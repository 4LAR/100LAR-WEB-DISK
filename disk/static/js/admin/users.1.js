var users_JSON = {};
var templates_JSON = {};
var updated_users_JSON = {};
var updated_paths = {};
var new_user_id = 0;

var opened_users = [];

var prev_type = new Object();

function open_close_user(name, only_open=false) {
  if (document.getElementById('users_' + name).style.height == '30px' || only_open) {
    document.getElementById('users_' + name).style.height = '';
    document.getElementById('users_triangle_' + name).style.transform = 'rotate(0deg)';
    openModal('users_info_' + name);
    if (opened_users.indexOf(name) == -1) opened_users.push(name);
    return true;
  } else {
    document.getElementById('users_' + name).style.height = '30px';
    document.getElementById('users_triangle_' + name).style.transform = 'rotate(90deg)';
    closeModal('users_info_' + name);
    if (opened_users.indexOf(name) != -1) opened_users.splice(opened_users.indexOf(name), 1);
    return false;
  }
}

function open_user(user) {
  try {
    if (open_close_user(user)) {
      generate_details(user, users_JSON[user]['username'], users_JSON[user]['status'], users_JSON[user]['password'], users_JSON[user]['panel']);
      generate_details_path(user);
    }
  } catch {
    opened_users.splice(opened_users.indexOf(user), 1);
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
          <div onclick="open_user(${user})" style="cursor: pointer">
            <img class="icon" width="20" height="20" src="static/img/user.svg">
            <p>${user}:${users_JSON[user]['username']}</p>
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

function see_password(name) {
  var el = document.getElementById(`users_info_${name}_password`);
  var img = document.getElementById(`users_info_${name}_password_img`);
  if (el.type == 'password') {
    el.type = 'text';
    img.src = "static/img/admin/unsee.svg";
  } else {
    el.type = 'password';
    img.src = "static/img/admin/see.svg";
  }
}

//Внутренности юзер блока, вызывается при открытии юзера вместе с open_close_user
function generate_details(name, username, status, password, panel) {
  details_block = document.getElementById('users_info_' + name);
  details_block.innerHTML = `
    <div class="path_list_grid">
      <div>
        <p style="font-size: 18; font-weight: normal">Name</p><br>
        <input id="users_info_${name}_name" type=text class="input_border" value="${username}" style="margin-left: 14px; margin-top: -3px; width: 90%"><br>
        <p style="font-size: 18; font-weight: normal">Status</p><br>
        <input id="users_info_${name}_status" type=text class="input_border" value="${status}" style="margin-left: 14px; margin-top: -3px; width: 90%"><br>
        <p style="font-size: 18; font-weight: normal">Password</p><br>
        <label style="display : flex">
          <input id="users_info_${name}_password" type=password class="input_border" value="${password}" style="margin-left: 14px; margin-top: -3px; width: 80%;"><br>
          <img onclick="see_password('${name}')" id="users_info_${name}_password_img" style="margin: -5px 0px; cursor: pointer;" class="icon" width="25" height="25" src="static/img/admin/see.svg">
        </label>
        <input id="users_info_${name}_panel" type=checkbox class="custom-checkbox" style="position: relative; margin: 10 -5 15 5;" ${(panel)? 'checked': ''}>
        <label for="users_info_${name}_panel">
          <p style="font-weight: normal; font-size: 18">Panel</p>
        </label>
      </div>
      <div>
        <div class="main_page_button block_select" style="width: 140px; margin: 10px; display: inline-block;" onclick="open_alert_delete_user('${name}')">
          <img style="margin: 0px 0px" class="icon" width="20" height="20" src="static/img/trash.svg">
          <p style="margin: -15px 35px">delete user</p>
        </div><br>
        <div class="main_page_button block_select" style="width: 145px; margin: 10px; display: inline-block;" onclick="set_user_info('${name}')">
          <img style="margin: 0px 0px" class="icon" width="20" height="20" src="static/img/admin/refresh.svg">
          <p style="margin: -15px 35px">update user</p>
        </div>
      </div>
    </div>

    <hr class="main_page_hr">
    <ul id="users_info_${name}_path" class="path_list_grid"></ul>
    <div class="main_page_button block_select" style="width: 130px; margin: 10px; display: inline-block;" onclick="add_new_path('${name}')">
      <img style="margin: 0px 0px" class="icon" width="20" height="20" src="static/img/add.svg">
      <p style="margin: -15px 35px">add path</p>
    </div>
    &nbsp;
  `;
}

//Добавление путей к функции generate_details
var last_path_id = 0;
function generate_details_path(user) {
  clear_ul(`users_info_${user}_path`);
  var i = 0;
  if (users_JSON[user]) {
    for (path of users_JSON[user]['path']) {
      updated_paths[user].push(`users_info_${user}_path_${path['name']}`);

      selected_path = (path['type'] === 'path')? 'selected': '';
      selected_template = (path['type'] === 'template')? 'selected': '';
      append_to_ul(
        `users_info_${user}_path`,
        `
          <div id="users_info_${user}_${path['name']}_main" style="" class="path_panel">
            <div class="main_page_button block_select" style="width: 100px; margin: 10px; display: inline-block;" onclick="open_alert_delete_existing_path('${user}', '${path['name']}', '${path['name']}')">
              <img style="margin: 0px 0px" class="icon" width="20" height="20" src="static/img/trash.svg">
              <p style="margin: -15px 35px">delete</p>
            </div>

            <p style="font-size: 16; text-transform: capitalize; font-weight: bold">${path['name']}</p>

            <table class="table_width" style="width: 90%">
              <tr>
                <th align="left">
                  <label for='users_info_${user}_path_${path['name']}_type>'>
                    <p style="font-size: 14; font-weight: normal">Type</p><br>
                  </label>
                  <select id='users_info_${user}_path_${path['name']}_type' class='input_border' style='padding: 0; margin: 2px 13px; width: 98%' onchange="type_change('${user}', '${path['name']}', '${i}')">
                    <option value="path" ${selected_path}>path</option>
                    <option value="template" ${selected_template}>template</option>
                  </select>
                </th>
                <th align="left" id="users_info_${user}_path_${path['name']}_name_th">

                </th>
              </tr>
            </table>

            <div id="users_info_${user}_path_${path['name']}">
            </div>
          </div>
        `
      );
      type_change(user, path['name'], i);
      i++;
      last_path_id[user] = i + 1;
    }
  }
}

//Добавление нового пути
function add_new_path(user) {
  updated_paths[user].push(`users_info_${user}_path_${last_path_id[user]}`);
  append_to_ul(
    `users_info_${user}_path`,
    `
      <div id="users_info_${user}_${last_path_id[user]}_main" class="path_panel">
        <div class="main_page_button block_select" style="width: 100px; margin: 10px; display: inline-block;" onclick="open_alert_delete_existing_path('${user}', '${last_path_id[user]}', '${path['name']}')">
          <img style="margin: 0px 0px" class="icon" width="20" height="20" src="static/img/trash.svg">
          <p style="margin: -15px 35px">delete</p>
        </div>

        <p style="font-size: 16; text-transform: capitalize; font-weight: bold">${last_path_id[user]}</p>

        <table class="table_width" style="width: 90%">
          <tr>
            <th align="left">
              <label for='users_info_${user}_path_${last_path_id[user]}_type>'>
                <p style="font-size: 14; font-weight: normal">Type</p><br>
              </label>
              <select id='users_info_${user}_path_${last_path_id[user]}_type' class='input_border' style='padding: 0; margin: 2px 13px; width: 98%' onchange="type_change('${user}', '${last_path_id[user]}', '${i}')">
                <option value="path">path</option>
                <option value="template">template</option>
              </select>
            </th>
            <th align="left" id="users_info_${user}_path_${last_path_id[user]}_name_th">

            </th>
          </tr>
        </table>

        <div id="users_info_${user}_path_${last_path_id[user]}">
        </div>
      </div>
    `
  );
  type_change(user, last_path_id[user], last_path_id[user]);
  last_path_id[user]++;
}

//снести путь
function delete_existing_path(user, path) {
  var index = updated_paths[user].indexOf(`users_info_${user}_path_${path}`);
  if (index !== -1) updated_paths[user].splice(index, 1);
  document.getElementById(`users_info_${user}_${path}_main`).innerHTML = `
    <h1 align="center">DELETED PATH</h1>
    <h2 align="center" style="margin: -20px -50px">(${path})</h2>
    <br>
  `;
}

//Смена вида при выборе темплейтов/пасов
function type_change(user, path, index) {
  div_path = document.getElementById(`users_info_${user}_path_${path}`);
  div_path_name = document.getElementById(`users_info_${user}_path_${path}_name_th`);
  div_path_type = document.getElementById(`users_info_${user}_path_${path}_type`);
  if (div_path_type.options[div_path_type.selectedIndex].value === 'template') {
    var templates = "";
    for (name in templates_JSON) {
      templates += `<option value="${name}" ${(name == path)? 'selected': ''}>${name}</option>`
    }
    div_path_name.innerHTML = `
      <p style="font-size: 14; font-weight: normal">Name</p><br>
      <select id='users_info_${user}_path_${path}_template' class='input_border' style='padding: 0; margin: 2px 15px; width: 100%'>
        ${templates}
      </select>
    `;

    div_path.innerHTML = ``;
  }
  else if (div_path_type.options[div_path_type.selectedIndex].value === 'path') {

    try {

      var path_val = "/";
      var size_val = "";
      var readonly_val = false;
      try {path_val = users_JSON[user]['path'][index]['path'];} catch {};
      try {size_val = users_JSON[user]['path'][index]['size'];} catch {};
      try {readonly_val = users_JSON[user]['path'][index]['readonly'];} catch {};

      var sizes = "";
      converted_size = convert_size(size_val, true)
      for (size of size_name) {
        sizes += `<option value="${size}" ${(size == converted_size[1])? 'selected': ''}>${size}</option>`
      }

      div_path_name.innerHTML = `
        <p style="font-size: 14; font-weight: normal">Name</p><br>
        <input id="users_info_${user}_path_${path}_name" type=text class="input_border" value="${path}" style="margin: 2px 15px; width: 100%"><br>
      `

      div_path.innerHTML = `

        <p style="font-size: 14">Path</p><br>
        <input id="users_info_${user}_path_${path}_path" type=text class="input_border" value="${path_val}" style="margin-left: 14px; margin-top: -3px; width: 90%""><br>
        <p style="font-size: 14">Size</p><br>
        <select id='users_info_${user}_path_${path}_size_type' class='input_border' style='padding: 0; margin: 2px 15px; width: 50px'>
          ${sizes}
        </select>
        <input id="users_info_${user}_path_${path}_size" type=text class="input_border" value="${converted_size[0]}" style="margin-left: -13px; margin-top: -3px; width: 50%"><br>

        <div style="margin: 5px 16px; height: 30px;">
          <input type="checkbox" class="custom-checkbox" id="users_info_${user}_path_${path}_readonly" name="users_info_${user}_path_${path}_readonly" ${(readonly_val)? 'checked': ''}>
          <label for="users_info_${user}_path_${path}_readonly">
            <p style="font-weight: normal; margin: 0px 0px">read only</p>
          </label>
        </div>
      `;

    } catch {

    }
  }
}

function get_users() {
  users_JSON = {};
  last_path_id = {};
  updated_users_JSON = {};
  updated_paths = {};
  new_user_id = 0;

  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/get_users`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      users_JSON = JSON.parse(xhr.responseText.toString());
      get_templates();
      generate_users();
      for (user in users_JSON) {
        updated_paths[user] = [];
        last_path_id[user] = 0;
        updated_users_JSON[user] = new Object();
        prev_type[user] = new Object();
        for (path of users_JSON[user]['path']) {
          prev_type[user][path['name']] = 0;
        }
      }
      for (let i = 0; i < opened_users.length; i++)
        open_user(opened_users[i]);
    }
  };
  xhr.send();
}

function set_user_info(name) {
  username = document.getElementById(`users_info_${name}_name`).value;
  status = document.getElementById(`users_info_${name}_status`).value;
  password = document.getElementById(`users_info_${name}_password`).value;
  panel = document.getElementById(`users_info_${name}_panel`);
  if (panel.checked) panel = true;
  else panel = false;
  updated_users_JSON[name]['username'] = username;
  updated_users_JSON[name]['status'] = status;
  updated_users_JSON[name]['password'] = password;
  updated_users_JSON[name]['panel'] = panel;
  var j = 0;
  updated_users_JSON[name]['path'] = [];
  for (path of updated_paths[name]) {
    updated_users_JSON[name]['path'].push(new Object());
    type = document.getElementById(`${path}_type`).options[document.getElementById(`${path}_type`).selectedIndex].value;
    updated_users_JSON[name]['path'][j]['type'] = type;
    if (type === 'path') {
      path_name = document.getElementById(`${path}_name`).value;
      path_disk = document.getElementById(`${path}_path`).value;
      size = document.getElementById(`${path}_size`).value;
      path_readonly = document.getElementById(`${path}_readonly`).checked;
      updated_users_JSON[name]['path'][j]['path'] = path_disk;
      updated_users_JSON[name]['path'][j]['readonly'] = path_readonly;
      var size_type = document.getElementById(`${path}_size_type`).value;
      updated_users_JSON[name]['path'][j]['size'] = convert_size_to_b(parseInt(size), get_size_index_by_name(size_type));
    }
    else {
      path_name = document.getElementById(`${path}_template`).value;
    }
    updated_users_JSON[name]['path'][j]['name'] = path_name;
    j++;
  }
  //new_name = document.getElementById(`users_info_${name}_name`).value;

  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/set_user?user=${JSON.stringify(updated_users_JSON)}&name=${name}&reload=true`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      get_users();

    }
  };
  xhr.send()

}

function delete_user(name) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/delete_user?name=${name}&reload=true`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      get_users();

    }
  };
  xhr.send()
}

//добавление юзверя
function add_new_user() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/create_user?reload=true`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      get_users();

    }
  };
  xhr.send()
}

get_users();

function open_alert_delete_user(name) {
  open_alert(`
    <h3 style="margin: 50px 10px;" align="center">Are you sure you want to delete this user?</h3>
    <p style="margin: -50px 10px;" align="center">"${users_JSON[name]['username']}"</p>

    <div class="main_page_button" style="position: absolute; width: 100px; bottom: 10px; left: 10px;" onclick="delete_user('${name}'); close_alert()">
      <img style="margin: 5px 5px" class="icon" width="20" height="20" src="static/img/trash.svg">
      <p style="margin: -25px 35px">delete</p>
    </div>
  `, 150);
}

function open_alert_delete_existing_path(user, last_path_id, name_path) {
  open_alert(`
    <h3 style="margin: 50px 10px;" align="center">Are you sure you want to delete this path?</h3>
    <p style="margin: -50px 10px;" align="center">"${name_path}"</p>

    <div class="main_page_button" style="position: absolute; width: 100px; bottom: 10px; left: 10px;" onclick="delete_existing_path('${user}', '${last_path_id}'); close_alert()">
      <img style="margin: 5px 5px" class="icon" width="20" height="20" src="static/img/trash.svg">
      <p style="margin: -25px 35px">delete</p>
    </div>
  `, 150);
}
