
//
function add_path_map(count, name, open=false) {
  var ul = document.getElementById("path_map_list");
  var li = document.createElement("li");

  var left = path_map_left * count;
  var rotate = (!open)? 'path_map_img_rotate': '';

  li.innerHTML = `
  <div class="path_map_button">
    <img class="icon ${rotate}" style="margin: 5px ${left + 5}px" width="8" height="8" src="static/img/triangle.svg">
    <p style="margin: -17px ${left + 15}px;">${name}</p>
  </div>
  `;

  ul.appendChild(li);
}

/*
add_path_map(0, 'home', true);
add_path_map(1, 'stolar', true);
add_path_map(2, 'downloads', false);
add_path_map(2, 'images', false);
add_path_map(2, 'docs', false);
add_path_map(2, 'test', true);
*/
