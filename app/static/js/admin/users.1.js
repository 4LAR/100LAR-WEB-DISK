var users_JSON = {};

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

function get_users() {
  clear_ul('userlist');
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/get_users`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      users_JSON = JSON.parse(xhr.responseText.toString());

      var i = Object.keys(users_JSON).length - 1;
      for (user in users_JSON) {
        var path_list_str = '';
        for (let i = 0; i < users_JSON[user]['path'].length; i++) {
          if (users_JSON[user]['path'][i]['type'] == 'path') {
            // <p style="margin: 0px 10px; padding-top: 5px; font-weight: normal;">Type</p>
            // <input id="users_path_${i}_${user}_type" class="input_border" style="margin-top: 0px;" type=text placeholder="..." value="${users_JSON[user]['path'][i]['type']}">
            // <br>

            size = convert_size(users_JSON[user]['path'][i]['size'], true);

            str_size_name_select = '';
            for (let size_ = 0; size_ < size_name.length; size_++) {
              str_size_name_select += `<option value="${size_name[size_]}" ${(size_ == size[2])? 'selected': ''}>${size_name[size_]}</option>`;
            }

            path_list_str += `
              <div class="path_grid">
                <br>
                <p style="margin: 0px 10px; padding-top: 5px; font-weight: normal;">Type</p><br>
                <select id="users_path_type_${i}_${user}" class="input_border" style="left: 10px; margin-top: 0px; padding: 0px 0px; width: 90%">
                  <option value="path" selected>path</option>
                  <option value="template">template</option>
                </select>
                <br>
                <p style="margin: 0px 10px; padding-top: 5px; font-weight: normal;">Name</p><br>
                <input id="users_path_name_${i}_${user}" class="input_border" style="left: 10px; margin-top: 0px; width: 90%" type=text placeholder="..." value="${users_JSON[user]['path'][i]['name']}">
                <br>
                <p style="margin: 0px 10px; padding-top: 5px; font-weight: normal;">Path</p><br>
                <input id="users_path_path_${i}_${user}" class="input_border" style="left: 10px; margin-top: 0px; width: 90%" type=text placeholder="..." value="${users_JSON[user]['path'][i]['path']}">
                <br>
                <p style="margin: 0px 10px; padding-top: 5px; font-weight: normal;">Size</p><br>
                <select id="users_sizen_name_${i}_${user}" class="input_border" style="left: 10px; margin-top: 0px; padding: 0px 0px; width: 20%">
                  ${str_size_name_select}
                </select>
                <input id="users_size_name_${i}_${user}" class="input_border" style="left: 10px; margin-top: 0px; width: 70%" type=text placeholder="..." value="${size[0]}">
                <br>
              </div>
            `
          } else {
            path_list_str += `
              <div class="path_grid">
                <br>
                <p style="margin: 0px 10px; padding-top: 5px; font-weight: normal;">Type</p>
                <select id="users_path_type_${i}_${user}" class="input_border" style="left: 10px; margin-top: 0px; padding: 0px 0px; width: 90%">
                  <option value="path">path</option>
                  <option value="template" selected>template</option>
                </select>
                <br>
                <p style="margin: 0px 10px; padding-top: 5px; font-weight: normal;">Name</p>
                <input id="users_path_name_${i}_${user}" class="input_border" style="margin-top: 0px;width: 90% " type=text placeholder="..." value="${users_JSON[user]['path'][i]['name']}">
                <br>
              </div>
            `
          }

        }

        append_to_ul(
          'userlist',
          `
            <div id="users_${user}" style="height: 30px" class="block_select">
              <div onclick="open_close_user('${user}')" style="cursor: pointer">
                <img class="icon" width="20" height="20" src="static/img/user.svg">
                <p>${user}</p>
                <img align="right" id="users_triangle_${user}" style="margin: 5px 20px; transform: rotate(90deg)" class="icon" width="10" height="10" src="static/img/triangle.svg">
              </div>
              <div id="users_info_${user}" class="user_info" style="display: none">

                <p style="margin: 0px 10px; padding-top: 5px; font-weight: normal;">Name</p><br>
                <input id="users_name_${user}" class="input_border" style="left: 10px; width: 90%; margin-top: 0px;" type=text placeholder="..." value="${user}">

                <p style="margin: 0px 10px; padding-top: 5px; font-weight: normal;">Password</p><br>
                <input id="users_password_${user}" class="input_border" style="left: 10px; width: 90%; margin-top: 0px;" type=text placeholder="..." value="${users_JSON[user]['password']}">
                <br>
                <p style="margin: 0px 10px; padding-top: 5px; font-weight: normal;">Status</p><br>
                <input id="users_status_${user}" class="input_border" style="left: 10px; width: 90%; margin-top: 0px;" type=text placeholder="..." value="${users_JSON[user]['status']}">

                <div style="margin-left: 20px; height: 30px;">
                  <input type="checkbox" class="custom-checkbox" id="users_panel_${user}" name="users_panel_${user}" value="yes" onchange="switch_draw_type('list', this)" ${(users_JSON[user]['panel'])? 'checked': ''}>
                  <label for="users_panel_${user}">
                    <p style="font-weight: normal; margin: 0px 0px;">Panel</p>
                  </label>
                </div>

                <div align="left" class="main_page_button block_select" style="width: 100px; margin: 10px" onclick="()">
                  <img style="margin: 0px 0px" class="icon" width="20" height="20" src="static/img/admin/save.svg">
                  <p style="margin: -15px 35px; font-weight: normal">save</p>
                </div>

                <hr class="main_page_hr">

                <div class="path_list_grid">
                  ${path_list_str}
                </div>

                <br>
              </div>
            </div>
            ${(i-- != 0)? '<hr class="main_page_hr">': ''}
          `
        );
      }
    }
  };
  xhr.send();
}

get_users();
