from fastapi import Depends, Response
import copy

from globals import *
from utils import *
from deco import try_decorator

@try_decorator
async def render_app(id: str, app_id: str, user = Depends(login_manager)):
    user_id = database.get_id_by_name(user['username'])
    app_dict = extensions.get(user_id)[app_id]
    return Response(extensions.generate_html(id, int(user_id), app_dict))
