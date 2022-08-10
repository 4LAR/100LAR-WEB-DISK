var currentTheme = localStorage.getItem('theme');

console.log(currentTheme)

function checkThame() {
  currentTheme = localStorage.getItem('theme');
  document.documentElement.setAttribute('data-theme', currentTheme);
}

function lightThame() {
  localStorage.setItem('theme', 'light');
}

function darkThame() {
  localStorage.setItem('theme', 'dark');
}

function switchTheme() {
  if (currentTheme === 'dark')
    lightThame();
   else
    darkThame();

  checkThame();
}

checkThame();
