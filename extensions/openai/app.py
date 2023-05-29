

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

        self.config = kwargs['config']
        openai.api_key = kwargs['config']['api_key']

        self.all_history = []
        self.history = []
        if "history" in self.cache.get_data():
            self.all_history = self.cache.get_data()["history"]

        elif len(kwargs['system_message']) > 0:
            self.append_history(kwargs['system_message'], "system")

        self.convert_history()

    def get_tokens(self, arr=None):
        arr = arr if arr else self.history
        count_tokens = 0
        for el in arr:
            count_tokens += len(el['content'])

        return count_tokens

    def convert_history(self):
        for i in range(len(self.all_history)-1, -1, -1):
            data = self.all_history[i]

            if (self.get_tokens(self.history + [data]) >= self.config['max_tokens']):
                break

            self.history.append(data)


    def append_history(self, data, role):
        if role != "system":
            self.all_history.append({
                "role": role,
                "content": data
            })

        self.history.append({
            "role": role,
            "content": data
        })

        while ((self.get_tokens() >= self.config['max_tokens']) and (len(self.history) > 0)):
            self.history.pop(0)

        self.cache.update_data({"history": self.all_history})

    def io_connect(self, data):
        self.socketio.emit("history", {"output": self.all_history}, namespace=self.app_namespace)
        return

    def io_message(self, data):
        if len(data['text']) > 0:
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
