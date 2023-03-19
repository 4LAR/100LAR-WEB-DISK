const COLOR_WHITE = "D1D5DA";
const COLOR_RED = "D73A49";
const COLOR_ORANGE = "DBAB09";
const COLOR_GREEN = "28A745";

const APP_NAMESPACE = "createApp_";

var apps_count = 0;
var selected_app_id = "";
var selected_app_id_iframe = 0;
var apps_buttons = [];
var my_apps = {};

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
    `<div class="apps_list_element block_select">
      <image class="icon apps_list_icon" width="20" height="20" src="data:image/svg+xml;base64,${image} ">
      <img class="icon apps_list_delete" width="20" height="20" src="static/img/trash.svg" onclick="delete_app(${id})">
      <p class="apps_list_name">${name}</p>
      <p class="apps_list_type">${type_name}</p>
      <p class="apps_list_dot" style="color: #${dot_color}">•</p>
      <div onclick="open_app(${id})" style="position: absolute; height: 40px; left: 35px; right: 0px;"></div>
    </div>`
  );
}

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

  document.getElementById('main_app_frame').src = `about:blank`;

  closeModal('dialog_bg');
  closeModal('dialog_main_app');
}

/*----------------------------------------------------------------------------*/

// создание приложения
function append_app() {
  var data = new Object();
  var args_list = apps_buttons[selected_app_id]['executable_args'];
  for (let i = 0; i < args_list.length; i++) {
    data[args_list[i]] = document.getElementById(`${APP_NAMESPACE}${selected_app_id}_${args_list[i]}`).value;
  }

  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/append_app?app_id=${selected_app_id}&data=${JSON.stringify(data)}`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      close_create_apps_dialog();
      get_apps();
    }
  };
  xhr.send();
}

// удлание приложения
function delete_app(app_id) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/delete_app?id=${app_id}`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      close_create_apps_dialog();
      get_apps();
    }
  };
  xhr.send();
}

function get_my_apps() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/get_my_apps');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      clear_ul('apps_list');
      apps_count = 0;
      my_apps = JSON.parse(xhr.responseText.toString())["apps"];
      for (let i = 0; i < my_apps.length; i++) {
        append_apps_to_list(i, my_apps[i]["name"], my_apps[i]["app_id"], my_apps[i]["status"]);
        apps_count++;
      }
      if (apps_count > 0) {
        closeModal("apps_empty_message");
      } else {
        openModal("apps_empty_message");
      }
      document.getElementById('apps_count').innerHTML = `${apps_count} elements`;
    }
  };
  xhr.send();
}

function get_apps() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/get_apps');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      apps_buttons = JSON.parse(xhr.responseText.toString())["apps"];
      append_to_apps_buttons();
      get_my_apps();
    }
  };
  xhr.send();
}

function append_to_apps_buttons() {
  var first_app = "";
  clear_ul('apps_buttons');
  var apps_count = 0;
  for (app_name in apps_buttons) {
    if (first_app.length < 1) first_app = app_name;
    append_to_ul(
      'apps_buttons',
      `<div id="app_button_${app_name}" class="app_button round_button block_select button_margin" onclick="select_app_button('${app_name}')">
        <image class="icon" width="20" height="20" src="data:image/svg+xml;base64,${apps_buttons[app_name]['ico']} ">
        <p>${apps_buttons[app_name]['name']}</p>
      </div>`
    )
    apps_count++;
  }
  if (apps_count > 0) {
    select_app_button(first_app);
    openModal("apps_list_main");
  } else {
    closeModal("apps_list_main");
  }
}

function generate_create_layout(dict, root=true) {
  var html_div = '';
  if (root) {
    dict.unshift({
      "type": "row",
      "text": "App name:",
      "elements": [
        {
          "type": "input",
          "arg": "name",
          "placeholder": "app name",
          "value": "My app",
          "must_be_filled": true
        }
      ]
    })
  }
  for (el of dict) {
    switch (el['type']) {
      case ('label'): {
        html_div += `<p style="margin-left: 10px;">${el['text']}</p>`
        break;
      }
      case ('row'): {
        html_div += `<p style="margin-left: 5px;">${el['text']}</p>`;
        html_div += generate_create_layout(el['elements'], false);
        break;
      }
      case ('input'): {
        html_div += `<input id="${APP_NAMESPACE}${el['arg']}" class="input_style dialog_input" style="left: 10px; width: 90%; max-width: 260px;" type=text placeholder="${el['placeholder']}" value="${el['value']}">`;
        break;
      }
    }
  }
  return html_div
}

function select_app_button(id) {
  if (selected_app_id != "")
    document.getElementById(`app_button_${selected_app_id}`).classList.replace('app_button_selected', 'app_button');

  document.getElementById(`app_button_${id}`).classList.replace('app_button', 'app_button_selected');
  document.getElementById(`apps_main_div`).innerHTML = generate_create_layout(apps_buttons[id]['create_layout']);
  selected_app_id = id;
}

get_apps();

/*----------------------------------------------------------------------------*/

function open_app(id) {
  selected_app_id_iframe = id;
  document.getElementById('main_app_frame').src = `/app?app_id=${my_apps[id]['app_id']}&id=${id}`;

  main_app_dialog();
}

document.getElementById('main_app_frame').onload = function() {

}
