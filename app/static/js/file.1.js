
var dir = [];
var forward_dir_history = [];
var back_dir_history = [];
var dir_str = ''
var path = 0;
var files_json = {}

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

// преобразование пути
function parse_dir() {
  back_dir_history.push(dir.slice());
  dir_str = document.getElementById("path").value;

  dir = dir_str.split('/');
  if (dir[0] == '')
    dir.shift();

  update_dir();
}

// преобразование пути по нажатию enter
function parse_dir_enter(e) {
  if (e.keyCode == 13) {
    parse_dir();
    return false;
  }
}

// обновление кнопок передвижения и пути
function update_dir() {
  dir_str = '';
  // генерируем строку из пути (массива)
  for (let i = 0; i < dir.length; i++)
    if (i < dir.length - 1) {
      dir_str += dir[i] + '/';
    } else {
      dir_str += dir[i];
    }

  // изменение цвета кнопки (назад)
  if (back_dir_history.length <= 0) {
    document.getElementById("go_back").style.filter = "invert(30%)";
  } else {
    document.getElementById("go_back").style.filter = "invert(60%)";
  }

  // изменение цвета кнопки (вперёд)
  if (forward_dir_history.length <= 0) {
    document.getElementById("go_forward").style.filter = "invert(30%)";
  } else {
    document.getElementById("go_forward").style.filter = "invert(60%)";
  }

  // получаем информацию о пользователе
  get_info();

  // и после список файлов
  get_files();

  // прописываем путь
  document.getElementById("path").value = '/' + dir_str;
  undo_files_checkBox();
}

function append_back_dir() {
  var ul = document.getElementById("file_list");

  // если это не корневая папка
  if (dir.length > 0) {

    // создаём кнопку перехода в верхнюю директорию
    var li = document.createElement("li");
    li.innerHTML = `
      <div class="file" onclick="back_dir()">
        <img class="icon" style="margin: 7px 40px" width="25" height="25" src="static/img/files/folder.svg">
        <p style="margin: -25px 70px">...</p>
      </div>
    `;

    // добавляем кнопка в список
    ul.appendChild(li);
  }
}

// получение всех файлов от сервера в текущей директории
var read_files_bool = false;
function get_files() {
  if (!read_files_bool) {
    read_files_bool = true;
    undo_files_checkBox();

    if (checkModal('file_list_block')) {
      closeModal('rightBar');
      closeModal('file_list_block');
    }

    var ul = document.getElementById("file_list");
    ul.innerHTML = '';

    // создаём запрос
    var xhr = new XMLHttpRequest();
    xhr.open('POST', `/files?path=${path}&dir=${dir_str}`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // когда запрос выполнится, то вызовется эта функция
    xhr.onload = function () {
      read_files_bool = false;
      // проверяем код
      if (xhr.status === 200) {
        // проверяем, не пустая ли директория
        if (xhr.responseText.toString() === 'EMPTY') {
          append_back_dir();
          // если файлов нет, то выводим такое сообщение
          var li = document.createElement("li");
          li.innerHTML = `
            <h1 align="center">EMPTY</h1>
          `;

          // добавляем его в список
          ul.appendChild(li);

        // проверяем, есть такая директория или нет
        } else if (xhr.responseText.toString() === 'ERROR DIR') {
          // если файлов нет, то выводим такое сообщение
          var li = document.createElement("li");
          li.innerHTML = `
            <h1 align="center">NO SUCH PATH EXISTS</h1>
          `;

          // добавляем его в список
          ul.appendChild(li);

        } else {
          append_back_dir();

          // получаем json
          files_json = JSON.parse(xhr.responseText.toString());

          // сортировка файлов по типу
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

          // добавляем файлы в список
          for (let i = 0; i < files_json['files'].length; i++){
            file = files_json['files'][i]
            if (file['type'] == 'dir') {
              append_file(file['type'], file['name']);
            } else {
              append_file(file['type'], file['name'], file['size'], dir_str + '/' + file['name'], file['time'], file['type_mime']);
            }
          }
        }

      }
    };

    // отправляем запрос
    xhr.send();
  } else {

  }

}

// добавление файла в список
function append_file(type, name, size='', path='', date='', mime='') {
  var ul = document.getElementById("file_list");
  var li = document.createElement("li");

  // checkBox
  var str = `
    <div style="position: absolute; margin: 8px 8px">
      <input type="checkbox" class="custom-checkbox" id="checkbox_file_${name}" name="${name}" value="yes" onchange="checkBox_file(this, '${name}', '${type}')">
      <label for="checkbox_file_${name}"></label>
    </div>
  `

  if (type == 'dir') {
    // директория
    str += `
      <div class="file" onclick="forward_dir('${name}')">
        <img class="icon" style="margin: 7px 40px" width="25" height="25" src="static/img/files/folder.svg">
        <p style="margin: -25px 70px">${name}</p>
      </div>
    `;

  } else {
    // файл
     str += `
      <div class="file" onclick="open_fileInfo('${name}', '${type}', '${size}', '${path}', '${date}', '${mime}')">
        <img class="icon" style="margin: 7px 40px" width="25" height="25" src="static/img/files/${type}.svg">
        <p style="margin: -25px 70px">${name}</p>
        <p style="margin: -25px 300px">${date}</p>
        <p style="margin: 4px 500px">${size}</p>
      </div>
    `;
  }

  li.innerHTML = str;

  // добавояем папку или файл в список
  ul.appendChild(li);
}

var selected_file_name = '';
var selected_file_dir = '';
// открытие информации о файле
function open_fileInfo(name, type, size, file_path, date, mime, description='') {
  undo_files_checkBox();

  selected_file_name = name;
  selected_file_dir = dir_str;

  document.getElementById("file_icon").src = `static/img/files/${type}.svg`;
  document.getElementById("fileName_input").value = name;

  document.getElementById("file_type").innerHTML = 'type: ' + mime;
  document.getElementById("file_size").innerHTML = 'size: ' + size;
  document.getElementById("file_path").innerHTML = 'path: ' + file_path;
  document.getElementById("file_date").innerHTML = 'date of change: ' + date;

  document.getElementById("file_download_button").href = `/download?path=${path}&dir=${dir_str}&file=${name}`;
  document.getElementById("file_download_button").downlaod = name;
  document.getElementById("file_delete_button").onclick = function(){delete_file(path, dir_str, name)};//`delete_file(${path}, ${dir_str}, ${name})`;

  openModal('rightBar');
  openModal('file_info_block');
  closeModal('file_list_block');
}

// закрытие страницы информации о файле
function close_rightBar() {
  undo_files_checkBox();
  closeModal('rightBar');
  closeModal('file_info_block');
  closeModal('file_list_block');
}

var list_checked_file = [];

// выделение файла
function checkBox_file(e, name, type) {
  openModal('rightBar');
  closeModal('file_info_block');
  openModal('file_list_block');

  var ok = false;
  for (let i = 0; i < files_json['files'].length; i++)
    if (document.getElementById("checkbox_file_" + files_json['files'][i]['name']).checked == false) {
      ok = true;
      break;
    }

  if (ok) {
    openModal('file_select_all_button');
  } else {
    closeModal('file_select_all_button');
  }

  if (e.checked) {
    ok = true;
    for (let i = 0; i < list_checked_file.length; i++) {
      if (list_checked_file[i][0] === name)
        ok = false;
    }
    if (ok)
      list_checked_file.push([name, type]);

  } else {
    list_checked_file.pop([name, type]);
  }


  if (list_checked_file.length > 0) {
    var count_files = 0;
    var count_folders = 0;

    for (let i = 0; i < list_checked_file.length; i++)
      if (list_checked_file[i][1] === 'dir')
        count_folders += 1;
      else
        count_files += 1;

    document.getElementById("file_list_files").innerHTML = 'Files: ' + count_files;
    document.getElementById("file_list_folders").innerHTML = 'Folders: ' + count_folders;

    document.getElementById("file_list_download_button").href = `/download?path=${path}&dir=${dir_str}&files=${JSON.stringify({"files": list_checked_file})}`;
    document.getElementById("file_list_download_button").downlaod = 'files.zip';

  } else {
    close_rightBar();

  }

}

// выделить все файлы
function all_files_checkBox() {
  var ok = false;
  for (let i = 0; i < files_json['files'].length; i++)
    if (document.getElementById("checkbox_file_" + files_json['files'][i]['name']).checked == false) {
      ok = true;
      break;
    }

  if (ok) {
    for (let i = 0; i < files_json['files'].length; i++) {
      document.getElementById("checkbox_file_" + files_json['files'][i]['name']).checked = true;
      checkBox_file(
        {'checked': true},
        files_json['files'][i]['name'],
        files_json['files'][i]['type']
      );

    }
    closeModal('file_select_all_button');
  } else {

  }

}

// убрать выделение со всех файлов
function undo_files_checkBox() {
  for (i in files_json['files']) {
    document.getElementById('checkbox_file_' + files_json['files'][i]['name']).checked = false;
  }
  list_checked_file = [];
}

// удаление файла
function delete_file(path, dir_str, name) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/delete?path=${path}&dir=${dir_str}&file=${name}`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      update_dir();
      close_rightBar();
    }
  };
  xhr.send();
}

// удаление выделенных файлов
function delete_files() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/delete?path=${path}&dir=${dir_str}&files=${JSON.stringify({"files": list_checked_file})}`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      update_dir();
      undo_files_checkBox();
      close_rightBar();
    }
  };
  xhr.send();
}

// переименование файла
function rename_file() {
  var new_file_name = document.getElementById("fileName_input").value;

  if (selected_file_name != new_file_name) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', `/rename?path=${path}&dir=${selected_file_dir}&file=${selected_file_name}&new_file=${new_file_name}`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
      if (xhr.status === 200) {
        selected_file_name = new_file_name;
        update_dir();
      }
    };
    xhr.send();
  }

}

var file_name_input = document.getElementById("fileName_input");

file_name_input.onblur = function() {
  rename_file();
};

// переименование файла по нажатию enter
function rename_file_enter(e) {
  if (e.keyCode == 13) {
    rename_file();
    return false;
  }
}

// выгрузка файлов
let dropArea = document.getElementById('html');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)
})

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
};

['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false)
});

['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false)
})

function highlight(e) {
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  dropArea.classList.remove('highlight')
}

dropArea.addEventListener('drop', handleDrop, false)

function handleDrop(e) {
  let dt = e.dataTransfer
  let files = dt.files
  handleFiles(files)

}

function handleFiles(files) {
  console.log('uploading files');
  ([...files]).forEach(uploadFile);
}

function uploadFile(file) {
  form = new FormData();
  var xhr = new XMLHttpRequest();
  form.append("file", file);
  xhr.open('post', `upload_file?path=${path}&dir=${dir_str}&file=${file.name}`, true);
  xhr.upload.onprogress = function(event) {
    //document.getElementById("upload_bar").max = event.total;
    //document.getElementById("upload_bar").value = event.loaded;
  }
  xhr.upload.onload = function() {
    update_dir();
  }
  xhr.send(form);
}

// получаем файлы
update_dir();
