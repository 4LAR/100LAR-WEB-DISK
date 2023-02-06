
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
        self.cmd = ""

    def set_winsize(self, fd, row, col, xpix=0, ypix=0):
        winsize = struct.pack("HHHH", row, col, xpix, ypix)
        fcntl.ioctl(fd, termios.TIOCSWINSZ, winsize)

    def create(self):
        if self.child_pid:
            return

        (child_pid, fd) = pty.fork()

        if (self.child_pid == 0):
            subprocess.run(self.cmd)

        else:
            self.fd = fd
            sefl.child_pid = child_pid

            self.set_winsize(fd, 50, 50)
