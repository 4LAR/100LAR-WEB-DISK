var currentTheme = localStorage.getItem('theme');

console.log(currentTheme)

function checkThame() {
  currentTheme = localStorage.getItem('theme');
  document.documentElement.setAttribute('data-theme', currentTheme);

  try {
    if (currentTheme === 'dark') {
      document.getElementById('lightThame_chekcbox').checked = false;
    } else if (currentTheme === 'light') {
      document.getElementById('lightThame_chekcbox').checked = true;
    }
  } catch {
    
  }


}

function lightThame() {
  localStorage.setItem('theme', 'light');
  checkThame();
}

function darkThame() {
  localStorage.setItem('theme', 'dark');
  checkThame();
}

function switchTheme() {
  if (currentTheme === 'dark')
    lightThame();
   else
    darkThame();
}

function checkBox_thame(e) {
  console.log(1);
  if (e.checked) {
    lightThame();
  } else {
    darkThame();
  }

}

checkThame();
