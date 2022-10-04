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

function generate_users() {
  var i = Object.keys(users_JSON).length - 1;
  for (user in users_JSON) {
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
            <p>hello world</p>
          </div>
            
        </div>
        ${(i-- != 0)? '<hr class="main_page_hr">': ''}
      `
    );
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
      
      generate_users();
      
    }
  };
  xhr.send();
}

function set_user_info(name) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/set_user');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {


    }
  };
  xhr.send()

}

get_users();
