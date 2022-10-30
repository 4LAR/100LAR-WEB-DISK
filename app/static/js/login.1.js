
//
function close_warning() {
  closeModal('login_warning');
}

//
function login() {
  openModal('loading_login');
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
        closeModal('loading_login');
        openModal('login_warning');


      } else {
        check_login();

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
function check_device() {
  return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}

//
function check_login() {
  xhr = new XMLHttpRequest();
  xhr.open('POST', '/info');
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
