var history_types = [
  ['login', 'admin/login.svg'],
  ['logout', 'admin/logout.svg'],
  ['download', 'admin/download.svg'],
  ['upload', 'admin/upload.svg'],
  ['copy / move', 'copy.svg'],
  ['create', 'admin/add.svg'],
  ['delete', 'trash.svg'],
  ['edit', 'admin/edit.svg'],
]

function get_history() {
  clear_ul('historylist');

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/get_history');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      history_json = JSON.parse(xhr.responseText.toString());

      if (history_json['history'].length > 0) {
        for (let i = history_json['history'].length - 1; i > -1; i--){
          // history_json['history'][i]
          append_to_ul('historylist',
            `
              <div>
                <img class="icon" width="20" height="20" src="static/img/${history_types[history_json['history'][i][1]][1]}">
                <p style="position: absolute; margin: 5px 20px;">${history_types[history_json['history'][i][1]][0]}</p>
                <p style="position: absolute; margin: 5px 20px; right: 0px;">${history_json['history'][i][2]}</p>
                <br>
                <p style="position: relative; left: 0px; margin: 10px 8px">${history_json['history'][i][0]}</p>
              </div>
              ${(i == 0)? '': '<hr class="main_page_hr">'}
            `
          );

        }

      } else {
        append_to_ul('historylist', `<h2 align="center">HISTORY IS EMPTY</h2>`);
      }


    }
  };
  xhr.send()

}

get_history();

function delete_all_history() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/clear_history');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      get_history();
    }
  };
  xhr.send()
}
