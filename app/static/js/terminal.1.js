

function append_terminal_to_list(id, name, type, status) {
  append_to_ul(
    'terminal_list',
    `<div class="terminal_list_element">
      <p>${name}</p>
    </div>`
  );
}

append_terminal_to_list(0, 'test', '', '');
append_terminal_to_list(0, 'test', '', '');
append_terminal_to_list(0, 'test', '', '');
append_terminal_to_list(0, 'test', '', '');
append_terminal_to_list(0, 'test', '', '');
