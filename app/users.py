
import os
import json

from flask_login import UserMixin

def save_dict(dict, name):
    json.dump(dict, open(str(name) + '.json','w'), indent=2)

def read_dict(name):
    with open(str(name) + '.json', encoding='utf-8') as fh:
        data = json.load(fh)
    return data

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

        self.users_dict = {
            "admin": {
                "status": "admin",
                "password": "12345678",
                "panel": True,
                "path": [
                    {
                        "type": "path",
                        "name": "root",
                        "path": "/",
                        "size": 0
                    }
                ]
            }
        }
        self.users_dict_static = {}

        self.templates_dict = {}

        self.users = {}

        self.read()

    #
    def read(self):
        if not os.path.exists(self.path + '.json'):
            self.save()

        else:
            json_dict = read_dict(self.path)

            self.users_dict = json_dict['users']
            self.users_dict_static = json_dict['users'].copy()
            self.templates_dict = json_dict['templates']

            for user in self.users_dict_static:
                self.reload(user)

        self.update_users()

    #
    def reload(self, user):
        self.users_dict[user] = self.users_dict_static[user].copy()
        for i in range(len(self.users_dict_static[user]['path'])):
            if self.users_dict_static[user]['path'][i]['type'] == 'template':
                print(self.users_dict_static[user]['path'][i]['name'])
                print(self.templates_dict)
                self.users_dict[user]['path'][i] = self.templates_dict[self.users_dict_static[user]['path'][i]['name']].copy()
                self.users_dict[user]['path'][i]['type'] = 'template'


    #
    def save(self):
        json_dict = {
            "templates": self.templates_dict,
            "users": self.users_dict_static
        }
        save_dict(json_dict, self.path)


    #
    def update_users(self):
        self.users = {}

        i = 0
        for user in self.users_dict:
            self.users[user] = User(
                id = i,
                username = user,
                password = self.users_dict[user]['password'],
                status = self.users_dict[user]['status'],
                panel = self.users_dict[user]['panel'],
                path = self.users_dict[user]['path'],
                key = self.key
            )
            i += 1

    def get_users(self):
        return self.users_dict_static

    def get_templates(self):
        return self.templates_dict

    def get_user(self, name):
        try:
            return self.users[name]

        except:
            return None

    def get_name_by_id(self, id):
        if id < len(self.users_dict):
            i = 0
            for user in self.users_dict:
                if id == i:
                    return self.users[user]

                else:
                    i += 1

        else:
            return False

    def get_user_info(self, name):
        return self.users_dict[name]

    def add_user(self):
        pass
