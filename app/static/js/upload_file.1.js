
var uploading_bool = false;

if (!mobile) {
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
    //handleFiles(files)
    uploadFile(files);

  }

}

const upload_bar_width = 300;
function set_upload_bar(state = 0) {
  document.getElementById("upload_progress").style.width = (upload_bar_width/100) * state;
}

function uploadFile(files, count = 0) {
  openModal('rightBar');

  if (count < files.length) {
    uploading_bool = true;
    openModal('file_upload_block');

    file = files[count];

    document.getElementById("upload_file_count").innerHTML = `Upload ${files.length - count} files...`;
    document.getElementById("upload_file_name").innerHTML = files[count].name;

    form = new FormData();
    var xhr = new XMLHttpRequest();
    form.append("file", file);
    xhr.open('post', `upload_file?path=${path}&dir=${dir_str}&file=${file.name}`, true);
    xhr.upload.onprogress = function(event) {
      set_upload_bar((100 / event.total) * event.loaded);
      //document.getElementById("upload_bar").max = event.total;
      //document.getElementById("upload_bar").value = event.loaded;
    }
    xhr.upload.onload = function() {
      uploadFile(files, ++count);

    }

    xhr.onload = function() {
      console.log(xhr.responseText.toString())
      if (xhr.responseText.toString() === 'NO PLACE') {
        no_place_dialog();

        uploading_bool = false;
        closeModal('file_upload_block');
        if (!right_bar_bool) {
          close_rightBar();
        }
        update_dir();
      }

    }
    xhr.send(form);

  } else {
    uploading_bool = false;
    closeModal('file_upload_block');
    if (!right_bar_bool) {
      close_rightBar();
    }
    update_dir();
  }


}
