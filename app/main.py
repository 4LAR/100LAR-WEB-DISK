

import requests
import configparser
import os
import shutil
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
from flask import send_from_directory
from flask import send_file

from gevent.pywsgi import WSGIServer

# импортируем всё что нужно для автоизации
from flask_login import LoginManager
from flask_login import login_required
from flask_login import UserMixin
from flask_login import login_user
from flask_login import current_user
from flask_login import logout_user

#
import time
import datetime

#
import json

#
import zipfile
import io

#
import magic

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

#
@app.route('/main')
@login_required
def main_pc():
    return render_template('main.html')

@login_manager.user_loader
def load_user(userid):
    return userBase.get_name_by_id(int(userid))

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

#
@app.route("/logout", methods=['GET' , 'POST'])
@login_required
def logout():
    logout_user()
    return 'ok'

#
@app.route("/info", methods=['GET' , 'POST'])
@login_required
def info():
    info_json = userBase.get_user_info(current_user.username)
    info_json['name'] = current_user.username
    for i in range(len(info_json['path'])):
        info_json['path'][i]['size_converted'] = convert_size(info_json['path'][i]['size'])
        if info_json['path'][i]['path'] != '/':
            info_json['path'][i]['busy'] = get_size(info_json['path'][i]['path'])
            info_json['path'][i]['busy_converted'] = convert_size(info_json['path'][i]['busy'])

    return info_json

#
@app.route("/files", methods=['GET' , 'POST'])
@login_required
def files():
    try:
        path = request.args.get("path", "")
        dir = request.args.get("dir", "")

        if (not '..' in dir):

            #dir = dir.replace('/', '"/"')

            user_path = userBase.get_user_info(current_user.username)['path'][int(path)]['path']

            files = os.listdir(user_path + dir)

            if len(files) > 0:
                files_list = []
                for i in range(len(files)):
                    try:
                        file = files[i]

                        files_list.append(
                            {
                                'name': file
                            }
                        )

                        if len(dir) > 0:
                            file_path = user_path + dir + '/' + file

                        else:
                            file_path = user_path + file

                        if os.path.isdir(file_path):
                            files_list[i]['type'] = 'dir'

                        else:
                            #magic.from_file(file_path, mime=True)
                            mime = magic.from_buffer(open(file_path, "rb").read(2048), mime=True)

                            if mime.split('/')[1] in ['zip', 'x-rar']:
                                files_list[i]['type'] = 'archive'

                            else:
                                files_list[i]['type'] = 'file'

                            files_list[i]['type_mime'] = mime
                            files_list[i]['size'] = convert_size(
                                os.path.getsize(
                                    user_path + dir + '/' + file
                                )
                            )
                            change_time = os.path.getmtime(file_path)
                            files_list[i]['time'] = datetime.datetime.fromtimestamp(change_time).strftime('%H:%M:%S %d-%m-%Y')

                    except Exception as e:
                        print(e)

                return {'files': files_list}

            else:
                return 'EMPTY'

        else:
            return 'ERROR DIR'

    except:
        return 'ERROR DIR'

# переименование файла
@app.route("/rename", methods=['GET' , 'POST'])
@login_required
def rename():
    path = request.args.get("path", "")
    dir = request.args.get("dir", "")
    file = request.args.get("file", "")
    new_file = request.args.get("new_file", "")

    user_path = userBase.get_user_info(current_user.username)['path'][int(path)]['path']

    os.rename(user_path + dir + '/' + file, user_path + dir + '/' + new_file)

    return 'ok'

# скачивание файла
@app.route("/download", methods=['GET' , 'POST'])
@login_required
def downlaod():
    try:
        path = request.args.get("path", "")
        dir = request.args.get("dir", "")
        file = request.args.get("file", "")
        files = request.args.get("files", "")

        user_path = userBase.get_user_info(current_user.username)['path'][int(path)]['path']

        if len(file) > 0:
            os.remove(user_path + dir + '/' + file)

            return send_from_directory(user_path + dir, file)

        else:
            files_list = json.loads(files)['files']

            # содаём буфер
            zip_buffer = io.BytesIO()

            # открываем архив и хапичваем в него все нужные файлы
            with zipfile.ZipFile(zip_buffer, 'w') as archive:
                for file in files_list:
                    if file[1] == 'dir':
                        for folderName, subfolders, filenames in os.walk(user_path + dir + '/' + file[0]):
                            for filename in filenames:
                                filePath = os.path.join(folderName, filename)
                                archive.write(filePath, compress_type=zipfile.ZIP_DEFLATED)

                    else:
                        archive.write(user_path + dir + '/' + file[0])

            # переходим в начало архива
            zip_buffer.seek(0)

            # отправляем архив
            return Response(zip_buffer.getvalue(),
                mimetype='application/zip',
                headers={'Content-Disposition': 'attachment;filename=%s.zip' % (current_user.username)})

    except Exception as e:
        console_term.print('/download: ' + str(e), 3)
        return 'ERROR'

# удаление файла
@app.route('/delete', methods=['POST', 'GET'])
@login_required
def delete():
    try:
        path = request.args.get("path", "")
        dir = request.args.get("dir", "")
        file = request.args.get("file", "")
        files = request.args.get("files", "")

        user_path = userBase.get_user_info(current_user.username)['path'][int(path)]['path']

        if len(file) > 0:
            os.remove(user_path + dir + '/' + file)

        else:
            files_list = json.loads(files)['files']

            print(files_list)

            for file in files_list:
                if file[1] == 'dir':
                    shutil.rmtree(user_path + dir + '/' + file[0])
                else:
                    os.remove(user_path + dir + '/' + file[0])

        return 'ok'

    except Exception as e:
        console_term.print('/delete: ' + str(e), 3)
        return 'ERROR'

# загрузка файла
@app.route('/upload_file', methods=['POST', 'GET'])
@login_required
def upload_file_disk():
    path = request.args.get("path", "")
    dir = request.args.get("dir", "")
    file = request.args.get("file", "")

    f = request.files['file']

    user_path = userBase.get_user_info(current_user.username)['path'][int(path)]['path']
    f.save(user_path + dir + '/' + file)

    return 'OK'

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
