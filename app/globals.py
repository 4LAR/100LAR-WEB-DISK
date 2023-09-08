from fastapi_login import LoginManager

from config import Config

config = Config("config.ini")

for section in config.options:
    for parameter in config.options[section]:
        value = config.options[section][parameter]
        exec("%s = %s" % (
            f"{section.upper()}_{parameter.upper()}",
            value if value == str else "\"%s\"" % value
        ), globals())

login_manager = LoginManager(FASTAPI_SECRET_KEY, token_url='/auth/token')
