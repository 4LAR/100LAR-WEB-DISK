

from flask_socketio import SocketIO
import openai

import os
import sys

class app():
    def __init__(self, **kwargs):
        self.socketio = kwargs['socketio']
        self.app_namespace = kwargs['app_namespace']
        self.status = 0
        self.cache = kwargs['cache']
        self.history = []
        if "history" in self.cache.get_data():
            print(self.cache.get_data())
            self.history = self.cache.get_data()["history"]

        self.max_rows = 50

        self.config = kwargs['config']
        openai.api_key = kwargs['config']['api_key']

    def append_history(self, data, role):
        self.history.append({
            "role": role,
            "content": data
        })

        if (len(self.history) > self.max_rows):
            self.history.pop(0)

        self.cache.update_data({"history": self.history})

    def io_connect(self, data):
        for el in self.history:
            self.socketio.emit("output", {"output": el}, namespace=self.app_namespace)
        return

    def io_message(self, data):
        self.append_history(data['text'], "user")
        self.create_completion(data['text'])

    def create_completion(self, text):
        response = openai.ChatCompletion.create(
            model=self.config['model'],
            messages=self.history,
            temperature=self.config['temperature'],
            n=self.config['n_choices'],
            max_tokens=self.config['max_tokens'],
            presence_penalty=self.config['presence_penalty'],
            frequency_penalty=self.config['frequency_penalty'],
            stream=False
        )

        text = response.choices[0].message.content
        self.append_history(text, "assistant")
        self.socketio.emit("output", {"output": {
            "role": "assistant",
            "content": text
        }}, namespace=self.app_namespace)

    def close(self):
        pass

    def version(self):
        return "1.0.0"
