from fastapi import Depends
import magic
import datetime

from globals import *
from utils import *
from deco import try_decorator

@try_decorator
async def files(path: int = 0, dir: str = "/", user = Depends(login_manager)):
    if (not '..' in dir):
        user_path = user['path'][int(path)]['path']

        files = os.listdir(user_path + dir)

        if len(files) > 0:
            files_list = []
            for i in range(len(files)):
                try:
                    file = files[i]

                    files_list.append(
                        {
                            'name': file
                        }
                    )

                    if len(dir) > 0:
                        file_path = user_path + dir + '/' + file

                    else:
                        file_path = user_path + file

                    if os.path.isdir(file_path):
                        files_list[i]['type'] = 'dir'

                    else:
                        mime = magic.from_buffer(open(file_path, "rb").read(2048), mime=True)

                        if mime.split('/')[1] in ['zip', 'x-rar']:
                            files_list[i]['type'] = 'archive'

                        elif mime.split('/')[1] in ['pdf']:
                            files_list[i]['type'] = 'pdf'

                        elif mime.split('/')[0] in ['text']:
                            files_list[i]['type'] = 'text file'

                        elif mime.split('/')[0] in ['image']:
                            files_list[i]['type'] = 'image'

                        elif mime.split('/')[0] in ['video']:
                            files_list[i]['type'] = 'video'

                        elif mime.split('/')[0] in ['audio']:
                            files_list[i]['type'] = 'audio'

                        else:
                            files_list[i]['type'] = 'file'

                        files_list[i]['type_mime'] = mime
                        files_list[i]['size'] = convert_size(
                            os.path.getsize(
                                user_path + dir + '/' + file
                            )
                        )
                        change_time = os.path.getmtime(file_path)
                        files_list[i]['time'] = datetime.datetime.fromtimestamp(change_time).strftime('%H:%M:%S %d-%m-%Y')

                except Exception as e:
                    print(e)

            return {'files': files_list}

        else:
            return EMPTY

    else:
        return ERROR_DIR
