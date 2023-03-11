
VERSION = '2.1.0 (not stable)'

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

from flask_socketio import SocketIO

# импортируем всё что нужно для авторизации
from flask_login import LoginManager
from flask_login import login_required
from flask_login import UserMixin
from flask_login import login_user
from flask_login import current_user
from flask_login import logout_user

from flask_codemirror import CodeMirror
from flask_codemirror.fields import CodeMirrorField
from flask_wtf import FlaskForm

# время
import time
import datetime

# очевидно
import json

# архивы
import zipfile
import io

# тип файлов
import magic

#xterm
# пусто

# для получения информации и системе и сервере
import psutil
from memory_profiler import memory_usage

start_time = datetime.datetime.now()

# импортируем py файлы
from dict_json import *
from log import *
from get_time import *
from settings import *
from users import *
from file import *
from history import *
from terminal import *
from extensions import *

settings = settings()

time_now = Time_now(
    timedelta = settings.options['Logs']['timedelta']
)

logging = Logging(
    log_bool =  settings.options['Logs']['save_logs'],
    path =      settings.options['Logs']['path']
)
logging.time = time_now

history = History(
    length = settings.options['History']['length'],
    use_bool = settings.options['History']['use']
)
history.time = time_now

userBase = UserBase(
    path =      settings.options['Base']['path'],
    key =       settings.options['Flask']['secret_key']
)

terminal = Terminal()

CODEMIRROR_LANGUAGES = ['python', 'yaml', 'htmlembedded', "clike"]
WTF_CSRF_ENABLED = True

CODEMIRROR_THEMES = [
    'eclipse',
    'midnight',
    'material',
    '3024-night'
]

app = Flask(__name__)
app.config.from_object(__name__)
app.config['SECRET_KEY'] = settings.options['Flask']['secret_key']
app.debug = settings.options['Flask']['debug']
socketio = SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")

codemirror = CodeMirror(app)
extensions = Extensions(app, userBase, socketio)

login_manager = LoginManager()
login_manager.login_view = "login"
login_manager.init_app(app)

#####################################################
# константы

ERROR = 'ERROR'
OK = 'ok'
NO_PLACE = 'NO PLACE'
EMPTY = 'EMPTY'
ERROR_DIR = 'ERROR DIR'
ERROR_LOGIN = 'ERROR LOGIN'
NO_ADMIN = 'NO ADMIN'
READ_ONLY = 'READ ONLY'

#####################################################

#
def reboot():
    logging.print('Server rebooting', 0, comment='[SERVER] ')
    os.execv(sys.executable, ['python3'] + sys.argv)
    exit()

#
def shutdown():
    logging.print('Server shutdown', 0, comment='[SERVER] ')
    exit()

#
def check_size(current_user, path, file_size):

    busy = get_size(userBase.get_user_info(current_user.id)['path'][int(path)]['path'])
    user_size = userBase.get_user_info(current_user.id)['path'][int(path)]['size']
    if (user_size != 0):
        return (busy + file_size <= user_size)

    else:
        return True

#
def check_size_list(current_user, path, dir, files=[]):
    files_size = 0

    user_path = userBase.get_user_info(current_user.id)['path'][int(path)]['path']

    busy = get_size(user_path)
    user_size = userBase.get_user_info(current_user.id)['path'][int(path)]['size']

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
    return render_template(
        'login.html',
        version = VERSION
    )

#
@app.route('/main')
@login_required
def main_pc():
    return render_template(
        'main.html',
        version = VERSION
    )

#
@app.route('/m-main')
@login_required
def main_m():
    return render_template(
        'm-main.html',
        version = VERSION
    )

#####################################################

@app.route('/admin')
@login_required
def admin():
    if (current_user.panel):
        return render_template('admin.html')

    else:
        return NO_ADMIN

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
        info['warnings'] = logging.warning_list

        return info

    else:
        return NO_ADMIN

# Очищение списка ошибок
@app.route('/clear_warnings', methods=['POST', 'GET'])
@login_required
def clear_warnings():
    if (current_user.panel):
        logging.warning_list = []
        logging.print('clear warnings', print_bool=True, comment='[ADMIN] ')
        return OK

    else:
        return NO_ADMIN

# Учебная тревога
@app.route('/error')
def error():
    if (current_user.panel):
        logging.print('test error', 3, comment='[ERROR] ')
        return OK

    else:
        return NO_ADMIN

############HISTORY
# получить историю
@app.route('/get_history', methods=['POST', 'GET'])
@login_required
def get_history():
    if (current_user.panel):
        return {'history': history.get()}

    else:
        return NO_ADMIN

# удалить историю
@app.route('/clear_history', methods=['POST', 'GET'])
@login_required
def clear_history():
    if (current_user.panel):
        history.clear()
        logging.print('clear history', print_bool=True, comment='[ADMIN] ')
        return OK

    else:
        return NO_ADMIN

############TEMPLATES
# получить список шаблонов путей
@app.route('/get_templates', methods=['GET', 'POST'])
@login_required
def get_templates():
    if (current_user.panel):
        return userBase.templates_dict

    else:
        return NO_ADMIN

# # изменение шаблона пути
@app.route('/set_template', methods=['GET', 'POST'])
@login_required
def set_template():
    if (current_user.panel):
        template_json = request.args.get("json", "")
        template_json = json.loads(template_json)

        userBase.templates_dict[template_json['name']] = template_json

        if request.args.get("reload", "").lower() == 'true':
            userBase.reload_all()
            userBase.update_users()
            userBase.save()

        logging.print('set template: %s' % (template_json['name']), print_bool=True, comment='[ADMIN] ')

        return OK

    else:
        return NO_ADMIN

# # создание шаблона пути
@app.route('/create_template', methods=['GET', 'POST'])
@login_required
def create_template():
    if (current_user.panel):
        random_name = random_string(10)

        userBase.templates_dict[random_name] = {
            "name": random_name,
            "path": "/",
            "readonly": False,
            "size": 0
        }

        if request.args.get("reload", "").lower() == 'true':
            userBase.reload_all()
            userBase.update_users()
            userBase.save()

        logging.print('create template: %s' % (random_name), print_bool=True, comment='[ADMIN] ')

        return OK

    else:
        return NO_ADMIN

# удаление шаблона пути
@app.route('/delete_template', methods=['GET', 'POST'])
@login_required
def delete_template():
    if (current_user.panel):
        template_name = request.args.get("name", "")

        userBase.templates_dict.pop(template_name)

        if request.args.get("reload", "").lower() == 'true':
            userBase.reload_all()
            userBase.update_users()
            userBase.save()

        logging.print('delete template: %s' % (template_name), print_bool=True, comment='[ADMIN] ')

        return OK

    else:
        return NO_ADMIN

############USERS
# получить настройки пользователей
@app.route('/get_users', methods=['GET', 'POST'])
@login_required
def get_users():
    if (current_user.panel):
        return userBase.get_users()

    else:
        return NO_ADMIN

# изменение настроек пользователя
@app.route('/set_user', methods=['POST'])
@login_required
def set_user():
    if (current_user.panel):
        user_json = request.args.get("user", "")
        user_json = json.loads(user_json)
        user_name = request.args.get("name", "")

        userBase.users_dict_static[user_name] = user_json[user_name]

        if request.args.get("reload", "").lower() == 'true':
            userBase.reload(user_name)
            userBase.update_users()
            userBase.save()

        logging.print('set user: %s' % (user_name), print_bool=True, comment='[ADMIN] ')

        return OK

    else:
        return NO_ADMIN

@app.route('/create_user', methods=['POST'])
@login_required
def create_user():
    if (current_user.panel):

        userBase.last_id += 1
        userBase.users_dict_static[str(userBase.last_id)] = {
            "username": "new_user_" + str(userBase.last_id),
            "status": "user",
            "password": "12345678",
            "panel": False,
            "path": []
        }

        if request.args.get("reload", "").lower() == 'true':
            userBase.reload(str(userBase.last_id))
            userBase.update_users()
            userBase.save()

        logging.print('create user: %d' % (userBase.last_id), print_bool=True, comment='[ADMIN] ')

        return OK
    else:
        return NO_ADMIN

# удаление пользователя
@app.route('/delete_user', methods=['POST'])
@login_required
def delete_user():
    if (current_user.panel):
        user_name = request.args.get("name", "")

        userBase.users_dict_static.pop(user_name)

        if request.args.get("reload", "").lower() == 'true':
            userBase.update_users()
            userBase.save()

        logging.print('delete user: %s' % (user_name), print_bool=True, comment='[ADMIN] ')

        return OK
    else:
        return NO_ADMIN

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
            logging.print('set parametr: [%s] %s = %s' % (section, parameter, state), print_bool=True, comment='[ADMIN] ')

            settings.save_settings()

            return OK

        except:
            return ERROR

    else:
        return NO_ADMIN

# перезапуск скрипта
@app.route('/reboot', methods=['POST', 'GET'])
@login_required
def web_reboot():
    if (current_user.panel):
        reboot()

    else:
        return NO_ADMIN

# остановка скрипта
@app.route('/shutdown', methods=['POST', 'GET'])
@login_required
def web_shutdown():
    if (current_user.panel):
        shutdown()

    else:
        return NO_ADMIN

############LOGS
# получение имён логов
@app.route('/get_logs_names', methods=['POST'])
@login_required
def get_logs_names():
    if (current_user.panel):
        files = logging.get_all_logs()
        files = sorted(files, key=lambda x: os.path.getmtime(logging.path + x))
        files.reverse()
        return {'logs': files}

    else:
        return NO_ADMIN

# получение содержимого лог файла
@app.route('/read_current_log', methods=['POST', 'GET'])
@login_required
def read_current_log():
    if (current_user.panel):
        name = request.args.get("name", "")
        return str(logging.read_current_log(name))

    else:
        return NO_ADMIN

# удаление всех лог файлов
@app.route('/delete_all_logs', methods=['POST'])
@login_required
def delete_all_logs():
    if (current_user.panel):
        files = logging.get_all_logs()
        for f in files:
            os.remove(logging.path + f)

        logging.create_log()
        logging.print('Delete all logs', 0, comment='[SERVER] ')

        return OK

    else:
        return NO_ADMIN

#####################################################

class EditorForm(FlaskForm):
    source_code = CodeMirrorField(
        #language = 'text/x-csrc',
        config = {
            'lineNumbers': 'true'
        }
    )

# текстовый редактор
@app.route('/editor')
@login_required
def editor():
    path = request.args.get("path", "")
    dir = request.args.get("dir", "")
    file = request.args.get("file", "")

    themes_str = ''
    for theme_name in CODEMIRROR_THEMES:
        themes_str += '<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.61.0/theme/%s.css">\n' % (theme_name)

    data = [
        path,
        userBase.get_user_info(current_user.id)['path'][int(path)]['name'],
        dir,
        file
    ]

    form = EditorForm()

    return render_template(
        'editor.html',
        data=data,
        form=form,
        codemirror_themes = themes_str
    )

# запись в файл новых данных
@app.route('/save', methods=['GET' , 'POST'])
@login_required
def save_file():
    try:
        path = request.args.get("path", "")
        dir = request.args.get("dir", "")
        file = request.args.get("file", "")

        user_path = userBase.get_user_info(current_user.id)['path'][int(path)]['path']

        file_path = user_path + dir + '/' + file

        size = 0

        if not userBase.get_user_info(current_user.id)['path'][int(path)]['readonly']:

            if os.path.exists(file_path):
                f = open(file_path, 'r', encoding = 'utf-8')
                size = utf8len(f.read())
                f.close()

                if not check_size(current_user, path, utf8len(request.json['code']) - size):
                    return NO_PLACE

            else:
                if not check_size(current_user, path, size):
                    return NO_PLACE

            f = open(file_path, 'w', encoding = 'utf-8')
            f.write(request.json['code'])
            f.close()

            return OK

        return READ_ONLY

    except Exception as e:
        logging.print('/save: ' + str(e), 3, comment='[ERROR] ')
        return ERROR

#####################################################

@login_manager.user_loader
def load_user(userid):
    return userBase.get_user(int(userid))

# авторизация
@app.route('/login', methods=['GET' , 'POST'])
def login():
    username = request.args.get("username", "")
    password = request.args.get("password", "")
    remember = True if (request.args.get("remember", "false").lower() == 'true') else False
    user = userBase.get_user(userBase.get_id_by_name(username))
    if user != None and user.password == password:
        login_user(user, remember=remember)
        str_log = '%s login' % username
        history.add(0, str_log)
        logging.print(str_log, print_bool=False, comment='[HISTORY] ')
        return OK

    else:
        return ERROR_LOGIN

#
@app.route("/logout", methods=['GET' , 'POST'])
@login_required
def logout():
    str_log = '%s logout' % current_user.username
    history.add(1, str_log)
    logging.print(str_log, print_bool=False, comment='[HISTORY] ')
    logout_user()
    return OK

#
@app.route("/info", methods=['GET' , 'POST'])
@login_required
def info():
    info_json = userBase.get_user_info(current_user.id)
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

            user_path = userBase.get_user_info(current_user.id)['path'][int(path)]['path']

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

                            elif mime.split('/')[0] in ['video']:
                                files_list[i]['type'] = 'video'

                            elif mime.split('/')[0] in ['audio']:
                                files_list[i]['type'] = 'audio'

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
                return EMPTY

        else:
            return ERROR_DIR

    except:
        return ERROR_DIR

# создание файла
@app.route("/create_file", methods=['GET' , 'POST'])
@login_required
def create_file():
    path = request.args.get("path", "")
    dir = request.args.get("dir", "")
    file = request.args.get("file", "")
    hello_data = request.args.get("hello", "HELLO WORLD")

    user_path = userBase.get_user_info(current_user.id)['path'][int(path)]['path']
    if not userBase.get_user_info(current_user.id)['path'][int(path)]['readonly']:
        if check_size(current_user, path, utf8len(hello_data)):
            f = open(user_path + dir + '/' + file, 'w')
            f.write("HELLO WORLD")
            f.close()

            str_log = '%s create file (%s)' % (current_user.username, user_path + dir + '/' + file)
            history.add(5, str_log)
            logging.print(str_log, print_bool=False, comment='[HISTORY] ')

            return OK

        else:
            return NO_PLACE

    else:
        return READ_ONLY

# создание папки
@app.route("/create_folder", methods=['GET' , 'POST'])
@login_required
def create_folder():
    path = request.args.get("path", "")
    dir = request.args.get("dir", "")
    file = request.args.get("folder_name", "")

    user_path = userBase.get_user_info(current_user.id)['path'][int(path)]['path']

    if not userBase.get_user_info(current_user.id)['path'][int(path)]['readonly']:
        os.mkdir(user_path + dir + '/' + file)

        str_log = '%s create folder (%s)' % (current_user.username, user_path + dir + '/' + file)
        history.add(5, str_log)
        logging.print(str_log, print_bool=False, comment='[HISTORY] ')

        return OK

    else:
        return READ_ONLY

# переименование файла
@app.route("/rename", methods=['GET' , 'POST'])
@login_required
def rename():
    path = request.args.get("path", "")
    dir = request.args.get("dir", "")
    file = request.args.get("file", "")
    new_file = request.args.get("new_file", "")

    user_path = userBase.get_user_info(current_user.id)['path'][int(path)]['path']

    os.rename(user_path + dir + '/' + file, user_path + dir + '/' + new_file)

    str_log = '%s rename file (%s to %s)' % (current_user.username, user_path + dir + '/' + file, user_path + dir + '/' + new_file)
    history.add(7, str_log)
    logging.print(str_log, print_bool=False, comment='[HISTORY] ')

    return OK

# распоковка архива
@app.route("/unpack", methods=['GET' , 'POST'])
@login_required
def unpack():
    try:
        path = request.args.get("path", "")
        dir = request.args.get("dir", "")
        file = request.args.get("file", "")

        user_path = userBase.get_user_info(current_user.id)['path'][int(path)]['path']

        if not userBase.get_user_info(current_user.id)['path'][int(path)]['readonly']:
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

                return OK

            else:
                return NO_PLACE

        else:
            return READ_ONLY

    except Exception as e:
        logging.print('/unpack: ' + str(e), 3, comment='[ERROR] ')
        return ERROR

# скачивание файла
@app.route("/download", methods=['GET' , 'POST'])
@login_required
def downlaod():
    try:
        path = request.args.get("path", "")
        dir = request.args.get("dir", "")
        file = request.args.get("file", "")
        files = request.args.get("files", "")

        user_path = userBase.get_user_info(current_user.id)['path'][int(path)]['path']

        if len(file) > 0:
            str_log = '%s download file (%s)' % (current_user.username, user_path + dir + '/' + file)
            history.add(2, str_log)
            logging.print(str_log, print_bool=False, comment='[HISTORY] ')

            return send_from_directory(user_path + dir, file)

        else:
            files_list = json.loads(files)['files']
            files_list_log = []

            # создаём буфер
            zip_buffer = io.BytesIO()

            # размер строки (для удаления лишних путей)
            cut_len = len(os.path.abspath(user_path + dir + '/')) - (1 if os.name == 'nt' else 0)

            # открываем архив и хапичваем в него все нужные файлы
            with zipfile.ZipFile(zip_buffer, 'w') as archive:
                for file in files_list:
                    if file[1] == 'dir':
                        for folderName, subfolders, filenames in os.walk(user_path + dir + '/' + file[0]):
                            for filename in filenames:
                                filePath = os.path.join(folderName, filename)
                                archive.write(filePath, arcname=filePath[cut_len:], compress_type=zipfile.ZIP_DEFLATED)
                                files_list_log.append(filePath[cut_len:])

                    else:
                        archive.write(user_path + dir + '/' + file[0], arcname=file[0])

                        files_list_log.append(file[0])

            # переходим в начало архива
            zip_buffer.seek(0)

            str_log = '%s download files (%s)' % (current_user.username, user_path + dir + '/' + str(files_list_log))
            history.add(2, str_log)
            logging.print(str_log, print_bool=False, comment='[HISTORY] ')

            # отправляем архив
            return Response(zip_buffer.getvalue(),
                mimetype='application/zip',
                headers={'Content-Disposition': 'attachment;filename=%s.zip' % (current_user.username)})

    except Exception as e:
        logging.print('/download: ' + str(e), 3, comment='[ERROR] ')
        return ERROR

# удаление файла
@app.route('/delete', methods=['POST', 'GET'])
@login_required
def delete():
    try:
        path = request.args.get("path", "")
        dir = request.args.get("dir", "")
        file = request.args.get("file", "")
        files = request.args.get("files", "")

        user_path = userBase.get_user_info(current_user.id)['path'][int(path)]['path']

        if not userBase.get_user_info(current_user.id)['path'][int(path)]['readonly']:
            if len(file) > 0:

                history.add(6, '%s delete file (%s)' % (current_user.username, user_path + dir + '/' + file))

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

                str_log = '%s delete files (%s)' % (current_user.username, user_path + dir + '/' + str(files_list_log))
                history.add(6, str_log)
                logging.print(str_log, print_bool=False, comment='[HISTORY] ')

            return OK

        return READ_ONLY

    except Exception as e:
        logging.print('/delete: ' + str(e), 3, comment='[ERROR] ')
        return ERROR

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

        user_path = userBase.get_user_info(current_user.id)['path'][int(path)]['path']
        files_list = json.loads(files)['files']
        files_list_log = []

        if not userBase.get_user_info(current_user.id)['path'][int(path)]['readonly']:
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
                str_log = '%s %s file (%s) to %s' % (current_user.username, ('move' if (cut_bool) else 'copy'), user_path + dir + '/'+  str(files_list_log), user_path + dir + '/' + to)
                history.add(4, str_log)
                logging.print(str_log, print_bool=False, comment='[HISTORY] ')


                return OK

            else:
                return NO_PLACE

        return READ_ONLY

    except Exception as e:
        logging.print('/copy: ' + str(e), 3, comment='[ERROR] ')
        return ERROR

# загрузка файла
@app.route('/upload_file', methods=['POST', 'GET'])
@login_required
def upload_file_disk():
    path = request.args.get("path", "")
    dir = request.args.get("dir", "")
    file = request.args.get("file", "")

    f = request.files['file']
    size = len(f.read())
    if not userBase.get_user_info(current_user.id)['path'][int(path)]['readonly']:
        if check_size(current_user, path, size):
            f.seek(0, os.SEEK_SET)
            print(userBase.get_user_info(current_user.id))
            user_path = userBase.get_user_info(current_user.id)['path'][int(path)]['path']
            f.save(user_path + dir + '/' + file)

            str_log = '%s upload file (%s)' % (current_user.username, user_path + dir + '/' + file)
            history.add(3, str_log)
            logging.print(str_log, print_bool=False, comment='[HISTORY] ')

            return OK

        else:
            return NO_PLACE

    else:
        return READ_ONLY

@app.before_request
def log_request_info():
    try:
        if 'text/html' in request.headers['Accept']:
            str_log = ' '.join([
            request.remote_addr,
            request.method,
            request.url,
            '\n\t'.join([': '.join(x) for x in request.headers])])

            logging.print(str_log, print_bool=False, comment='[REQUEST] ')

    except Exception as e:
        #logging.print(e, 3, comment='[ERROR REQUEST] ')
        pass

#####################################################
# приложения
@app.route('/get_apps', methods=['GET' , 'POST'])
@login_required
def get_apps():
    return {"apps": extensions.get()}

@app.route('/get_my_apps', methods=['GET' , 'POST'])
@login_required
def get_my_apps():
    return {"apps": extensions.get_my_apps(int(current_user.id))}

@app.route('/append_app', methods=['GET' , 'POST'])
@login_required
def append_app():
    data = request.args.get("data", "")
    app_id = request.args.get("app_id", "")
    extensions.append_app(int(current_user.id), app_id, json.loads(data))

    return OK

@app.route('/delete_app', methods=['GET' , 'POST'])
@login_required
def delete_app():
    id = request.args.get("id", "")
    extensions.delete_app(int(current_user.id), int(id))

    return OK

@app.route('/app', methods=['GET' , 'POST'])
@login_required
def custom_app():
    id = request.args.get("id", "")
    app_dict = extensions.get()[request.args.get("app_id", "")]
    return extensions.generate_html(id, app_dict)

#####################################################
# соккеты

def read_and_forward_pty_output():
    max_read_bytes = 1024 * 20
    while True:
        socketio.sleep(0.01)
        if terminal.fd:
            timeout_sec = 0
            (data_ready, _, _) = select.select([terminal.fd], [], [], timeout_sec)
            if data_ready:
                output = os.read(terminal.fd, max_read_bytes).decode(
                    errors="ignore"
                )
                socketio.emit("pty-output", {"output": output}, namespace="/pty")

@socketio.on("ptyInput", namespace="/pty")
def pty_input(data):
    terminal.input(data)
    pass

@socketio.on("resize", namespace="/pty")
def resize(data):
    terminal.set_winsize(data["rows"], data["cols"])

@socketio.on("connect", namespace="/pty")
def connect():
    if terminal.create():
        socketio.start_background_task(target=read_and_forward_pty_output)
        pass
    else:
        return
#####################################################

logging.create_log()
print('100LAR-WEB-DISK')

# создаём сервер
# app.run(
#     host = settings.options['Flask']['IP'],
#     port = settings.options['Flask']['PORT'],
#     debug = settings.options['Flask']['debug'],
#     threaded = settings.options['Flask']['threaded'],
#     processes = int(settings.options['Flask']['processes'])
# )

socketio.run(
    app,
    debug=settings.options['Flask']['debug'],
    port=settings.options['Flask']['PORT'],
    host=settings.options['Flask']['IP']#,
    # threaded = settings.options['Flask']['threaded'],
    # processes = int(settings.options['Flask']['processes'])
)
