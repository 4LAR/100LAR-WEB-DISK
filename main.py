from flask import Flask, render_template, request, make_response, redirect
from flask_httpauth import HTTPBasicAuth
from werkzeug.security import generate_password_hash, check_password_hash
#from werkzeug.utils import secure_filename
from flask import Flask, request, redirect, url_for
from werkzeug.utils import secure_filename
import os, configparser, socket
import time

UPLOAD_FOLDER = '/static/files'

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret_key'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists("settings.txt"):
    config = configparser.ConfigParser()
    config.add_section("Settings")
    config.set("Settings", "ip", "0.0.0.0")
    config.set("Settings", "port", "80")
    config.set("Settings", "debug", "True")
    #config.set("Settings", "page", "file_manager")
    config.set("Settings", "page-user", "admin")
    config.set("Settings", "page-password", "12345678")
    with open("settings.txt", "w") as config_file:
        config.write(config_file)
try:
     config = configparser.ConfigParser()
     config.read("settings.txt")
     ip_server = config.get("Settings", "ip")
     port_server = int(config.get("Settings", "port"))
     debug_server = config.get("Settings", "debug")
     debug_server_bool = True if debug_server == "true" or debug_server == "True" else False
     #page = config.get("Settings", "page")
     page_user = config.get("Settings", "page-user")
     page_password = config.get("Settings", "page-password")
except:
     input('\n ERROR READING SETTINGS FILE')
     exit()

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

print("""
  ___  ___   ___    __    ___    ___        _      __   ____   ___
 <  / / _ \ / _ \  / /   / _ |  / _ \ ____ | | /| / /  / __/  / _ )
 / / / // // // / / /__ / __ | / , _//___/ | |/ |/ /  / _/   / _  |
/_/  \___/ \___/ /____//_/ |_|/_/|_|       |__/|__/  /___/  /____/
    FILE MANAGER""")
print("LOCAL IP : " + get_ip() +':'+ str(port_server))
#print("PAGE : " + page)
print("USER : " + page_user)
print("USER PASSWORD : " + page_password)
print()
def log_time():
    return time.strftime("%Y-%m-%d", time.localtime())
def check_time():
    return time.strftime("%Y-%m-%d", time.localtime())

######################
auth = HTTPBasicAuth()
users = {
    page_user: generate_password_hash(page_password)
}
page = 'test'
######################
@auth.verify_password
def verify_password(username, password):
    if username in users:
        return check_password_hash(users.get(username), password)
    return False

#@app.route('/'+page)
@app.route('/')
@auth.login_required
def main():
    return render_template('index.html')

#@app.route('/'+page+'/files', methods=['POST', 'GET', 'OPTIONS'])
@app.route('/files', methods=['POST', 'GET', 'OPTIONS'])
@auth.login_required
def files():
    dir = request.args.get("dir", "")
    final = ''
    files = os.listdir('static/files'+dir)
    if len(files) > 0:
        #print(files)
        for file in files:
            if os.path.isdir('static/files'+dir+'/'+file):
                final += file + ':dir' + '\n'
            else:
                final += file + ':file' + '\n'
        return final
    else:
        return 'EMPTY'
######################test
#app.route('/'+page+'/upload_file', methods=['POST', 'GET'])
@app.route('/upload_file', methods=['POST', 'GET'])
@auth.login_required
def upload_file():
    if request.method == 'POST':
        #try:
        dir = request.args.get("dir", "")
        #print(dir)
        file_name = request.args.get("file_name", "")
        #print(file_name)
        f = request.files['file']
        #print(f)
        f.save('static/files'+dir+'/'+file_name)
        return 'OK'
        #except:
        #    print('ERROR UPLOAD')
        #    return 'ERROR UPLOAD'

    else:
        return 'ERROR'

@app.route('/add_dir', methods=['POST', 'GET'])
@auth.login_required
def add_dir():
    if request.method == 'POST':
        dir = request.args.get("dir", "")
        file_name = request.args.get("file_name", "")
        os.mkdir('static/files' + dir + '/' + file_name)
        return 'OK'
    else:
        return 'ERROR'

@app.route('/del_file', methods=['POST', 'GET'])
@auth.login_required
def del_file():
    if request.method == 'POST':
        dir = request.args.get("dir", "")
        file_name = request.args.get("file_name", "")
        os.remove('static/files' + dir + '/' + file_name)
        return 'OK'
    else:
        return 'ERROR'

@app.route('/del_folder', methods=['POST', 'GET'])
@auth.login_required
def del_folder():
    if request.method == 'POST':
        dir = request.args.get("dir", "")
        os.rmdir('static/files' + dir)
        return 'OK'
    else:
        return 'ERROR'

######################
if __name__ == '__main__':
    #socketio.run(app, debug=True)
    app.run(host=ip_server, port=port_server, debug=debug_server_bool)
