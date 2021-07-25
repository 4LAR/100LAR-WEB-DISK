
var page_names = ['page_login', 'page_files'];
var current_page = "page_files";
//var closed_page = "";

var dark_mode = true;

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
if (getCookie('dark_mode') == 'false') {
  dark_mode = false;
} else {
  dark_mode = true;
}

if (dark_mode)
  document.getElementById('html').className = 'dark';
else
  document.getElementById('html').className = 'light';

function switch_theme() {
  if (dark_mode){
    document.getElementById('html').className = 'light';
    dark_mode = false;
    document.cookie = "dark_mode=false";
  } else {
    document.getElementById('html').className = 'dark';
    dark_mode = true;
    document.cookie = "dark_mode=true";
  }
}

var dir = '';
var login_bool = false;

var show_menu_bool = false;

function short_name(name, chars, subst) {
  return name.replace(
    new RegExp('(^.{' + chars + '}).+(\\.[^\\.]*$)'), '$1' + subst + '$2');
}

function close_menu() {
  if (show_menu_bool) {
    document.getElementById('right_bar').style.right = '-100%';
    show_menu_bool = false;
  }
}

function show_menu() {
  if (!create_dir_alert_bool && !show_bottom_bar_bool){
    if (show_menu_bool){
      document.getElementById('right_bar').style.right = '-100%';
      show_menu_bool = false;
    } else {
      document.getElementById('right_bar').style.right = '0%';
      show_menu_bool = true;
    }
  }

}

function closeModal(modalId) {
  try {
    var modal = document.getElementById(modalId);
    modal.style.display = "none";
  } catch {
  }
}

function openModal(modalId) {
  try {
    var modal = document.getElementById(modalId);
    modal.style.display = "block";
  } catch {
  }
}
if (!mobile){
  let dropArea = document.getElementById('html')

  ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
  })
  function preventDefaults (e) {
    e.preventDefault()
    e.stopPropagation()
  }

  ;['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
  })
  ;['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
  })
  function highlight(e) {
    dropArea.classList.add('highlight')
  }
  function unhighlight(e) {
    dropArea.classList.remove('highlight')
  }

  dropArea.addEventListener('drop', handleDrop, false)
}

function handleDrop(e) {
  if (login_bool) {
    let dt = e.dataTransfer
    let files = dt.files
    handleFiles(files)
  }
}

function handleFiles(files) {
  console.log('uploading files');
  ([...files]).forEach(uploadFile);
}

var show_bottom_bar_bool = false;
var show_bottom_bar_upload_bool = false;

function open_bottom_bar(image_file, name_file, desctyption_file, download_file, size_file='') {

  document.getElementById('image_file').src = image_file;
  document.getElementById('name_file').innerHTML = ((mobile)? short_name(name_file, 12, '...'): short_name(name_file, 40, '...'));
  document.getElementById('desctyption_file').innerHTML = desctyption_file + ' | ' + size_file;
  //document.getElementById('size_file').innerHTML = size_file;
  document.getElementById('download_file').href = download_file;
  document.getElementById('download_file').download = name_file;
  document.getElementById('delete_file').href = 'javascript:delFile(\''+name_file+'\')';


  openModal('bottom_bar');
  openModal('show_bottom_block');
  show_bottom_bar_bool = true;
}

function close_bottom_bar() {
  closeModal('bottom_bar');
  show_bottom_bar_bool = false;
  if (!show_bottom_bar_upload_bool)
    closeModal('show_bottom_block');
}

function open_bottom_bar_upload() {
  openModal('bottom_bar_upload');
  openModal('show_bottom_block');
  show_bottom_bar_upload_bool = true;
}

function close_bottom_bar_upload() {
  closeModal('bottom_bar_upload');
  show_bottom_bar_upload_bool = false;
  if (!show_bottom_bar_bool)
    closeModal('show_bottom_block');
}

function uploadFile(file) {
  /*
  let url = 'upload_file_disk?dir=' + dir + '&file_name=' + file.name
  let formData = new FormData()
  formData.append('file', file)
  fetch(url, {
    method: 'POST',
    body: formData,
  })
  .then(() => { readFiles(dir); })
  .catch(() => {  })
  */
  open_bottom_bar_upload();
  if (!mobile)
    document.getElementById("upload_file_name").innerHTML = file.name;
  else
    openModal('upload_bar');
  form=new FormData();
  var xhr = new XMLHttpRequest();
  form.append("file", file);
  xhr.open('post', 'upload_file_disk?dir=' + dir + '&file_name=' + file.name, true);
  xhr.upload.onprogress = function(event) {
    document.getElementById("upload_bar").max = event.total;
    document.getElementById("upload_bar").value = event.loaded;
  }
  xhr.upload.onload = function() {
    if (mobile)
      closeModal('upload_bar');
    readFiles(dir);
    close_bottom_bar_upload();
  }
  xhr.send(form);

}

function delFile(file){
  var xhr = new XMLHttpRequest();
  xhr.open('post', 'del_file_disk?dir='+dir+'&file_name='+file, true);
  xhr.onload = function() {
    readFiles(dir);
    close_bottom_bar();
  }
  xhr.send();

}

for (let i = 0; i < page_names.length; i++){
  document.getElementById(page_names[i]).style.left = -1900;
}

open_page("page_login");

function open_page(page_name, animation=false){ //переключение страниц
  //alert()
  var opened = false;


  //document.getElementById(current_page).style.left = -1900;

  for (let i = 0; i < page_names.length; i++) {
    if (page_names[i] == page_name){

      openModal(page_names[i]);
      opened = true;
    } else {
      closeModal(page_names[i]);
      //document.getElementById(page_names[i]).addEventListener("transitionend", closeModal(page_names[i]), false);

    }
    if (opened) {
      //document.getElementById(page_name).style.left = 0;
      current_page = page_name;
    }


  }
  if (!opened){
    openModal("page_not_found");
    current_page = "page_not_found";
  } else {
    document.getElementById(page_name).style.left = 100;
    current_page = page_name;
  }
}

function close_main_loading() {
  document.getElementById("loading_background").style.display = "none";
}
document.getElementById("loading_background").style.opacity = 0;
var element = document.getElementById("loading_background");
element.addEventListener("transitionend", close_main_loading, false);

function get_memory(){
  var xhr = new XMLHttpRequest();
    xhr.open('GET', 'get_memory', true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var memory = xhr.responseText.toString().replace(/\n$/, "").split(/\n/);
        document.getElementById("memory_text").innerHTML = '(' + memory[1] + 'GB /' + memory[0] + 'GB) FREE: ' + memory[2] + 'GB';
        document.getElementById("memory_bar").max = memory[0];
        document.getElementById("memory_bar").value = memory[1];
      }
    };
  xhr.send();
}

/*
<div class="file_list_container">
  <img class="icon" src="static/img/files/dir.svg" width="50" height="50">
  <h2 style="position: absolute; left: 5%; display: inline-block;">test2</h2>
  <h2 style="position: absolute; left: 70%; display: inline-block;">DIR</h2>
</div>
*/

var type_files = {
  '': 'file',
  'mp3': 'music_file',
  'png': 'image_file'
}

function reload_files(){
  readFiles(dir);
}

function home_dir() {
  dir = '';
  readFiles(dir);
}

function back_dir() {
  var new_dir = '';
  if (dir.length > 0){
    if (dir.split('/').length > 1){
      for (let i = 1; i <= dir.split('/').length-2; i++){
        new_dir += '/' + dir.split('/')[i];
      }
    }
    dir = new_dir;
    readFiles(dir);

  }
}

function change_dir(file) {
  dir += '/' + file;
  readFiles(dir);
}

function appendToFiles(type, name, type_description='', file_size='') {
  //open_bottom_bar(image_file, name_file, desctyption_file, download_file, size_file='')
  //href="static/files/'+dir+'/'+name+'"
  var ul = document.getElementById("file_list_ul");
  var li = document.createElement("li");
  if (!mobile) {
    li.innerHTML = `
    <div class="file_list_container"  ` + ((type == 'dir')? 'onclick="change_dir(\''+name+'\')"': 'onclick="open_bottom_bar(\'static/img/files/'+type+'.svg\', \''+name+'\', \''+(type_description != '' ? type_description: type.toUpperCase())+'\', \'download?dir='+dir+'&file='+name+'\', \''+file_size+'\')"') + `>
      <img class="icon" src="static/img/files/` + type + `.svg" width="50" height="50">
      <h2 style="position: absolute; left: 5%; display: inline-block;">` + name + `</h2>
      <h2 style="position: absolute; left: 70%; display: inline-block;">` + (type_description != '' ? type_description: type.toUpperCase()) + `</h2>
      ` + (file_size == '' ? '':
        '<h2 style="position: absolute; left: 88%; display: inline-block;">' + file_size + '</h2>'
    ) + `
    </div>`;// + (type == 'dir'? '': '</a>');
  } else {
    li.innerHTML = `
    <div class="m_file_list_container"  ` + ((type == 'dir')? 'onclick="change_dir(\''+name+'\'); close_menu()"': 'onclick="open_bottom_bar(\'static/img/files/'+type+'.svg\', \''+name+'\', \''+(type_description != '' ? type_description: type.toUpperCase())+'\', \'download?dir='+dir+'&file='+name+'\', \''+file_size+'\'); close_menu()"') + `>
      <img class="icon" src="static/img/files/` + type + `.svg" width="50" height="50">
      <h2 style="position: absolute; left: 20%; display: inline-block; margin: -1%">` + short_name(name, 12, '...') + `</h2>
      <h2 style="position: absolute; left: 70%; display: inline-block;">` + (type_description != '' ? type_description: type.toUpperCase()) + `</h2>
      ` + (file_size == '' ? '':
        '<h2 style="position: absolute; left: 20%; display: inline-block; margin: 8% -1%">' + file_size + '</h2>'
    ) + `
    </div>`;
  }
  li.setAttribute("id", "element4");
  ul.appendChild(li);
}

function sort_files(a, b) {
  console.log(a + b);
  if (a.split(':')[1] == 'dir')
    return -1;
  else return 1;
}

function delDir(folder){
  var xhr = new XMLHttpRequest();
  xhr.open('post', 'del_folder_disk?dir='+folder, true);
  xhr.onload = function() {
    back_dir();
  }
  xhr.send();

}

function readFiles(d) {
  document.getElementById("files_input").value = 'HOME://'+ d;
  document.getElementById("file_list_ul").innerHTML = '';
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'files_disk?dir='+d, true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      if (xhr.responseText != 'ERROR'){
        if (xhr.responseText != 'EMPTY'){
          closeModal('empty_dir_alert');
          document.getElementById("file_list_ul").innerHTML = '';
          var files = xhr.responseText.toString().replace(/\n$/, "").split(/\n/);
          files.sort(sort_files);
          for (let i = 0; i < files.length; i++) {
            if (files[i].split(':') < 3)
              appendToFiles(files[i].split(':')[1], files[i].split(':')[0]);
            else
              appendToFiles(files[i].split(':')[1], files[i].split(':')[0], '', file_size=files[i].split(':')[2]);
          }
        } else {
          openModal('empty_dir_alert');
          document.getElementById("empty_dir_a").href = 'javascript:delDir(\''+d+'\')';

        }
      }
    }
  };
  xhr.send();
  get_memory();
}

var create_dir_alert_bool = false;

function create_dir_alert() {
  if (!create_dir_alert_bool){
    if (mobile)
      close_menu();
    var ul = document.getElementById("file_list_ul");
    var li = document.createElement("li");
    if (!mobile) {
      li.innerHTML = `
      <div class="file_list_container_edit">
        <img class="icon" src="static/img/files/dir.svg" width="50" height="50">
        <h2 style="position: absolute; left: 5%; display: inline-block;"><input id="folder_name" class="input_file_name_container" placeholder="Folder name">
          <div class="button_file_name_create" onclick="create_dir()"><h4 align="center">Create</h4></div>
          <div class="button_file_name_abort" onclick="create_dir_alert_close()"><h4 align="center">Abort</h4></div>
        </h2>
        <h2 style="position: absolute; left: 70%; display: inline-block;">DIR</h2>
      </div>`;// + (type == 'dir'? '': '</a>');
    } else {
      openModal('create_dir_alert')
    }

    li.setAttribute("id", "element4");
    ul.prepend(li);
    create_dir_alert_bool = true;
  }
}

function create_dir_alert_close(){
  create_dir_alert_bool = false;
  readFiles(dir);
  closeModal('create_dir_alert')
}

function create_dir(){
  var g = document.getElementById("folder_name");
  if (folder_name.value.length > 0){
    var xhr = new XMLHttpRequest();
    xhr.open('post', 'add_dir_disk?dir='+dir+'&file_name='+g.value, true);
    xhr.onload = function () {
      document.getElementById("folder_name").value = '';
      readFiles(dir);
      create_dir_alert_bool = false;
      if (mobile)
        closeModal('create_dir_alert')
    }
    xhr.send();

  }

}

function login() {
  var login = document.getElementById("login_input").value;
  var password = document.getElementById("password_input").value;

  xhr = new XMLHttpRequest();
  xhr.open('POST', '/login');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status !== 200) {
      console.warn(xhr.responseText);
    } else {
      if (xhr.responseText.toString() == 'ERROR LOGIN'){
        openModal('alert_login');
      } else {
        login_bool = true;
        get_memory();
        readFiles(dir);
        open_page('page_files');
      }
    }
  };
  xhr.send(encodeURI('username=' + login + '&password=' + password));
}

function logout() {
  xhr = new XMLHttpRequest();
  xhr.open('POST', '/logout');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      login_bool = false;
      document.getElementById("login_input").value = '';
      document.getElementById("password_input").value = '';
      closeModal('alert_login');
      open_page('page_login');
    }
  };
  xhr.send()
}

function check_login(){
    var xhr = new XMLHttpRequest();
    xhr.open('get', '/check_login', true);
    xhr.onload = function () {
      if (xhr.responseText == 'OK') {
        login_bool = true;
        open_page('page_files');
        get_memory();
        readFiles(dir);
      } else {
        open_page('page_login');
      }
    }
    xhr.send();

}


/*

    file types

  dir
  archive
  file
  file_text
  image
  music_file
*/

/*
appendToFiles('dir', 'test', 'DIR');
appendToFiles('archive', 'test');
appendToFiles('file', 'test');
appendToFiles('file_text', 'test');
appendToFiles('image', 'test');
appendToFiles('music_file', 'test');
*/
check_login();

close_bottom_bar();
close_bottom_bar_upload();

function resize() {
  document.body.style.zoom = document.body.clientWidth / (1920);
}
if (!mobile){
  resize();
  window.addEventListener('resize', resize, true);
}
