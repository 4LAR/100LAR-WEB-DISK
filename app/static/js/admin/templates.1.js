
function get_templates() {
  clear_ul('templateslist');
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/get_templates`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      templates_JSON = JSON.parse(xhr.responseText.toString());

      

    }
  };
  xhr.send();
}

get_templates();
