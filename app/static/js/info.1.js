
var info_json = {};

//
function get_info() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/info');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      info_json = JSON.parse(xhr.responseText.toString());

      document.getElementById('user_status').innerHTML = info_json['status'];
      document.getElementById('user_name').innerHTML = info_json['name'];

      set_disk_space((100/info_json['path'][path]['size']) * info_json['path'][path]['busy']);
      document.getElementById('disk_converted').innerHTML = `${info_json['path'][path]['busy_converted']} / ${info_json['path'][path]['size_converted']}`;


    }
  };
  xhr.send()
}

get_info();

//
function set_disk_space(state = 0) {
  document.getElementById("disk_space_progress").style.width = (space_bar_width/100) * state;
}

set_disk_space(0);

document.addEventListener('keydown', function(event){

  if(event.keyCode == 27){
    if (open_close_user_bool) {
      open_close_user_button();
    } else {
      close_rightBar();
    }

  }

});

function set_size_str(str, to_size) {
  if (str.length > to_size) {
    size = to_size / 2;
    return str.substr(0, size) + '...' + str.substr(str.length - size, size);
  } else {
    return str
  }
}

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
