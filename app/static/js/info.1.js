
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

      if (info_json['path'][path]['size'] > 0) {
        set_disk_space((100/info_json['path'][path]['size']) * info_json['path'][path]['busy']);
        document.getElementById('disk_converted').innerHTML = `${info_json['path'][path]['busy_converted']} / ${info_json['path'][path]['size_converted']}`;
      } else {
        set_disk_space(0);
        document.getElementById('disk_converted').innerHTML = `${info_json['path'][path]['busy_converted']}`;
      }


      clear_ul('path_list');
      for (let i = 0; i < info_json['path'].length; i++) {
        append_to_ul(
          'path_list',
          `
            <div class="path_list_element" onclick="set_path(${i})">
              <img class="icon_topBar" style="margin: 10px 15px" width="25" height="25" src="static/img/dvd-disk.svg">
              <p class="top_bar_font_color" style="position: absolute; margin: -42px 45px; color: #959DA5">${info_json['path'][i]['size_converted']}</p>
              <p class="top_bar_font_color" style="position: absolute; margin: -28px 45px">${info_json['path'][i]['name']}</p>
            </div>
          `
        );
      }

      document.getElementById('path_status_size').innerHTML = info_json['path'][path]['size_converted'];
      document.getElementById('path_name').innerHTML = info_json['path'][path]['name'];

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

  if(event.keyCode == 27){
    if (delete_file_bool) {
      close_delete_file_dialog();
    } else if (create_file_bool) {
      close_create_file_dialog();
    } else if (open_close_user_bool || open_close_path_bool) {
      close_user();
    } else {
      close_rightBar();
    }

  }

});

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
