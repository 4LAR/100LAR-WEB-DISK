var settings_json = {};

function sort_params(parameters_dict) {

}

// вывод настроек на панель
function generate_settingslist() {
  var left = true;

  document.getElementById("settings_left").innerHTML = '';
  document.getElementById("settings_right").innerHTML = '';

  for (section in settings_json) {

    append_to_ul(
      'settings_' + ((left)? 'left': 'right'),
      `
        <div class="border sub_border_size" align="left">
          <p style="margin: 10px 50px; color: #8B949E; font-weight: normal; white-space: nowrap;">${section}</p>
          <hr class="main_page_hr">
          <ul id="settings_${section}"></ul>
        </div>
        <br>
      `
    );

    section_ul = 'settings_' + section;

    for (parameter in settings_json[section]) {
      name_parametr = parameter + '-' + section;
      if (typeof(settings_json[section][parameter]) === "boolean") {
        checked = (settings_json[section][parameter])? 'checked': '';
        append_to_ul(section_ul, `
          <div style="margin: -10px 10px; height: 50px;">
            <input type="checkbox" class="custom-checkbox" id="${name_parametr}" name="${name_parametr}" value="yes" onchange="switch_draw_type('list', this)" ${checked}>
            <label for="${name_parametr}">
              <p style="font-weight: normal;">${parameter}</p>
            </label>
          </div>

        `);
      } else if (typeof(settings_json[section][parameter]) === "string" || typeof(settings_json[section][parameter]) === "number") {
        append_to_ul(section_ul, `
        <p style="margin: 0px 10px; padding-top: 5px; font-weight: normal;">${parameter}</p>
        <input id="${name_parametr}" class="input_border" style="left: 10px; width: 90%; margin-top: 0px;" type=text placeholder="..." value="${settings_json[section][parameter]}">

        `)
      }
    }

    left = !left;
  }
}

// чтение настроек с панели
function save_settings() {
  for (section in settings_json) {
    section_ul = 'settings_' + section;
    for (parameter in settings_json[section]) {
      name_parametr = parameter + '-' + section;
      value = document.getElementById(name_parametr);
      if (typeof(settings_json[section][parameter]) === "boolean") {
        //console.log(value.checked);
        send_settings(section, parameter, value.checked);
      } else {
        //console.log(value.value);
        send_settings(section, parameter, value.value);
      }

    }
  }

}

// отправка настроек на сервер
function send_settings(section, parameter, value) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/settings_set?section=${section}&parameter=${parameter}&state=${value}`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {

    }
  };
  xhr.send();
}

// перезапуск сервера
function reboot_script() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/reboot');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log('reboot ok');
    }
  };
  xhr.send();

}

// выключение сервера
function shutdown_script() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/shutdown');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send();

}

function open_alert_reboot_script() {
  open_alert(`
    <h3 style="margin: 50px 10px;" align="center">Do you really want to restart the server now?</h3>
    <p style="margin: -50px 10px;" align="center">This may take some time</p>

    <div class="main_page_button" style="position: absolute; width: 100px; bottom: 10px; left: 10px;" onclick="reboot_script(); close_alert()">
      <img style="margin: 5px 5px" class="icon" width="20" height="20" src="static/img/refresh.svg">
      <p style="margin: -25px 35px">reboot</p>
    </div>
  `, 150);
}
