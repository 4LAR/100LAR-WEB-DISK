
import pty
import os
import signal
import subprocess
import resource
import select
import termios
import struct
import fcntl
import shlex
import sys

class Terminal:
    def __init__(self, cmd = ["bash"], cwd=None, memory_limit=None):
        self.fd = None
        self.child_pid = None
        self.process = None
        self.cmd = cmd
        self.cwd = cwd
        self.memory_limit = memory_limit

    def limit_virtual_memory(self):
        resource.setrlimit(resource.RLIMIT_AS, (self.memory_limit, resource.RLIM_INFINITY))

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
            if self.memory_limit:
                self.process = subprocess.run(self.cmd, cwd=self.cwd, preexec_fn=self.limit_virtual_memory)
            else:
                self.process = subprocess.run(self.cmd, cwd=self.cwd)

        else:
            self.fd = fd
            self.child_pid = child_pid

            self.set_winsize(50, 50)

        return True
