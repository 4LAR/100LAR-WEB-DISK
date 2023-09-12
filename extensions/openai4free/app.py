

from flask_socketio import SocketIO
import g4f

import os
import sys
# eval(f"g4f.Provider.{service}")
# services = [service for service in dir(g4f.Provider) if not "__" in service]
# print(services)
# print(dir(services[0]))
# print(services[0].working)
# print(dir(g4f.models))

models_support = {
    "GPT3.5": "supports_gpt_35_turbo",
    "GPT4": "supports_gpt_4",
}

class app():
    def __init__(self, **kwargs):
        self.socketio = kwargs['socketio']
        self.app_namespace = kwargs['app_namespace']
        self.status = 0
        self.cache = kwargs['cache']

        self.services = []
        for service in dir(g4f.Provider):
            if not "__" in service:
                try:
                    obj = eval(f"g4f.Provider.{service}")
                    if obj.working and (getattr(obj, models_support[kwargs['model']])):
                        self.services.append(obj)
                        print(service)
                        print(obj.working)
                except:
                    pass

        self.config = kwargs['config']
        self.config['model'] = g4f.models.gpt_35_turbo if (kwargs['model'] == "GPT3.5") else g4f.models.gpt_4

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

    def set_primary_service(self, service_obj):
        self.new_services = [service_obj]
        self.new_services += [service for service in self.services if service != service_obj]
        self.services = self.new_services

    def create_completion(self, text):
        response = None
        ok = True
        for service in self.services:
            try:
                print(service)
                response = g4f.ChatCompletion.create(
                    model=self.config['model'],
                    # model=g4f.models.gpt_4,
                    messages=self.history,
                    provider=service,
                    temperature=self.config['temperature'],
                    n=self.config['n_choices'],
                    max_tokens=self.config['max_tokens'],
                    presence_penalty=self.config['presence_penalty'],
                    frequency_penalty=self.config['frequency_penalty'],
                    stream=False
                )
                if (service != self.services[0]):
                    self.set_primary_service(service)

                break

            except Exception as e:
                ok = False
                print("ERROR:", service, e)

        if not ok:
            pass
        # print(response)

        text = response#response.choices[0].message.content
        self.append_history(text, "assistant")
        self.socketio.emit("output", {"output": {
            "role": "assistant",
            "content": text
        }}, namespace=self.app_namespace)

    def close(self):
        pass

    def version(self):
        return "1.0.0"
