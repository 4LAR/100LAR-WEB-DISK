
//
var open_close_user_bool = false;
function open_close_user_button(close_bool=false) {
  if (mobile)
    return

  if (!close_bool) {
    open_close_path_button(true);
    open_close_user_bool = !open_close_user_bool;
  } else open_close_user_bool = false;

  document.getElementById("background_black").style.display = (open_close_user_bool)? "block": "none";
  document.getElementById("leftBar_user").style.display = (open_close_user_bool)? "block": "none";
  document.getElementById("user_button_triangle").style.transform = (open_close_user_bool)? "rotate(180deg)": "rotate(0deg)";

  // document.getElementById(selected_file_name).classList.remove('file_selected');
  // document.getElementById(name).classList.add('file_selected');
  if (currentTheme === 'light') {
    if (open_close_user_bool) {
      document.getElementById("user_avatar").classList.replace("icon_topBar", "icon");
      document.getElementById("user_name").classList.remove("top_bar_font_color");
      document.getElementById("user_button_triangle").classList.replace("icon_topBar", "icon");
    } else {
      document.getElementById("user_avatar").classList.replace("icon", "icon_topBar");
      document.getElementById("user_name").classList.add("top_bar_font_color");
      document.getElementById("user_button_triangle").classList.replace("icon", "icon_topBar");
    }
  }

  document.getElementById("user_button").classList.replace(
    (open_close_user_bool)? "user_button_no_selected_color": "user_button_selected_color",
    (open_close_user_bool)? "user_button_selected_color": "user_button_no_selected_color"
  );

}

//
var open_close_path_bool = false;
function open_close_path_button(close_bool=false) {
  if (!close_bool) {
    if (!mobile) open_close_user_button(true);
    open_close_path_bool = !open_close_path_bool;
  } else open_close_path_bool = false;
  document.getElementById("background_black").style.display = (open_close_path_bool)? "block": "none";
  document.getElementById("path_select_list_div").style.display = (open_close_path_bool)? "block": "none";
  document.getElementById("path_select_button_triangle").style.transform = (open_close_path_bool)? "rotate(180deg)": "rotate(0deg)";

  if (currentTheme === 'light') {
    if (open_close_path_bool) {
      document.getElementById("disk_image").classList.replace("icon_topBar", "icon");
      document.getElementById("path_name").classList.remove("top_bar_font_color");
      document.getElementById("path_select_button_triangle").classList.replace("icon_topBar", "icon");
    } else {
      document.getElementById("disk_image").classList.replace("icon", "icon_topBar");
      document.getElementById("path_name").classList.add("top_bar_font_color");
      document.getElementById("path_select_button_triangle").classList.replace("icon", "icon_topBar");
    }
  }

  document.getElementById("path_select_button").classList.replace(
    (open_close_path_bool)? "path_select_button_no_selected_color": "path_select_button_selected_color",
    (open_close_path_bool)? "path_select_button_selected_color": "path_select_button_no_selected_color"
  );

}

//
function close_user() {
  open_close_user_button(true);
  open_close_path_button(true);
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

// диалог на изменение логина
var change_login_bool = false;
function change_login_dialog() {
  change_login_bool = true;

  document.getElementById(`new_login_input`).value = info_json['name'];
  document.getElementById(`new_login_input`).classList.replace('app_input_error', 'app_input_ok');

  openModal('dialog_bg');
  openModal('dialog_change_login');
}

function close_change_login_dialog() {
  change_login_bool = false;

  closeModal('dialog_bg');
  closeModal('dialog_change_login');
}

// диалог на изменение пароля
var change_password_bool = false;
function change_password_dialog() {
  change_password_bool = true;

  document.getElementById(`old_pass_div`).classList.replace('app_input_error', 'app_input_ok');
  document.getElementById(`new_pass_div`).classList.replace('app_input_error', 'app_input_ok');
  document.getElementById(`new_pass_repeat_div`).classList.replace('app_input_error', 'app_input_ok');

  openModal('dialog_bg');
  openModal('dialog_change_password');
}

function close_change_password_dialog() {
  change_password_bool = false;

  closeModal('dialog_bg');
  closeModal('dialog_change_password');
}

//
function change_login() {
  var name_input = document.getElementById("new_login_input");
  xhr = new XMLHttpRequest();
  xhr.open('POST', `/change_login?name=${name_input.value}`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      if (xhr.responseText.toString() === 'ERROR LOGIN') {
        document.getElementById(`new_login_input`).classList.replace('app_input_ok', 'app_input_error');
      } else {
        get_info();
        close_change_login_dialog();
      }
    }
  };
  xhr.send()
}

//
function change_password() {
  var old_pass = document.getElementById("old_pass_input");
  var new_pass = document.getElementById("new_pass_input");
  var new_pass_repeat = document.getElementById("new_pass_repeat_input");

  document.getElementById(`old_pass_div`).classList.replace('app_input_error', 'app_input_ok');
  document.getElementById(`new_pass_div`).classList.replace('app_input_error', 'app_input_ok');
  document.getElementById(`new_pass_repeat_div`).classList.replace('app_input_error', 'app_input_ok');

  if (new_pass.value !== new_pass_repeat.value) {
    document.getElementById(`new_pass_repeat_div`).classList.replace('app_input_ok', 'app_input_error');
    return
  }

  xhr = new XMLHttpRequest();
  xhr.open('POST', `/change_password?old=${old_pass.value}&new=${new_pass.value}`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      if (xhr.responseText.toString() === 'ERROR PASSWD') {
        document.getElementById(`old_pass_div`).classList.replace('app_input_ok', 'app_input_error');
      } else if (xhr.responseText.toString() === 'ERROR PASSWD LENGTH') {
        document.getElementById(`new_pass_div`).classList.replace('app_input_ok', 'app_input_error');
      } else {
        logout();
      }
    }
  };
  xhr.send()
}
