from fastapi import Depends
import copy
import json
import shutil

from globals import *
from utils import *
from deco import try_decorator

@try_decorator
async def delete(file: str = "", files: str = "", path: int = 0, dir: str = "/", user = Depends(login_manager)):
    user_path = user['path'][int(path)]['path']

    if not user['path'][int(path)]['readonly']:
        if len(file) > 0:

            history.add(6, '%s delete file (%s)' % (user['username'], user_path + dir + '/' + file))

            os.remove(user_path + dir + '/' + file)

        else:
            files_list = json.loads(files)['files']
            files_list_log = []

            for file in files_list:
                if file[1] == 'dir':
                    shutil.rmtree(user_path + dir + '/' + file[0])
                else:
                    os.remove(user_path + dir + '/' + file[0])

                files_list_log.append(file[0])

            str_log = '%s delete files (%s)' % (user['username'], user_path + dir + '/' + str(files_list_log))
            history.add(6, str_log)
            logging.print(str_log, print_bool=False, comment='[HISTORY] ')

        return OK

    return READ_ONLY
