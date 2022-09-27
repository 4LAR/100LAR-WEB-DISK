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
              <p>type: ${users_JSON[user]['path'][i]['type']}</p><br>
              <p>name: ${users_JSON[user]['path'][i]['name']}</p><br>
              <p>path: ${users_JSON[user]['path'][i]['path']}</p><br>
              <p>size: ${users_JSON[user]['path'][i]['size']}</p><br>
            `
          } else {
            path_list_str += `
              <br>
              <p>type: ${users_JSON[user]['path'][i]['type']}</p><br>
              <p>name: ${users_JSON[user]['path'][i]['name']}</p><br>
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
                <br>
                <p>STATUS: ${users_JSON[user]['status']}</p><br>
                <p>PASSWORD: ${users_JSON[user]['password']}</p><br>
                <p>PANEL: ${users_JSON[user]['panel']}</p><br>

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
