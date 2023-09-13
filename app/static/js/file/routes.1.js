
// получение всех файлов от сервера в текущей директории
var read_files_bool = false;
function get_files(onload_function=undefined) {
  selected_file_name = "";
  if (!read_files_bool) {
    read_files_bool = true;
    undo_files_checkBox();

    if (!checkModal('copy_or_paste_block')) {
      close_selected_files_div();
    }

    if (checkModal('file_list_block')) {
      closeModal('rightBar');
      closeModal('file_list_block');
    }

    var ul = document.getElementById("file_list");
    ul.innerHTML = '';

    // создаём запрос
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `/files?path=${path}&dir=${dir_str}`);
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
          files_json['files'] = sort_files(files_json['files'], sort_type, sort_order);

          audio_list = [];
          image_list = [];

          // добавляем файлы в список
          for (let i = 0; i < files_json['files'].length; i++) {
            file = files_json['files'][i]
            if (file['type'] == 'dir') {
              append_file(file['type'], file['name']);
            } else {
              append_file(file['type'], file['name'], file['size'], dir_str + '/' + file['name'], file['time'], file['type_mime']);
            }
          }
          if (draw_type == 'list')
            append_path_info(files_json['files'].length);
          if (onload_function != undefined) {
            onload_function();
          }
        }

      }
    };

    // отправляем запрос
    xhr.send();
  } else {

  }

}

// удаление файла
function delete_file(path, dir_str, name) {
  var xhr = new XMLHttpRequest();
  xhr.open('DELETE', `/delete?path=${path}&dir=${dir_str}&file=${name}`);
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
  xhr.open('DELETE', `/delete?path=${path}&dir=${dir_str}&files=${JSON.stringify({"files": list_checked_file})}`);
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
        if (xhr.responseText.toString() === 'ALREADY EXISTS') {
          document.getElementById(`fileName_input`).classList.replace('app_input_ok', 'app_input_error');
        } else {
          selected_file_name = new_file_name;
          document.getElementById(`fileName_input`).classList.replace('app_input_error', 'app_input_ok');
          update_dir(function(){open_fileInfo_by_name(new_file_name)});
        }
      }
    };
    xhr.send();
  }

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
