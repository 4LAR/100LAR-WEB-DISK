
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

  async function handleDrop(e) {
    e.preventDefault();
    let dt = e.dataTransfer;
    let items = dt.items;
    file_list = await file_handler(items);
    console.log(file_list);
    uploadFile(file_list);
  }
}

/*----------------------------------------------------------------------------*/

function traverseDirectory(entry) {
  const reader = entry.createReader();
  // Resolved when the entire directory is traversed
  return new Promise((resolve, reject) => {
    const iterationAttempts = [];
    function readEntries() {
      // According to the FileSystem API spec, readEntries() must be called until
      // it calls the callback with an empty array.  Seriously??
      reader.readEntries((entries) => {
        if (!entries.length) {
          // Done iterating this particular directory
          resolve(Promise.all(iterationAttempts));
        } else {
          // Add a list of promises for each directory entry.  If the entry is itself
          // a directory, then that promise won't resolve until it is fully traversed.
          iterationAttempts.push(Promise.all(entries.map(async (ientry) => {
            if (ientry.isFile) {
              // DO SOMETHING WITH FILES
              return [ientry, ientry.fullPath.split("/").slice(0, -1).join("/")];
            }
            // DO SOMETHING WITH DIRECTORIES
            await create_directory(ientry.name, ientry.fullPath.split("/").slice(0, -1).join("/"));
            const result = await traverseDirectory(ientry)
            return result.flat(1);
          })));
          // Try calling readEntries() again for the same dir, according to spec
          readEntries();
        }
      }, error => reject(error));
    // }, error => console.log(error));
    }
    readEntries();
  });
}

async function file_handler_old(items) {
  let out = [];
  // for (let i = 0; i < items.length; i++) {
  for (const suka of items) {
    const folder = suka.webkitGetAsEntry();
    if (folder) {
      if (folder.isDirectory) {
        try {
          await create_directory(folder.name);
          let result = await traverseDirectory(folder) // хуита
          console.log(result);
          result = result[0].reduce((acc, item) => {
            if (Array.isArray(item[0])) {
              item.forEach((_item) => {
                acc.push(_item)
              });
            } else {
              acc.push(item);
            };
            return acc;
          }, [])
          out = out.concat(result);
        } catch(error) {
          // console.log(error);
        }

      } else {
        out.push([folder, "/"]);
      }
    }
  }
  return out;
}

/*----------------------------------------------------------------------------*/
var file_queue = [];
async function process_dir(item, dir="/") {
  var directoryReader = item.createReader();
  await directoryReader.readEntries(async function(entries) {
    for (const entry of entries) {
      if (entry.isDirectory) {
        create_directory(entry.name, dir);
        await process_dir(entry, dir + entry.name + "/");
      } else {
        file_queue.push([entry, dir]);
      }
    }
  });
}

async function file_handler(items) {
  file_queue = [];
  for (const item of items) {
    var entry = await item.webkitGetAsEntry();
    if (entry) {
      if (entry.isDirectory) {
        create_directory(entry.name, "/");
        await process_dir(entry, `/${entry.name}/`);
      } else {
        file_queue.push([entry, "/"]);
      }
    }
  }
  return file_queue;
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

function uploadFile(files, count = 0) {
  openModal('rightBar');

  if (count < files.length) {
    uploading_bool = true;
    openModal('file_upload_block');

    files[count][0].file((file) => {
      document.getElementById("upload_file_count").innerHTML = `Upload ${files.length - count} files...`;
      document.getElementById("upload_file_name").innerHTML = file.name;

      form = new FormData();
      var xhr = new XMLHttpRequest();
      form.append("file", file);
      xhr.open('post', `upload_file?path=${path}&dir=${dir_str + files[count][1]}&file=${file.name}`, true);
      xhr.upload.onprogress = function(event) {
        set_upload_bar((100 / event.total) * event.loaded);
        //document.getElementById("upload_bar").max = event.total;
        //document.getElementById("upload_bar").value = event.loaded;
      }
      xhr.upload.onload = function() {
        uploadFile(files, ++count);

      }
    if (count == (files.length - 1))
      xhr.onload = function() {
        // console.log(xhr.responseText.toString())
        if (xhr.responseText.toString() === 'NO PLACE') {
          no_place_dialog();

        } else if (xhr.responseText.toString() === 'READ ONLY') {
          readonly_dialog();
        }

        uploading_bool = false;
        closeModal('file_upload_block');
        if (!right_bar_bool) {
          close_rightBar();
        }
        update_dir();

      }
      xhr.send(form);
    });
  } else {
    uploading_bool = false;
    closeModal('file_upload_block');
    if (!right_bar_bool) {
      close_rightBar();
    }
    update_dir();
  }
}
