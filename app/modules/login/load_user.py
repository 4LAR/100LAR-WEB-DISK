from fastapi import Depends, Response
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_login.exceptions import InvalidCredentialsException

from globals import *
from deco import try_decorator

@login_manager.user_loader()
def load_user(name: str):  # could also be an asynchronous function
    user = database.get_user_by_name(name)
    return user

@try_decorator
async def login(response: Response, data: OAuth2PasswordRequestForm = Depends()):
    name = data.username
    password = data.password

    user = load_user(name)
    if not user:
        raise InvalidCredentialsException
    elif password != user['password']:
        raise InvalidCredentialsException

    access_token = login_manager.create_access_token(
        data = dict(sub = name)
    )
    login_manager.set_cookie(response, access_token)

    return {'access_token': access_token, 'token_type': 'bearer'}
