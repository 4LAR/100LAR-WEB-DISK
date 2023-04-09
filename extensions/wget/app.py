

from flask_socketio import SocketIO

import os
import sys

class app():
    def __init__(self, **kwargs):
        self.socketio = kwargs['socketio']
        self.app_namespace = kwargs['app_namespace']
        self.status = 2

        self.link = kwargs['link']
        self.file_name = kwargs['file_name']
        self.path = kwargs['path']

    def io_connect(self, data):
        return

    def close(self):
        pass

    def version(self):
        return "0.0.1"
