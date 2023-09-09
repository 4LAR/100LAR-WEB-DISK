
import os
import json
import copy
from dict_json import *

#
class DataBase():
    def __init__(self, path='', file_name='users', key='secret_key'):
        #

        self.path = path + file_name
        self.key = key

        self.last_id = 0

        self.users_apps = {}
        self.users_dict = {}
        self.users_dict_static = {
            "0": {
                "username": "admin",
                "status": "admin",
                "password": "12345678",
                "panel": True,
                "path": [
                    {
                        "type": "path",
                        "name": "disk",
                        "readonly": False,
                        "path": (os.getcwd()[2:] if (os.name == "nt") else os.getcwd()) + "/",
                        "size": 0
                    },
                    {
                        "type": "path",
                        "name": "root",
                        "readonly": True,
                        "path": "/",
                        "size": 0
                    },
                    {
                        "type": "template",
                        "name": "root_template"
                    }
                ]
            }
        }

        self.templates_dict = {
            "root_template": {
                "name": "root_template",
                "path": "/",
                "readonly": True,
                "size": 0
            }
        }

        self.read()

    #
    def read(self):
        if not os.path.exists(self.path + '.json'):
            self.save()
            self.read()

        else:
            json_dict = read_dict(self.path)

            self.last_id = json_dict['last_id']

            self.users_dict = json_dict['users']
            self.users_dict_static = json_dict['users'].copy()
            self.templates_dict = json_dict['templates']

            self.reload_all()

        # self.update_users()

    def reload_all(self):
        for user in self.users_dict_static:
            self.reload(user)

    #
    def reload(self, user):
        self.users_dict[user] = copy.deepcopy(self.users_dict_static[user])
        for i in range(len(self.users_dict_static[user]['path']) - 1, -1, -1):
            if self.users_dict_static[user]['path'][i]['type'] == 'template' and self.users_dict_static[user]['path'][i]['name'] in self.templates_dict:
                self.users_dict[user]['path'][i] = self.templates_dict[self.users_dict_static[user]['path'][i]['name']].copy()
                self.users_dict[user]['path'][i]['type'] = 'template'
            elif (self.users_dict_static[user]['path'][i]['type'] == 'template'):
                self.users_dict[user]['path'].pop(i)

    #
    def save(self):
        json_dict = {
            "last_id": self.last_id,
            "templates": self.templates_dict,
            "users": self.users_dict_static
        }
        save_dict(json_dict, self.path)

    def get_users(self):
        return self.users_dict_static

    def get_templates(self):
        return self.templates_dict

    def get_user(self, id):
        try:
            return self.users_dict[str(id)]

        except:
            return None

    def get_id_by_name(self, name):
        for user_id in self.users_dict:
            if self.users_dict[user_id]['username'] == name:
                return user_id

        return None

    def get_user_by_name(self, name):
        for user_id in self.users_dict:
            if self.users_dict[user_id]['username'] == name:
                return self.users_dict[user_id]

        return None

    def get_user_info(self, id):
        return self.users_dict[str(id)]

    def add_user(self):
        pass
