
//
function get_all_logs() {

  var ul = document.getElementById("loglist");
  ul.innerHTML = '';

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/get_logs_names');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      log_list_json = JSON.parse(xhr.responseText.toString());

      for (let i = 0; i < log_list_json['logs'].length; i++){
        append_logs(log_list_json['logs'][i], (i == log_list_json['logs'].length - 1)? true: false);
      }

    }
  };
  xhr.send()
}

//
function append_logs(name, end=false) {
  var ul = document.getElementById("loglist");
  var li = document.createElement("li");

  li.innerHTML = `
    <div style="height: 30px;">
      <img class="icon" width="20" height="20" src="static/img/admin/log.svg">
      <p>${name}</p>
      <a href="read_current_log?name=${name}" download="${name}">
        <img align="right" class="icon log_download" width="20" height="20" src="static/img/download.svg">
      </a>
    </div>
  `;

  if (!end) {
    li.innerHTML += `<hr class="main_page_hr">`;
  }

  ul.appendChild(li);

}

//
function delete_all_logs() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/delete_all_logs');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      get_all_logs();
    }
  };
  xhr.send()
}

get_all_logs();
