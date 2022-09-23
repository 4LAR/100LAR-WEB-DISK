

// список доступных страниц
var page_names = [
    'dashboard',
    'users',
    'templates',
    'logs',
    'settings'
  ];

//
function open_page(page_name) {
  var opened = false;

  // цикл для поиска нужной страницы
  for (let i = 0; i < page_names.length; i++){
    if (page_names[i] == page_name){
      openModal(page_names[i]);
      document.getElementById('left_bar_' + page_names[i]).className = 'left_bar_button_selected block_select';
    } else {
      closeModal(page_names[i]);
      document.getElementById('left_bar_' + page_names[i]).className = 'left_bar_button block_select';
    }
  }

  if (opened) {

  }
}

//---DASHBOARD------------------------------------------------------
function get_server_info() {

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/system_info');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      info_json = JSON.parse(xhr.responseText.toString());

      document.getElementById("server_time_running").innerHTML = `${info_json['server_time_running']}`;
      document.getElementById("server_program_memory").innerHTML = `Disk: ${convert_size(info_json['program_memory'])}`;
      document.getElementById("server_used_memory").innerHTML = `Other: ${convert_size(info_json['used_memory'] - info_json['program_memory'])}`;
      document.getElementById("server_total_memory").innerHTML = `Total: ${convert_size(info_json['total_memory'])}`;

      program_memory = (100 / info_json['total_memory']) * info_json['program_memory'];
      used_memory = (100 / info_json['total_memory']) * info_json['used_memory'];

      set_progressbar('ram_memory_usage', [used_memory, program_memory], 2);

    }
  };
  xhr.send()

}

get_server_info();

open_page('dashboard');
