
var code_example =
`
hello world
123
`;

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

code_area.value = code_example;
line_counter();
