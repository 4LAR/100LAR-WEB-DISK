from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi import *

from globals import *
from routers import *

app = FastAPI()

app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.include_router(render_router, prefix="")
