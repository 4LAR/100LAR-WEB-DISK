

// список доступных страниц
var page_names = [
    'dashboard',
    'history',
    'users',
    'templates',
    'apps',
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

  open_menu(true);

}

var menu_open_flag = false;
function open_menu(close=false) {
  if (window.innerWidth >= 768)
    return

  if (close)
    menu_open_flag = true;

  menu_open_flag = !menu_open_flag;
  if (menu_open_flag) {
    openModal("left_bar");
    openModal("menu_bg_div");

  } else {
    closeModal("left_bar");
    closeModal("menu_bg_div");
  }
}

//---ALERTS------------------------------------------------------
function open_alert(html, height = 200, big=false) {
  document.getElementById("alert_div").innerHTML = html;
  if (big) {
    document.getElementById("alert").className = "big_alert";
    document.getElementById("alert").style.height = "none";
  } else {
    document.getElementById("alert").className = "alert";
    document.getElementById("alert").style.height = height + "px";
  }

  openModal('alert_bg');
  openModal('alert');
}

function close_alert() {
  closeModal('alert_bg');
  closeModal('alert');
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

      //REBOOT
      // if (info_json['BUILT_IN_SERVER']) {
      //   openModal('reboot_button');
      // }

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

function open_alert_clear_error_list() {
  open_alert(`
    <h3 style="margin: 50px 10px;" align="center">Are you sure you want to clear the error list?</h3>

    <div class="main_page_button" style="position: absolute; width: 100px; bottom: 10px; left: 10px;" onclick="clear_error_list(); close_alert()">
      <img style="margin: 5px 5px" class="icon" width="20" height="20" src="static/img/trash.svg">
      <p style="margin: -25px 35px">clear</p>
    </div>
  `, 130);
}

const socket = io.connect("/system_info");

socket.on("info", function (data) {
  set_progressbar(`cpu_usage`, data['cpu_usage']);
  document.getElementById("server_cpu_usage").innerHTML = `Usage: ${data['cpu_usage']}%`;

  //TIME
  document.getElementById("server_time_running").innerHTML = `${data['server_time_running']}`;

  //RAM
  document.getElementById("server_program_memory").innerHTML = `Disk: ${convert_size(data['program_memory'])}`;
  document.getElementById("server_used_memory").innerHTML = `Other: ${convert_size(data['used_memory'] - data['program_memory'])}`;
  document.getElementById("server_total_memory").innerHTML = `Total: ${convert_size(data['total_memory'])}`;

  program_memory = (100 / data['total_memory']) * data['program_memory'];
  used_memory = (100 / data['total_memory']) * data['used_memory'];

  set_progressbar('ram_memory_usage', [used_memory, program_memory], 2);

});

get_server_info();

open_page('dashboard');
