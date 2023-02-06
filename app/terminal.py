
import pty
import os
import subprocess
import select
import termios
import struct
import fcntl
import shlex
import sys

class Terminal:
    def __init__(self):
        self.fd = None
        self.child_pid = None
        self.cmd = ["bash"]

    def set_winsize(self, row, col, xpix=0, ypix=0):
        if (self.fd):
            winsize = struct.pack("HHHH", row, col, xpix, ypix)
            fcntl.ioctl(self.fd, termios.TIOCSWINSZ, winsize)

    def input(self, data):
        if self.fd:
            os.write(self.fd, data["input"].encode())

    def create(self):
        if self.child_pid:
            return False

        (child_pid, fd) = pty.fork()

        if (self.child_pid == 0):
            subprocess.run(self.cmd)

        else:
            self.fd = fd
            self.child_pid = child_pid

            self.set_winsize(fd, 50, 50)

        return True
