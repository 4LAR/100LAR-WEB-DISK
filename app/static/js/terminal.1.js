const COLOR_WHITE = "D1D5DA";
const COLOR_RED = "D73A49";
const COLOR_ORANGE = "DBAB09";
const COLOR_GREEN = "28A745";

function append_terminal_to_list(id, name, type, status) {
  var dot_color = "";
  switch (status) {
    case (0):
    break;

    case (1):
    dot_color = COLOR_RED;
    break;

    case (2):
    dot_color = COLOR_ORANGE;
    break;

    case (3):
    dot_color = COLOR_GREEN;
    break;
  }
  append_to_ul(
    'terminal_list',
    `<div class="terminal_list_element">
      <img class="icon terminal_list_icon" width="20" height="20" src="static/img/admin/terminal.svg">
      <img class="icon terminal_list_delete" width="20" height="20" src="static/img/trash.svg">
      <p class="terminal_list_name">${name}</p>
      <p class="terminal_list_type">${type}</p>
      <p class="terminal_list_dot" style="color: #${dot_color}">•</p>
    </div>`
  );
}

for (let i = 0; i < 30; i++)
  append_terminal_to_list(0, 'test', 'bash', 3);
