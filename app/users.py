
import os
import json

from flask_login import UserMixin

def save_dict(dict, name):
    json.dump(dict, open(str(name) + '.json','w'))

def read_dict(name):
    with open(str(name) + '.json', encoding='utf-8') as fh:
        data = json.load(fh)
    return data

#
class User(UserMixin):
    def __init__(self, id, username, password, status, path, key='secret_key'):
        self.id = id

        self.username = username
        self.password = password

        self.status = status
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

        self.users_dict = {}
        self.users = {}

        self.read()

    #
    def read(self):
        if not os.path.exists(self.path + '.json'):
            self.save()

        else:
            self.users_dict = read_dict(self.path)

        self.update_users()

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
                path = self.users_dict[user]['path'],
                key = self.key
            )
            i += 1

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

    #
    def save(self):
        save_dict(self.users_dict, self.path)

    def add_user(self):
        pass
