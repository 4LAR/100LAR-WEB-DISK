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
function checkModal(modalId) {
  try {
    var modal = document.getElementById(modalId);
    if (modal.style.display == "block")
      return true;
    else
      return false;

  } catch {
    return false;
  }
}

//
function set_disk_space(state=0) {
  document.getElementById("disk_space_progress").style.width = (space_bar_width/100) * state;
}

set_disk_space(0);

document.addEventListener('keydown', function(event){

  if(event.keyCode == 27){
    if (open_close_user_bool) {
      open_close_user_button();
    } else {
      close_rightBar();
    }

  }

});
