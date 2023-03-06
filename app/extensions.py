
import os
import base64
import imp
from dict_json import *

def image_to_base64(path_to_file):
    with open(path_to_file, "rb") as img_file:
        b64_string = base64.b64encode(img_file.read())

    return b64_string

def get_methods(class_object):
    return [method for method in dir(class_object) if (method[0:2] != '__')]

class Extensions():
    def __init__(self):
        self.path = "extensions/"
        self.apps = []

        self.read()

    def get(self):
        return self.apps

    def read(self):
        self.apps = []
        folders = [e for e in os.listdir(self.path) if os.path.isdir(self.path + e)]
        for dir in folders:
            try:
                settings_json = read_dict(self.path + dir + "/appinfo")
                self.apps.append({
                    "name": settings_json["name"],
                    "ico": image_to_base64(self.path + dir + "/" + settings_json["ico"]).decode("utf-8"),
                    "main_html": self.generate_html(self.path + dir + "/", settings_json),
                    "welcome_html": self.read_welcome_html(self.path + dir + "/" + settings_json["welcome_html"]),
                    "executable": self.load_executable(self.path + dir + "/" + settings_json["executable"])
                })
            except Exception as e:
                print(e)

    def load_executable(self, path):
        f = open(path, "r")
        test_class = imp.load_module('app', f, path, ('.py', 'r', 1))
        f.close()
        return test_class.app

    def read_welcome_html(self, path):
        html_str = ''

        with open(path, "r", encoding='utf-8') as fh:
            html_str += fh.read()

        return html_str

    def generate_html(self, path, settings_json):
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

        main_html_str = main_html_str.format(name=settings_json['name'], style=style_str, script=script_str)

        return main_html_str
