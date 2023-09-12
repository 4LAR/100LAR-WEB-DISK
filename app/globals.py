from fastapi_login import LoginManager
import socketio

from config import Config
from base import DataBase
from log import Logging
from get_time import Time_now

################################################################################

config = Config("config.ini")

for section in config.options:
    for parameter in config.options[section]:
        value = config.options[section][parameter]
        exec("%s = %s" % (
            f"{section.upper()}_{parameter.upper()}",
            value if value == str else "\"%s\"" % value
        ), globals())

time_now = Time_now(
    timedelta = int(LOGS_TIMEDELTA)
)

logging = Logging(
    log_bool =  LOGS_SAVE_LOGS,
    path     =  LOGS_PATH
)
logging.time = time_now
logging.create_log()

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

################################################################################
# константы

FILE_NAME_BACK_LIST = ("/", "\\", ":", "*", "?", "<", ">", "|")
USERNAME_WHITE_LIST = ("qwertyuiopasdfghjklzxcvbnm1234567890")

MAX_SIZE_READ_FILE = 2048

ERROR = 'ERROR'
OK = 'ok'
NO_PLACE = 'NO PLACE'
EMPTY = 'EMPTY'
ERROR_DIR = 'ERROR DIR'
ERROR_LOGIN = 'ERROR LOGIN'
ERROR_PASSWD = 'ERROR PASSWD'
ERROR_PASSWD_LENGTH = 'ERROR PASSWD LENGTH'
NO_ADMIN = 'NO ADMIN'
READ_ONLY = 'READ ONLY'
ERROR_NAME = 'ERROR NAME'
ALREADY_EXISTS = 'ALREADY EXISTS'
