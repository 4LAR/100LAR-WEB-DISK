

# io - принимающий сокет
# iol - циклически отправляющий сокет

from terminal import *

class app():
    def __init__(self):
        self.terminal = Terminal()

    def io_ptyInput(self, data):
        terminal.input(data)

    def io_resize(self, data):
        terminal.set_winsize(data["rows"], data["cols"])

    def io_connect(self, data):
        if terminal.create():
            socketio.start_background_task(target=read_and_forward_pty_output)
        else:
            return

    def iol_loop(self):
        pass
