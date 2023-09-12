from fastapi import Depends
import copy

from globals import *
from utils import *
from deco import try_decorator

@try_decorator
async def info(user = Depends(login_manager)):
    info_json = user.copy()
    info_json.pop("password")
    for i in range(len(info_json['path'])):
        info_json['path'][i]['size_converted'] = convert_size(info_json['path'][i]['size'])
        if info_json['path'][i]['path'] != '/':
            info_json['path'][i]['busy'] = get_size(info_json['path'][i]['path'])
            info_json['path'][i]['busy_converted'] = convert_size(info_json['path'][i]['busy'])

    return info_json
