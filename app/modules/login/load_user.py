from globals import *

@login_manager.user_loader()
async def load_user(userid: int):
    return userBase.get_user(userid)
