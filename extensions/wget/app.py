

from flask_socketio import SocketIO

import os
import sys
import requests

class app():
    def __init__(self, **kwargs):
        self.socketio = kwargs['socketio']
        self.app_namespace = kwargs['app_namespace']
        self.status = 2

        self.link = kwargs['link']
        self.file_name = kwargs['file_name']
        self.path = kwargs['path']

        self.socketio.start_background_task(target=self.loop)

    def io_connect(self, data):
        output = {
            "link": self.link,
            "file_name": self.file_name
        }
        self.socketio.emit("info", {"output": output}, namespace=self.app_namespace)

    def close(self):
        pass

    def loop(self):
        with open(self.path + self.file_name, "wb") as f:
            response = requests.get(self.link, stream=True)
            total_length = response.headers.get('content-length')

            self.status = 2

            if total_length is None: # no content length header
                f.write(response.content)
            else:
                dl = 0
                total_length = int(total_length)
                for data in response.iter_content(chunk_size=4096):
                    dl += len(data)
                    f.write(data)

                    data_socket = {
                        "total_length": total_length,
                        "dl": dl
                    }
                    self.socketio.emit("progress", {"output": data_socket}, namespace=self.app_namespace)

        self.status = 3

    def version(self):
        return "0.0.1"
