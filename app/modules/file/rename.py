from fastapi import Depends
import copy

from globals import *
from utils import *
from deco import try_decorator

@try_decorator
async def rename(file: str, new_file: str, path: int = 0, dir: str = "/", user = Depends(login_manager)):
    user_path = user['path'][int(path)]['path']

    if os.path.exists(user_path + dir + '/' + new_file):
        return ALREADY_EXISTS

    os.rename(user_path + dir + '/' + file, user_path + dir + '/' + new_file)

    str_log = '%s rename file (%s to %s)' % (current_user.username, user_path + dir + '/' + file, user_path + dir + '/' + new_file)
    history.add(7, str_log)
    logging.print(str_log, print_bool=False, comment='[HISTORY] ')

    return OK
