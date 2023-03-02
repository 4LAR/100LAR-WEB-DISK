
import os
import json
import copy
from flask_login import UserMixin
from dict_json import *

#
class User(UserMixin):
    def __init__(self, id, username, password, status, panel, path, key='secret_key'):
        self.id = id

        self.username = username
        self.password = password

        self.status = status
        self.panel = panel
        self.path = path

    def get_id(self):
        return self.id

    def get_auth_token(self):
        return make_secure_token(self.username , key=key)

#
class UserBase():
    def __init__(self, path='users', key='secret_key'):
        #

        self.path = 'users'
        self.key = key

        self.last_id = 0

        self.users_dict = {}
        self.users_dict_static = {
            0: {
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

        self.users = {}
        self.users_id = {}

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

        self.update_users()

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


    #
    def update_users(self):
        self.users = {}
        self.users_id = {}

        #i = 0
        for user_id in self.users_dict:
            self.users[user_id] = User(
                id = user_id,
                username = self.users_dict[user_id]['username'],
                password = self.users_dict[user_id]['password'],
                status = self.users_dict[user_id]['status'],
                panel = self.users_dict[user_id]['panel'],
                path = self.users_dict[user_id]['path'],
                key = user_id #self.key
            )
            #i += 1

            self.users_id[self.users_dict[user_id]['username']] = user_id

    def get_users(self):
        return self.users_dict_static

    def get_templates(self):
        return self.templates_dict

    def get_user(self, id):
        try:
            return self.users[str(id)]

        except:
            return None

    def get_id_by_name(self, name):
        try:
            return self.users_id[name]

        except:
            return None

    def get_user_info(self, id):
        return self.users_dict[str(id)]

    def add_user(self):
        pass
