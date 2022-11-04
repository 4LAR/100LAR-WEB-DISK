

// список доступных страниц
var page_names = [
    'dashboard',
    'history',
    'users',
    'templates',
    'logs',
    'settings',
    'terminal'
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

      settings_json = info_json['settings'];
      generate_settingslist();

      //TIME
      document.getElementById("server_time_running").innerHTML = `${info_json['server_time_running']}`;

      //RAM
      document.getElementById("server_program_memory").innerHTML = `Disk: ${convert_size(info_json['program_memory'])}`;
      document.getElementById("server_used_memory").innerHTML = `Other: ${convert_size(info_json['used_memory'] - info_json['program_memory'])}`;
      document.getElementById("server_total_memory").innerHTML = `Total: ${convert_size(info_json['total_memory'])}`;

      program_memory = (100 / info_json['total_memory']) * info_json['program_memory'];
      used_memory = (100 / info_json['total_memory']) * info_json['used_memory'];

      set_progressbar('ram_memory_usage', [used_memory, program_memory], 2);

      //CPU
      document.getElementById("server_cpu_usage").innerHTML = `Usage: ${info_json['cpu_usage']}%`;
      set_progressbar('cpu_usage', info_json['cpu_usage']);

      //WARNINGS
      clear_ul('warnings_list');
      if (info_json['warnings'].length > 0) {
        openModal('clear_errors_div');
        for (let i = 0; i < info_json['warnings'].length; i++) {
          append_to_ul('warnings_list',
            `
              <p style="margin: 10px">${info_json['warnings'][i]}</p>
              ${(i == info_json['warnings'].length - 1)? '': '<hr class="main_page_hr">'}
            `
          );

        }
      } else {
        closeModal('clear_errors_div');
        append_to_ul('warnings_list',
          `<h2 align="center">NO ERRORS</h2>`
          );
      }

    }
  };
  xhr.send()

}

// очистка списка ошибок
function clear_error_list() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/clear_warnings');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      get_server_info();
    }
  };
  xhr.send()
}

get_server_info();

open_page('dashboard');
