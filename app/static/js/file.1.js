
var dir = [];
var dir_str = ''
var path = 1;

function forward_dir(name) {
  dir.push(name);
  update_dir();
  get_files();
}

function back_dir() {
  dir.pop();
  update_dir();
  get_files();
}

function update_dir() {
  dir_str = '';
  for (let i = 0; i < dir.length; i++)
    if (i < dir.length - 1) {
      dir_str += dir[i] + '/'
    } else {
      dir_str += dir[i]
    }

  document.getElementById("path").value = '/' + dir_str;
}

//
function get_files() {
  var ul = document.getElementById("file_list");
  ul.innerHTML = '';

  if (dir.length > 0) {
    var li = document.createElement("li");
    li.innerHTML = `
      <div class="file" onclick="back_dir()">
        <img class="icon" style="margin: 7px 40px" width="25" height="25" src="static/img/folder.svg">
        <p style="margin: -25px 70px">...</p>
      </div>
    `;
    ul.appendChild(li);
  }


  var xhr = new XMLHttpRequest();
  xhr.open('POST', `/files?path=${path}&dir=${dir_str}`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      files_json = JSON.parse(xhr.responseText.toString());

      for (let i = 0; i < files_json['files'].length; i++){
        file = files_json['files'][i]
        if (file['type'] == 'dir') {
          append_file(file['type'], file['name']);
        } else {
          append_file(file['type'], file['name'], file['size'], dir_str + '/' + file['name'], file['time']);
        }


      }

    }
  };
  xhr.send()
}

//
function append_file(type, name, size='', path='', date='') {
  var ul = document.getElementById("file_list");
  var li = document.createElement("li");

  var str = `
    <div style="position: absolute; margin: 8px 8px">
      <input type="checkbox" class="custom-checkbox" id="${name}" name="${name}" value="yes">
      <label for="${name}"></label>
    </div>
  `

  if (type == 'dir') {
    str += `
      <div class="file" onclick="forward_dir('${name}')">
        <img class="icon" style="margin: 7px 40px" width="25" height="25" src="static/img/folder.svg">
        <p style="margin: -25px 70px">${name}</p>
      </div>
    `;

  } else {
     str += `
      <div style="position: absolute; margin: 8px 8px">
        <input type="checkbox" class="custom-checkbox" id="${name}" name="${name}" value="yes">
        <label for="${name}"></label>
      </div>
      <div class="file" onclick="open_fileInfo('${name}', 'text file', '${size}', '${path}', '${date}')">
        <img class="icon" style="margin: 7px 40px" width="25" height="25" src="static/img/file.svg">
        <p style="margin: -25px 70px">${name}</p>
        <p style="margin: -25px 300px">${date}</p>
        <p style="margin: 4px 500px">${size}</p>
      </div>
    `;
  }

  li.innerHTML = str;

  ul.appendChild(li);
}

//
function open_fileInfo(name, type, size, file_path, date, description='') {

  document.getElementById("fileName_input").value = name;

  document.getElementById("file_type").innerHTML = 'type: ' + type;
  document.getElementById("file_size").innerHTML = 'size: ' + size;
  document.getElementById("file_path").innerHTML = 'path: ' + file_path;
  document.getElementById("file_date").innerHTML = 'date of change: ' + date;
  console.log(dir_str);
  document.getElementById("file_download_button").href = `/download?path=${path}&dir=${dir_str}&file=${name}`;
  document.getElementById("file_download_button").downlaod = name;

  openModal('rightBar');

}

function close_fileInfo() {
  closeModal('rightBar');
}

update_dir();
get_files();
//for (let i = 0; i < 20; i++)
//  append_file('test_file.txt', '120KB', '/home/stolar', '12:30 30.07.2022');
