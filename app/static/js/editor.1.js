
var code_example = `HELLO WORLD`;

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
    if (e.ctrlKey && e.keyCode === 83) {
        save();

        return false;
    }
};

function set_mode(selectObject) {
  editor_for_source_code.setOption("mode", selectObject.value);
}

function set_theme(selectObject) {
  console.log(selectObject.options[selectObject.selectedIndex].text);
  // editor_for_source_code.setOption("theme", selectObject.options[selectObject.selectedIndex].text);
  editor_for_source_code.setOption("theme", '3024-night');
}
