

# io - принимающий сокет
# iol - циклически отправляющий сокет

from flask_socketio import SocketIO

import os
import sys

class app():
    def __init__(self, socketio, app_namespace):
        self.socketio = socketio
        self.app_namespace = app_namespace
        self.status = 2

    def io_connect(self, data):
        return

    def close(self):
        pass

    def version(self):
        return "0.0.1"
