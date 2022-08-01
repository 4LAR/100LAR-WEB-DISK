

import requests
import configparser
import os
import sys
import datetime
import time

# импортируем всё что нужно для Flask
from flask import Flask
from flask import render_template
from flask import render_template_string
from flask import make_response
from flask import jsonify
from flask import abort
from flask import redirect
from flask import Response
from flask import url_for
from flask import request

from gevent.pywsgi import WSGIServer

# импортируем всё что нужно для автоизации
from flask_login import LoginManager
from flask_login import login_required
from flask_login import UserMixin
from flask_login import login_user
from flask_login import current_user
from flask_login import logout_user

# импортируем py файлы
from console import *
from get_time import *
from settings import *
from users import *
from file import *

settings = settings()

time_now = Time_now(
    timedelta = settings.options['Logs']['timedelta']
)

console_term = console_term(
    log_bool =  settings.options['Logs']['save_logs'],
    path =      settings.options['Logs']['path']
)

userBase = UserBase(
    path =      settings.options['Base']['path'],
    key =       settings.options['Flask']['secret_key']
)

console_term.time = time_now

app = Flask(__name__)
app.config['SECRET_KEY'] = settings.options['Flask']['secret_key']
app.debug = settings.options['Flask']['debug']

login_manager = LoginManager()
login_manager.login_view = "login"
login_manager.init_app(app)

# Запросы
@app.route('/')
def index():
    return render_template('login.html')

@app.route('/main')
def main_pc():
    return render_template('main.html')

# авторизация
@app.route('/login' , methods=['GET' , 'POST'])
def login():
    username = request.args.get("username", "")
    password = request.args.get("password", "")
    user = userBase.get_user(username)
    if user != None and user.password == password:
        login_user(user, remember=True)
        return 'OK'

    else:
        return 'ERROR LOGIN'

@app.route("/logout", methods=['GET' , 'POST'])
@login_required
def logout():
    logout_user()
    return 'ok'

@app.route("/info", methods=['GET' , 'POST'])
@login_required
def info():
    return userBase.get_user_info(current_user.username)



# создаём WSGI сервер
http_server = WSGIServer(
    (
        settings.options['Flask']['IP'],
        settings.options['Flask']['PORT']
    ),
    app
)

console_term.create_log()
print('100LAR-WEB-DISK')

http_server.serve_forever()
