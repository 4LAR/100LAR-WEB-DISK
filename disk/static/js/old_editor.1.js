
var code_example =
`
hello world
123
`;

function load_code() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/download?path=${path}&dir=${dir_str}&file=${name}`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  xhr.onload = function () {
    if (xhr.status === 200) {
      code_area.value = xhr.responseText.toString();
      line_counter();
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
        load_code();
      }

    }
  };
  //xhr.send(`"code": ${code_area.value}`);
  xhr.send(JSON.stringify({"code": code_area.value}))
}

var code_area = document.getElementById('code_area');
var lines_area = document.getElementById('lines_area');

var lineCountCache = 0;

function line_counter() {
      var lineCount = code_area.value.split('\n').length;
      var outarr = new Array();
      if (lineCountCache != lineCount) {
          for (var x = 0; x < lineCount; x++) {
              outarr[x] = (x + 1) + '.';
          }
          lines_area.value = outarr.join('\n');
      }
      lineCountCache = lineCount;
}

code_area.addEventListener('scroll', () => {
  lines_area.scrollTop = code_area.scrollTop;
  lines_area.scrollLeft = code_area.scrollLeft;
});

code_area.addEventListener('input', () => {
  openModal('save_state');
  line_counter();
});

code_area.addEventListener('keydown', (e) => {
  let { keyCode } = e;
  let { value, selectionStart, selectionEnd } = code_area;

  if (keyCode === 9) {  // TAB = 9
    e.preventDefault();
    code_area.value = value.slice(0, selectionStart) + '\t' + value.slice(selectionEnd);
    code_area.setSelectionRange(selectionStart+2, selectionStart+1)
  }
});

//load_code(0, '/', 'log.txt');
load_code();

document.onkeydown = function(e) {
    if (e.ctrlKey && e.keyCode === 83) {
        save();

        return false;
    }
};
