from fastapi.templating import Jinja2Templates
from fastapi import Request

templates = Jinja2Templates(directory="app/templates")

async def index(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

async def main_pc(request: Request):
    return templates.TemplateResponse("main.html", {"request": request})

async def main_m(request: Request):
    return templates.TemplateResponse("m-main.html", {"request": request})

# async def entry(request: Request):
    # return templates.TemplateResponse("entry.html", {"request": request})

async def admin(request: Request):
    return templates.TemplateResponse("admin.html", {"request": request})
