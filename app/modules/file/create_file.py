from fastapi import Depends
import copy

from globals import *
from utils import *
from deco import try_decorator

@try_decorator
def create_file(file: str, hello_data: str = "HELLO WORLD", path: int = 0, dir: str = "/", user = Depends(login_manager)):
    if len(file) < 1:
        return ERROR_NAME

    for s in file:
        if s in FILE_NAME_BACK_LIST:
            return ERROR_NAME

    user_path = user['path'][int(path)]['path']

    if os.path.exists(user_path + dir + '/' + file):
        return ALREADY_EXISTS

    if not user['path'][int(path)]['readonly']:
        if check_size(current_user, path, utf8len(hello_data)):
            f = open(user_path + dir + '/' + file, 'w')
            f.write(hello_data)
            f.close()

            str_log = '%s create file (%s)' % (current_user.username, user_path + dir + '/' + file)
            history.add(5, str_log)
            logging.print(str_log, print_bool=False, comment='[HISTORY] ')

            return OK

        else:
            return NO_PLACE

    else:
        return READ_ONLY
