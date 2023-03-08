

# io - принимающий сокет
# iol - циклически отправляющий сокет

from flask_socketio import SocketIO
import os
import sys

from terminal import *

class app():
    def __init__(self, socketio):
        self.socketio = socketio
        self.terminal = Terminal()

    def io_ptyInput(self, data):
        self.terminal.input(data)

    def io_resize(self, data):
        self.terminal.set_winsize(data["rows"], data["cols"])

    def io_connect(self, data):
        if self.terminal.create():
            self.socketio.start_background_task(target=self.iol_loop)
            # pass
        else:
            return

    def iol_loop(self):
        max_read_bytes = 1024 * 20
        while True:
            self.socketio.sleep(0.01)
            if self.terminal.fd:
                timeout_sec = 0
                (data_ready, _, _) = select.select([self.terminal.fd], [], [], timeout_sec)
                if data_ready:
                    output = os.read(self.terminal.fd, max_read_bytes).decode(
                        errors="ignore"
                    )
                    self.socketio.emit("pty-output", {"output": output}, namespace="/bash")

    def version(self):
        return "0.0.1"
