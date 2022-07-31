 

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

# 
from console import *
from get_time import *
from settings import *

settings = settings()

time_now = Time_now(
    timedelta = settings.options['Logs']['timedelta']
)

console_term = console_term(
    log_bool =  settings.options['Logs']['save_logs'],
    path =      settings.options['Logs']['path']
)

console_term.time = time_now

app = Flask(__name__)
app.config['SECRET_KEY'] = settings.options['Flask']['secret_key']
app.debug = settings.options['Flask']['debug']

# Запросы
@app.route('/')
def index():
    return render_template('login.html')

@app.route('/main')
def main_pc():
    return render_template('main.html')

console_term.create_log()

# создаём WSGI сервер
http_server = WSGIServer(
    (
        settings.options['Flask']['IP'],
        settings.options['Flask']['PORT']
    ),
    app
)

http_server.serve_forever()
