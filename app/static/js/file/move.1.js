
// переход в домашнюю директорию
function go_home() {
  if (dir.length > 0) {
    back_dir_history.push(dir.slice())
    forward_dir_history = [];
    dir = [];
    update_dir();
  }
}

// переход к предыдущей директории по истории
function go_back_dir_history() {
  if (back_dir_history.length > 0) {
    forward_dir_history.push(dir.slice());
    dir = back_dir_history.pop();
    update_dir();
  }
}

// переход к следующей директории по истории
function go_forward_dir_history() {
  if (forward_dir_history.length > 0) {
    back_dir_history.push(dir.slice());
    dir = forward_dir_history.pop();
    update_dir();
  }
}

// переход в выбранную директорию
function forward_dir(name) {
  if (list_checked_file.length > 0) {
    var fileCheckBox = document.getElementById("checkbox_file_" + name);
    fileCheckBox.checked = !fileCheckBox.checked;
    checkBox_file(
      {'checked':   fileCheckBox.checked},
      name,
      'dir'
    );
    return;
  }

  forward_dir_history = [];
  back_dir_history.push(dir.slice());
  dir.push(name);
  update_dir();
}


// переход к предыдущей директории
function back_dir() {
  forward_dir_history = [];
  back_dir_history.push(dir.slice());
  dir.pop();
  update_dir();
}


// обновление кнопок передвижения и пути
function update_dir(onload_function=undefined) {
  dir_str = '';
  // генерируем строку из пути (массива)
  for (let i = 0; i < dir.length; i++)
    if (i < dir.length - 1) {
      dir_str += dir[i] + '/';
    } else {
      dir_str += dir[i];
    }

  // изменение цвета кнопки (назад)
  if (!mobile)
    if (back_dir_history.length <= 0) {
      document.getElementById("go_back").style.filter = "invert(30%)";
    } else {
      document.getElementById("go_back").style.filter = "invert(60%)";
    }

  // изменение цвета кнопки (вперёд)
  if (!mobile)
    if (forward_dir_history.length <= 0) {
      document.getElementById("go_forward").style.filter = "invert(30%)";
    } else {
      document.getElementById("go_forward").style.filter = "invert(60%)";
    }

  // получаем информацию о пользователе
  get_info();

  // и после список файлов
  get_files(onload_function);

  // прописываем путь
  document.getElementById("path").value = '/' + dir_str;
  undo_files_checkBox();
}
