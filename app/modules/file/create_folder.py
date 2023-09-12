from fastapi import Depends
import copy

from globals import *
from utils import *
from deco import try_decorator

@try_decorator
async def create_folder(folder_name: str, path: int = 0, dir: str = "/", user = Depends(login_manager)):
    if len(file) < 1:
        return ERROR_NAME

    for s in file:
        if s in FILE_NAME_BACK_LIST:
            return ERROR_NAME

    user_path = user['path'][int(path)]['path']

    if os.path.exists(user_path + dir + '/' + file):
        return ALREADY_EXISTS

    if not user['path'][int(path)]['readonly']:
        os.mkdir(user_path + dir + '/' + file)

        str_log = '%s create folder (%s)' % (current_user.username, user_path + dir + '/' + file)
        history.add(5, str_log)
        logging.print(str_log, print_bool=False, comment='[HISTORY] ')

        return OK

    else:
        return READ_ONLY
