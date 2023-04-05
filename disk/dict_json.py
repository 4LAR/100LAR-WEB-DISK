import os
import json

def save_dict(dict, name):
    json.dump(dict, open(str(name) + '.json','w'), indent=2)

def read_dict(name):
    with open(str(name) + '.json', encoding='utf-8') as fh:
        data = json.load(fh)
    return data
