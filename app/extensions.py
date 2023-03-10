
import os
import base64
import imp
import copy

from dict_json import *

from flask_socketio import SocketIO
from flask import request
from flask_login import current_user

def image_to_base64(path_to_file):
    with open(path_to_file, "rb") as img_file:
        b64_string = base64.b64encode(img_file.read())

    return b64_string

def get_methods(class_object):
    return [method for method in dir(class_object) if (method[0:2] != '__')]

class Extensions():
    def __init__(self, app, userBase, socketio):
        self.app = app
        self.socketio = socketio
        self.userBase = userBase

        self.namespace = "createApp_"

        self.path = "extensions/"
        self.apps = {}

        self.read()
        # self.append_app(0, "bash", {"name": "test", "path": ""})

    def append_app(self, user_id, app_id, data):
        if not (user_id in self.userBase.users_apps):
            self.userBase.users_apps[user_id] = []

        app_name = data.pop("name")

        executable = self.apps[app_id]['executable'](self.socketio, **data)

        self.userBase.users_apps[user_id].append({
            "name": app_name,
            "app_id": app_id,
            "executable": executable
        })

        return True

    def delete_app(self, user_id, id):
        self.userBase.users_apps[user_id].pop(id)

    def get_my_apps(self, user_id):
        if (user_id in self.userBase.users_apps):
            apps_list = []
            for app in self.userBase.users_apps[user_id]:
                apps_list.append({
                    "name": app["name"],
                    "status": app["executable"].status,
                    "app_name": self.apps[app["app_id"]]["name"],
                    "app_id": app["app_id"]
                })

            return apps_list

        else:
            return {}

    def get(self):
        apps_dict = {}
        for app in self.apps:
            apps_dict[app] = {
                "name": self.apps[app]['name'],
                "ico": self.apps[app]['ico'],
                "main_html": self.apps[app]['main_html'],
                "welcome_html": self.apps[app]['welcome_html'],
                "executable_args": self.apps[app]['executable_args']
            }
        return apps_dict

    def get_all(self):
        return self.apps

    def read(self):
        self.apps = {}
        folders = [e for e in os.listdir(self.path) if os.path.isdir(self.path + e)]
        for dir in folders:
            try:
                settings_json = read_dict(self.path + dir + "/appinfo")
                executable, args = self.load_executable(self.path + dir + "/" + settings_json["executable"])
                self.generate_sockets(executable, settings_json)
                self.apps[settings_json["name"]] = {
                    "name": settings_json["name"],
                    "ico": image_to_base64(self.path + dir + "/" + settings_json["ico"]).decode("utf-8"),
                    "main_html": self.read_html(self.path + dir + "/", settings_json),
                    "welcome_html": self.read_welcome_html(self.path + dir + "/" + settings_json["welcome_html"], settings_json),
                    "executable": executable,
                    "executable_args": args
                }
            except Exception as e:
                print("Extensions: ", e)

    def generate_sockets(self, obj, settings_json):
        for method in get_methods(obj):
            method_split = method.split("_")
            if (method_split[0] == 'io'):
                self.socketio.on_event(method_split[1], lambda data, method=method: self.socket_wrapper(data, method), namespace='/%s' % settings_json["name"])

    def load_executable(self, path):
        f = open(path, "r")
        test_class = imp.load_module('app', f, path, ('.py', 'r', 1))
        f.close()

        args_list = list(test_class.app.__init__.__code__.co_varnames)
        args_list = [x for x in args_list if (not x in ['self', 'socketio'])]
        args_list.append('name')

        return test_class.app, args_list

    def read_welcome_html(self, path, settings_json):
        html_str = ''

        with open(path, "r", encoding='utf-8') as fh:
            html_str += fh.read()

        html_str = html_str.format(name=settings_json['name'], namespace=self.namespace + ("%s_" % settings_json['name']), defaultPath="home:/")

        return html_str

    def read_html(self, path, settings_json):
        style_str = ""
        for f in settings_json['css']:
            with open(path + f, "r", encoding='utf-8') as fh:
                style_str += fh.read()

        script_str = ''
        for f in settings_json['script']:
            with open(path + f, "r", encoding='utf-8') as fh:
                script_str += fh.read()

        main_html_str = ''
        with open(path + settings_json['main_html'], "r", encoding='utf-8') as fh:
            main_html_str += fh.read()

        return {"css": style_str, "script": script_str, "html": main_html_str}

    def generate_html(self, id, settings_json):
        script_str = '<script type="text/javascript">var current_app_id = %s;\n' % str(id)
        script_str += settings_json['main_html']['script']
        script_str += "</script>";

        main_html_str = settings_json['main_html']['html'].format(name=settings_json['name'], style=settings_json['main_html']['css'], script=script_str)

        return main_html_str

    # --------------------------------------------------------------------------

    def socket_wrapper(self, data, method):
        try:
            app_id = int(request.args.get('app_id'))
            if (self.userBase.users_apps[int(current_user.id)][app_id]):
                getattr(self.userBase.users_apps[int(current_user.id)][app_id]["executable"], method)(data)
        except Exception as e:
            # print("WARNING", e)
            pass
