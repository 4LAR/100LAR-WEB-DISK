
function load_preview() {
  document.getElementById("preview_video").pause();
  document.getElementById("preview_audio").pause();
  switch (type_file) {
    case 'image':
      openModal('file_activity_view');
      load_preview_image();
      break;

    case 'video':
      openModal('file_activity_view');
      load_preview_video();
      break;

    case 'audio':
      openModal('file_activity_view');
      load_preview_audio();
      break;

    case 'text file':
      openModal('file_activity_view');
      load_preview_text();
      break;

    case 'pdf':
      if (!mobile)
        openModal('file_activity_view');
      load_preview_pdf();
      break;

    case 'archive':
      if (!mobile)
        openModal('file_activity_view');
      load_preview_archive();
      break;
  }
}


function load_preview_archive() {
  if (document.getElementById("checkbox_preview_image").checked) {
    openModal('preview_archive_div');
    load_archive(url_file, selected_file_name);
  } else {
    closeModal('preview_archive_div');
  }
  localStorage.setItem('preview_image', document.getElementById("checkbox_preview_image").checked);
}

function load_preview_pdf() {
  if (!mobile)
    if (document.getElementById("checkbox_preview_image").checked) {
      openModal('preview_pdf_div');
      load_pdf(url_file, selected_file_name);
    } else {
      closeModal('preview_pdf_div');
      document.getElementById('preview_pdf_iframe').src = `about:blank`;
    }
  localStorage.setItem('preview_image', document.getElementById("checkbox_preview_image").checked);
}

function load_preview_text() {
  if (document.getElementById("checkbox_preview_image").checked) {
    openModal('preview_text_div');
    load_text(url_file, selected_file_name);
  } else {
    closeModal('preview_text_div');
  }
  localStorage.setItem('preview_image', document.getElementById("checkbox_preview_image").checked);
}

function load_preview_image() {
  if (document.getElementById("checkbox_preview_image").checked) {
    openModal('preview_image_div');
    load_image(url_file, selected_file_name);
  } else {
    closeModal('preview_image_div');
  }
  localStorage.setItem('preview_image', document.getElementById("checkbox_preview_image").checked);
}

function load_preview_video() {
  if (document.getElementById("checkbox_preview_image").checked) {
    openModal('preview_video_div');
    load_video(url_file, selected_file_name);
  } else {
    closeModal('preview_video_div');
  }
  localStorage.setItem('preview_image', document.getElementById("checkbox_preview_image").checked);
}

var audio_list = [];
var image_list = [];

function load_preview_audio() {
  if (document.getElementById("checkbox_preview_image").checked) {
    openModal('preview_audio_div');
    load_audio(url_file, selected_file_name);
  } else {
    closeModal('preview_audio_div');
  }
  localStorage.setItem('preview_image', document.getElementById("checkbox_preview_image").checked);
}

function set_preview_image_type(type="auto") {
  document.getElementById("preview_image").style.imageRendering = type;
  if (!mobile) document.getElementById("preview_image_fullscreen").style.imageRendering = type;
  localStorage.setItem('preview_imageRendering', type);
  selectElement("preview_image_type", type);
}

function preview_image_type(selectObject) {
  set_preview_image_type(selectObject.value);
}

if (localStorage.getItem('preview_image') == null) {
  localStorage.setItem('preview_image', false);
}

document.getElementById("checkbox_preview_image").checked = (localStorage.getItem('preview_image') === 'true');
set_preview_image_type(get_localStorage("preview_imageRendering", "auto"));
