

// список доступных страниц
var page_names = [
    'dashboard',
    'users',
    'templates',
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
        document.getElementById('left_bar_' + page_names[i]).className = 'left_bar_button_selected';
      } else {
        closeModal(page_names[i]);
        document.getElementById('left_bar_' + page_names[i]).className = 'left_bar_button';
      }
    }
  
    if (opened) {
  
    }
  }
  
open_page('dashboard');
  