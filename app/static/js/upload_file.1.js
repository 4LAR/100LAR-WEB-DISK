
// выгрузка файлов
let dropArea = document.getElementById('html');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)
})

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
};

['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false)
});

['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false)
})

function highlight(e) {
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  dropArea.classList.remove('highlight')
}

dropArea.addEventListener('drop', handleDrop, false)

function handleDrop(e) {
  let dt = e.dataTransfer
  let files = dt.files
  handleFiles(files)

}

function handleFiles(files) {
  console.log('uploading files');
  ([...files]).forEach(uploadFile);
}

function uploadFile(file) {
  form = new FormData();
  var xhr = new XMLHttpRequest();
  form.append("file", file);
  xhr.open('post', `upload_file?path=${path}&dir=${dir_str}&file=${file.name}`, true);
  xhr.upload.onprogress = function(event) {
    //document.getElementById("upload_bar").max = event.total;
    //document.getElementById("upload_bar").value = event.loaded;
  }
  xhr.upload.onload = function() {
    update_dir();
  }
  xhr.send(form);
}
