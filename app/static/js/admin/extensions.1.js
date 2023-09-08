
var apps_JSON = {};

function get_apps() {
  clear_ul('appslist');
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/get_all_apps`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      apps_JSON = JSON.parse(xhr.responseText.toString())["apps"];

      for (app_name in apps_JSON) {
        append_to_apps(apps_JSON[app_name]);
      }

    }
  };
  xhr.send();
}

get_apps();

function append_to_apps(app_json) {
  var settings = "";
  for (el in app_json['config']) {
    if (el !== "use" && el !== "status_required")
      switch (typeof(app_json['config'][el])) {
        case ("boolean"):
          checked = (app_json['config'][el])? 'checked': '';
          settings += `<div style="margin-top: 0; margin-bottom: -20px; margin-left: 10px; height: 50px;">
            <input type="checkbox" class="custom-checkbox" id="appsettings_${app_json['name']}_${el}" name="appsettings_${app_json['name']}_${el}" value="yes" ${checked}>
            <label for="appsettings_${app_json['name']}_${el}">
              <p style="font-weight: normal; margin-left: 0px;">${el}</p>
            </label>
          </div>`
          break;
        default:
          settings += `
            <p style="margin: 0px 10px; padding-top: 5px; font-weight: normal;">${el}</p>
            <input id="appsettings_${app_json['name']}_${el}" class="input_border" style="left: 10px; width: calc(100% - 20px); margin-top: 0px;" type=text placeholder="..." value="${app_json['config'][el]}">
          `
      }
  }
  checked = (app_json['config']['use'])? 'checked': '';
  append_to_ul(
    'appslist',
    `
      <div class="template_border sub_border_size">
        <div class="main_page_button block_select" style="width: 100px; margin: 10px; display: inline-block;" onclick="reverse_checkBox('appsettings_${app_json['name']}_use')">
          <div style="margin-top: 5; margin-bottom: -20px; margin-left: 10px; height: 50px;">
            <input type="checkbox" class="custom-checkbox" id="appsettings_${app_json['name']}_use" name="appsettings_${app_json['name']}_use" value="yes" ${checked}>
            <label for="appsettings_${app_json['name']}_use">
              <p style="font-weight: normal; margin-left: 0px;">use</p>
            </label>
          </div>
        </div>

        <img class="icon" width="28" height="28" style="position: absolute; margin: 12px 4px;" src="data:image/svg+xml;base64,${app_json['ico']} ">
        <p style="position: absolute; margin: 14px 50px; color: #8B949E; font-weight: normal; white-space: nowrap;">${app_json['name']}</p>
        <hr class="main_page_hr">
        <p style="margin: 0px 10px; padding-top: 5px; font-weight: normal;">status_required</p>
        <input id="appsettings_${app_json['name']}_status_required" class="input_border" style="left: 10px; width: calc(100% - 20px); margin-top: 0px;" type=text placeholder="..." value="${app_json['config']['status_required']}">
        ${(settings.length > 0)? `<hr class="main_page_hr">`: ``}

        ${settings}
      </div>
    `
  )
}

function save_all_apps_settings() {
  var config = {};
  var current_app = {};
  for (app_name in apps_JSON) {
    current_app = apps_JSON[app_name];
    config = {};
    for (el in current_app['config']) {
        switch (typeof(current_app['config'][el])) {
          case ("boolean"):
            config[el] = document.getElementById(`appsettings_${app_name}_${el}`).checked;
            break;
          default:
            config[el] = document.getElementById(`appsettings_${app_name}_${el}`).value;
        }
    }
    save_app_settings(app_name, config)
  }
}

function save_app_settings(app_name, app_config) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/app_set_config?app_id=${app_name}&config=${JSON.stringify({"config": app_config})}`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {

    }
  };
  xhr.send();
}

function reload_apps() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/reload_apps`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {

    }
  };
  xhr.send();
}
