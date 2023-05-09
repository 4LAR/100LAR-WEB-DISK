![](https://github.com/4LAR/100LAR-WEB-DISK/assets/18627440/b0ef7072-021a-48b2-86be-7d67820d817c)

English | [Русский](https://github.com/4LAR/100LAR-WEB-DISK/blob/v2.x/README-ru_RU.md)

## Overview
Cloud storage web application created using flask framework (https://flask.palletsprojects.com). 
  
  Features:
  - file management (download, upload, move, etc.)
  - users can change their current storage location
  - edit txt and source files (using codemirror)
  - image/video/audio/PDF/archive/txt preview
  - extensions (e.g. remote terminal)
  
  Upcoming features:
  - public file access ("share")

## Installation:

### *use WSL or any other emulation software to run on Windows*

 - Download one of the latest releases (https://github.com/4LAR/100LAR-WEB-DISK/releases)
 
    or the whole repository using the command
    
        git clone https://github.com/4LAR/100LAR-WEB-DISK.git
    *but the latter isn't recommended because it contains all the latest updates which could be unstable*

 - Install all the requirements

        pip install -r requirements.txt

 - Run using the command

        python3 app.py
 
Default address: 127.0.0.1<br>
Default credentials: admin:12345678

## Configuration
Project's root directory contains the "settings.ini" file. It generates on the first launch.
It can be configured using a text editor or the inner admin panel.

### Flask

| option               | description | default       |
|----------------------|-------------|---------------|
| IP                   | used IP | 0.0.0.0       |
| PORT                 | used Port | 80            |
| debug                | debug mode | False         |
| secret_key           | secret key for debugging | random_string |
| waitress             | use waitress server | True          |
| threads              | thread amount | 1             |

### Logs

| option               | description | default       |
|----------------------|-------------|---------------|
| path                 | logging dir | logs/         |
| save_logs            | turn logging on or of | True          |
| timedelta            | time zone | 3             |

### History

| option               | description | default       |
|----------------------|-------------|---------------|
| length               | max amount of elements in History | 100           |
| use                  | turn History on or off | True          |

### Base

| option               | description | default       |
|----------------------|-------------|---------------|
| path                 | file path |               |
| file_name            | file name (without .json) | users         |

### Extensions

| option               | description | default       |
|----------------------|-------------|---------------|
| use                  | permit extension usage | True          |
| path                 | extension dir | extensions    |

### Preview

| option               | description | default       |
|----------------------|-------------|---------------|
| max_text_file_weight | amount of symbols in preview | 2048          | 
| max_pics_width       | max image width in preview (if the width of the image is higher than this number, it will be reduced proportionally to it) | 1280          | 
| max_files_in_archive | max amount of files availiable for preview in an archive | 100           | 

### Entry

| option               | description | default       |
|----------------------|-------------|---------------|
| type                 | type (html, page, none) | none          |
| source               | file path or a page link |               |

## Extensions (apps)

Configuration file for each app is availiable in the app's directory and is called <<config.ini>>.

App access can be restricted to certain roles (statuses) for each individual app.

### BASH

 | description| screenshots |
 |----------------------|-------------|
 | Simple remote terminal. Not secure. Only grant access to trusted users. | ![Screenshot 2023-05-09 165044](https://github.com/4LAR/100LAR-WEB-DISK/assets/18627440/f53b1331-3a30-4d8c-acf0-c9f2efd409e8) |
