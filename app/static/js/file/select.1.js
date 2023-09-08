
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
