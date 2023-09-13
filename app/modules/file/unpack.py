from fastapi import Depends
import copy

from globals import *
from utils import *
from deco import try_decorator

@try_decorator
async def unpack(file: str, path: int = 0, dir: str = "/", user = Depends(login_manager)):
    user_path = user['path'][int(path)]['path']

    if not user['path'][int(path)]['readonly']:
        dir_name = file.split('.')[0]

        # Узнаём суммарный размер файлов в архиве
        f = zipfile.ZipFile(user_path + dir + '/' + file, 'r')
        size = sum([zinfo.file_size for zinfo in f.filelist])

        # проверяем есть ли свободное место
        if check_size(user, path, size):

            # распаковка
            with zipfile.ZipFile(user_path + dir + '/' + file, 'r') as f:
                zipInfo = f.infolist()
                for member in zipInfo:
                    # меняем кодировку именя файла чтобы была кириллица
                    member.filename = member.filename.encode('cp437').decode('cp866')
                    f.extract(member, user_path + dir + '/' + dir_name)

            return OK

        else:
            return NO_PLACE

    else:
        return READ_ONLY
