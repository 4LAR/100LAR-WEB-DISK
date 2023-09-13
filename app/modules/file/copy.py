from fastapi import Depends
import copy
import json
import shutil

from globals import *
from utils import *
from deco import try_decorator

@try_decorator
async def copy(files: str, to: str, cut_bool: bool, path: int = 0, dir: str = "/", user = Depends(login_manager)):
    user_path = user['path'][int(path)]['path']
    files_list = json.loads(files)['files']
    files_list_log = []

    if not user['path'][int(path)]['readonly']:
        if (cut_bool or check_size_list(user, path, dir, files_list)):
            # цикл по файлам
            for f in files_list:
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
            str_log = '%s %s file (%s) to %s' % (user['username'], ('move' if (cut_bool) else 'copy'), user_path + dir + '/'+  str(files_list_log), user_path + dir + '/' + to)
            history.add(4, str_log)
            logging.print(str_log, print_bool=False, comment='[HISTORY] ')


            return OK

        else:
            return NO_PLACE

    return READ_ONLY
