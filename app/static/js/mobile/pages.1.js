
var page_names = ["apps", "files", "profile"];

function open_page(name) {
  for (page of page_names) {
    if (page === name) {
      openModal(`page_${page}`);
      document.getElementById(`page_button_${page}`).classList.replace('menu_button', 'menu_button_selected');
    } else {
      closeModal(`page_${page}`);
      document.getElementById(`page_button_${page}`).classList.replace('menu_button_selected', 'menu_button');
    }
  }
}

open_page("files");
