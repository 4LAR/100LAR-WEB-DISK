const COLOR_WHITE = "D1D5DA";
const COLOR_RED = "D73A49";
const COLOR_ORANGE = "DBAB09";
const COLOR_GREEN = "28A745";

function append_apps_to_list(id, name, type, status) {
  var dot_color = "";
  var image = ""
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

  switch (type) {
    case ("bash"):
      image = "admin/terminal.svg";
      break;
    case ("server"):
      image = "server.svg";
      break;
  }

  append_to_ul(
    'apps_list',
    `<div class="apps_list_element">
      <img class="icon apps_list_icon" width="20" height="20" src="static/img/${image}">
      <img class="icon apps_list_delete" width="20" height="20" src="static/img/trash.svg">
      <p class="apps_list_name">${name}</p>
      <p class="apps_list_type">${type}</p>
      <p class="apps_list_dot" style="color: #${dot_color}">•</p>
    </div>`
  );
}

for (let i = 0; i < 5; i++)
  append_apps_to_list(0, 'server #' + i, 'server', getRandomInt(1, 3));

for (let i = 0; i < 5; i++)
  append_apps_to_list(0, 'apps #' + i, 'bash', 3);

/*----------------------------------------------------------------------------*/

var apps_dialog_bool = false;
function create_apps_dialog() {
  no_place_file_bool = true;

  openModal('dialog_bg');
  openModal('dialog_create_apps');
}

function close_create_apps_dialog() {
  apps_dialog_bool = false;

  closeModal('dialog_bg');
  closeModal('dialog_create_apps');
}

/*----------------------------------------------------------------------------*/

var selected_app_id = -1;
var apps_buttons = [
  ['bash', 'admin/terminal.svg'],
  ['server', 'server.svg']
];

function append_to_apps_buttons() {
  for (let i = 0; i < apps_buttons.length; i++) {
    append_to_ul(
      'apps_buttons',
      `<div id="app_button_${i}" class="app_button round_button block_select button_margin" onclick="select_app_button(${i})">
        <img class="icon" width="20" height="20" src="static/img/${apps_buttons[i][1]}">
        <p>${apps_buttons[i][0]}</p>
      </div>`
    )
  }
  select_app_button(0);
}

function select_app_button(id) {
  if (selected_app_id != -1)
    document.getElementById(`app_button_${selected_app_id}`).classList.replace('app_button_selected', 'app_button');

  document.getElementById(`app_button_${id}`).classList.replace('app_button', 'app_button_selected');
  selected_app_id = id;
}

append_to_apps_buttons();
