
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

/*----------------------------------------------------------------------------*/
// right bar

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

/*----------------------------------------------------------------------------*/
// info bar (in right bar)

var selected_file_name = '';
var selected_file_dir = '';
// открытие информации о файле
function open_fileInfo(name, type, size, file_path, date, mime, description='') {
  if (list_checked_file.length > 0 || ctrl_key_flag) {
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

  document.getElementById(`fileName_input`).classList.replace('app_input_error', 'app_input_ok');

  closeModal('file_activity_unpack_button');
  closeModal('file_activity_edit_button');
  closeModal('file_activity_view_button');
  closeModal('file_activity_original_button');
  closeModal('file_activity_view');

  if (mobile) closeModal('checkbox_preview_image_div');

  closeModal('preview_archive_div');
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
      load_preview_archive();
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

//
function open_fileInfo_by_name(name) {
  for (let i = 0; i < files_json['files'].length; i++) {
    file = files_json['files'][i];
    if (name === file['name'] && file['type'] !== 'dir') {
      open_fileInfo(file['name'], file['type'], file['size'], dir_str + '/' + file['name'], file['time'], file['type_mime']);
      break;
    }

  }
}
