var currentTheme = localStorage.getItem('theme');
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
var colored_file_icons = true;
var colored_space_status = true;

//
function checkThame() {
  currentTheme = localStorage.getItem('theme');
  document.documentElement.setAttribute('data-theme', currentTheme);

  colored_file_icons = str_to_bool(get_localStorage('colored_file_icons', 'true'));
  document.getElementById('file_icons_chekcbox').checked = colored_file_icons;

  colored_space_status = str_to_bool(get_localStorage('colored_space_status', 'true'));
  document.getElementById('space_status_chekcbox').checked = colored_space_status;

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

function checkBox_space_status(e) {
  localStorage.setItem('colored_space_status', e.checked);
  update_dir();
  checkThame();
}

checkThame();
