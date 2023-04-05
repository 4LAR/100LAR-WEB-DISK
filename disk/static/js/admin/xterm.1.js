const term = new Terminal({
  cursorBlink: true,
  macOptionIsMeta: true,
  scrollback: true,
});
term.attachCustomKeyEventHandler(customKeyEventHandler);

const fit = new FitAddon.FitAddon();
term.loadAddon(fit);
term.loadAddon(new WebLinksAddon.WebLinksAddon());
term.loadAddon(new SearchAddon.SearchAddon());

term.open(document.getElementById("terminal"));
fit.fit();

fit.fit();
term.onData((data) => {
  socket.emit("ptyInput", { input: data });
});

const socket = io.connect("/pty");
const terminal_status = document.getElementById("terminal_status");

socket.on("pty-output", function (data) {
  term.write(data.output);
});

socket.on("connect", () => {
  fitToscreen();
  terminal_status.innerHTML =
    'status: connected';
});

socket.on("disconnect", () => {
  terminal_status.innerHTML =
    'status: disconnected';
});

function fitToscreen() {
  fit.fit();
  const dims = { cols: term.cols, rows: term.rows };
  socket.emit("resize", dims);
}

function customKeyEventHandler(e) {
  if (e.type !== "keydown") {
    return true;
  }
  if (e.ctrlKey && e.shiftKey) {
    const key = e.key.toLowerCase();
    if (key === "v") {
      navigator.clipboard.readText().then((toPaste) => {
        term.writeText(toPaste);
      });
      return false;
    } else if (key === "c" || key === "x") {
      const toCopy = term.getSelection();
      navigator.clipboard.writeText(toCopy);
      term.focus();
      return false;
    }
  }
  return true;
}
