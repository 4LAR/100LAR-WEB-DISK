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
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/get_users`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      users_JSON = JSON.parse(xhr.responseText.toString());
      console.log(users_JSON);

      var i = Object.keys(users_JSON).length - 1;
      for (user in users_JSON) {
        var path_list_str = '';
        for (let i = 0; i < users_JSON[user]['path'].length; i++) {
          if (users_JSON[user]['path'][i]['type'] == 'path') {
            path_list_str += `
              <br>
              <p style="margin: 0px 10px; padding-top: 5px; font-weight: normal;">Type</p>
              <input id="users_path_${i}_${user}_type" class="input_border" style="margin-top: 0px;" type=text placeholder="..." value="${users_JSON[user]['path'][i]['type']}">
              <br>
              <p style="margin: 0px 10px; padding-top: 5px; font-weight: normal;">Name</p>
              <input id="users_name_${user}" class="input_border" style="margin-top: 0px;" type=text placeholder="..." value="${users_JSON[user]['path'][i]['name']}">
              <br>
              <p style="margin: 0px 10px; padding-top: 5px; font-weight: normal;">Path</p>
              <input id="users_name_${user}" class="input_border" style="margin-top: 0px;" type=text placeholder="..." value="${users_JSON[user]['path'][i]['path']}">
              <br>
              <p style="margin: 0px 10px; padding-top: 5px; font-weight: normal;">Size</p>
              <input id="users_name_${user}" class="input_border" style="margin-top: 0px;" type=text placeholder="..." value="${users_JSON[user]['path'][i]['size']}">
              <br>
            `
          } else {
            path_list_str += `
              <br>
              <p style="margin: 0px 10px; padding-top: 5px; font-weight: normal;">Type</p>
              <input id="users_path_${i}_${user}_type" class="input_border" style="margin-top: 0px;" type=text placeholder="..." value="${users_JSON[user]['path'][i]['type']}">
              <br>
              <p style="margin: 0px 10px; padding-top: 5px; font-weight: normal;">Name</p>
              <input id="users_name_${user}" class="input_border" style="margin-top: 0px;" type=text placeholder="..." value="${users_JSON[user]['path'][i]['name']}">
              <br>
            `
          }

        }
        console.log(i);
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
                <hr class="main_page_hr">

                ${path_list_str}
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
