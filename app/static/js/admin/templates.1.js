
function get_templates() {
  clear_ul('templateslist');
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/get_templates`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      templates_JSON = JSON.parse(xhr.responseText.toString());
      generate_templates();


    }
  };
  xhr.send();
}

get_templates();

function generate_templates() {
  clear_ul('templateslist');

  var sizes;
  var converted_size;
  var template;
  for (name in templates_JSON) {
    template = templates_JSON[name];
    converted_size = convert_size(template['size'], true)
    sizes = '';
    for (size of size_name) {
      sizes += `<option value="${size}" ${(size == converted_size[1])? 'selected': ''}>${size}</option>`
    }
    append_to_ul(
      'templateslist',
      `
        <div class="path_list_grid template_border">
          <div class="main_page_button block_select" style="width: 100px; margin: 10px; display: inline-block;" onclick="open_alert_delete_template('${name}')">
            <img style="margin: 5px 5px" class="icon" width="20" height="20" src="static/img/trash.svg">
            <p style="margin: -25px 35px; font-weight: normal;">delete</p>
          </div>
          <p style="margin: 10px 50px; color: #8B949E; font-weight: normal; white-space: nowrap;">${name}</p>
          <hr class="main_page_hr">
          <p style="font-size: 14; font-weight: normal">Name</p><br>
          <input id="template_${name}_name" type=text class="input_border" value="${name}" style="margin: 2px 15px; width: 90%"><br>
          <p style="font-size: 14">Path</p><br>
          <input id="template_${name}_path" type=text class="input_border" value="${template['path']}" style="margin-left: 14px; margin-top: 0px; width: 90%"><br>

          <p style="font-size: 14">Size</p><br>
          <select id="template_${name}_size_type" class='input_border' style='padding: 0; margin: 2px 15px; width: 50px'>
            ${sizes}
          </select>
          <input id="template_${name}_size" type=text class="input_border" value="${converted_size[0]}" style="margin-left: -13px; margin-top: -3px; width: 40%"><br>

          <div class="main_page_button block_select save_template" style="width: 100px" onclick="set_template('${name}')">
            <img style="margin: 5px 5px" class="icon" width="20" height="20" src="static/img/admin/save.svg">
            <p style="margin: -25px 35px; font-weight: normal;">save</p>
          </div>
          <div style="margin: 5px 16px; height: 30px;">
            <input type="checkbox" class="custom-checkbox" id="template_${name}_readonly" name="template_${name}_readonly" ${(template['readonly'])? 'checked': ''}>
            <label for="template_${name}_readonly">
              <p style="font-weight: normal; margin: 0px 0px">read only</p>
            </label>
          </div>
        </div>
      `
    )
  }
}

function set_template(name) {
  var new_template_JSON = {};
  new_template_JSON['name'] = document.getElementById(`template_${name}_name`).value;
  new_template_JSON['path'] = document.getElementById(`template_${name}_path`).value;
  new_template_JSON['readonly'] = document.getElementById(`template_${name}_readonly`).checked;
  var size_type = document.getElementById(`template_${name}_size_type`).value;
  var size = document.getElementById(`template_${name}_size`).value;

  new_template_JSON['size'] = convert_size_to_b(parseInt(size), get_size_index_by_name(size_type));

  delete_template(name);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/set_template?json=${JSON.stringify(new_template_JSON)}&reload=true`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      get_templates();

    }
  };
  xhr.send()
}

function delete_template(name) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/delete_template?name=${name}&reload=true`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      get_templates();

    }
  };
  xhr.send()
}

function add_new_template() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/create_template?reload=true`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      get_templates();

    }
  };
  xhr.send()
}

function open_alert_delete_template(name) {
  open_alert(`
    <h3 style="margin: 50px 10px;" align="center">Are you sure you want to remove the path pattern?</h3>
    <p style="margin: -50px 10px;" align="center">"${name}"</p>

    <div class="main_page_button" style="position: absolute; width: 100px; bottom: 10px; left: 10px;" onclick="delete_template('${name}'); close_alert()">
      <img style="margin: 5px 5px" class="icon" width="20" height="20" src="static/img/trash.svg">
      <p style="margin: -25px 35px">delete</p>
    </div>
  `, 150);
}
