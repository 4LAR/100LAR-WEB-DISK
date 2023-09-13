from fastapi import Depends
from fastapi.responses import FileResponse, Response
import copy
import json
import zipfile
import rarfile
import io


from globals import *
from utils import *
from deco import try_decorator

@try_decorator
async def download(file: str = "", files: str = "", preview_flag: bool = False, preview_type: str = "", path: int = 0, dir: str = "/", user = Depends(login_manager)):
    user_path = user['path'][int(path)]['path']
    if preview_flag:
        if preview_type == "text":
            return read_file_with_len(user_path + dir + '/' + file, settings.options['Preview']['max_text_file_weight'])

        elif preview_type == "archive":
            mime = magic.from_buffer(open(user_path + dir + '/' + file, "rb").read(2048), mime=True)
            archive = None

            if mime.split("/")[1] == "zip":
                archive = zipfile.ZipFile(user_path + dir + '/' + file)

            elif (mime.split("/")[1] == "x-rar"):
                archive = rarfile.RarFile(user_path + dir + '/' + file)

            archive_files = archive.namelist()
            if len(archive_files) <= settings.options['Preview']['max_files_in_archive']:
                return {"archive": archive_files}

            else:
                return ERROR

        elif preview_type == "image":
            image_type = file.split(".")[-1]
            if image_type.lower() in ["svg", "gif"]:
                return FileResponse(path = user_path + dir + file, filename = file)

            im = Image.open(user_path + dir + '/' + file)
            if im.size[0] > settings.options['Preview']['max_pics_width']:
                im = im.resize((
                    settings.options['Preview']['max_pics_width'],
                    int((im.size[1] * settings.options['Preview']['max_pics_width'])/(im.size[0]))
                ))
            im_io = io.BytesIO()
            im.save(im_io, "PNG")
            im_io.seek(0)
            return Response(content = im_io, media_type = 'image/png')

        else:
            return ERROR

    if len(file) > 0:
        # str_log = '%s download file (%s)' % (user['username'], user_path + dir + '/' + file)
        # history.add(2, str_log)
        # logging.print(str_log, print_bool=False, comment='[HISTORY] ')

        return FileResponse(path = user_path + dir + file, filename = file)

    else:
        files_list = json.loads(files)['files']
        files_list_log = []

        # создаём буфер
        zip_buffer = io.BytesIO()

        # размер строки (для удаления лишних путей)
        cut_len = len(os.path.abspath(user_path + dir + '/')) - (1 if os.name == 'nt' else 0)

        # открываем архив и хапичваем в него все нужные файлы
        with zipfile.ZipFile(zip_buffer, 'w') as archive:
            for file in files_list:
                if file[1] == 'dir':
                    for folderName, subfolders, filenames in os.walk(user_path + dir + '/' + file[0]):
                        for filename in filenames:
                            filePath = os.path.join(folderName, filename)
                            archive.write(filePath, arcname=filePath[cut_len:], compress_type=zipfile.ZIP_DEFLATED)
                            files_list_log.append(filePath[cut_len:])

                else:
                    archive.write(user_path + dir + '/' + file[0], arcname=file[0])

                    files_list_log.append(file[0])

        # переходим в начало архива
        zip_buffer.seek(0)

        str_log = '%s download files (%s)' % (user['username'], user_path + dir + '/' + str(files_list_log))
        history.add(2, str_log)
        logging.print(str_log, print_bool=False, comment='[HISTORY] ')

        # отправляем архив
        return Response(content=zip_buffer.getvalue(),
            media_type='application/zip',
            headers={'Content-Disposition': 'attachment;filename=%s.zip' % (user['username'])})
