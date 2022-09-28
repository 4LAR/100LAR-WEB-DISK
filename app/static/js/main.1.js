const space_bar_width = 200;

const path_map_left = 10;

// функция для скрытия эелемента
function closeModal(modalId) {
  try {
    var modal = document.getElementById(modalId);
    modal.style.display = "none";
  } catch {
  }
}

// функция для показа эелемента (если элемент скрыт)
function openModal(modalId) {
  try {
    var modal = document.getElementById(modalId);
    modal.style.display = "block";
  } catch {
  }
}

//
function checkModal(modalId) {
  try {
    var modal = document.getElementById(modalId);
    if (modal.style.display == "block")
      return true;
    else
      return false;

  } catch {
    return false;
  }
}

//
function openInNewTab(url) {
  window.open(url, '_blank').focus();
}

//
function append_to_ul(id, content) {
  var ul = document.getElementById(id);

  var li = document.createElement("li");

  li.innerHTML = content;

  ul.appendChild(li);
}

function clear_ul(id) {
  document.getElementById(id).innerHTML = '';
}

//
function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}

var size_name = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

//
function convert_size(size_bytes, name_bool=false) {
  if (size_bytes == 0)
    if (name_bool)
      return [0, 'B', 0]
    else
      return '0 B';

  i = Math.floor(getBaseLog(1024, size_bytes));
  p = Math.pow(1024, i);
  s = Math.round((size_bytes / p) * 100) / 100;

  if (name_bool)
    return [s, size_name[i], i]
  else
    return s + ' ' + size_name[i]
}

//
function set_progressbar(name, state = 0, count=1) {
  if (count > 1) {
    for (let i = 0; i < count; i++) {
      document.getElementById(name + "_" + i).style.width = (document.getElementById(name + "_div").offsetWidth/100) * state[i];
    }

  } else {
    document.getElementById(name).style.width = (document.getElementById(name + "_div").offsetWidth/100) * state;

  }
}
