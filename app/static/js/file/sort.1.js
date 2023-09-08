
const SORT_BY_TYPE = [
  'dir',
  'archive',
  'image',
  'text file',
  'pdf',
  'video',
  'audio',
  'file'
];

// event смены типа сортировки
function sort_files_event(e) {
  let type = document.getElementById("file_sort_selector_type").value;
  let order = document.getElementById("file_sort_selector_order").value;
  sort_type = type;
  sort_order = (order == 'descending')? true: false;
  localStorage.setItem('sort_type', sort_type);
  localStorage.setItem('sort_order', sort_order);
  get_files();
}


// функция сортирующая файлы по типу
function sort_files(files_list, sort_type="type", reversed=false) {
  var new_files_list = [];

  switch (sort_type) {
    case "type":
      for (let i = 0; i < SORT_BY_TYPE.length; i++)
        for (let j = 0; j < files_list.length; j++) {
          if (SORT_BY_TYPE[i] == files_list[j]['type'])
            new_files_list.push(files_list[j]);
        }
      break;

    case "name":
      new_files_list = files_list.sort(function (a, b) {
        if (a['name'].toLowerCase() < b['name'].toLowerCase()) {
          return -1;
        }
        if (a['name'].toLowerCase() > b['name'].toLowerCase()) {
          return 1;
        }
        return 0;
      })
      break;

    case "date":
      new_files_list = files_list.sort(function (a, b) {
        if (a['type'] == 'dir') return -1;
        if (b['type'] == 'dir') return 1;
        return string_to_date(b['time']) - string_to_date(a['time']);
      })
      break;

    case "size":
      new_files_list = files_list.sort(function (a, b) {
        if (a['type'] == 'dir') return -1;
        if (b['type'] == 'dir') return 1;
        return convert_size_to_b(Math.floor(b['size'].split(" ")[0]), size_name.indexOf(b['size'].split(" ")[1])) - convert_size_to_b(Math.floor(a['size'].split(" ")[0]), size_name.indexOf(a['size'].split(" ")[1]));
      })
      break;
  }

  if (reversed) new_files_list = new_files_list.reverse()

  return new_files_list;
}
