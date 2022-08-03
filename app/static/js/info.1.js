
var info_json = {};

//
function get_info() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/info');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      info_json = JSON.parse(xhr.responseText.toString());

      document.getElementById('user_status').innerHTML = info_json['status'];
      document.getElementById('user_name').innerHTML = info_json['name'];

      set_disk_space((100/info_json['path'][path]['size']) * info_json['path'][path]['busy']);
      document.getElementById('disk_converted').innerHTML = `${info_json['path'][path]['busy_converted']} / ${info_json['path'][path]['size_converted']}`;


    }
  };
  xhr.send()
}

get_info();
