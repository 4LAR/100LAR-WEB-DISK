
var info_json = {};

//
function get_info() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/info');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      info_json = JSON.parse(xhr.responseText.toString());

      // показ кнопки админ панели
      if (info_json['panel']) {
        openModal('admin_panel');
        document.getElementById('other_options').style.top = "82px";
      }

      document.getElementById('user_status').innerHTML = info_json['status'];
      document.getElementById('user_name').innerHTML = info_json['name'];

      if (info_json['path'][path]['readonly']) {
        document.getElementById('disk_converted').innerHTML = `${info_json['path'][path]['busy_converted']} (read-only)`;
        set_disk_space(100);
        set_color_disk_space(0);
      } else {
        if (info_json['path'][path]['size'] > 0) {
          var space = (100/info_json['path'][path]['size']) * info_json['path'][path]['busy'];
          set_disk_space(space);
          set_color_disk_space(space);
          document.getElementById('disk_converted').innerHTML = `${info_json['path'][path]['busy_converted']} / ${info_json['path'][path]['size_converted']}`;
        } else {
          set_disk_space(0);
          set_color_disk_space(0);
          document.getElementById('disk_converted').innerHTML = `${info_json['path'][path]['busy_converted']}`;
        }
      }



      clear_ul('path_list');
      for (let i = 0; i < info_json['path'].length; i++) {
        append_to_ul(
          'path_list',
          `
            <div class="path_list_element" onclick="set_path(${i})" id="set_path_div_${i}">
              <div id="select_path_div_${i}" class="vl_style" style="height: 25px; margin: 10px 4px; position: absolute; display: ${(path == i)? 'block': 'none'}"></div>
              <img class="icon" style="margin: 10px 15px" width="25" height="25" src="static/img/dvd-disk.svg">
              <p style="position: absolute; margin: -42px 45px; color: var(--color-hide-font)">${(info_json['path'][i]['readonly'])? 'readonly': info_json['path'][i]['size_converted']}</p>
              <p style="position: absolute; margin: -28px 45px">${info_json['path'][i]['name']}</p>
            </div>
          `
        );
      }

      document.getElementById('path_status_size').innerHTML = info_json['path'][path]['size_converted'];
      document.getElementById('path_name').innerHTML = info_json['path'][path]['name'];

      get_apps();
    }
  };
  xhr.send()
}

//
function set_disk_space(state = 0) {
  document.getElementById("disk_space_progress").style.width = (document.getElementById("disk_space_div").offsetWidth/100) * state;
}

set_disk_space(0);

document.addEventListener('keydown', function(event){
  if (event.keyCode === 32) {
    if (video_fullscreen) {
      if (video_pause) play_video();
      else pause_video();
    }
  }

  if (event.ctrlKey && event.keyCode === 37) {
    go_back_dir_history();
  } else if (event.ctrlKey && event.keyCode === 39) {
    go_forward_dir_history();
  } else if (event.keyCode === 37 && image_fullscreen_bool) {
    next_image(true);
  } else if (event.keyCode === 39 && image_fullscreen_bool) {
    next_image();
  }

  if(event.keyCode == 27 && !check_device()){
    if (image_fullscreen_bool) {
      image_fullscreen();
    } else if (video_fullscreen) {
      full_screen();
    } else if (close_dialogs()) {

    } else if (open_close_user_bool || open_close_path_bool) {
      close_user();
    } else {
      close_rightBar();
      close_selected_files_div();
    }

  }

});

//
function close_dialogs() {
  if (delete_file_bool) {
    close_delete_file_dialog();
  } else if (create_file_bool) {
    close_create_file_dialog();
  } else if (apps_dialog_bool) {
    close_create_apps_dialog();
  } else if (readonly_path_bool) {
    close_readonly_dialog();
  } else if (no_place_file_bool) {
    close_no_place_dialog();
  } else if (main_app_dialog_bool) {
    close_main_app_dialog();
  } else if (delete_app_dialog_bool) {
    close_delete_app_dialog();
  } else if (change_password_bool) {
    close_change_password_dialog();
  } else if (change_login_bool) {
    close_change_login_dialog();
  } else if (image_fullscreen_bool) {
    image_fullscreen();
  } else if (video_fullscreen) {
    full_screen();
  } else return false;
  return true;
}

//
function set_size_str(str, to_size) {
  if (str.length > to_size) {
    size = to_size / 2;
    return str.substr(0, size) + '...' + str.substr(str.length - size, size);
  } else {
    return str
  }
}

//
function set_size_str_path(str, to_size) {
  if (str.length > to_size) {
    return '...' + str.substr(str.length - to_size, to_size)
  } else {
    return str
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
