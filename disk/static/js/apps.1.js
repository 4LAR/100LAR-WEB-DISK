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
      ${(mobile)? "<div class=\"file_checkbox_bg\"></div>": ""}
      <img class="icon apps_list_icon" src="data:image/svg+xml;base64,${image} ">
      <img class="icon apps_list_delete" src="static/img/cross.svg" onclick="delete_app_dialog(${id}, '${name}')">
      <p class="apps_list_name">${name}</p>
      <p class="apps_list_type">${type_name}</p>
      <p class="apps_list_dot" style="color: #${dot_color}">•</p>
      <div class="apps_list_collider" onclick="open_app(${id})"></div>
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

  if (mobile) {
    closeModal("create_apps_back_dialog");
    closeModal("apps_page_2");
    openModal("apps_page_1");
  }
}

function create_apps_dialog_next_page() {
  openModal("create_apps_back_dialog");
  openModal("apps_page_2");
  closeModal("apps_page_1");
}

function close_create_apps_dialog() {
  apps_dialog_bool = false;

  closeModal('dialog_bg');
  closeModal('dialog_create_apps');
}

// удаление приложения
var delete_app_dialog_bool = false;
function delete_app_dialog(id, name) {
  delete_app_dialog_bool = true;
  document.getElementById('delete_app_button').onclick = function(){delete_app(id)};
  document.getElementById('delete_app_name').innerHTML = `&lt;&lt;${name}&gt;&gt;`;
  openModal('dialog_bg');
  openModal('dialog_delete_app');
}

function close_delete_app_dialog() {
  delete_app_dialog_bool = false;

  closeModal('dialog_bg');
  closeModal('dialog_delete_app');
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
  var data = get_values_from_create_layout(apps_buttons[selected_app_id]['create_layout']);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/append_app?app_id=${selected_app_id}&data=${JSON.stringify(data)}`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      if (xhr.responseText.toString() === 'ok') {
        close_create_apps_dialog();
        document.getElementById(`apps_main_div`).innerHTML = ``;
        get_apps();
      } else {
        for (const [key, value] of Object.entries(data)) {
          if (value['type'] === 'path' || value['type'] === 'memory') {
            document.getElementById(`${APP_NAMESPACE}${key}_select`).classList.replace('app_input_error', 'app_input_ok');
            document.getElementById(`${APP_NAMESPACE}${key}_input`).classList.replace('app_input_error', 'app_input_ok');
          } else document.getElementById(`${APP_NAMESPACE}${key}`).classList.replace('app_input_error', 'app_input_ok');
        }
        var arg = xhr.responseText.toString()
        if (data[arg]['type'] === 'path' || data[arg]['type'] === 'memory') {
          document.getElementById(`${APP_NAMESPACE}${arg}_select`).classList.replace('app_input_ok', 'app_input_error');
          document.getElementById(`${APP_NAMESPACE}${arg}_input`).classList.replace('app_input_ok', 'app_input_error');
        } else document.getElementById(`${APP_NAMESPACE}${arg}`).classList.replace('app_input_ok', 'app_input_error');
      }
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
      close_delete_app_dialog();
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
        openModal("app_search_div");
        openModal("apps_list_div");
      } else {
        openModal("apps_empty_message");
        closeModal("app_search_div");
        closeModal("apps_list_div");
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
    apps_buttons[app_name]['create_layout'].unshift({
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

function get_values_from_create_layout(dict, root=true) {
  var data = new Object();
  if (root) {
    data['name'] = document.getElementById(`${APP_NAMESPACE}name`).value;
  }

  for (el of dict) {
    if (!["label", "row"].includes(el['type']))
      data[el['arg']] = {
        "type": el['type'],
        "value": undefined
      };
    switch (el['type']) {
      case ('path'): {
        data[el['arg']]["value"] = document.getElementById(`${APP_NAMESPACE}${el['arg']}_select`).value + ":" + document.getElementById(`${APP_NAMESPACE}${el['arg']}_input`).value;
        break;
      }
      case ('memory'): {
        data[el['arg']]["value"] = document.getElementById(`${APP_NAMESPACE}${el['arg']}_select`).value + ":" + document.getElementById(`${APP_NAMESPACE}${el['arg']}_input`).value;
        break;
      }
      case ('row'): {
        data = Object.assign(data, get_values_from_create_layout(el['elements'], false));
        break;
      }
      case ('label'):
        break;

      default: {
        data[el['arg']]["value"] = document.getElementById(`${APP_NAMESPACE}${el['arg']}`).value;
      }
    }

  }
  return data
}

function generate_create_layout(dict, root=true) {
  var html_div = '';
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
        html_div += `<input id="${APP_NAMESPACE}${el['arg']}" class="app_input_ok input_style dialog_input" style="left: 10px; width: 90%; max-width: 260px;" type=text placeholder="${el['placeholder']}" value="${el['value']}">`;
        break;
      }
      case ('select'): {
        var select_options = "";
        for (option of el['options']) {
          select_options += `<option value="${option}">${option}</option>`;
        }
        html_div += `<select class="app_input_ok round_selector" id="${APP_NAMESPACE}${el['arg']}" style="left: 10px; width: 90%; max-width: 260px;">${select_options}</select>`;
        break;
      }
      case ('path'): {
        var select_options = "";
        for (let i = 0; i < info_json['path'].length; i++) {
          if (!info_json['path'][i]['readonly'])
            select_options += `<option value="${i}">${info_json['path'][i]['name']}</option>`;
        }
        html_div += `<div class="apps_path_div"><select class="app_input_ok round_selector" id="${APP_NAMESPACE}${el['arg']}_select" style="left: 10px; width: 80px;">${select_options}</select>`;
        html_div += `<input id="${APP_NAMESPACE}${el['arg']}_input" class="app_input_ok input_style dialog_input" style="position: absolute; left: 95px; width: calc(100% - calc(95px + 5%)); max-width: 175px;" type=text placeholder="direcory" value="/"></div>`
        break;
      }
      case ('memory'): {
        var select_options = "";
        for (let i = 0; i < size_name.length; i++) {
          select_options += `<option value="${i}" ${(i == 2)? "selected": ""}>${size_name[i]}</option>`;
        }
        html_div += `<div class="apps_path_div"><input id="${APP_NAMESPACE}${el['arg']}_input" class="app_input_ok input_style dialog_input" style="position: absolute; left: 65px; width: calc(100% - calc(65px + 5%)); max-width: 205px;" type=text placeholder="direcory" value="10">`
        html_div += `<select class="app_input_ok round_selector" id="${APP_NAMESPACE}${el['arg']}_select" style="left: 10px; width: 50px;">${select_options}</select></div>`;
        break;
      }
    }
  }
  return html_div
}

function select_app_button(id) {
  if (mobile)
    create_apps_dialog_next_page();

  if (selected_app_id != "")
    document.getElementById(`app_button_${selected_app_id}`).classList.replace('app_button_selected', 'app_button');

  document.getElementById(`app_button_${id}`).classList.replace('app_button', 'app_button_selected');
  document.getElementById(`apps_main_div`).innerHTML = generate_create_layout(apps_buttons[id]['create_layout']);
  selected_app_id = id;
}

/*----------------------------------------------------------------------------*/

function search_app_input() {
  search_app(document.getElementById(`app_search_input`).value);
}

function search_app(name) {
  clear_ul('apps_list');
  for (let i = 0; i < my_apps.length; i++) {
    if (compare_str(name, my_apps[i]["name"]) || (name == "")) {
      append_apps_to_list(i, my_apps[i]["name"], my_apps[i]["app_id"], my_apps[i]["status"]);
    }
  }
}

/*----------------------------------------------------------------------------*/

function open_app(id) {
  selected_app_id_iframe = id;
  document.getElementById('main_app_frame').src = `/app?app_id=${my_apps[id]['app_id']}&id=${id}`;
  document.getElementById('app_new_window_button').onclick = function(){open_app_in_new_tab(id)};

  main_app_dialog();
}

function open_app_in_new_tab(id) {
  close_main_app_dialog();
  openInNewTab(`/app?app_id=${my_apps[id]['app_id']}&id=${id}`);
}

document.getElementById('main_app_frame').onload = function() {

}
