
const socket = io.connect(current_namespace);

socket.on("progress", function (data) {
  console.log(data.output);
  document.getElementById("file_size").innerHTML = `TOTAL SIZE: ${data.output.total_length}B`;
  document.getElementById("file_progress").innerHTML = `DL: ${data.output.dl}B`;
});

socket.on("info", function (data) {
  console.log(data);
  document.getElementById("file_url").innerHTML = `LINK: ${data.output.link}`;
  document.getElementById("file_name").innerHTML = `FILE NAME: ${data.output.file_name}`;
});
