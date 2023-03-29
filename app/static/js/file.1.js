
var dir = [];
var forward_dir_history = [];
var back_dir_history = [];
var dir_str = ''
var path = 0;
var files_json = {}

var url_file = "";
var type_file = "";

//
function set_path(path_id) {
  path = path_id;

  back_dir_history = [];
  forward_dir_history = [];
  dir = [];

  open_close_path_button(true);
  update_dir();

  for (let i = 0; i < info_json['path'].length; i++) {
    if (i == path_id) openModal(`select_path_div_${i}`);
    else closeModal(`select_path_div_${i}`);
  }
}

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
  if (list_checked_file.length > 0) {
    var fileCheckBox = document.getElementById("checkbox_file_" + name);
    fileCheckBox.checked = !fileCheckBox.checked;
    checkBox_file(
      {'checked':   fileCheckBox.checked},
      name,
      'dir'
    );
    return;
  }

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
  if (!mobile)
    if (back_dir_history.length <= 0) {
      document.getElementById("go_back").style.filter = "invert(30%)";
    } else {
      document.getElementById("go_back").style.filter = "invert(60%)";
    }

  // изменение цвета кнопки (вперёд)
  if (!mobile)
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

    if (mobile) {
      li.innerHTML = `
        <div class="file_checkbox_bg"></div>
        <div class="file" onclick="back_dir()">
          <img class="${(colored_file_icons)? "folder_filter": ""} icon" style="margin: 5px 55px" width="35" height="35" src="static/img/files/folder.svg">
          <p style="margin: -38px 100px">...</p>
        </div>
      `;

    } else {
      if (draw_type == 'list') {
        li.innerHTML = `
          <div class="file_checkbox_bg"></div>
          <div class="file" onclick="back_dir()">
            <img class="${(colored_file_icons)? "folder_filter": ""} icon" style="margin: 7px 50px" width="25" height="25" src="static/img/files/folder.svg">
            <p style="margin: -25px 80px">...</p>
          </div>
        `;
      } else {
        li.innerHTML = `
          <div class="file_grid" onclick="back_dir()">
            <img class="${(colored_file_icons)? "folder_filter": ""} icon" style="margin: 7px 40px" width="40" height="40" src="static/img/files/folder.svg">
            <p style="margin: -35px 90px">...</p>
          </div>
        `;
      }
    }
    // добавляем кнопка в список
    ul.appendChild(li);
  }
}

function append_path_info() {
  var ul = document.getElementById("file_list");

  // создаём кнопку перехода в верхнюю директорию
  var li = document.createElement("li");

  if (!mobile) {
    if (draw_type == 'list') {
      li.innerHTML = `
        <div class="file_delimiter_bg"></div>
        <div class="file_pathInfo"></div>
      `;
    } else {
      li.innerHTML = `
        <div class="file_grid"></div>
      `;
    }
  }
  // добавляем кнопка в список
  ul.appendChild(li);
}

const SORT_BY_TYPE = [
  'dir',
  'archive',
  'image',
  'text file',
  'pdf',
  'video',
  'audio',
  'file'
];

// функция сортирующая файлы по типу
function sort_files(files_list) {
  var new_files_list = [];

  for (let i = 0; i < SORT_BY_TYPE.length; i++)
    for (let j = 0; j < files_list.length; j++) {
      if (SORT_BY_TYPE[i] == files_list[j]['type'])
        new_files_list.push(files_list[j]);

    }

  return new_files_list;
}

// получение всех файлов от сервера в текущей директории
var read_files_bool = false;
function get_files() {
  selected_file_name = "";
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
          files_json['files'] = [];
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
          files_json['files'] = [];
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
          files_json['files'] = sort_files(files_json['files']);

          audio_list = [];
          image_list = [];

          // добавляем файлы в список
          for (let i = 0; i < files_json['files'].length; i++){
            file = files_json['files'][i]
            if (file['type'] == 'dir') {
              append_file(file['type'], file['name']);
            } else {
              append_file(file['type'], file['name'], file['size'], dir_str + '/' + file['name'], file['time'], file['type_mime']);
            }
          }
          append_path_info();
        }

      }
    };

    // отправляем запрос
    xhr.send();
  } else {

  }

}

function get_color_by_type(type) {
  var color_class = "";
  switch (type) {
    case 'archive':
      color_class = "archive_filter";
      break;

    case 'audio':
      color_class = "media_filter";
      break;

    case 'image':
      color_class = "media_filter";
      break;

    case 'pdf':
      color_class = "media_filter";
      break;

    case 'video':
      color_class = "media_filter";
      break;

    case 'text file':
      color_class = "text_filter";
      break;

    case 'file':
      color_class = "text_filter";
      break;

    case 'dir':
      color_class = "folder_filter";
      break;
  }
  return color_class;
}

// добавление файла в список
function append_file(type, name, size='', path_s='', date='', mime='') {
  var ul = document.getElementById("file_list");
  var li = document.createElement("li");

  var color_class = "";
  if (colored_file_icons) {
    color_class = get_color_by_type(type);
  }

  if (type === 'audio') {
    audio_list.push([type, name, size, path_s, date, mime, `/download?path=${path}&dir=${dir_str}&file=${name}`]);
  } else if (type === 'image') {
    image_list.push([type, name, size, path_s, date, mime, `/download?path=${path}&dir=${dir_str}&file=${name}`]);
  }

  var draw_type_class = '';
  var file_info = '';
  var image_size = 0;

  if (mobile) {
    draw_type_class = 'file';

    if (type == 'dir') {
      file_info = `
        <p style="margin: -38px 100px">${name}</p
      `;
    } else {
      file_info = `
        <p style="margin: -38px 100px">${name}</p>
        <p style="position: absolute; margin: 32px 100px; color: var(--color-hide-font);">${size}</p>
      `;
    }

    image_size = 35;

    var str = `
      <label for="checkbox_file_${name}"><div class="file_checkbox_bg">
        <div style="position: absolute; margin: 10px 10px">
          <input type="checkbox" class="custom-checkbox custom-checkbox-mobile" id="checkbox_file_${name}" name="${name}" value="yes" onchange="checkBox_file(this, '${name}', '${type}')">
          <label for="checkbox_file_${name}"></label>
        </div>
      </div></label>
    `
    if (type == 'dir') {
      // директория
      str += `
        <div class="${draw_type_class} block_select" id="${name}" onclick="forward_dir('${name}')">
          <img class="${color_class} icon" style="margin: 5px 55px" width="${image_size}" height="${image_size}" src="static/img/files/folder.svg">
          ${file_info}
        </div>
      `;

    } else {
      // файл
       str += `
        <div class="${draw_type_class} block_select" id="${name}" onclick="open_fileInfo('${name}', '${type}', '${size}', '${path_s}', '${date}', '${mime}')">
          <img class="${color_class} icon" style="margin: 5px 55px" width="${image_size}" height="${image_size}" src="static/img/files/${type}.svg">
          ${file_info}
        </div>
      `;
    }

  } else {
    if (draw_type == 'list') {
      draw_type_class = 'file';

      if (type == 'dir') {
        file_info = `
          <p style="margin: -29px 80px;">${name}</p
        `;
      } else {
        file_info = `
          <p style="margin: -29px 80px" class="file_name">${name}</p>
          <p style="margin: 8px 110px" align="right">${date}</p>
          <p style="margin: -30px 10px" align="right">${size}</p>
        `;
      }

      image_size = 25;

    } else if (draw_type == 'grid') {
      draw_type_class = 'file_grid';
      if (type == 'dir') {
        file_info = `
          <p style="margin: -35px 90px; white-space: nowrap;" class="file_name_grid">${name}</p>
        `;
      } else {
        file_info = `
          <p style="margin: -35px 90px; white-space: nowrap;" class="file_name_grid">${name}</p>

        `;
      }

      image_size = 40;
    }

    // checkBox
    var str = `
      <label for="checkbox_file_${name}"><div class="file_checkbox_bg">
        <div style="position: absolute; margin: 10px 12px">
          <input type="checkbox" class="custom-checkbox checkBox_file" id="checkbox_file_${name}" name="${name}" value="yes" onchange="checkBox_file(this, '${name}', '${type}')">
          <label for="checkbox_file_${name}"></label>
        </div>
      </div></label>
    `

    if (type == 'dir') {
      // директория
      str += `
        <div class="${draw_type_class} block_select" id="${name}" onclick="forward_dir('${name}')">
          <img class="${color_class} icon" style="margin: 7px 50px" width="${image_size}" height="${image_size}" src="static/img/files/folder.svg">
          ${file_info}
        </div>
      `;

    } else {
      // файл

       str += `
        <div class="${draw_type_class} block_select" id="${name}" onclick="open_fileInfo('${name}', '${type}', '${size}', '${path_s}', '${date}', '${mime}')">
          <img class="${color_class} icon" style="margin: 7px 50px" width="${image_size}" height="${image_size}" src="static/img/files/${type}.svg">
          ${file_info}
        </div>
      `;
    }
  }


  li.innerHTML = str;

  // добавояем папку или файл в список
  ul.appendChild(li);
}



function load_preview() {
  document.getElementById("preview_video").pause();
  document.getElementById("preview_audio").pause();
  switch (type_file) {
    case 'image':
      openModal('file_activity_view');
      load_preview_image();
      break;

    case 'video':
      openModal('file_activity_view');
      load_preview_video();
      break;

    case 'audio':
      openModal('file_activity_view');
      load_preview_audio();
      break;

    case 'text file':
      openModal('file_activity_view');
      load_preview_text();
      break;

    case 'pdf':
      if (!mobile)
        openModal('file_activity_view');
      load_preview_pdf();
      break;
  }
}

function load_preview_pdf() {
  if (!mobile)
    if (document.getElementById("checkbox_preview_image").checked) {
      openModal('preview_pdf_div');
      load_pdf(url_file, selected_file_name);
    } else {
      closeModal('preview_pdf_div');
      document.getElementById('preview_pdf_iframe').src = `about:blank`;
    }
  localStorage.setItem('preview_image', document.getElementById("checkbox_preview_image").checked);
}

function load_preview_text() {
  if (document.getElementById("checkbox_preview_image").checked) {
    openModal('preview_text_div');
    load_text(url_file, selected_file_name);
  } else {
    closeModal('preview_text_div');
  }
  localStorage.setItem('preview_image', document.getElementById("checkbox_preview_image").checked);
}

function load_preview_image() {
  if (document.getElementById("checkbox_preview_image").checked) {
    openModal('preview_image_div');
    load_image(url_file, selected_file_name);
  } else {
    closeModal('preview_image_div');
  }
  localStorage.setItem('preview_image', document.getElementById("checkbox_preview_image").checked);
}

function load_preview_video() {
  if (document.getElementById("checkbox_preview_image").checked) {
    openModal('preview_video_div');
    load_video(url_file, selected_file_name);
  } else {
    closeModal('preview_video_div');
  }
  localStorage.setItem('preview_image', document.getElementById("checkbox_preview_image").checked);
}

var audio_list = [];
var image_list = [];

function load_preview_audio() {
  if (document.getElementById("checkbox_preview_image").checked) {
    openModal('preview_audio_div');
    load_audio(url_file, selected_file_name);
  } else {
    closeModal('preview_audio_div');
  }
  localStorage.setItem('preview_image', document.getElementById("checkbox_preview_image").checked);
}

function set_preview_image_type(type="auto") {
  document.getElementById("preview_image").style.imageRendering = type;
  if (!mobile) document.getElementById("preview_image_fullscreen").style.imageRendering = type;
  localStorage.setItem('preview_imageRendering', type);
  selectElement("preview_image_type", type);
}

function preview_image_type(selectObject) {
  set_preview_image_type(selectObject.value);
}

if (localStorage.getItem('preview_image') == null) {
  localStorage.setItem('preview_image', false);
}

document.getElementById("checkbox_preview_image").checked = (localStorage.getItem('preview_image') === 'true');
set_preview_image_type(get_localStorage("preview_imageRendering", "auto"));

var selected_file_name = '';
var selected_file_dir = '';
// открытие информации о файле
function open_fileInfo(name, type, size, file_path, date, mime, description='') {

  if (list_checked_file.length > 0) {
    var fileCheckBox = document.getElementById("checkbox_file_" + name);
    fileCheckBox.checked = !fileCheckBox.checked;
    checkBox_file(
      {'checked':   fileCheckBox.checked},
      name,
      type
    );
    return;
  }

  if (mobile) openModal('file_info_bar_background_black');
  undo_files_checkBox();

  if (selected_file_name.length > 0)
    document.getElementById(selected_file_name).classList.remove('file_selected');

  document.getElementById(name).classList.add('file_selected');

  selected_file_name = name;
  selected_file_dir = dir_str;
  type_file = type;

  closeModal('file_activity_unpack_button');
  closeModal('file_activity_edit_button');
  closeModal('file_activity_view_button');
  closeModal('file_activity_original_button');
  closeModal('file_activity_view');

  if (mobile) closeModal('checkbox_preview_image_div');

  closeModal('preview_pdf_div');
  closeModal('preview_text_div');
  closeModal('preview_image_div');
  closeModal('preview_video_div');
  closeModal('preview_audio_div');

  document.getElementById("preview_video").pause()
  document.getElementById("preview_audio").pause()

  url_file = `/download?path=${path}&dir=${dir_str}&file=${name}`;

  switch (type) {
    case 'archive':
      openModal('file_activity_view');
      openModal('file_activity_unpack_button');
      break;

    case 'text file':
      openModal('file_activity_view');
      openModal('file_activity_edit_button');
      document.getElementById('file_activity_edit_button').onclick = function(){openInNewTab(`/editor?path=${path}&dir=${dir_str}&file=${name}`)};
      if (mobile) openModal('checkbox_preview_image_div');
      load_preview_text();
      break;

    case 'pdf':
      if (!mobile) {
        openModal('file_activity_view');
        openModal('file_activity_view_button');
        document.getElementById('file_activity_view_button_href').href = url_file;
        load_preview_pdf()
      }
      break;

    case 'image':
      openModal('file_activity_view');
      openModal('file_activity_original_button');
      document.getElementById('file_activity_original_button').onclick = function(){openInNewTab(`/download?path=${path}&dir=${dir_str}&file=${name}`)};
      if (mobile) openModal('checkbox_preview_image_div');
      load_preview_image();
      break;

    case 'video':
      openModal('file_activity_view');
      if (mobile) openModal('checkbox_preview_image_div');
      load_preview_video();
      break;

    case 'audio':
      openModal('file_activity_view');
      if (mobile) openModal('checkbox_preview_image_div');
      load_preview_audio();
      break;
  }

  var color_class = "";
  if (colored_file_icons) {
    color_class = get_color_by_type(type);
  }

  document.getElementById("file_icon").src = `static/img/files/${type}.svg`;
  document.getElementById("file_icon").className = `${color_class} icon`
  document.getElementById("fileName_input").value = name;

  document.getElementById("file_type").innerHTML = 'type: ' + set_size_str_path(mime, 30);
  document.getElementById("file_size").innerHTML = 'size: ' + size;
  document.getElementById("file_path").innerHTML = 'path: ' + set_size_str_path(file_path, 30);
  document.getElementById("file_date").innerHTML = 'date of change: ' + date;

  document.getElementById("file_download_button").href = url_file;
  document.getElementById("file_download_button").downlaod = name;
  document.getElementById("file_delete_button").onclick = function(){delete_file_dialog(path, dir_str, name)};//`delete_file(${path}, ${dir_str}, ${name})`;

  open_right_bar();
  openModal('file_info_block');
  closeModal('file_list_block');
  if (mobile) closeModal('addFileMenu');
}

// закрытие страницы информации о файле
var right_bar_bool = false;
function close_rightBar(for_select=false) {
  right_bar_bool = false;
  if (!for_select) {
    undo_files_checkBox();
    close_selected_files_div();

    if (selected_file_name.length > 0)
      document.getElementById(selected_file_name).classList.remove('file_selected');
  }

  if (!uploading_bool)
    closeModal('rightBar');

  closeModal('file_info_block');
  closeModal('file_list_block');
  closeModal('copy_or_paste_block');
  if (mobile) closeModal('file_info_bar_background_black');
  if (mobile) closeModal('checkbox_preview_image_div');
  if (mobile) closeModal('addFileMenu');

  if (!mobile) document.getElementById("file_list_div").style.right = '0px';
  else document.getElementById("file_list_div").style.bottom = '30px';
  //closeModal('file_info_bar_background_black');
  document.getElementById("preview_video").pause()
  document.getElementById("preview_audio").pause()
}

function open_right_bar() {

  right_bar_bool = true;
  if (!mobile) document.getElementById("file_list_div").style.right = '300px';
  else document.getElementById("file_list_div").style.bottom = '250px';
  //openModal('file_info_bar_background_black');
  openModal('rightBar');
}

function open_selected_files_div() {
  close_rightBar(true);
  openModal("selected_files_div");
  closeModal('file_list_block');
  closeModal('copy_or_paste_block');
  if (mobile) document.getElementById("file_list_div").style.top = "70px";
  else document.getElementById("file_list_div").style.top = "70px";
}

function close_selected_files_div() {
  closeModal("selected_files_div");
  if (mobile) document.getElementById("file_list_div").style.top = "30px";
  else document.getElementById("file_list_div").style.top = "32px";
}

var list_checked_file = [];

// выделение файла
function checkBox_file(e, name, type) {

  if (list_checked_file.length == 0 && selected_file_name.length > 0)
    document.getElementById(selected_file_name).classList.remove('file_selected');

  open_selected_files_div();

  closeModal('file_info_block');
  if (mobile) closeModal('addFileMenu');
  openModal('file_list_block');

  var ok = false;
  for (let i = 0; i < files_json['files'].length; i++)
    if (document.getElementById("checkbox_file_" + files_json['files'][i]['name']).checked == false) {
      ok = true;
      break;
    }

  if (ok) {
    document.getElementById("checkbox_select_all").checked = false;
  } else {
    document.getElementById("checkbox_select_all").checked = true;
  }

  if (e.checked) {
    ok = true;
    for (let i = 0; i < list_checked_file.length; i++) {
      if (list_checked_file[i][0] === name)
        ok = false;
    }
    if (ok) {
      list_checked_file.push([name, type]);
      document.getElementById(name).classList.add('file_selected');
    }

  } else {
    list_checked_file.pop([name, type]);
    document.getElementById(name).classList.remove('file_selected');
  }


  if (list_checked_file.length > 0) {
    var count_files = 0;
    var count_folders = 0;

    for (let i = 0; i < list_checked_file.length; i++)
      if (list_checked_file[i][1] === 'dir')
        count_folders += 1;
      else
        count_files += 1;

    document.getElementById("file_list_files_folders").innerHTML = 'Selected: ' + (count_files + count_folders);

    document.getElementById("file_list_download_button").href = `/download?path=${path}&dir=${dir_str}&files=${JSON.stringify({"files": list_checked_file})}`;
    document.getElementById("file_list_download_button").downlaod = 'files.zip';

  } else {
    close_selected_files_div();

  }

}

// копирование файла
var copied_files = [];
var copied_dir = '';
var move_files_bool = false;
function copy_file_buf(move=false) {
  copied_files = list_checked_file.slice();
  copied_dir = dir_str;
  move_files_bool = move;
  undo_files_checkBox();
  closeModal('file_list_block');
  openModal('copy_or_paste_block');

  var count_files = 0;
  var count_folders = 0;

  for (let i = 0; i < copied_files.length; i++)
    if (copied_files[i][1] === 'dir')
      count_folders += 1;
    else
      count_files += 1;

  // document.getElementById("cop_info").innerHTML = (move)? 'move elements': 'copy elements';
  // document.getElementById("cop_file_list_files").innerHTML = 'Files: ' + count_files;
  // document.getElementById("cop_file_list_folders").innerHTML = 'Folders: ' + count_folders;

  document.getElementById("cop_file_list_files_folders").innerHTML = 'Selected: ' + (count_folders + count_files);
}

function paste_files() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/copy?path=${path}&dir=${copied_dir}&files=${JSON.stringify({"files": copied_files})}&to=${dir_str}&move=${move_files_bool}`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      close_selected_files_div();
      if (xhr.responseText.toString() === 'NO PLACE') {
        no_place_dialog();
      } else if (xhr.responseText.toString() === 'READ ONLY') {
        readonly_dialog();
      } else update_dir();

    }
  };
  xhr.send();
}

// выделить все файлы
function all_files_checkBox() {
  if (document.getElementById("checkbox_select_all").checked) {
    close_selected_files_div();
    undo_files_checkBox();
    return
  }
  document.getElementById("checkbox_select_all").checked = true;
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
    // document.getElementById("checkbox_select_all").checked = true;
  } else {
    // document.getElementById("checkbox_select_all").checked = false;
  }

}

// убрать выделение со всех файлов
function undo_files_checkBox() {
  try {
    for (i in files_json['files']) {
      document.getElementById('checkbox_file_' + files_json['files'][i]['name']).checked = false;
      try {
        document.getElementById(files_json['files'][i]['name']).classList.remove('file_selected');
      } catch {}
    }
    list_checked_file = [];
  } catch {

  }
  document.getElementById("checkbox_select_all").checked = false;
}

// удаление файла
function delete_file(path, dir_str, name) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/delete?path=${path}&dir=${dir_str}&file=${name}`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      close_delete_file_dialog();
      if (xhr.responseText.toString() === 'READ ONLY') {
        readonly_dialog();
      } else {
        close_rightBar();
        update_dir();
      }

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
      close_delete_file_dialog();
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

//
function open_file_add() {
  openModal("background_black_create_file");
  openModal('addFileMenu');
}

function close_file_add() {
  closeModal("background_black_create_file");
  closeModal('addFileMenu');
}

/*-----------------отображение------------------------*/

var draw_type_checkox = ['list', 'grid'];
var draw_type = 'list';
function switch_draw_type(type='list', e) {
  if (e.checked && draw_type != type) {
    draw_type = type;
    document.getElementById("file_list").className = "file_list_" + draw_type;
    update_dir();
  }

  for (let i = 0; i < draw_type_checkox.length; i++) {
    document.getElementById("checkbox_draw_type_" + draw_type_checkox[i]).checked = false;
  }
  document.getElementById("checkbox_draw_type_" + draw_type).checked = true;

  localStorage.setItem('draw_type', draw_type);

}

if (localStorage.getItem('draw_type') == null) {
  localStorage.setItem('draw_type', 'list');
}

if (!mobile)
  switch_draw_type(localStorage.getItem('draw_type'), {"checked": true});

/* Уведомление о том что путь только для чтения */
var readonly_path_bool = false;
function readonly_dialog() {
  readonly_path_bool = true;

  openModal('dialog_bg');
  openModal('dialog_readonly');
}

function close_readonly_dialog() {
  readonly_path_bool = false;

  closeModal('dialog_bg');
  closeModal('dialog_readonly');
}

/* Уведомление о том что нет места */
var no_place_file_bool = false;
function no_place_dialog() {
  no_place_file_bool = true;

  openModal('dialog_bg');
  openModal('dialog_no_place');
}

function close_no_place_dialog() {
  no_place_file_bool = false;

  closeModal('dialog_bg');
  closeModal('dialog_no_place');
}

/* Диалог для удаления файла */
var delete_file_bool = false;
function delete_file_dialog(path='', dir_str='', name='') {
  delete_file_bool = true;
  var str = '';
  if (path.length != '') {
    str = '-' + name;
    document.getElementById("delete_file_button").onclick = function(){delete_file(path, dir_str, name)};
  } else {
    str = '';
    for (let i = 0; i < list_checked_file.length; i++) {
      str += '-' + list_checked_file[i][0] + '\n'
    }
    document.getElementById("delete_file_button").onclick = function(){delete_files()};
  }
  document.getElementById("delete_file_list").innerHTML = str;

  openModal('dialog_bg');
  openModal('dialog_delete_file');

}

function close_delete_file_dialog() {
  delete_file_bool = false;

  closeModal('dialog_bg');
  closeModal('dialog_delete_file');
}

/*-----------------создание------------------------*/

// открытие диалогового окна для создания файла или директории
var create_file_bool = false;
function create_file_dialog(folder=false) {
  create_file_bool = true;

  if (folder) {
    document.getElementById("create_file_image").src = "static/img/files/folder.svg";
    document.getElementById("create_file_image").className = `${(colored_file_icons)? "folder_filter": ""} icon`;
    document.getElementById("create_file_button").onclick = function(){create_file(true)};
    document.getElementById("create_fileName_input").placeholder = 'New directory name';
  } else {
    document.getElementById("create_file_image").src = "static/img/files/file.svg";
    document.getElementById("create_file_image").className = `${(colored_file_icons)? "text_filter": ""} icon`;
    document.getElementById("create_file_button").onclick = function(){create_file()};
    document.getElementById("create_fileName_input").placeholder = 'New file name';
  }
  document.getElementById(`create_fileName_input`).classList.replace('app_input_error', 'app_input_ok');
  document.getElementById("create_fileName_input").value = "";

  openModal('dialog_bg');
  openModal('dialog_create_file');

  document.getElementById("create_fileName_input").focus();
}

// закрытие диалогового окна для создания файла или директории
function close_create_file_dialog() {
  create_file_bool = false;

  closeModal('dialog_bg');
  closeModal('dialog_create_file');
}

// создание файла или директории
function create_file(folder=false) {
  var xhr = new XMLHttpRequest();

  file_name = document.getElementById("create_fileName_input");

  if (folder) {
    xhr.open('POST', `/create_folder?path=${path}&dir=${dir_str}&folder_name=${file_name.value}`);

  } else {
    xhr.open('POST', `/create_file?path=${path}&dir=${dir_str}&file=${file_name.value}`);
  }

  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      var close_dialog = true;
      if (xhr.responseText.toString() === 'NO PLACE') {
        no_place_dialog();
      } else if (xhr.responseText.toString() === 'READ ONLY') {
        readonly_dialog();
      } else if (xhr.responseText.toString() === 'ERROR NAME') {
        document.getElementById(`create_fileName_input`).classList.replace('app_input_ok', 'app_input_error');
        close_dialog = false;
      } else if (xhr.responseText.toString() === 'ALREADY EXISTS') {
        document.getElementById(`create_fileName_input`).classList.replace('app_input_ok', 'app_input_error');
        close_dialog = false;
      } else update_dir();

      if (close_dialog) {
        close_create_file_dialog();
        file_name.value = '';
      }

    }
  };
  xhr.send();
}

//
function create_file_enter(e) {
  if (e.keyCode == 13) {
    (document.getElementById("create_file_button").onclick)()
    return false;
  }
}

/*------------------------------активности------------------------------*/

// распаковка
function activity_unpack_file() {

  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/unpack?path=${path}&dir=${selected_file_dir}&file=${selected_file_name}&new_file=${selected_file_name}`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      if (xhr.responseText.toString() === 'NO PLACE') {
        no_place_dialog();
      } else if (xhr.responseText.toString() === 'READ ONLY') {
        readonly_dialog();
      } else update_dir();

    }
  };

  xhr.send();

}

// получаем файлы
update_dir();
