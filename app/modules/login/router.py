from fastapi import APIRouter
from .load_user import *

login_router = APIRouter()

login_router.add_api_route(
    "/login",
    login,
    methods=['POST'],
    tags=['Login']
)
