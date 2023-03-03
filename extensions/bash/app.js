const term = new Terminal({
  cursorBlink: true,
  macOptionIsMeta: true,
  scrollback: true,
});

const fit = new FitAddon.FitAddon();
term.loadAddon(fit);
term.loadAddon(new WebLinksAddon.WebLinksAddon());
term.loadAddon(new SearchAddon.SearchAddon());

term.open(document.getElementById("terminal"));
fit.fit();

window.onresize = function () {
  fit.fit();
};

for (let i = 0; i < 200; i++) {
  term.writeln('HELLO World');
}
