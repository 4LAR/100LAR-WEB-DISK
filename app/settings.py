import configparser
import random
import string
import os

def get_bool(str):
    return True if str.lower() == 'true' else False

def random_string(size):
    return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(size))

class settings():
    def __init__(self):

        self.path = 'settings.ini'

        self.error_promt = 'SETTINGS: '

        self.options = {
            'Flask': {
                'IP': '0.0.0.0',
                'PORT': 80,
                'debug': True,
                'secret_key': random_string(4)
            },
            'Logs': {
                'path': 'logs/',
                'save_logs': True,
                'timedelta': 3
            },
            'Base': {
                'path': 'users'
            }
        }

        self.read_settings()

    def save_settings(self):
        config = configparser.ConfigParser()

        for section in self.options:
            config.add_section(section)

            for parameter in self.options[section]:
                config.set(section, str(parameter), str(self.options[section][parameter]))

        with open(self.path, "w") as config_file:
            config.write(config_file)

    def set_settings(self, section, parameter, state):
        if (type(self.options[section][parameter]) == str):
            self.options[section][parameter] = state

        elif (type(self.options[section][parameter]) == bool):
            self.options[section][parameter] = get_bool(state)

        elif (type(self.options[section][parameter]) == int):
            self.options[section][parameter] = int(state)

        elif (type(self.options[section][parameter]) == float):
            self.options[section][parameter] = float(state)

    def read_settings(self):
        if not os.path.exists(self.path):
            self.save_settings()
            self.read_settings()

        else:
            config = configparser.ConfigParser()
            config.read(self.path)

            error_bool = False

            for section in self.options:
                for parameter in self.options[section]:
                    try:
                        parameter_buf = config.get(section, parameter)
                        self.set_settings(section, parameter, parameter_buf)

                    except:
                        error_bool = True

            if error_bool:
                self.save_settings()
