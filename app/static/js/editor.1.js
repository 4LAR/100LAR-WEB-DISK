
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

editor_for_source_code.on('change',function(cMirror){
  openModal('save_state');
});

//load_code(0, '/', 'log.txt');
load_code();

document.onkeydown = function(e) {
    if (e.ctrlKey && e.keyCode === 83) {
        save();

        return false;
    }
};