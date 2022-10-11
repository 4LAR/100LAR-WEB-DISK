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
    if (modal.style.display == "block")
      return true;
    else
      return false;

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
  return Math.pow(size, name_i);
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
