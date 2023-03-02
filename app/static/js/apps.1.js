const COLOR_WHITE = "D1D5DA";
const COLOR_RED = "D73A49";
const COLOR_ORANGE = "DBAB09";
const COLOR_GREEN = "28A745";

var apps_count = 0;

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
    `<div class="apps_list_element" onclick="main_app_dialog()">
      <img class="icon apps_list_icon" width="20" height="20" src="static/img/${image}">
      <img class="icon apps_list_delete" width="20" height="20" src="static/img/trash.svg">
      <p class="apps_list_name">${name}</p>
      <p class="apps_list_type">${type}</p>
      <p class="apps_list_dot" style="color: #${dot_color}">•</p>
    </div>`
  );

  apps_count++;
  document.getElementById('apps_count').innerHTML = `${apps_count} elements`;
}

function read_apps_list() {
  apps_count = 0;
  for (let i = 0; i < 5; i++)
  append_apps_to_list(0, 'server #' + i, 'server', getRandomInt(1, 3));

  for (let i = 0; i < 5; i++)
  append_apps_to_list(0, 'bash #' + i, 'bash', 3);
}

read_apps_list();

/*----------------------------------------------------------------------------*/

// создание приложения
var apps_dialog_bool = false;
function create_apps_dialog() {
  apps_dialog_bool = true;

  openModal('dialog_bg');
  openModal('dialog_create_apps');
}

function close_create_apps_dialog() {
  apps_dialog_bool = false;

  closeModal('dialog_bg');
  closeModal('dialog_create_apps');
}

// открытие приложения
var main_app_dialog_bool = false;
function main_app_dialog() {
  main_app_dialog_bool = true;

  openModal('dialog_bg');
  openModal('dialog_main_app');
}

function close_main_app_dialog() {
  main_app_dialog_bool = false;

  closeModal('dialog_bg');
  closeModal('dialog_main_app');
}

/*----------------------------------------------------------------------------*/

var selected_app_id = -1;
var apps_buttons = [
  ['bash', 'admin/terminal.svg',
    `<div>
      <p style="position: absolute; top: -5px; left: 5px;">Thread name:</p>
      <input id="app_name_input" class="input_style dialog_input" style="position: absolute; left: 10px; top: 25px; right: 10px; max-width: 260px;" type=text placeholder="name" onkeypress="">

      <p style="position: absolute; top: 60px; left: 5px;">Start path:</p>
      <input id="app_name_input" class="input_style dialog_input" style="position: absolute; left: 10px; top: 90px; right: 10px; max-width: 260px;" type=text placeholder="path" onkeypress="">
    </div>`
  ],
  ['server', 'server.svg',
    `<div>
      <p style="position: absolute; top: -5px; left: 5px;">Thread name:</p>
      <input id="app_name_input" class="input_style dialog_input" style="position: absolute; left: 10px; top: 25px; right: 10px; max-width: 260px;" type=text placeholder="name" onkeypress="">

      <p style="position: absolute; top: 60px; left: 5px;">Path to file:</p>
      <input id="app_name_input" class="input_style dialog_input" style="position: absolute; left: 10px; top: 90px; right: 10px; max-width: 260px;" type=text placeholder="path" onkeypress="">

      <p style="position: absolute; top: 125px; left: 5px;">Aarguments: </p>
      <input id="app_name_input" class="input_style dialog_input" style="position: absolute; left: 10px; top: 155px; right: 10px; max-width: 260px;" type=text placeholder="path" onkeypress="">
    </div>`
  ]
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
  document.getElementById(`apps_main_div`).innerHTML = apps_buttons[id][2];
  selected_app_id = id;
}

append_to_apps_buttons();

/*----------------------------------------------------------------------------*/

// document.getElementById("app_script").innerHTML = "alert(123)"
// document.getElementById("app_script").innerHTML = "console.log(567)"
