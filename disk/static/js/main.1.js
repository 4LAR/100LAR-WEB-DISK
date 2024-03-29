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

// проверка на показ элемента
function checkModal(modalId) {
  try {
    var modal = document.getElementById(modalId);
    return (modal.style.display == "block")

  } catch {
    return false;
  }
}

// открыть новую вкладку
function openInNewTab(url) {
  window.open(url, '_blank').focus();
}

// добавить элемент в список (ul)
function append_to_ul(id, content) {
  var ul = document.getElementById(id);

  var li = document.createElement("li");

  li.innerHTML = content;

  ul.appendChild(li);
}

// очистить список (ul)
function clear_ul(id) {
  document.getElementById(id).innerHTML = '';
}

// вычисление логарифма
function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}

var size_name = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

function get_size_index_by_name(name) {
  for (let i = 0; i < size_name.length; i++) {
    if (name === size_name[i]) return i;
  }
  return -1;
}

// конвертирование байтов в [size_name]
function convert_size(size_bytes, name_bool=false) {
  if (size_bytes == 0)
    if (name_bool)
      return [0, 'B', 0]
    else
      return '0 B';

  i = Math.floor(getBaseLog(1024, size_bytes)); // индекс названия
  p = Math.pow(1024, i);
  s = Math.round((size_bytes / p) * 100) / 100; // размер

  if (name_bool)
    return [s, size_name[i], i]
  else
    return s + ' ' + size_name[i]
}

// конвертирование [size_name] в байты
function convert_size_to_b(size, name_i = 0) {
  return Math.pow(1024, name_i) * size;
}

// установка размера прогресса в зависимости от размера
function set_progressbar(name, state = 0, count=1) {
  if (count > 1) {
    for (let i = 0; i < count; i++) {
      document.getElementById(name + "_" + i).style.width = (document.getElementById(name + "_div").offsetWidth/100) * state[i];
    }

  } else {
    document.getElementById(name).style.width = (document.getElementById(name + "_div").offsetWidth/100) * state;

  }
}

//
function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

//
function selectElement(id, valueToSelect) {
    let element = document.getElementById(id);
    element.value = valueToSelect;
}

//
function get_localStorage(key, default_return=null) {
  if (localStorage.getItem(key) != null)
    return localStorage.getItem(key);

  else
    return default_return;
}

//
function check_device() {
  return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}

//
function open_git_releases() {
  openInNewTab('https://github.com/4LAR/100LAR-WEB-DISK/releases');
}

//
function seconds_to_hms(seconds) {
  var date = new Date(null);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
}

//
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max + 1);
  return Math.floor(Math.random() * (max - min)) + min;
}

//
function debounce(func, wait_ms) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait_ms);
  };
}

//
function compare_str(str1, str2) {
  return (str1 === str2.slice(0, str1.length));
}

//
function str_to_bool(str) {
  return (String(str).toLowerCase() === 'true');
}

//
function reverse_checkBox(id) {
  document.getElementById(id).checked = !document.getElementById(id).checked;
}

// hh:mm::ss DD::MM:YYYY
function string_to_date(date_str) {
  var arr = date_str.split(" ");
  var time = arr[0].split(":");
  var date = arr[1].split("-");
  // (year, month, date, hours, minutes, seconds, ms)
  return new Date(date[2], date[1], date[0], time[0], time[1], time[2]);
}

//
function scroll_to_bottom(id) {
  var objDiv = document.getElementById(id);
  objDiv.scrollTop = objDiv.scrollHeight;
}

//
function scroll_to_top(id) {
  var objDiv = document.getElementById(id);
  objDiv.scrollTop = 0;
}
