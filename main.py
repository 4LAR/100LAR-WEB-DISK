#
#       100LAR-WEB CORE
#           by 100LAR
#

version_core = '0.1'

#
from flask import Flask, render_template, request, make_response, jsonify, abort, redirect, Response, url_for, render_template
from flask_cors import CORS
import logging
import pickle, os, configparser, socket
import time
from werkzeug.serving import make_server
import threading
import logging
import gevent
from gevent.pywsgi import WSGIServer

#from flask_socketio import SocketIO, emit

import shutil


#socketio = SocketIO(app)

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

# нужныйе функции

def cls():
    os.system('cls' if os.name=='nt' else 'clear')

def get_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

def get_time():
    return time.strftime("%H:%M:%S|%d-%m-%y", time.localtime())

def log(text, time_log_bool=True, print_console=False):
    log_file = open('log.txt', 'a')
    log_file.write((('[' + str(get_time()) + '] ') if time_log_bool else '') + str(text) + '\n')
    log_file.close()
    if print_console:
        print((('[' + str(get_time()) + '] ') if time_log_bool else '') + str(text) + '\n')
    #console.add_console('[ CRITICAL ] ' + (('[' + str(get_time()) + '] ') if time_log_bool else '') + str(text))


# чтение и запись настроек
class settings():
    def __init__(self):
        # переменные настроек

        self.secret_key = '100LAR'
        self.port = 80
        self.debug = True
        self.ip = '0.0.0.0'

        self.read_settings() # читаем настроки

    def read_settings(self):
        if not os.path.exists("settings.txt"): # проверка файла с настройками
            config = configparser.ConfigParser()
            config.add_section("Server")
            config.set("Server", "secret_key", str(self.secret_key))
            config.set("Server", "port", str(self.port))
            config.set("Server", "debug", str(self.debug))
            config.set("Server", "ip", str(self.ip))
            with open("settings.txt", "w") as config_file: # запись файла с настройками
                config.write(config_file)
            self.read_settings()
        else:
            config = configparser.ConfigParser()
            config.read("settings.txt")
            self.secret_key = str(config.get("Server", "secret_key"))
            self.port = int(config.get("Server", "port"))
            self.debug = True if (config.get("Server", "debug")).lower() == 'true' else False
            self.ip = str(config.get("Server", "ip"))

settings = settings() # инициализация класса с настройками
app = Flask(__name__)
app.config['SECRET_KEY'] = settings.secret_key
#
def logo():
    print('-'*80)
    print("""
    ___  ___   ___    __    ___    ___        _      __   ____   ___
   <  / / _ \ / _ \  / /   / _ |  / _ \ ____ | | /| / /  / __/  / _ )
   / / / // // // / / /__ / __ | / , _//___/ | |/ |/ /  / _/   / _  |
  /_/  \___/ \___/ /____//_/ |_|/_/|_|       |__/|__/  /___/  /____/
                                                          _________  ___  ____
                                                         / ___/ __ \/ _ \/ __/
                                                        / /__/ /_/ / , _/ _/
                                                        \___/\____/_/|_/___/
                                                                             """)
    print('-'*80)

def server_info_logo():
    print("\nVersion: " + version_core)
    print("\nLOCAL IP : " + get_ip() + '\n')
    total, used, free = shutil.disk_usage("/")
    print("Total: %d GB" % (total // (2**30)))
    print("Used: %d GB" % (used // (2**30)))
    print("Free: %d GB" % (free // (2**30)))
    print()

#терминал

class Terminal():
    def __init__(self):
        self.text = ''
        self.text_ = ' > '

        logo()
        server_info_logo()

    def read(self):
        self.text = input(self.text_)
        if self.text == 'stop':
            stop_server()
            print('SERVER STOPPED')
            exit()
        elif self.text == 'info':
            server_info_logo()
        elif self.text == 'clear':
            cls()
        elif self.text == 'classes':
            print()
            for f in files:
                print(f[0])
            print()

def terminal_def(): # функция для терминала
    run_terminal_bool = True
    terminal = Terminal() # инициализация класса с терминалом
    while run_terminal_bool:
        terminal.read()

#

#

#

from werkzeug.serving import make_server
from werkzeug.debug import DebuggedApplication

class ServerThread(threading.Thread):

    def __init__(self, app):
        threading.Thread.__init__(self)
        app.debug = settings.debug

        #self.srv = make_server(settings.ip, settings.port, app)
        self.http_server = WSGIServer((settings.ip, int(settings.port)), app)
        self.ctx = app.app_context()
        self.ctx.push()
        self.files = []
    def run(self):

        self.http_server.serve_forever()

    def shutdown(self):
        self.http_server.shutdown()

#app = Flask('100LAR-WEB-CORE')
code = ''
files = []
file_objects = (open('objects/objects.list', 'r', encoding="utf-8").read()).split('\n')
#print(file_objects)
for i in range(len(file_objects)-1):
    files.append([file_objects[i], 0])
    print('IMPORT: ' + file_objects[i])
'''
#классы
for i in range(len(files)):
    file_objects = open('objects/' + files[i][0], 'r', encoding="utf-8")
    code += file_objects.read() + '\n'
    files[i][1] = len(code.split('\n'))
    file_objects.close()
'''

for file in files:
    file_objects = open('objects/' + file[0], 'r', encoding="utf-8")
    code += file_objects.read() + '\n'
    file[1] = len(code.split('\n'))
    file_objects.close()

exec(code)
logo()
server_info_logo()
app.debug = settings.debug
http_server = WSGIServer((settings.ip, int(settings.port)), app)
http_server.serve_forever()
'''
def start_server():
    global server

    #code = ''
    # здесь код

    print('-'*80)
    # получаем названия файлов с нужными объктами

    # после кода
    server = ServerThread(app)
    server.start()
    log('SERVER STARTED')
    terminal_def()

def stop_server():
    global server
    server.shutdown()
    log('SERVER STOPPED')
start_server()
#stop_server()
'''
