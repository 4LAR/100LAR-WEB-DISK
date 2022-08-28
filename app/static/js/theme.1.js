var currentTheme = localStorage.getItem('theme');
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

//
function checkThame() {
  currentTheme = localStorage.getItem('theme');
  document.documentElement.setAttribute('data-theme', currentTheme);

  try {
    /*document.getElementById('darkThame_chekcbox').checked = false;
    document.getElementById('lightThame_chekcbox').checked = false;
    document.getElementById('systemThame_chekcbox').checked = false;*/
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

checkThame();
