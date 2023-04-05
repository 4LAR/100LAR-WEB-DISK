var currentTheme = localStorage.getItem('theme');
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
var colored_file_icons = false;

//
function checkThame() {
  currentTheme = localStorage.getItem('theme');
  colored_file_icons = str_to_bool(localStorage.getItem('colored_file_icons'));
  document.getElementById('file_icons_chekcbox').checked = colored_file_icons;

  document.documentElement.setAttribute('data-theme', currentTheme);

  try {
    switch (currentTheme) {
      case 'dark':
        document.getElementById('lightThame_chekcbox').checked = false;
        break;
      case 'light':
        document.getElementById('lightThame_chekcbox').checked = true;
        break;
    }

  } catch {

  }


}

//
function lightThame() {
  localStorage.setItem('theme', 'light');
  checkThame();
}

//
function darkThame() {
  localStorage.setItem('theme', 'dark');
  checkThame();
}

//
function systemThame() {
  localStorage.setItem('theme', 'system');
  checkThame();
}

//
function switchTheme() {
  if (currentTheme === 'dark')
    lightThame();
   else
    darkThame();
}

//
function checkBox_thame(e) {
  if (e.checked) {
    lightThame();
  } else {
    darkThame();
  }

}

function checkBox_file_icons(e) {
  localStorage.setItem('colored_file_icons', e.checked);
  update_dir();
  checkThame();
}

checkThame();
