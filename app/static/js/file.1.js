
var dir = [];
var forward_dir_history = [];
var back_dir_history = [];
var dir_str = ''
var path = 0;

// переход в домашнюю директорию
function go_home() {
  if (dir.length > 0) {
    back_dir_history.push(dir.slice())
    forward_dir_history = [];
    dir = [];
    update_dir();
  }
}

// переход к предыдущей директории по истории
function go_back_dir_history() {
  if (back_dir_history.length > 0) {
    forward_dir_history.push(dir.slice());
    dir = back_dir_history.pop();
    update_dir();
  }
}

// переход к следующей директории по истории
function go_forward_dir_history() {
  if (forward_dir_history.length > 0) {
    back_dir_history.push(dir.slice());
    dir = forward_dir_history.pop();
    update_dir();
  }
}

// переход в выбранную директорию
function forward_dir(name) {
  forward_dir_history = [];
  back_dir_history.push(dir.slice());
  dir.push(name);
  update_dir();
}

// переход к предыдущей директории
function back_dir() {
  forward_dir_history = [];
  back_dir_history.push(dir.slice());
  dir.pop();
  update_dir();
}

// обновление кнопок передвижения и пути
function update_dir() {
  dir_str = '';
  for (let i = 0; i < dir.length; i++)
    if (i < dir.length - 1) {
      dir_str += dir[i] + '/';
    } else {
      dir_str += dir[i];
    }

  if (back_dir_history.length <= 0) {
    document.getElementById("go_back").style.filter = "invert(30%)";
  } else {
    document.getElementById("go_back").style.filter = "invert(60%)";
  }

  if (forward_dir_history.length <= 0) {
    document.getElementById("go_forward").style.filter = "invert(30%)";
  } else {
    document.getElementById("go_forward").style.filter = "invert(60%)";
  }

  get_files();

  document.getElementById("path").value = '/' + dir_str;
}

// получение всех файлов от сервера в текущей директории
function get_files() {
  var ul = document.getElementById("file_list");
  ul.innerHTML = '';

  if (dir.length > 0) {
    var li = document.createElement("li");
    li.innerHTML = `
      <div class="file" onclick="back_dir()">
        <img class="icon" style="margin: 7px 40px" width="25" height="25" src="static/img/folder.svg">
        <p style="margin: -25px 70px">...</p>
      </div>
    `;
    ul.appendChild(li);
  }


  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/files?path=${path}&dir=${dir_str}`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      files_json = JSON.parse(xhr.responseText.toString());

      files_json['files'].sort(
        function (a) {
          console.log(a['type'])
          if (a['type'] == 'dir') {
            return -1;
          } else {
            return 0;
          }

        }
      );

      for (let i = 0; i < files_json['files'].length; i++){
        file = files_json['files'][i]
        if (file['type'] == 'dir') {
          append_file(file['type'], file['name']);
        } else {
          append_file(file['type'], file['name'], file['size'], dir_str + '/' + file['name'], file['time']);
        }


      }

    }
  };
  xhr.send()
}

// добавление файла в список
function append_file(type, name, size='', path='', date='') {
  var ul = document.getElementById("file_list");
  var li = document.createElement("li");

  var str = `
    <div style="position: absolute; margin: 8px 8px">
      <input type="checkbox" class="custom-checkbox" id="${name}" name="${name}" value="yes">
      <label for="${name}"></label>
    </div>
  `

  if (type == 'dir') {
    str += `
      <div class="file" onclick="forward_dir('${name}')">
        <img class="icon" style="margin: 7px 40px" width="25" height="25" src="static/img/folder.svg">
        <p style="margin: -25px 70px">${name}</p>
      </div>
    `;

  } else {
     str += `
      <div style="position: absolute; margin: 8px 8px">
        <input type="checkbox" class="custom-checkbox" id="${name}" name="${name}" value="yes">
        <label for="${name}"></label>
      </div>
      <div class="file" onclick="open_fileInfo('${name}', 'text file', '${size}', '${path}', '${date}')">
        <img class="icon" style="margin: 7px 40px" width="25" height="25" src="static/img/file.svg">
        <p style="margin: -25px 70px">${name}</p>
        <p style="margin: -25px 300px">${date}</p>
        <p style="margin: 4px 500px">${size}</p>
      </div>
    `;
  }

  li.innerHTML = str;

  ul.appendChild(li);
}

// открытие информации о файле
function open_fileInfo(name, type, size, file_path, date, description='') {

  document.getElementById("fileName_input").value = name;

  document.getElementById("file_type").innerHTML = 'type: ' + type;
  document.getElementById("file_size").innerHTML = 'size: ' + size;
  document.getElementById("file_path").innerHTML = 'path: ' + file_path;
  document.getElementById("file_date").innerHTML = 'date of change: ' + date;
  console.log(dir_str);
  document.getElementById("file_download_button").href = `/download?path=${path}&dir=${dir_str}&file=${name}`;
  document.getElementById("file_download_button").downlaod = name;

  openModal('rightBar');

}

// закрытие страницы информации о файле
function close_fileInfo() {
  closeModal('rightBar');
}

update_dir();
