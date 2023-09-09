from fastapi import APIRouter

from globals import *
from .info import info

file_router = APIRouter()

file_router.add_api_route(
    "/info",
    info,
    methods=['GET'],
    tags=['File']
)
