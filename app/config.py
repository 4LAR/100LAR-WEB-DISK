import configparser
import random
import string

import os

def get_bool(str):
    return True if str.lower() == 'true' else False

def random_string(size):
    return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(size))

class Config:
    def __init__(self, file_name, options=None):
        self.file_name = file_name

        #
        if (options):
            self.options = options

        else:
            self.options = {
                'FastAPI': {
                    'IP': '0.0.0.0',
                    'PORT': 80,
                    'debug': False,
                    'secret_key': random_string(4)
                },
                'Logs': {
                    'path': 'logs/',
                    'save_logs': True,
                    'timedelta': 3
                },
                'History': {
                    'length': 100,
                    'use': True
                },
                'Base': {
                    'path': '',
                    'file_name': 'users'
                },
                'Extensions': {
                    'use': True,
                    'path': 'extensions'
                },
                'Preview': {
                    'max_text_file_weight': 2048,
                    'max_pics_width': 1280,
                    'max_files_in_archive': 100
                },
                'Entry': {
                    'type': "none",
                    'source': ""
                }
            }

        self.read()

    # преобразование строки в нужный формат данных
    def set_settings(self, section, parameter, state):
        if (type(self.options[section][parameter]) == str):
            self.options[section][parameter] = state

        elif (type(self.options[section][parameter]) == bool):
            self.options[section][parameter] = get_bool(state)

        elif (type(self.options[section][parameter]) == int):
            self.options[section][parameter] = int(state)

        elif (type(self.options[section][parameter]) == float):
            self.options[section][parameter] = float(state)

    # запись настроек в файл
    def save(self):
        config = configparser.ConfigParser()

        for section in self.options:
            config.add_section(section)

            for parameter in self.options[section]:
                config.set(section, str(parameter), str(self.options[section][parameter]))

        with open(self.file_name, "w") as config_file:
            config.write(config_file)

    # чтение настроек в файл
    def read(self):
        if not os.path.exists(self.file_name):
            #
            self.save()
            self.read()

        else:
            config = configparser.ConfigParser()
            config.read(self.file_name)

            error_bool = False

            #
            for section in self.options:
                for parameter in self.options[section]:
                    try:
                        parameter_buf = config.get(section, parameter)
                        self.set_settings(section, parameter, parameter_buf)

                    except:
                        error_bool = True

            #
            if error_bool:
                self.save()

    #
    def get(self, section):
        return self.options[section]

    #
    def get_all(self):
        return self.options
