
var code_example = `HELLO WORLD`;

function export_file() {
  download(name, editor_for_source_code.getValue());
}

function load_code() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/download?path=${path}&dir=${dir_str}&file=${name}`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  xhr.onload = function () {
    if (xhr.status === 200) {
      editor_for_source_code.setValue(xhr.responseText.toString());
      closeModal('save_state');

    }
  };
  xhr.send();
}

function save() {
  var formData = new FormData;

  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/save?path=${path}&dir=${dir_str}&file=${name}`);
  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  xhr.onload = function () {
    if (xhr.status === 200) {
      if (xhr.responseText.toString() === 'ok') {
        closeModal('save_state');

      }

    }
  };
  //xhr.send(`"code": ${code_area.value}`);
  xhr.send(JSON.stringify({"code": editor_for_source_code.getValue()}))
}

editor_for_source_code.on('change', function(cMirror){
  openModal('save_state');
});

editor_for_source_code.on('cursorActivity', function(cMirror){
  cursor_pos = editor_for_source_code.getCursor();
  document.getElementById('cursor_pos').innerHTML = `${cursor_pos.line + 1}:${cursor_pos.ch}`;
});

//load_code(0, '/', 'log.txt');
load_code();

document.onkeydown = function(e) {
    if (e.ctrlKey && e.shiftKey && e.keyCode === 83) {
        export_file();

        return false;
    } else if (e.ctrlKey && e.keyCode === 83) {
        save();

        return false;
    }
};

function setOption(name_option, selectObject=null, id=null, value=null) {
  if (selectObject === null) {
    editor_for_source_code.setOption(name_option, value);
    selectElement(id, value);
    localStorage.setItem('cm_' + name_option, value);

  } else {
    editor_for_source_code.setOption(name_option, selectObject.value);
    localStorage.setItem('cm_' + name_option, selectObject.value);

  }


}

var lang_dict = {
  'python': ['py'],
  'text/x-csrc': ['c', 'h'],
  'text/x-c++src': ['cpp', 'hpp'],
  'text/x-java': ['class', 'java']
}

function check_lang(file_name) {
  extension_file = file_name.split('.');
  extension_file = extension_file[extension_file.length - 1];
  for (var key in lang_dict) {
    if (lang_dict[key].includes(extension_file)) return key;
  }

  return 'text/plain';
}

selected_lang = check_lang(name);
setOption('mode', null, 'set_mode', selected_lang)

var tabSize = get_localStorage('cm_tabSize', '2');
var theme = get_localStorage('cm_theme', 'default');

setOption('tabSize', null, 'set_tabSize', tabSize)
setOption('theme', null, 'set_theme', theme)

editor_for_source_code.setOption("indentUnit", 1);

var drop_down_menu_list = ['menu_file', 'menu_edit'];
function open_drop_down_menu(id) {
  if (checkModal(id)) {
    close_all_drop_down_menu();
    closeModal(id);
  } else {
    close_all_drop_down_menu();

    openModal(id);
    openModal('background_black_editor');
  }
}

function close_all_drop_down_menu() {
  for (let i = 0; i < drop_down_menu_list.length; i++) {
    closeModal(drop_down_menu_list[i]);
  }
  closeModal('background_black_editor');

}
