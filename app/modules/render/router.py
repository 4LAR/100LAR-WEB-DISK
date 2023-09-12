from fastapi import APIRouter
from .main import *

render_router = APIRouter()

render_router.add_api_route(
    "/",
    index,
    methods=['GET'],
    tags=['Render']
)

render_router.add_api_route(
    "/main",
    main_pc,
    methods=['GET'],
    tags=['Render']
)

render_router.add_api_route(
    "/m-main",
    main_m,
    methods=['GET'],
    tags=['Render']
)

render_router.add_api_route(
    "/admin",
    admin,
    methods=['GET'],
    tags=['Render']
)
