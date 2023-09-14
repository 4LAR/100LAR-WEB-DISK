from fastapi import Depends, Response
import copy
import json

from globals import *
from utils import *
from deco import try_decorator

@try_decorator
async def append_app(data: str, app_id: str, user = Depends(login_manager)):
    status, out_data = extensions.append_app(int(database.get_id_by_name(user['username'])), app_id, json.loads(data))
    if status:
        str_log = '%s create app with name "%s:%s"' % (user['username'], app_id, json.loads(data)['name']['value'])
        history.add(8, str_log)
        logging.print(str_log, print_bool=False, comment='[HISTORY] ')

        return Response(OK)

    else:
        return Response(out_data)
