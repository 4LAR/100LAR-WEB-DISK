
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
    openModal("drag_and_drop_div");
  }

  function unhighlight(e) {
    closeModal("drag_and_drop_div");
  }

  dropArea.addEventListener('drop', handleDrop, false)

  async function handleDrop(e) {
    e.preventDefault();
    let dt = e.dataTransfer;
    let items = dt.items;
    file_handler(items);
  }
}

/*----------------------------------------------------------------------------*/
var file_queue_count = 0;
async function process_dir(item, dir="/") {
  var directoryReader = item.createReader();
  await directoryReader.readEntries(async function(entries) {
    for (const entry of entries) {
      if (entry.isDirectory) {
        await create_directory(entry.name, dir);
        await process_dir(entry, dir + entry.name + "/");
      } else {
        file_queue_count++;
        uploadFile([entry, dir])
      }
    }
  });
  return;
}

async function file_handler(items) {
  file_queue_count = 0;
  file_queue_count_uploaded = 0;
  clear_ul('file_upload_ul');
  openModal('dialog_upload');
  openModal('dialog_bg');
  scroll_to_top('dialog_upload');
  for (let i = 0; i < items.length; i++) {
    var item = items[i];
    var entry = await item.webkitGetAsEntry();
    if (entry) {
      if (entry.isDirectory) {
        await create_directory(entry.name, "/");
        await process_dir(entry, `/${entry.name}/`);
      } else {
        file_queue_count++;
        uploadFile([entry, "/"])
      }
    }
  }
}

/*----------------------------------------------------------------------------*/

async function create_directory(name="", dir="/") {
  let response = await fetch(`/create_folder?path=${path}&dir=${dir_str + dir}&folder_name=${name}`, {
    method: 'POST'
  });
  if (!response.ok) {
    console.warn(response.status);
  }
  return;
}

const upload_bar_width = 300;
function set_upload_bar(state = 0) {
  document.getElementById("upload_progress").style.width = (upload_bar_width/100) * state;
}

var file_queue_count_uploaded = 0;
function uploadFile(files) {
  uploading_bool = true;
  files[0].file((file) => {
    append_file_uploading(files[1] + file.name)
    form = new FormData();
    var xhr = new XMLHttpRequest();
    form.append("file", file);
    xhr.open('post', `upload_file?path=${path}&dir=${dir_str + files[1]}&file=${file.name}`, true);
    xhr.upload.onprogress = function(event) {
      document.getElementById(`upload_progress_text_${files[1] + file.name}`).scrollIntoView({ block: "center" });
      document.getElementById(`upload_progress_text_${files[1] + file.name}`).innerHTML = `${Math.ceil((100 / event.total) * event.loaded)}%`;
      set_progressbar(`upload_progress_${files[1] + file.name}`, ((100 / event.total) * event.loaded))
    }
    xhr.upload.onload = function() {
      file_queue_count_uploaded++;
      if (file_queue_count_uploaded == file_queue_count) {
        closeModal('dialog_upload');
        closeModal('dialog_bg');
        update_dir();
      }

    }
    xhr.onload = function() {
      if (xhr.responseText.toString() === 'NO PLACE') {
        no_place_dialog();

      } else if (xhr.responseText.toString() === 'READ ONLY') {
        readonly_dialog();
      }

      uploading_bool = false;

    }
    xhr.send(form);
  });

}

/*----------------------------------------------------------------------------*/

function uploadFileNODD(files) {
  if (mobile) close_file_add();
  clear_ul('file_upload_ul');
  openModal('dialog_upload');
  openModal('dialog_bg');
  scroll_to_top('dialog_upload');
  uploading_bool = true;
  for (let i = 0; i < files.length; i++) {
    var file = files[i];
    append_file_uploading(file.name);
  }
  for (let i = 0; i < files.length; i++) {
    var file = files[i];

    form = new FormData();
    var xhr = new XMLHttpRequest();
    form.append("file", file);
    xhr.open('post', `upload_file?path=${path}&dir=${dir_str}&file=${file.name}`, true);
    xhr.upload.onprogress = function(event) {
      document.getElementById(`upload_progress_text_${file.name}`).scrollIntoView({ block: "center" });
      document.getElementById(`upload_progress_text_${file.name}`).innerHTML = `${Math.ceil((100 / event.total) * event.loaded)}%`;
      set_progressbar(`upload_progress_${file.name}`, ((100 / event.total) * event.loaded))
    }
    xhr.upload.onload = function() {
      if (i != 0) {
        document.getElementById(`upload_progress_text_${files[i-1].name}`).innerHTML = `100%`;
        set_progressbar(`upload_progress_${files[i-1].name}`, 100)
      }
      if (i == (files.length - 1)) {
        closeModal('dialog_upload');
        closeModal('dialog_bg');
        update_dir();
      }

    }
    xhr.onload = function() {
      if (xhr.responseText.toString() === 'NO PLACE') {
        no_place_dialog();

      } else if (xhr.responseText.toString() === 'READ ONLY') {
        readonly_dialog();
      }

    }
    xhr.send(form);
  }

}

/*----------------------------------------------------------------------------*/

function append_file_uploading(file_name) {
  append_to_ul("file_upload_ul", `<div class="file_upload_el">
    <p class="file_upload_p">${file_name}</p>
    <p id="upload_progress_text_${file_name}" class="file_upload_loading">0%</p>
    <div id="upload_progress_${file_name}_div" class="upload_bg">
      <div id="upload_progress_${file_name}" class="upload_progress" style="width: 0px;"></div>
    </div>
  </div>`)
}
