from fastapi import APIRouter

from globals import *
from .get_apps import get_apps
from .get_my_apps import get_my_apps
from .append_app import append_app
from .render_app import render_app

extensions_router = APIRouter()

extensions_router.add_api_route(
    "/get_apps",
    get_apps,
    methods=['GET'],
    tags=['Extensions']
)

extensions_router.add_api_route(
    "/get_my_apps",
    get_my_apps,
    methods=['GET'],
    tags=['Extensions']
)

extensions_router.add_api_route(
    "/append_app",
    append_app,
    methods=['POST'],
    tags=['Extensions']
)

extensions_router.add_api_route(
    "/app",
    render_app,
    methods=['GET'],
    tags=['Extensions']
)
