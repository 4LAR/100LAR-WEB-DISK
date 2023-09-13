from fastapi import APIRouter

from globals import *

from .info import info
from .files import files
from .create_file import create_file
from .create_folder import create_folder
from .rename import rename
from .unpack import unpack
from .download import download
from .delete import delete
from .copy import copy
from .upload_file import upload_file

file_router = APIRouter()

file_router.add_api_route(
    "/info",
    info,
    methods=['GET'],
    tags=['File']
)

file_router.add_api_route(
    "/files",
    files,
    methods=['GET'],
    tags=['File']
)

file_router.add_api_route(
    "/create_file",
    create_file,
    methods=['POST'],
    tags=['File']
)

file_router.add_api_route(
    "/create_folder",
    create_folder,
    methods=['POST'],
    tags=['File']
)

file_router.add_api_route(
    "/rename",
    rename,
    methods=['POST'],
    tags=['File']
)

file_router.add_api_route(
    "/unpack",
    unpack,
    methods=['POST'],
    tags=['File']
)

file_router.add_api_route(
    "/download",
    download,
    methods=['GET'],
    tags=['File']
)

file_router.add_api_route(
    "/delete",
    delete,
    methods=['DELETE'],
    tags=['File']
)

file_router.add_api_route(
    "/copy",
    copy,
    methods=['POST'],
    tags=['File']
)

file_router.add_api_route(
    "/upload_file",
    upload_file,
    methods=['POST'],
    tags=['File']
)
