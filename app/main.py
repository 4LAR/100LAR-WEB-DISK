

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

# для получения информации и системе и сервере
import psutil
from memory_profiler import memory_usage

start_time = datetime.datetime.now()

# импортируем py файлы
from console import *
from get_time import *
from settings import *
from users import *
from file import *
from history import *

settings = settings()

time_now = Time_now(
    timedelta = settings.options['Logs']['timedelta']
)

console_term = console_term(
    log_bool =  settings.options['Logs']['save_logs'],
    path =      settings.options['Logs']['path']
)
console_term.time = time_now

history = History(
    length = settings.options['History']['length'],
    use_bool = settings.options['History']['use']
)
history.time = time_now

userBase = UserBase(
    path =      settings.options['Base']['path'],
    key =       settings.options['Flask']['secret_key']
)

app = Flask(__name__)
app.config['SECRET_KEY'] = settings.options['Flask']['secret_key']
app.debug = settings.options['Flask']['debug']

login_manager = LoginManager()
login_manager.login_view = "login"
login_manager.init_app(app)

#####################################################

#
def reboot():
    console_term.print('Server rebooting', 0)
    os.execv(sys.executable, ['python3'] + sys.argv)
    exit()

#
def shutdown():
    console_term.print('Server shutdown', 0)
    exit()

#
def check_size(current_user, path, file_size):

    busy = get_size(userBase.get_user_info(current_user.username)['path'][int(path)]['path'])
    user_size = userBase.get_user_info(current_user.username)['path'][int(path)]['size']
    if (user_size != 0):
        return (busy + file_size <= user_size)

    else:
        return True

#
def check_size_list(current_user, path, dir, files=[]):
    files_size = 0

    user_path = userBase.get_user_info(current_user.username)['path'][int(path)]['path']

    busy = get_size(user_path)
    user_size = userBase.get_user_info(current_user.username)['path'][int(path)]['size']

    if (user_size != 0):
        for f in files:
            if (f[1] == 'dir'):
                files_size += get_size(user_path + dir + f[0])

            else:
                files_size += os.path.getsize(
                    user_path + dir + '/' + f[0]
                )

        print(files_size)
        return (busy + files_size <= user_size)

    else:
        return True

#
def utf8len(s):
    return len(s.encode('utf-8'))

#####################################################

# Запросы
@app.route('/')
def index():
    return render_template('login.html')

#
@app.route('/main')
@login_required
def main_pc():
    return render_template('main.html')

#
@app.route('/m-main')
@login_required
def main_m():
    return render_template('m-main.html')

#####################################################

@app.route('/admin')
@login_required
def admin():
    if (current_user.panel):
        return render_template('admin.html')

    else:
        return "NO ADMIN"

############DASHBOARD
# вывод информации о сервере
@app.route('/system_info', methods=['GET' , 'POST'])
@login_required
def system_info():
    if (current_user.panel):
        info = {}

        memory = psutil.virtual_memory()

        info['cpu_usage'] = psutil.cpu_percent()
        info['total_memory'] = memory.total
        info['used_memory'] = memory.used
        info['program_memory'] = (memory_usage()[0] * 1024 * 1024)
        info['server_time_running'] = str(datetime.datetime.now() - start_time).split('.')[0]
        info['settings'] = settings.options
        info['warnings'] = console_term.warning_list

        return info

    else:
        return "NO ADMIN"

# Очищение списка ошибок
@app.route('/clear_warnings', methods=['POST', 'GET'])
@login_required
def clear_warnings():
    if (current_user.panel):
        console_term.warning_list = []
        return 'OK'

    else:
        return "NO ADMIN"

# Учебная тревога
@app.route('/error')
def error():
    if (current_user.panel):
        console_term.print('test error', 3)
        return 'OK'

    else:
        return "NO ADMIN"

############HISTORY
# получить историю
@app.route('/get_history', methods=['POST', 'GET'])
@login_required
def get_history():
    if (current_user.panel):
        return {'history': history.get()}

    else:
        return "NO ADMIN"

# удалить историю
@app.route('/clear_history', methods=['POST', 'GET'])
@login_required
def clear_history():
    if (current_user.panel):
        history.clear()
        return 'OK'

    else:
        return "NO ADMIN"

############USERS
# получить настройки пользователей
@app.route('/get_templates', methods=['GET', 'POST'])
@login_required
def get_templates():
    if (current_user.panel):
        return userBase.templates_dict

    else:
        return "NO ADMIN"

# получить настройки пользователей
@app.route('/get_users', methods=['GET', 'POST'])
@login_required
def get_users():
    if (current_user.panel):
        return userBase.get_users()

    else:
        return "NO ADMIN"

# изменение настроек пользователя
@app.route('/set_user', methods=['POST'])
@login_required
def set_user():
    if (current_user.panel):
        user_json = json.loads(request.args.get("user", ""))
        user_name = request.args.get("name", "")

        userBase.users_dict[name] = user_json

        if request.args.get("reload", "").lower() == 'true':
            userBase.update_users()

        return 'ok'

    else:
        return "NO ADMIN"

############SETTINGS
# изменение настроек
@app.route('/settings_set', methods=['POST'])
@login_required
def settings_set():
    if (current_user.panel):
        try:
            section = request.args.get("section", "")
            parameter = request.args.get("parameter", "")
            state = request.args.get("state", "")

            settings.set_settings(section, parameter, state)

            settings.save_settings()

            return 'OK'

        except:
            return 'ERROR'

    else:
        return "NO ADMIN"

# перезапуск скрипта
@app.route('/reboot', methods=['POST', 'GET'])
@login_required
def web_reboot():
    if (current_user.panel):
        reboot()

    else:
        return "NO ADMIN"

# остановка скрипта
@app.route('/shutdown', methods=['POST', 'GET'])
@login_required
def web_shutdown():
    if (current_user.panel):
        shutdown()

    else:
        return "NO ADMIN"

############LOGS
# получение имён логов
@app.route('/get_logs_names', methods=['POST'])
@login_required
def get_logs_names():
    if (current_user.panel):
        files = console_term.get_all_logs()
        files = sorted(files, key=lambda x: os.path.getmtime(console_term.path + x))
        files.reverse()
        return {'logs': files}

    else:
        return "NO ADMIN"

# получение содержимого лог файла
@app.route('/read_current_log', methods=['POST', 'GET'])
@login_required
def read_current_log():
    if (current_user.panel):
        name = request.args.get("name", "")
        return str(console_term.read_current_log(name))

    else:
        return "NO ADMIN"

# удаление всех лог файлов
@app.route('/delete_all_logs', methods=['POST'])
@login_required
def delete_all_logs():
    if (current_user.panel):
        files = console_term.get_all_logs()
        for f in files:
            os.remove(console_term.path + f)

        console_term.create_log()
        console_term.print('Delete all logs', 0)

        return 'OK'

    else:
        return "NO ADMIN"

#####################################################

# текстовый редактор
@app.route('/editor')
@login_required
def editor():
    path = request.args.get("path", "")
    dir = request.args.get("dir", "")
    file = request.args.get("file", "")

    print(path, dir, file)

    data = [path, dir, file]

    return render_template(
        'editor.html',
        data=data
    )

# запись в файл новых данных
@app.route('/save', methods=['GET' , 'POST'])
@login_required
def save_file():
    try:
        path = request.args.get("path", "")
        dir = request.args.get("dir", "")
        file = request.args.get("file", "")

        user_path = userBase.get_user_info(current_user.username)['path'][int(path)]['path']

        file_path = user_path + dir + '/' + file

        size = 0

        if os.path.exists(file_path):
            f = open(file_path, 'r', encoding = 'utf-8')
            size = utf8len(f.read())
            f.close()

            if not check_size(current_user, path, utf8len(request.json['code']) - size):
                return 'NO PLACE'

        else:
            if not check_size(current_user, path, size):
                return 'NO PLACE'

        f = open(file_path, 'w', encoding = 'utf-8')
        f.write(request.json['code'])
        f.close()

        return 'ok'

    except Exception as e:
        console_term.print('/save: ' + str(e), 3)
        return 'ERROR'

#####################################################

@login_manager.user_loader
def load_user(userid):
    return userBase.get_name_by_id(int(userid))

# авторизация
@app.route('/login', methods=['GET' , 'POST'])
def login():
    username = request.args.get("username", "")
    password = request.args.get("password", "")
    user = userBase.get_user(username)
    if user != None and user.password == password:
        login_user(user, remember=True)
        history.add(0, '%s login' % username)
        return 'OK'

    else:
        return 'ERROR LOGIN'

#
@app.route("/logout", methods=['GET' , 'POST'])
@login_required
def logout():
    history.add(1, '%s logout' % current_user.username)
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

                            elif mime.split('/')[1] in ['pdf']:
                                files_list[i]['type'] = 'pdf'

                            elif mime.split('/')[0] in ['text']:
                                files_list[i]['type'] = 'text file'

                            elif mime.split('/')[0] in ['image']:
                                files_list[i]['type'] = 'image'

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

# создание файла
@app.route("/create_file", methods=['GET' , 'POST'])
@login_required
def create_file():
    path = request.args.get("path", "")
    dir = request.args.get("dir", "")
    file = request.args.get("file", "")
    hello_data = request.args.get("hello", "HELLO WORLD")

    user_path = userBase.get_user_info(current_user.username)['path'][int(path)]['path']

    if check_size(current_user, path, utf8len(hello_data)):
        f = open(user_path + dir + '/' + file, 'w')
        f.write("HELLO WORLD")
        f.close()

        history.add(5, '%s create file (%s)' % (current_user.username, user_path + dir + file))

        return 'ok'

    else:
        return 'NO PLACE'

# создание папки
@app.route("/create_folder", methods=['GET' , 'POST'])
@login_required
def create_folder():
    path = request.args.get("path", "")
    dir = request.args.get("dir", "")
    file = request.args.get("folder_name", "")

    user_path = userBase.get_user_info(current_user.username)['path'][int(path)]['path']

    os.mkdir(user_path + dir + '/' + file)

    history.add(5, '%s create folder (%s)' % (current_user.username, user_path + dir + file))

    return 'ok'

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

    history.add(7, '%s rename file (%s to %s)' % (current_user.username, user_path + dir + file, user_path + dir + new_file))

    return 'ok'

# распоковка архива
@app.route("/unpack", methods=['GET' , 'POST'])
@login_required
def unpack():
    try:
        path = request.args.get("path", "")
        dir = request.args.get("dir", "")
        file = request.args.get("file", "")

        user_path = userBase.get_user_info(current_user.username)['path'][int(path)]['path']

        dir_name = file.split('.')[0]
        #os.mkdir(user_path + dir + '/' + dir_name)

        # Узнаём суммарный размер файлов в архиве
        f = zipfile.ZipFile(user_path + dir + '/' + file, 'r')
        size = sum([zinfo.file_size for zinfo in f.filelist])

        # проверяем есть ли свободное место
        if check_size(current_user, path, size):

            # распаковка
            with zipfile.ZipFile(user_path + dir + '/' + file, 'r') as f:
                zipInfo = f.infolist()
                for member in zipInfo:
                    # меняем кодировку именя файла чтобы была кириллица
                    member.filename = member.filename.encode('cp437').decode('cp866')
                    print(member)
                    f.extract(member, user_path + dir + '/' + dir_name)

            return 'ok'

        else:
            return 'NO PLACE'

    except Exception as e:
        console_term.print('/unpack: ' + str(e), 3)
        return 'ERROR'

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
            history.add(2, '%s download file (%s)' % (current_user.username, user_path + dir + file))

            return send_from_directory(user_path + dir, file)

        else:
            files_list = json.loads(files)['files']
            files_list_log = []

            # создаём буфер
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

                    files_list_log.append(file[0])

            # переходим в начало архива
            zip_buffer.seek(0)

            history.add(2, '%s download files (%s)' % (current_user.username, user_path + dir + str(files_list_log)))

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

            history.add(6, '%s delete file (%s)' % (current_user.username, user_path + dir + file))

            os.remove(user_path + dir + '/' + file)

        else:
            files_list = json.loads(files)['files']
            files_list_log = []

            print(files_list)

            for file in files_list:
                if file[1] == 'dir':
                    shutil.rmtree(user_path + dir + '/' + file[0])
                else:
                    os.remove(user_path + dir + '/' + file[0])

                files_list_log.append(file[0])

            history.add(6, '%s delete files (%s)' % (current_user.username, user_path + dir + str(files_list_log)))

        return 'ok'

    except Exception as e:
        console_term.print('/delete: ' + str(e), 3)
        return 'ERROR'

# копирование файлов
@app.route('/copy', methods=['POST', 'GET'])
@login_required
def copy_files():
    try:
        path = request.args.get("path", "")
        dir = request.args.get("dir", "")
        files = request.args.get("files", "")
        to = request.args.get("to", "")
        cut_bool = request.args.get("move", "")

        cut_bool = (cut_bool.lower() == 'true')

        user_path = userBase.get_user_info(current_user.username)['path'][int(path)]['path']
        files_list = json.loads(files)['files']
        files_list_log = []

        if (cut_bool or check_size_list(current_user, path, dir, files_list)):
            # цикл по файлам
            for f in files_list:
                print(user_path + dir + '/' + f[0])
                if cut_bool:
                    # перемещаем
                    shutil.move(
                        user_path + dir + '/' + f[0],
                        user_path + to
                    )

                else:
                    if (f[1] == 'dir'):
                        # копирование директории
                        shutil.copytree(
                            user_path + dir + '/' + f[0],
                            user_path + to + '/' + f[0]
                        )
                    else:
                        # копирование файла
                        shutil.copy2(
                            user_path + dir + '/' + f[0],
                            user_path + to
                        )

                files_list_log.append(f[0])

            # лог
            console_term.print(
                '/copy: %s %s files from %s to %s' %
                (current_user.username, ('move' if (cut_bool) else 'copy'), '/' + dir, '/' + to),
                1
            )

            history.add(4, '%s %s file (%s) to %s' % (current_user.username, ('move' if (cut_bool) else 'copy'), user_path + dir + str(files_list_log), user_path + dir + to))

            return 'ok'

        else:
            return 'NO PLACE'

    except Exception as e:
        console_term.print('/copy: ' + str(e), 3)
        return 'ERROR'

# загрузка файла
@app.route('/upload_file', methods=['POST', 'GET'])
@login_required
def upload_file_disk():
    path = request.args.get("path", "")
    dir = request.args.get("dir", "")
    file = request.args.get("file", "")

    f = request.files['file']
    size = len(f.read())

    if check_size(current_user, path, size):
        f.seek(0, os.SEEK_SET)

        user_path = userBase.get_user_info(current_user.username)['path'][int(path)]['path']
        f.save(user_path + dir + '/' + file)

        history.add(3, '%s upload file (%s)' % (current_user.username, user_path + dir + file))


        return 'ok'

    else:
        return 'NO PLACE'

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
