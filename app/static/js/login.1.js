
//
function login() {
  var username = document.getElementById("login_input").value;
  var password = document.getElementById("password_input").value;

  xhr = new XMLHttpRequest();
  xhr.open('POST', `/login?username=${username}&password=${password}`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status !== 200) {
      console.warn(xhr.responseText);
    } else {
      if (xhr.responseText.toString() == 'ERROR LOGIN'){
        console.log('ERROR LOGIN');

      } else {
        window.location.href = '/main';

      }
    }
  };
  xhr.send(encodeURI());
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
  xhr.open('POST', '/info');
  xhr.onload = function () {
    if (xhr.status === 200 && xhr.responseText.toString() != 'ERROR LOGIN') {
      window.location.href = '/main';
    }
  };
  xhr.send();
}

check_login();
