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
function openInNewTab(url) {
  window.open(url, '_blank').focus();
}
