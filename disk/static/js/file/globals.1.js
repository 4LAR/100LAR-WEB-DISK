
var dir = [];
var forward_dir_history = [];
var back_dir_history = [];
var dir_str = ''
var path = 0;
var files_json = {}

var url_file = "";
var type_file = "";

var sort_type = get_localStorage("sort_type", "type");
var sort_order = (get_localStorage("sort_order", "false") == "true")? true: false;

//
function set_color_disk_space(space=0) {
  var svg_class = "icon ";
  if (colored_space_status) {
    if (space >= 70) {
      svg_class += "disk_space_red";
    } else if (space >= 50) {
      svg_class += "disk_space_orange";
    }
  }
  document.getElementById("disk_space_img").className = svg_class;
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
