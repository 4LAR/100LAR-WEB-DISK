
//
var open_close_user_bool = false;
function open_close_user_button() {
  open_close_user_bool = !open_close_user_bool;
  document.getElementById("background_black").style.display = (open_close_user_bool)? "block": "none";
  document.getElementById("leftBar_user").style.display = (open_close_user_bool)? "block": "none";
  document.getElementById("user_button_triangle").style.transform = (open_close_user_bool)? "rotate(180deg)": "rotate(0deg)";

}

//
function logout() {
  xhr = new XMLHttpRequest();
  xhr.open('POST', '/logout');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      window.location.href = '/';
    }
  };
  xhr.send()
}
