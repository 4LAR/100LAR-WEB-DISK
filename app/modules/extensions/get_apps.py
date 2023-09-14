from fastapi import Depends
import copy

from globals import *
from utils import *
from deco import try_decorator

@try_decorator
async def get_apps(user = Depends(login_manager)):
    return {"apps": extensions.get(database.get_id_by_name(user['username']))}
