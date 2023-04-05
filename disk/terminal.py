
import pty
import os
import signal
import subprocess
import select
import termios
import struct
import fcntl
import shlex
import sys

class Terminal:
    def __init__(self, cmd = ["bash"], cwd=None):
        self.fd = None
        self.child_pid = None
        self.process = None
        self.cmd = cmd
        self.cwd = cwd

    def set_winsize(self, row, col, xpix=0, ypix=0):
        if (self.fd):
            winsize = struct.pack("HHHH", row, col, xpix, ypix)
            fcntl.ioctl(self.fd, termios.TIOCSWINSZ, winsize)

    def input(self, data):
        if self.fd:
            os.write(self.fd, data["input"].encode())

    def close(self):
        os.close(self.fd)

    def create(self):
        if self.child_pid:
            return False

        (child_pid, fd) = pty.fork()
        if (child_pid == 0):
            self.process = subprocess.run(self.cmd, cwd=self.cwd)

        else:
            self.fd = fd
            self.child_pid = child_pid

            self.set_winsize(50, 50)

        return True
