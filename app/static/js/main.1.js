const space_bar_width = 200;

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
function append_file() {
  var ul = document.getElementById("file_list");
  var li = document.createElement("li");

  li.innerHTML = `
    <div class="file" onclick="open_fileInfo('test_file.txt', 'text file', '120Kb', '/home/stolar', '29.07.2022')">
      <img class="icon" style="margin: 7px 40px" width="25" height="25" src="static/img/file.svg">
      <p style="margin: -25px 70px">test_file.txt</p>
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
  append_file();

//
function set_disk_space(state=0) {
  document.getElementById("disk_space_progress").style.width = (space_bar_width/100) * state;
}


set_disk_space(25.2);

document.addEventListener('keydown', function(event){

  if(event.keyCode == 27){
    close_fileInfo();

  }

});