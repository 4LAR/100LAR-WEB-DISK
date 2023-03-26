
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
