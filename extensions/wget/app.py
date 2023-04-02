

from flask_socketio import SocketIO

import os
import sys

class app():
    def __init__(self, socketio, app_namespace, link, file_name, path):
        self.socketio = socketio
        self.app_namespace = app_namespace
        self.status = 2

        self.link = links
        self.file_name = file_name
        self.path = path

    def io_connect(self, data):
        return

    def close(self):
        pass

    def version(self):
        return "0.0.1"
