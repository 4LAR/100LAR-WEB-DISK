
//
function close_warning() {
  closeModal('login_warning');
}

//
function login() {
  openModal('loading_login');
  closeModal('login_warning');
  var username = document.getElementById("login_input").value;
  var password = document.getElementById("password_input").value;
  var remember = document.getElementById("remember_chekcbox").checked;

  var details = {
    username: username,
    password: password
  };

  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  fetch(`/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
    body: formBody
  })
  .then(response => response.json())
  .then(data => {
    if (data == 'ERROR LOGIN'){
      console.log('ERROR LOGIN');
      closeModal('loading_login');
      openModal('login_warning');

    } else {
      check_login();

    }
  })
  .catch(error => {
    console.error("Произошла ошибка:", error);
  });
}

//
function login_enter(e) {
  if (e.keyCode == 13) {
    login();
    return false;
  }
}

//
function check_login() {
  xhr = new XMLHttpRequest();
  xhr.open('GET', '/info');
  xhr.onload = function () {
    if (xhr.status === 200 && xhr.responseText.toString() != 'ERROR LOGIN') {
      if (check_device()) {
        window.location.href = '/m-main';
      } else {
        window.location.href = '/main';
      }

    }
  };
  xhr.send();
}

check_login();
