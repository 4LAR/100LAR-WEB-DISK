 

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

app = Flask(__name__)
app.config['SECRET_KEY'] = '100LAR'
app.debug = True

# Запросы
@app.route('/')
def index():
    return render_template('index.html')

# создаём WSGI сервер
http_server = WSGIServer(
    (
        '0.0.0.0',
        80
    ),
    app
)

http_server.serve_forever()
