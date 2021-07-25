
import math
from flask import send_from_directory

from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager , login_required , UserMixin , login_user, current_user, logout_user

login_manager = LoginManager()
login_manager.login_view = "login"
login_manager.init_app(app)

def convert_size(size_bytes):
   if size_bytes == 0:
       return "0B"
   size_name = ("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB")
   i = int(math.floor(math.log(size_bytes, 1024)))
   p = math.pow(1024, i)
   s = round(size_bytes / p, 2)
   return "%s %s" % (s, size_name[i])

class user_settings():
    def __init__(self):
        # переменные настроек
        self.login = True
        self.username = 'admin'
        self.password = '12345678'
        self.directory = 'files'

        self.read_settings() # читаем настроки

    def read_settings(self):
        if not os.path.exists("user_settings.txt"): # проверка файла с настройками
            config = configparser.ConfigParser()
            config.add_section("USER")
            config.set("USER", "login", str(self.login))
            config.set("USER", "username", str(self.username))
            config.set("USER", "password", str(self.password))
            config.set("USER", "directory", str(self.directory))
            with open("user_settings.txt", "w") as config_file: # запись файла с настройками
                config.write(config_file)
            self.read_settings()
        else:
            config = configparser.ConfigParser()
            config.read("user_settings.txt")
            self.login = True if (config.get("USER", "login").lower == 'true') else False
            self.username = config.get("USER", "username")
            self.password = config.get("USER", "password")
            self.directory = config.get("USER", "directory")

user_settings = user_settings()

class User(UserMixin):
    def __init__(self):
        self.id = 0
        self.username = user_settings.username
        self.password = user_settings.password

    def get_id(self):
        return self.id

    def get_auth_token(self):
        return make_secure_token(self.username , key='secret_key')

user = User()

@app.route('/need_login' , methods=['GET' , 'POST'])
def need_login():
    return str(user_settings.login)

@login_manager.user_loader
def load_user(userid):
    return user

@app.route('/login' , methods=['GET' , 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username == user_settings.username and password == user_settings.password:
            print(username + ' Logged in..')
            login_user(user, remember=True)
            return 'OK'
        else:
            return 'ERROR LOGIN'
    else:
        return 'ERROR'

@app.route("/logout", methods=['GET' , 'POST'])
@login_required
def logout():
    logout_user()
    return 'OK'

@app.route('/check_login')
@login_required
def check_login():
    return 'OK'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/main')
def main():
    return render_template('main.html')

@app.route('/m-main')
def m_main():
    return render_template('m_main.html')

@app.errorhandler(404)
def page_not_found(e):
    return 'ERROR NF'
