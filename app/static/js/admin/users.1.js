var users_JSON = {};

function get_users() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/get_users`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      users_JSON = JSON.parse(xhr.responseText.toString());
      console.log(users_JSON);
      for (user in users_JSON) {
        append_to_ul(
          'userlist',
          `
            <div style="height: 30px;">
              <img class="icon" width="20" height="20" src="static/img/user.svg">
              <p>${user}</p>
            </div>
            <hr class="main_page_hr">
          `
        );
      }
    }
  };
  xhr.send();
}

get_users();