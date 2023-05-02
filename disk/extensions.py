
import os
import base64
import imp
import copy
import sys

from pathlib import Path

from disk.dict_json import *
from disk.settings import *

from flask_socketio import SocketIO
from flask import request
from flask_login import current_user

CACHE_FILE_NAME = "/cache"

def image_to_base64(path_to_file):
    with open(path_to_file, "rb") as img_file:
        b64_string = base64.b64encode(img_file.read())

    return b64_string

def get_methods(class_object):
    return [method for method in dir(class_object) if (method[0:2] != '__')]

def read_folders(path):
    return [e for e in os.listdir(path) if os.path.isdir(path + e)]

class Extensions_cache():
    def __init__(self, app_path, user_id, app_config, use=True, save=False):
        self.app_path = app_path
        self.user_id = str(user_id)
        self.use = use
        self.args = app_config['args']
        self.data = app_config['data']

        if save:
            self.save()

    def update_data(self, data):
        self.data = data
        self.save()

    def get_data(self):
        return self.data

    def delete(self):
        if not os.path.exists(self.app_path + CACHE_FILE_NAME + ".json"):
            return

        cache_json = read_dict(self.app_path + CACHE_FILE_NAME)
        if self.user_id in cache_json:
            for i in range(len(cache_json[self.user_id])):
                if cache_json[self.user_id][i]['args']['name'] == self.args['name']:
                    cache_json[self.user_id].pop(i)
                    break

        save_dict(cache_json, self.app_path + CACHE_FILE_NAME)

    def save(self):
        if self.use:
            if not os.path.exists(self.app_path + CACHE_FILE_NAME + ".json"):
                save_dict({}, self.app_path + CACHE_FILE_NAME)

            cache_json = read_dict(self.app_path + CACHE_FILE_NAME)
            if self.user_id in cache_json:
                for i in range(len(cache_json[self.user_id])):
                    if cache_json[self.user_id][i]['args']['name'] == self.args['name']:
                        cache_json[self.user_id][i]['data'] = self.data
                        break

                else:
                    cache_json[self.user_id].append({
                        "args": self.args,
                        "data": self.data
                    })

            else:
                cache_json[self.user_id] = [{
                    "args": self.args,
                    "data": self.data
                }]


            save_dict(cache_json, self.app_path + CACHE_FILE_NAME)

class Extensions():
    def __init__(self, app, userBase, socketio, logging):
        self.app = app
        self.socketio = socketio
        self.userBase = userBase
        self.logging = logging

        self.namespace = "createApp_"

        self.path = "extensions/"
        self.apps = {}
        self.apps_admin = {}

        self.read()

    def read_cache(self, app_path):
        if not os.path.exists(app_path + CACHE_FILE_NAME + ".json"):
            return {}

        cache_json = read_dict(app_path + CACHE_FILE_NAME)
        for user in cache_json:
            for i in range(len(cache_json[user])):
                try:
                    cache_json[user][i] = Extensions_cache(app_path, user, cache_json[user][i], use=True)

                except Exception as e:
                    print("Extensions cache:", e)
                    cache_json = {}

        return cache_json

    def create_app_by_cache(self, user_id, app_id, cache):
        args = {**cache.args, "cache": cache}
        self.append_app(user_id, app_id, args)

    def get_layout_args_settings(self, layout_arr):
        data = {}
        for app in layout_arr:
            if (app['type'] == "label"):
                pass

            elif (app['type'] == "path"):
                data[app['arg']] = {
                    "type": app['type']
                }

            elif (app['type'] == "row"):
                data = {**data, **self.get_layout_args_settings(app['elements'])}

            else:
                data[app['arg']] = {
                    "type": app['type'],
                    "must_be_filled": app['must_be_filled']
                }

        return data

    def check_data(self, app_id, user_id, data):
        checked_data = {}
        user_info = self.userBase.get_user_info(user_id)
        for el in data:
            data_value = data[el]['value']
            if (self.apps[app_id]['layout_args_settings'][el]['type'] == 'path'):
                data_value_splited = data_value.split(":")
                path = user_info['path'][int(data_value_splited[0])]['path'] + "/" + data_value_splited[1]
                if os.path.exists(path):
                    checked_data[el] = path
                else:
                    return el, False

            else:
                if ((self.apps[app_id]['layout_args_settings'][el]['must_be_filled'] and len(data_value) > 0) or not (self.apps[app_id]['layout_args_settings'][el]['must_be_filled'])):
                    checked_data[el] = data_value
                else:
                    return el, False

        return checked_data, True

    def check_user_app_names(self, user_id, name):
        for app in self.userBase.users_apps[user_id]:
            if (app['name'] == name):
                return False

        return True

    def append_app(self, user_id, app_id, data):
        if not (int(user_id) in self.userBase.users_apps):
            self.userBase.users_apps[int(user_id)] = []

        if not 'cache' in data:
            if not ((self.userBase.users_dict_static[str(user_id)]['status'] in self.apps[app_id]["status_required"]) or len(self.apps[app_id]["status_required"][0]) == 0):
                return False, 'status required'

            app_name = data.pop("name")['value']
            if (len(app_name) == 0 or not self.check_user_app_names(user_id, app_name)):
                return False, 'name'

            data, status = self.check_data(app_id, user_id, data)
            if (not status):
                return status, data

        else:
            app_name = data.pop("name")

        data_for_cache = data.copy()
        data_for_cache["name"] = app_name

        app_namespace = "/App_%s_%s" % (user_id, app_name)

        data['config'] = self.apps[app_id]['config']
        data['app'] = self.app
        data['socketio'] = self.socketio
        data['app_namespace'] = app_namespace
        if not('cache' in data):
            data['cache'] = Extensions_cache(self.apps[app_id]['app_path'], user_id, {"args": data_for_cache, "data": {}}, use=self.apps[app_id]['cached'], save=True)

        executable = self.apps[app_id]['executable'](**data)

        self.userBase.users_apps[int(user_id)].append({
            "name": app_name,
            "app_id": app_id,
            "executable": executable,
            "app_namespace": app_namespace,
            "cache": data['cache']
        })

        for method in self.apps[app_id]['executable_methods']:
            method_split = method.split("_")
            if (method_split[0] == 'io'):
                self.socketio.on_event(method_split[1], lambda data, method=getattr(executable, method), user_id=int(user_id): self.socket_wrapper(data, method, user_id), namespace=app_namespace)

        return True, None

    def delete_app(self, user_id, id):
        app_name = self.userBase.users_apps[user_id][id]['name']
        if "close" in dir(self.userBase.users_apps[user_id][id]['executable']):
            self.userBase.users_apps[user_id][id]['executable'].close()

        self.userBase.users_apps[user_id][id]['cache'].delete()
        self.userBase.users_apps[user_id].pop(id)

        return app_name

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

    def get(self, user_id):
        apps_dict = {}
        for app in self.apps:
            if ((self.userBase.users_dict_static[str(user_id)]['status'] in self.apps[app]["status_required"]) or len(self.apps[app]["status_required"][0]) == 0):
                apps_dict[app] = {
                    "name": self.apps[app]['name'],
                    "ico": self.apps[app]['ico'],
                    "html": self.apps[app]['html'],
                    "create_layout": self.apps[app]['create_layout'],
                    "executable_args": self.apps[app]['executable_args']
                }
        return apps_dict

    def get_all(self):
        return self.apps

    def get_admin(self):
        return self.apps_admin

    def set_config_for_app(self, app_id, config):
        path = self.apps_admin[app_id]['app_path']
        config_class = settings(path + "config.ini", {"Extension": self.apps_admin[app_id]["config"]})
        config_class.options['Extension'] = config
        config_class.save_settings()

    def read(self):
        self.apps = {}
        folders = read_folders(self.path)
        for dir in folders:
            try:
                settings_json = read_dict(self.path + dir + "/appinfo")
                if (settings_json["type"] == 'application'):
                    config = {"Extension": settings_json['config']}
                    config['Extension']['status_required'] = ', '.join(settings_json["status_required"])
                    config['Extension']['use'] = True
                    config = settings(self.path + dir + "/config.ini", config).options['Extension']
                    if (config['use']):
                        executable, args = self.load_executable(self.path + dir + "/" + settings_json["executable"])
                        self.apps[settings_json["name"]] = {
                            "name": settings_json["name"],
                            "ico": image_to_base64(self.path + dir + "/" + settings_json["ico"]).decode("utf-8"),
                            "html": self.read_html(self.path + dir + "/", settings_json),
                            "create_layout": settings_json["create_layout"],
                            "layout_args_settings": self.get_layout_args_settings(settings_json["create_layout"]),
                            "executable": executable,
                            "executable_args": args,
                            "executable_methods": get_methods(executable),
                            "app_path": self.path + dir + "/",
                            "config": config,
                            "status_required": [status.replace(" ", "") for status in config['status_required'].split(",")],
                            "cached": settings_json["cached"]
                        }

                        if settings_json["cached"]:
                            if os.path.exists(self.path + dir + "/" + CACHE_FILE_NAME + ".json"):
                                cache = self.read_cache(self.path + dir + "/")
                                for user in cache:
                                    for i in range(len(cache[user])):
                                        self.create_app_by_cache(user, settings_json["name"], cache[user][i])

                    self.apps_admin[settings_json["name"]] = {
                        "name": settings_json["name"],
                        "ico": image_to_base64(self.path + dir + "/" + settings_json["ico"]).decode("utf-8"),
                        "app_path": self.path + dir + "/",
                        "config": config
                    }
            except Exception as e:
                print("Extensions:", e)

    def load_executable(self, path):
        f = open(path, "r")
        test_class = imp.load_module('app', f, path, ('.py', 'r', 1))
        f.close()

        args_list = list(test_class.app.__init__.__code__.co_varnames)
        args_list = [x for x in args_list if (not x in ['self', 'socketio', 'app_namespace'])]
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
        with open(path + settings_json['html'], "r", encoding='utf-8') as fh:
            main_html_str += fh.read()

        return {"css": style_str, "script": script_str, "html": main_html_str}

    def generate_html(self, id, user_id, settings_json):
        user_app = self.userBase.users_apps[user_id][int(id)]
        script_str = '<script type="text/javascript">const current_app_id = %s; const current_namespace = "%s";\n' % (str(id), user_app['app_namespace'])
        script_str += settings_json['html']['script']
        script_str += "</script>";

        main_html_str = settings_json['html']['html'].format(name=settings_json['name'], style=settings_json['html']['css'], script=script_str)

        return main_html_str

    # --------------------------------------------------------------------------
    def socket_wrapper(self, data, method, user_id):
        try:
            if (user_id == int(current_user.id)):
                method(data)
        except Exception as e:
            print("WARNING", e)
