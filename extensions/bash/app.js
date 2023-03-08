const term = new Terminal({
  cursorBlink: true,
  macOptionIsMeta: true,
  scrollback: true,
});
term.attachCustomKeyEventHandler(customKeyEventHandler);
// https://github.com/xtermjs/xterm.js/issues/2941
const fit = new FitAddon.FitAddon();
term.loadAddon(fit);
term.loadAddon(new WebLinksAddon.WebLinksAddon());
term.loadAddon(new SearchAddon.SearchAddon());

term.open(document.getElementById("terminal"));
fit.fit();
// term.resize(15, 50);
console.log(`size: ${term.cols} columns, ${term.rows} rows`);
fit.fit();
term.onData((data) => {
  console.log("browser terminal received new data:", data);
  socket.emit("ptyInput", { input: data });
});

const socket = io.connect("/bash");
// const terminal_status = document.getElementById("terminal_status");

socket.on("pty-output", function (data) {
  console.log("new output received from server:", data.output);
  term.write(data.output);
});

socket.on("connect", () => {
  fitToscreen();

});

socket.on("disconnect", () => {

});

function fitToscreen() {
  fit.fit();
  const dims = { cols: term.cols, rows: term.rows };
  console.log("sending new dimensions to server's pty", dims);
  socket.emit("resize", dims);
}

/**
 * Handle copy and paste events
 */
function customKeyEventHandler(e) {
  if (e.type !== "keydown") {
    return true;
  }
  if (e.ctrlKey && e.shiftKey) {
    const key = e.key.toLowerCase();
    if (key === "v") {
      // ctrl+shift+v: paste whatever is in the clipboard
      navigator.clipboard.readText().then((toPaste) => {
        term.writeText(toPaste);
      });
      return false;
    } else if (key === "c" || key === "x") {
      // ctrl+shift+x: copy whatever is highlighted to clipboard

      // 'x' is used as an alternate to 'c' because ctrl+c is taken
      // by the terminal (SIGINT) and ctrl+shift+c is taken by the browser
      // (open devtools).
      // I'm not aware of ctrl+shift+x being used by anything in the terminal
      // or browser
      const toCopy = term.getSelection();
      navigator.clipboard.writeText(toCopy);
      term.focus();
      return false;
    }
  }
  return true;
}

window.onresize = function () {
  fitToscreen();
};
