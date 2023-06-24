
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

//
function open_file_add() {
  openModal("background_black_create_file");
  openModal('addFileMenu');
}

function close_file_add() {
  closeModal("background_black_create_file");
  closeModal('addFileMenu');
}
