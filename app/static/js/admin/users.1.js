var users_JSON = {};
var templates_JSON = {};
var updated_users_JSON = {};
var updated_paths = [];

function open_close_user(name) {
  if (document.getElementById('users_' + name).style.height == '30px') {
    document.getElementById('users_' + name).style.height = '';
    document.getElementById('users_triangle_' + name).style.transform = 'rotate(0deg)';
    openModal('users_info_' + name);
  } else {
    document.getElementById('users_' + name).style.height = '30px';
    document.getElementById('users_triangle_' + name).style.transform = 'rotate(90deg)';
    closeModal('users_info_' + name);
  }
}

function generate_users() {
  clear_ul('userlist');
  var i = Object.keys(users_JSON).length - 1;
  for (user in users_JSON) {
    append_to_ul(
      'userlist',
      `
        <div id="users_${user}" style="height: 30px" class="block_select">
          <div onclick="open_close_user('${user}'); generate_details('${user}', '${users_JSON[user]['status']}', '${users_JSON[user]['password']}', '${users_JSON[user]['panel']}'); generate_details_path('${user}')" style="cursor: pointer">
            <img class="icon" width="20" height="20" src="static/img/user.svg">
            <p>${user}</p>
            <img align="right" id="users_triangle_${user}" style="margin: 5px 20px; transform: rotate(90deg)" class="icon" width="10" height="10" src="static/img/triangle.svg">
          </div>
          <div id="users_info_${user}" class="user_info" style="display: none">
            <p>You're not supposed to see this.</p>
          </div>

        </div>
        ${(i-- != 0)? '<hr class="main_page_hr">': ''}
      `
    );
  }
}

//Внутренности юзер блока, вызывается при открытии юзера вместе с open_close_user
function generate_details(name, status, password, panel) {
  details_block = document.getElementById('users_info_' + name);
  checked = panel? 'checked': '';
  details_block.innerHTML = `
    <p style="font-size: 18; font-weight: bold">Name</p><br>
    <input id="users_info_${name}_name" type=text class="input_border" value="${name}" style="margin-left: 14px; margin-top: -3px"><br>
    <p style="font-size: 18; font-weight: bold">Status</p><br>
    <input id="users_info_${name}_status" type=text class="input_border" value="${status}" style="margin-left: 14px; margin-top: -3px"><br>
    <p style="font-size: 18; font-weight: bold">Password</p><br>
    <input id="users_info_${name}_password" type=text class="input_border" value="${password}" style="margin-left: 14px; margin-top: -3px"><br>
    <input id="users_info_${name}_panel" type=checkbox class="custom-checkbox" value="${panel}" style="position: relative; margin: 10 -5 15 5;" ${checked}>
    <label for="users_info_${name}_panel">
      <p style="font-weight: bold; font-size: 18">Panel</p>
    </label>
    <hr class="main_page_hr">
    <p style="font-size: 18; font-weight: bold">Path</p><br>
    <ul id="users_info_${name}_path"></ul>
    <img src="../static/img/add.svg" class=icon style="width: 15px; margin-left: 10px; margin-bottom: 5px" onclick="add_new_path('${name}')">
    <div class="main_page_button block_select" style="width: 100px; margin: 10px" onclick="set_user_info('${name}')">
      <p style="margin: 5.3px 25px">Update</p>
    </div>
    &nbsp;
  `;
}

//Добавление путей к функции generate_details
var last_path_id = 0;
function generate_details_path(user) {
  clear_ul(`users_info_${user}_path`);
  var i = 0;
  for (path of users_JSON[user]['path']) {
    updated_paths.push(`users_info_${user}_path_${path['name']}`);
    i++;
    selected_path = (path['type'] === 'path')? 'selected': '';
    selected_template = (path['type'] === 'template')? 'selected': '';
    append_to_ul(
      `users_info_${user}_path`,
      `
        <div id="users_info_${user}_${path['name']}_main">
          <p style="font-size: 16; text-transform: capitalize">${path['name']}</p>
          <img src="../static/img/cross.svg" onclick="delete_existing_path('${user}', '${path['name']}')" class=icon style="width: 15px; margin-left: -25px; margin-bottom: 3px"><br>
          <label for='users_info_${user}_path_${path['name']}_type>'>
            <p style="font-size: 14">Type</p><br>
          </label>
          <select id='users_info_${user}_path_${path['name']}_type' class='input_border' style='padding: 0; margin: 2px 15px; width: 200px' onchange="type_change('${user}', '${path['name']}', '${i}')">
            <option value="path" ${selected_path}>path</option>
            <option value="template" ${selected_template}>template</option>
          </select>

          <div id="users_info_${user}_path_${path['name']}">
          </div>
        </div>
      `
    );
    type_change(user, path['name'], i);
    last_path_id = i + 1;
  }
}

//Добавление нового пути
function add_new_path(user) {
  updated_paths.push(`users_info_${user}_path_${last_path_id}`);
  append_to_ul(
    `users_info_${user}_path`,
    `
      <div id="users_info_${user}_${last_path_id}_main">
        <p style="font-size: 16; text-transform: capitalize">New Path ${last_path_id}</p>
        <img src="../static/img/cross.svg" onclick="delete_existing_path('${user}', '${last_path_id}')" class=icon style="width: 15px; margin-left: -25px; margin-bottom: 3px"><br>
        <label for='users_info_${user}_path_${last_path_id}_type>'>
          <p style="font-size: 14">Type</p><br>
        </label>
        <select id='users_info_${user}_path_${last_path_id}_type' class='input_border' style='padding: 0; margin: 2px 15px; width: 200px' onchange="type_change('${user}', '${last_path_id}', '${last_path_id}')">
          <option value="path">path</option>
          <option value="template">template</option>
        </select>

        <div id="users_info_${user}_path_${last_path_id}">
        </div>
      </div>
    `
  );
  type_change(user, last_path_id, last_path_id);
  last_path_id++;
}

//снести путь
function delete_existing_path(user, path) {
  var index = updated_paths.indexOf(`users_info_${user}_path_${path}`);
  if (index !== -1) updated_paths.splice(index, 1);
  document.getElementById(`users_info_${user}_${path}_main`).innerHTML = "";
}

//Смена вида при выборе темплейтов/пасов
function type_change(user, path, index) {
  div_path = document.getElementById(`users_info_${user}_path_${path}`);
  div_path_type = document.getElementById(`users_info_${user}_path_${path}_type`);
  if (div_path_type.options[div_path_type.selectedIndex].value === 'template') {
    var templates = "";
    for (name in templates_JSON) {
      templates += `<option value="${name}">${name}</option>`
    }
    div_path.innerHTML = `
      <select id='users_info_${user}_path_${path}_template' class='input_border' style='padding: 0; margin: 2px 15px; width: 200px'>
        ${templates}
      </select>
      `;
  }
  else if (div_path_type.options[div_path_type.selectedIndex].value === 'path') {
    var sizes = "";
    for (size of size_name) {
      sizes += `<option value="${size}">${size}</option>`
    }
    try {
      var path_val = "";
      var size_val = "";
      try {path_val = users_JSON[user]['path'][index]['path'];}
      catch {};
      try {size_val = users_JSON[user]['path'][index]['size'];}
      catch {};
      div_path.innerHTML = `
        <p style="font-size: 14">Name</p><br>
        <input id="users_info_${user}_path_${path}_name" type=text class="input_border" value="${path}" style="margin-left: 14px; margin-top: -3px"><br>
        <p style="font-size: 14">Path</p><br>
        <input id="users_info_${user}_path_${path}_path" type=text class="input_border" value="${path_val}" style="margin-left: 14px; margin-top: -3px"><br>
        <p style="font-size: 14">Size</p><br>
        <select id='users_info_${user}_path_${path}_size_type' class='input_border' style='padding: 0; margin: 2px 15px; width: 50px' onchange="convert_this('${user}', '${path}')">
          ${sizes}
        </select>
        <input id="users_info_${user}_path_${path}_size" type=text class="input_border" value="${size_val}" style="margin-left: 14px; margin-top: -3px"><br>
        `;
    } catch {
      var path_val = "";
      var size_val = "";
      try {path_val = templates_JSON[path]['path'];}
      catch {};
      try {size_val = templates_JSON[path]['size'];}
      catch {};
      div_path.innerHTML = `
        <p style="font-size: 14">Name</p><br>
        <input id="users_info_${user}_path_${path}_name" type=text class="input_border" value="${path}" style="margin-left: 14px; margin-top: -3px"><br>
        <p style="font-size: 14">Path</p><br>
        <input id="users_info_${user}_path_${path}_path" type=text class="input_border" value="${path_val}" style="margin-left: 14px; margin-top: -3px"><br>
        <p style="font-size: 14">Size</p><br>
        <select id="users_info_${user}_path_${path}_size_type" class='input_border' style='padding: 0; margin: 2px 15px; width: 50px' onchange="convert_this('${user}', '${path}')">
          ${sizes}
        </select>
        <input id="users_info_${user}_path_${path}_size" type=text class="input_border" value="${size_val}" style="margin-left: 14px; margin-top: -3px"><br>
        `;
    }
  }
}

//блядское конвертирование
var prev_type = new Object();
function convert_this(user, path) {
  current_size = document.getElementById(`users_info_${user}_path_${path}_size`).value * Math.pow(1024, prev_type[user][path]);
  document.getElementById(`users_info_${user}_path_${path}_size`).value = current_size / Math.pow(1024, document.getElementById(`users_info_${user}_path_${path}_size_type`).selectedIndex);
  prev_type[user][path] = document.getElementById(`users_info_${user}_path_${path}_size_type`).selectedIndex;
}

function get_users() {
  updated_users_JSON = {};
  updated_paths = [];
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/get_users`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      users_JSON = JSON.parse(xhr.responseText.toString());
      get_templates();
      generate_users();
      for (user in users_JSON) {
        updated_users_JSON[user] = new Object();
        prev_type[user] = new Object();
        for (path of users_JSON[user]['path'])
        {
          prev_type[user][path['name']] = 0;
        }
      }
    }
  };
  xhr.send();
}

function get_templates() { //Полуение шаблонов, копия получения юзеров
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/get_templates`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      templates_JSON = JSON.parse(xhr.responseText.toString());
    }
  };
  xhr.send();
}

function set_user_info(name) {

  status = document.getElementById(`users_info_${name}_status`).value;
  password = document.getElementById(`users_info_${name}_password`).value;
  panel = document.getElementById(`users_info_${name}_panel`);
  if (panel.checked) panel = true;
  else panel = false;
  updated_users_JSON[name]['status'] = status;
  updated_users_JSON[name]['password'] = password;
  updated_users_JSON[name]['panel'] = panel;
  var j = 0;
  updated_users_JSON[name]['path'] = [];
  for (path of updated_paths) {
    updated_users_JSON[name]['path'].push(new Object());
    type = document.getElementById(`${path}_type`).options[document.getElementById(`${path}_type`).selectedIndex].value;
    updated_users_JSON[name]['path'][j]['type'] = type;
    if (type === 'path') {
      path_name = document.getElementById(`${path}_name`).value;
      path_disk = document.getElementById(`${path}_path`).value;
      size = document.getElementById(`${path}_size`).value;
      updated_users_JSON[name]['path'][j]['path'] = path_disk;
      updated_users_JSON[name]['path'][j]['size'] = parseInt(size);
    }
    else {
      path_name = document.getElementById(`${path}_template`).value;
    }
    updated_users_JSON[name]['path'][j]['name'] = path_name;
    j++;
  }

  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/set_user?user=${JSON.stringify(updated_users_JSON)}&name=${name}&reload=true`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {


    }
  };
  xhr.send()

}

get_users();
