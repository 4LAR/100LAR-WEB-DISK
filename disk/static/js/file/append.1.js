
function append_back_dir() {
  var ul = document.getElementById("file_list");

  // если это не корневая папка
  if (dir.length > 0) {
    // создаём кнопку перехода в верхнюю директорию
    var li = document.createElement("li");

    if (mobile) {
      li.innerHTML = `
        <div class="file_checkbox_bg"></div>
        <div class="file block_select" onclick="back_dir()">
          <img class="${(colored_file_icons)? "folder_filter": ""} icon" style="margin: 5px 55px" width="35" height="35" src="static/img/files/folder.svg">
          <p style="margin: -38px 100px">...</p>
        </div>
      `;

    } else {
      if (draw_type == 'list') {
        li.innerHTML = `
          <div class="file_checkbox_bg"></div>
          <div class="file block_select" onclick="back_dir()">
            <img class="${(colored_file_icons)? "folder_filter": ""} icon" style="margin: 7px 50px" width="25" height="25" src="static/img/files/folder.svg">
            <p style="margin: -25px 80px">...</p>
          </div>
        `;
      } else {
        li.innerHTML = `
          <div class="file_grid block_select" onclick="back_dir()">
            <img class="${(colored_file_icons)? "folder_filter": ""} icon" width="40" height="40" src="static/img/files/folder.svg">
            <p class="file_name_grid">...</p>
          </div>
        `;
      }
    }
    // добавляем кнопка в список
    ul.appendChild(li);
  }
}

function append_path_info(count_elements) {
  var ul = document.getElementById("file_list");

  // создаём кнопку перехода в верхнюю директорию
  var li = document.createElement("li");

  if (!mobile) {
    if (draw_type == 'list') {
      li.innerHTML = `
        <div class="file_delimiter_bg"></div>
        <div class="file_pathInfo">
          <label for="" style="position: absolute; margin: -1px 60px;">
            Sort by
            <select onchange="sort_files_event()" class="file_sort_selector" id="file_sort_selector_type" style="margin: 0px 5px">
              <option value="type">type</option>
              <option value="name">name</option>
              <option value="date">date</option>
              <option value="size">size</option>
            </select>
          </label>
          <label for="" style="position: absolute; margin: 2px 170px;">
            <select onchange="sort_files_event()" class="file_sort_selector" id="file_sort_selector_order" style="margin: 0px 5px">
              <option value="descending">in descending order</option>
              <option value="ascending">in ascending order</option>
            </select>
          </label>
          <p style="position: absolute; margin: 0px 0px; right: 10px;">elements: ${count_elements}</p>
        </div>
      `;
    } else {
      li.innerHTML = `
        <div class="file_grid"></div>
      `;
    }
  }
  // добавляем кнопка в список
  ul.appendChild(li);

  if (!mobile) {
    selectElement("file_sort_selector_type", sort_type);
    selectElement("file_sort_selector_order", (sort_order)? 'descending': 'ascending');
  }
}


function get_color_by_type(type) {
  var color_class = "";
  switch (type) {
    case 'archive':
      color_class = "archive_filter";
      break;

    case 'audio':
      color_class = "media_filter";
      break;

    case 'image':
      color_class = "media_filter";
      break;

    case 'pdf':
      color_class = "media_filter";
      break;

    case 'video':
      color_class = "media_filter";
      break;

    case 'text file':
      color_class = "text_filter";
      break;

    case 'file':
      color_class = "text_filter";
      break;

    case 'dir':
      color_class = "folder_filter";
      break;
  }
  return color_class;
}

// добавление файла в список
function append_file(type, name, size='', path_s='', date='', mime='') {
  var ul = document.getElementById("file_list");
  var li = document.createElement("li");

  var color_class = "";
  if (colored_file_icons) {
    color_class = get_color_by_type(type);
  }

  if (type === 'audio') {
    audio_list.push([type, name, size, path_s, date, mime, `/download?path=${path}&dir=${dir_str}&file=${name}`]);
  } else if (type === 'image') {
    image_list.push([type, name, size, path_s, date, mime, `/download?path=${path}&dir=${dir_str}&file=${name}`]);
  }

  var draw_type_class = '';
  var file_info = '';
  var image_size = 0;

  if (mobile) {
    draw_type_class = 'file';

    if (type == 'dir') {
      file_info = `
        <p style="margin: -38px 100px">${name}</p
      `;
    } else {
      file_info = `
        <p style="margin: -38px 100px">${name}</p>
        <p style="position: absolute; margin: 32px 100px; color: var(--color-hide-font);">${size}</p>
      `;
    }

    image_size = 35;

    var str = `
      <label for="checkbox_file_${name}"><div class="file_checkbox_bg">
        <div style="position: absolute; margin: 10px 10px">
          <input type="checkbox" class="custom-checkbox custom-checkbox-mobile" id="checkbox_file_${name}" name="${name}" value="yes" onchange="checkBox_file(this, '${name}', '${type}')">
          <label for="checkbox_file_${name}"></label>
        </div>
      </div></label>
    `
    if (type == 'dir') {
      // директория
      str += `
        <div class="${draw_type_class} block_select" id="${name}" onclick="forward_dir('${name}')">
          <img class="${color_class} icon" style="margin: 5px 55px" width="${image_size}" height="${image_size}" src="static/img/files/folder.svg">
          ${file_info}
        </div>
      `;

    } else {
      // файл
       str += `
        <div class="${draw_type_class} block_select" id="${name}" onclick="open_fileInfo('${name}', '${type}', '${size}', '${path_s}', '${date}', '${mime}')">
          <img class="${color_class} icon" style="margin: 5px 55px" width="${image_size}" height="${image_size}" src="static/img/files/${type}.svg">
          ${file_info}
        </div>
      `;
    }

  } else {
    if (draw_type == 'list') {
      draw_type_class = 'file';

      if (type == 'dir') {
        file_info = `
          <p style="margin: -29px 80px;">${name}</p
        `;
      } else {
        file_info = `
          <p style="margin: -29px 80px" class="file_name">${name}</p>
          <p style="margin: 8px 110px" align="right">${date}</p>
          <p style="margin: -30px 10px" align="right">${size}</p>
        `;
      }

    } else if (draw_type == 'grid') {
      draw_type_class = 'file_grid';
      if (type == 'dir') {
        file_info = `
          <p class="file_name_grid">${name}</p>
        `;
      } else {
        file_info = `
          <p class="file_name_grid">${name}</p>
        `;
      }
    }

    // checkBox
    var str = `
      <label for="checkbox_file_${name}"><div class="${(draw_type == 'list')? 'file_checkbox_bg': ''}">
        <div style="position: absolute; margin: 10px 12px">
          <input type="checkbox" class="custom-checkbox checkBox_file" id="checkbox_file_${name}" name="${name}" value="yes" onchange="checkBox_file(this, '${name}', '${type}')">
          <label for="checkbox_file_${name}"></label>
        </div>
      </div></label>
    `

    if (type == 'dir') {
      // директория
      str += `
        <div class="${draw_type_class} block_select" id="${name}" onclick="forward_dir('${name}')">
          <img class="${color_class} icon" width="${image_size}" height="${image_size}" src="static/img/files/folder.svg">
          ${file_info}
        </div>
      `;

    } else {
      // файл

       str += `
        <div class="${draw_type_class} block_select" id="${name}" ondblclick="" onclick="open_fileInfo('${name}', '${type}', '${size}', '${path_s}', '${date}', '${mime}')">
          <img class="${color_class} icon" width="${image_size}" height="${image_size}" src="static/img/files/${type}.svg">
          ${file_info}
        </div>
      `;
    }
  }

  li.innerHTML = str;

  // добавояем папку или файл в список
  ul.appendChild(li);
}
