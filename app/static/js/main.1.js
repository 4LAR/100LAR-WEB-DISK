const space_bar_width = 200;

const path_map_left = 10;

// функция для скрытия эелемента
function closeModal(modalId) { 
  try {
    var modal = document.getElementById(modalId);
    modal.style.display = "none";
  } catch {
  }
}

// функция для показа эелемента (если элемент скрыт)
function openModal(modalId) { 
  try {
    var modal = document.getElementById(modalId);
    modal.style.display = "block";
  } catch {
  }
}

//
function append_file(name, size, path, date) {
  var ul = document.getElementById("file_list");
  var li = document.createElement("li");

  li.innerHTML = `
    <div class="file" onclick="open_fileInfo('${name}', 'text file', '${size}', '${path}', '${date}')">
      <img class="icon" style="margin: 7px 40px" width="25" height="25" src="static/img/file.svg">
      <p style="margin: -25px 70px">${name}</p>
    </div>
  `;

  ul.appendChild(li);
}

//
function open_fileInfo(name, type, size, path, date, description='') {

  document.getElementById("fileName_input").value = name;

  document.getElementById("file_type").innerHTML = 'type: ' + type;
  document.getElementById("file_size").innerHTML = 'size: ' + size;
  document.getElementById("file_path").innerHTML = 'path: ' + path;
  document.getElementById("file_date").innerHTML = 'date of change: ' + date;

  openModal('rightBar');

}

function close_fileInfo() {
  closeModal('rightBar');
}

for (let i = 0; i < 20; i++)
  append_file('test_file.txt', '120KB', '/home/stolar', '12:30 30.07.2022');

//
function set_disk_space(state=0) {
  document.getElementById("disk_space_progress").style.width = (space_bar_width/100) * state;
}


set_disk_space(25.2);

var open_close_user_bool = false;

document.addEventListener('keydown', function(event){

  if(event.keyCode == 27){
    if (open_close_user_bool) {
      open_close_user_button();
    } else {
      close_fileInfo();
    }
    
  }

});

//
function add_path_map(count, name, open=false) {
  var ul = document.getElementById("path_map_list");
  var li = document.createElement("li");

  var left = path_map_left * count;
  var rotate = (!open)? 'path_map_img_rotate': '';

  li.innerHTML = `
  <div class="path_map_button">
    <img class="icon ${rotate}" style="margin: 5px ${left + 5}px" width="8" height="8" src="static/img/triangle.svg">
    <p style="margin: -17px ${left + 15}px;">${name}</p>
  </div>
  `;

  ul.appendChild(li);
}

add_path_map(0, 'home', true);
add_path_map(1, 'stolar', true);
add_path_map(2, 'downloads', false);
add_path_map(2, 'images', false);
add_path_map(2, 'docs', false);
add_path_map(2, 'test', true);


//
function open_close_user_button() {
  open_close_user_bool = !open_close_user_bool;
  document.getElementById("background_black").style.display = (open_close_user_bool)? "block": "none";
  document.getElementById("leftBar_user").style.display = (open_close_user_bool)? "block": "none";
  document.getElementById("user_button_triangle").style.transform = (open_close_user_bool)? "rotate(180deg)": "rotate(0deg)";

}