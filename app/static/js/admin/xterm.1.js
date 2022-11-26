const term = new Terminal({
  cursorBlink: true,
  macOptionIsMeta: true,
  scrollback: true,
});
// term.attachCustomKeyEventHandler(customKeyEventHandler);
// https://github.com/xtermjs/xterm.js/issues/2941
const fit = new FitAddon.FitAddon();
term.loadAddon(fit);
term.loadAddon(new WebLinksAddon.WebLinksAddon());
term.loadAddon(new SearchAddon.SearchAddon());

term.open(document.getElementById("terminal_div"));
fit.fit();
term.resize(75, 25);
console.log(`size: ${term.cols} columns, ${term.rows} rows`);
fit.fit();
term.writeln("copy: ctrl+shift+x");
term.writeln("pase: ctrl+shift+v");
for (let i = 0; i < 75; i++) {
  term.write("-");
}
term.writeln('')
term.onData((data) => {
  console.log("browser terminal received new data:", data);
  // socket.emit("pty-input", { input: data });
});
