from fastapi_login import LoginManager
import socketio

from config import Config
from base import DataBase

config = Config("config.ini")

for section in config.options:
    for parameter in config.options[section]:
        value = config.options[section][parameter]
        exec("%s = %s" % (
            f"{section.upper()}_{parameter.upper()}",
            value if value == str else "\"%s\"" % value
        ), globals())

login_manager = LoginManager(
    FASTAPI_SECRET_KEY,
    token_url='/auth/token',
    use_cookie=True,
    use_header=False
)

database = DataBase(
    path        = BASE_PATH,
    file_name   = BASE_FILE_NAME,
    key         = FASTAPI_SECRET_KEY
)
