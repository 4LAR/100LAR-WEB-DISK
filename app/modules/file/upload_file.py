from fastapi import Depends, UploadFile, File
import copy
import shutil

from globals import *
from utils import *
from deco import try_decorator

@try_decorator
async def upload_file(file: UploadFile, path: int = 0, dir: str = "/", user = Depends(login_manager)):
    f = file.file
    size = len(f.read())
    if not user['path'][path]['readonly']:
        if check_size(user, path, size):
            f.seek(0, os.SEEK_SET)
            user_path = user['path'][path]['path']
            # f.save(user_path + dir + '/' + file.name)
            with open(user_path + dir + '/' + file.filename, "wb") as buffer:
                shutil.copyfileobj(f, buffer)

            str_log = '%s upload file (%s)' % (user['username'], user_path + dir + '/' + file.filename)
            history.add(3, str_log)
            logging.print(str_log, print_bool=False, comment='[HISTORY] ')
            return OK

        else:
            return NO_PLACE

    else:
        return READ_ONLY
