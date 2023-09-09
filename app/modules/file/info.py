from fastapi import Depends

from globals import *
from utils import *

async def info(user = Depends(login_manager)):
    # info_json = userBase.get_user_info(current_user.id)
    # info_json['name'] = current_user.username
    # for i in range(len(info_json['path'])):
    #     info_json['path'][i]['size_converted'] = convert_size(info_json['path'][i]['size'])
    #     if info_json['path'][i]['path'] != '/':
    #         info_json['path'][i]['busy'] = get_size(info_json['path'][i]['path'])
    #         info_json['path'][i]['busy_converted'] = convert_size(info_json['path'][i]['busy'])

    return user
