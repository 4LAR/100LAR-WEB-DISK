const COLOR_WHITE = "D1D5DA";
const COLOR_RED = "D73A49";
const COLOR_ORANGE = "DBAB09";
const COLOR_GREEN = "28A745";

var apps_count = 0;
var selected_app_id = -1;
var apps_buttons = [];

function append_apps_to_list(id, name, type, status) {
  var dot_color = "";
  var image = ""
  var type_name = ""
  switch (status) {
    case (0):
      break;
    case (1):
      dot_color = COLOR_RED;
      break;
    case (2):
      dot_color = COLOR_ORANGE;
      break;
    case (3):
      dot_color = COLOR_GREEN;
      break;
  }

  image = apps_buttons[type]['ico'];
  type_name = apps_buttons[type]['name'];

  append_to_ul(
    'apps_list',
    `<div class="apps_list_element" onclick="open_app(${type})">
      <image class="icon apps_list_icon" width="20" height="20" src="data:image/svg+xml;base64,${image} ">
      <img class="icon apps_list_delete" width="20" height="20" src="static/img/trash.svg">
      <p class="apps_list_name">${name}</p>
      <p class="apps_list_type">${type_name}</p>
      <p class="apps_list_dot" style="color: #${dot_color}">•</p>
    </div>`
  );

  apps_count++;
  document.getElementById('apps_count').innerHTML = `${apps_count} elements`;
}

// function read_apps_list() {
//   apps_count = 0;
//   for (let i = 0; i < 5; i++)
//   append_apps_to_list(0, 'server #' + i, 1, getRandomInt(1, 3));
//
//   for (let i = 0; i < 5; i++)
//   append_apps_to_list(0, 'bash #' + i, 0, 3);
// }
//
// read_apps_list();

/*----------------------------------------------------------------------------*/

// создание приложения
var apps_dialog_bool = false;
function create_apps_dialog() {
  apps_dialog_bool = true;

  openModal('dialog_bg');
  openModal('dialog_create_apps');
}

function close_create_apps_dialog() {
  apps_dialog_bool = false;

  closeModal('dialog_bg');
  closeModal('dialog_create_apps');
}

// открытие приложения
var main_app_dialog_bool = false;
function main_app_dialog() {
  main_app_dialog_bool = true;

  openModal('dialog_bg');
  openModal('dialog_main_app');
}

function close_main_app_dialog() {
  main_app_dialog_bool = false;

  closeModal('dialog_bg');
  closeModal('dialog_main_app');
}

/*----------------------------------------------------------------------------*/

function get_apps() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/get_apps');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      apps_buttons = JSON.parse(xhr.responseText.toString())["apps"];
      append_to_apps_buttons();
      append_apps_to_list(0, 'test', 0, 0);
    }
  };
  xhr.send()
}

function append_to_apps_buttons() {
  for (let i = 0; i < apps_buttons.length; i++) {
    append_to_ul(
      'apps_buttons',
      `<div id="app_button_${i}" class="app_button round_button block_select button_margin" onclick="select_app_button(${i})">
        <image class="icon" width="20" height="20" src="data:image/svg+xml;base64,${apps_buttons[i]['ico']} ">
        <p>${apps_buttons[i]['name']}</p>
      </div>`
    )
  }
  select_app_button(0);
}

function select_app_button(id) {
  if (selected_app_id != -1)
    document.getElementById(`app_button_${selected_app_id}`).classList.replace('app_button_selected', 'app_button');

  document.getElementById(`app_button_${id}`).classList.replace('app_button', 'app_button_selected');
  document.getElementById(`apps_main_div`).innerHTML = apps_buttons[id]['welcome_html'];
  selected_app_id = id;
}

get_apps();

/*----------------------------------------------------------------------------*/

function open_app(id) {
  document.getElementById('main_app_frame').src = `/app?id=${id}`;
  main_app_dialog();
}
