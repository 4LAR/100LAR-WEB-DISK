'''
@app.route('/download/<filename>')
@login_required
def download(filename):
    print('DOWNLOAD FROM SERVER: ' + str(filename))
    return send_from_directory(user_settings.directory + '/' + filename.split(':')[0], filename.split(':')[1])
'''

@app.route('/download', methods=['GET'])
@login_required
def download():
    dir = request.args.get("dir", "")
    file = request.args.get("file", "")
    print('DOWNLOAD FROM SERVER: ' + str(dir) + '/' +  str(file))
    return send_from_directory(user_settings.directory + '/' + dir, file)

@app.route('/share_download', methods=['GET'])
def share_download():
    dir = request.args.get("dir", "")
    file = request.args.get("file", "")
    share_file_list = open('share_files.txt', 'r').read().split('\n')
    if (str(dir) + '/' +  str(file)) in share_file_list:
        print('SHARE DOWNLOAD FROM SERVER: ' + str(dir) + '/' +  str(file))
        return send_from_directory(user_settings.directory + '/' + dir, file, as_attachment=True)
    else:
        return 'ERROR'

@app.route('/add_share', methods=['GET'])
@login_required
def add_share():
    dir = request.args.get("dir", "")
    file = request.args.get("file", "")
    share_file_list = open('share_files.txt', 'r').read().split('\n')
    if not (str(dir) + '/' +  str(file)) in share_file_list:
        share_file_list.append(str(dir) + '/' +  str(file))
        f = open('share_files.txt', 'w')
        for i in share_file_list:
            f.write(i + '\n')
        f.close()
        return 'OK'
    else:
        return 'ERROR'

@app.route('/del_share', methods=['GET'])
@login_required
def del_share():
    dir = request.args.get("dir", "")
    file = request.args.get("file", "")
    share_file_list = open('share_files.txt', 'r').read().split('\n')
    try:
        i = share_file_list.index(str(dir) + '/' +  str(file))
        share_file_list.pop(i)
        f = open('share_files.txt', 'w')
        for i in share_file_list:
            f.write(i + '\n')
        f.close()
        return 'OK'
    except:
        return 'ERROR'



@app.route('/get_memory', methods=['POST', 'GET', 'OPTIONS'])
@login_required
def get_memory():
    total, used, free = total, used, free = shutil.disk_usage("/")
    return str(total // (2**30)) + '\n' + str(used // (2**30)) + '\n' + str(free // (2**30)) + '\n'

@app.route('/add_dir_disk', methods=['POST', 'GET'])
@login_required
def add_dir_disk():
    if request.method == 'POST':
        dir = request.args.get("dir", "")
        file_name = request.args.get("file_name", "")
        if not "'" in file_name:
            os.mkdir(user_settings.directory + dir + '/' + file_name)
            return 'OK'
        else:
            return 'ERROR'
    else:
        return 'ERROR'

@app.route('/del_file_disk', methods=['POST', 'GET'])
@login_required
def del_file_disk():
    if request.method == 'POST':
        dir = request.args.get("dir", "")
        file_name = request.args.get("file_name", "")
        os.remove(user_settings.directory + dir + '/' + file_name)#'static/files'
        return 'OK'
    else:
        return 'ERROR'

@app.route('/del_folder_disk', methods=['POST', 'GET'])
@login_required
def del_folder_disk():
    if request.method == 'POST':
        dir = request.args.get("dir", "")
        os.rmdir(user_settings.directory + dir)
        return 'OK'
    else:
        return 'ERROR'

@app.route('/upload_file_disk', methods=['POST', 'GET'])
@login_required
def upload_file_disk():
    if request.method == 'POST':
        dir = request.args.get("dir", "")
        file_name = request.args.get("file_name", "")
        f = request.files['file']
        f.save(user_settings.directory + dir + '/' + file_name)
        return 'OK'
    else:
        return 'ERROR'

@app.route('/files_disk', methods=['POST', 'GET', 'OPTIONS'])
@login_required
def files_disk():
    dir = request.args.get("dir", "")
    final = ''
    files = os.listdir(user_settings.directory + dir)
    if len(files) > 0:
        for file in files:
            if os.path.isdir(user_settings.directory + dir + '/' + file):
                final += file + ':dir' + '\n'
            else:
                final += file + ':file:' + str(convert_size(os.path.getsize(user_settings.directory + dir + '/' + file))) + '\n' #  + file.split('.')[len(file.split('.')) - 1]
        return final
    else:
        return 'EMPTY'
