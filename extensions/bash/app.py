

# io - принимающий сокет
# iol - циклически отправляющий сокет

from flask_socketio import SocketIO
from flask_login import current_user
import functools

import os
import sys
import psutil

from disk.terminal import *

class app():
    def __init__(self, **kwargs):
        self.socketio = kwargs['socketio']
        self.app_namespace = kwargs['app_namespace']
        self.terminal = Terminal(
            cmd=kwargs['cmd'].split(" "),
            cwd=kwargs['path'],
            memory_limit=kwargs['memory_limit']
        )

        self.status = 0
        self.run_thread = False

        self.terminal.create()
        self.socketio.start_background_task(target=self.iol_loop)

        self.max_rows = 50
        self.history = []

    def append_history(self, data):
        self.history.append(data)
        if (len(self.history) > self.max_rows):
            self.history.pop(0)

    def get_usage(self):
        p = psutil.Process(self.terminal.child_pid)
        data = {
            "cpu_usage": p.cpu_percent(),
            "cwd": p.cwd(),
            "memory": p.memory_info()
        }
        print(data)

    def io_ptyInput(self, data):
        self.terminal.input(data)

    def io_resize(self, data):
        self.terminal.set_winsize(data["rows"], data["cols"])

    def io_connect(self, data):
        for el in self.history:
            self.socketio.emit("pty-output", {"output": el}, namespace=self.app_namespace)
        return

    def close(self):
        self.run_thread = False
        self.terminal.close()

    def iol_loop(self):
        max_read_bytes = 1024 * 20
        self.run_thread = True
        while self.run_thread:
            self.socketio.sleep(0.01)
            # self.get_usage()
            try:
                if self.terminal.fd:
                    timeout_sec = 0
                    (data_ready, _, _) = select.select([self.terminal.fd], [], [], timeout_sec)
                    if data_ready:
                        output = os.read(self.terminal.fd, max_read_bytes).decode(
                            errors="ignore"
                        )
                        self.append_history(output)
                        self.socketio.emit("pty-output", {"output": output}, namespace=self.app_namespace)
            except:
                pass

    def io_ping(self, data):
        self.socketio.emit("pong", namespace=self.app_namespace)

    def version(self):
        return "0.0.1"
