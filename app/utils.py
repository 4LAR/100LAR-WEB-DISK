import os
import math
import random
import string
from globals import *

def convert_size(size_bytes):
   if size_bytes == 0:
       return "0B"
   size_name = ("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB")
   i = int(math.floor(math.log(size_bytes, 1024)))
   p = math.pow(1024, i)
   s = round(size_bytes / p, 2)
   return "%s %s" % (s, size_name[i])

def get_size(start_path = '.'):
    total_size = 0
    for dirpath, dirnames, filenames in os.walk(start_path):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            total_size += os.path.getsize(fp)
    return total_size

# конвертирование [size_name] в байты
def convert_size_to_b(size, name_i=0):
  return pow(1024, name_i) * size

def get_bool(str):
  return True if str.lower() == 'true' else False

def random_string(size):
  return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(size))


################################################################################

# перезагрузка сервера
def reboot():
    logging.print('Server rebooting', 0, comment='[SERVER] ')
    os.execv(sys.executable, ['python3'] + sys.argv)
    exit()

# остановка сервера
def shutdown():
    logging.print('Server shutdown', 0, comment='[SERVER] ')
    exit()

# получить вес файла
def check_size(current_user, path, file_size):

    busy = get_size(current_user['path'][int(path)]['path'])
    user_size = current_user['path'][int(path)]['size']
    if (user_size != 0):
        return (busy + file_size <= user_size)

    else:
        return True

# получить вкс вес списка файлов
def check_size_list(current_user, path, dir, files=[]):
    files_size = 0

    user_path = current_user['path'][int(path)]['path']

    busy = get_size(user_path)
    user_size = current_user['path'][int(path)]['size']

    if (user_size != 0):
        for f in files:
            if (f[1] == 'dir'):
                files_size += get_size(user_path + dir + f[0])

            else:
                files_size += os.path.getsize(
                    user_path + dir + '/' + f[0]
                )

        return (busy + files_size <= user_size)

    else:
        return True

# получить вес строки
def utf8len(s):
    return len(s.encode('utf-8'))

# прочитать определённое количество символов в файле
def read_file_with_len(file_name, count):
    f = open(file_name, "r", encoding='utf-8')
    result = f.read(count)
    f.close()

    return result
