![](https://user-images.githubusercontent.com/18627440/200840389-7222abf8-25fd-4a15-b4c8-377b226c3054.png)

English | [Русский](https://github.com/4LAR/100LAR-WEB-DISK/blob/v2.x/README-ru_RU.md)

## Overview
Cloud storage web application created using flask framework (https://flask.palletsprojects.com). 
  
  Features:
  - file management (download, upload, move, etc.)
  - users can change their current storage location
  - edit txt and source files (using codemirror)
  - image preview
  
  Upcoming features:
  - public file access ("share")
  - video and audio preview

## Installation:
 - Download the latest release (https://github.com/4LAR/100LAR-WEB-DISK/releases)
 
    or the whole repository using the command
    
        git clone https://github.com/4LAR/100LAR-WEB-DISK.git
    *but the latter isn't recommended because it containt all the latest updates that could be unstable*

 - Install all the dependencies

        pip install -r requirements.txt
    one additional dependency is required for Windows.
    
        python-magic-bin

 - Run using the command

        python app/main.py
    or via the start.bat(windows)/start.sh(linux) file
 
Default address: 127.0.0.1<br>
Default credentials: admin:12345678

## Configuration
Project's root directory contains the "settings.ini" file. It generates on the first launch.
It can be configured using a text editor or the inner admin panel.
