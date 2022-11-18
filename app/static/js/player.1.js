
/* AUDIO */
const audio_id = "preview_audio";
const audio_name_id = "preview_audio_name";
const audio_play_pause_id = "preview_play_pause_audio";
const audio_duration_id = "preview_audio_input_duration";
const audio_volume_id = "preview_audio_volume";

var audio_duration_hover = false;
var audio_play_bool = false;

if (!mobile) {
  set_volume_audio(get_localStorage('preview_audio_volume', 50));
  document.getElementById(audio_volume_id).value = get_localStorage('preview_audio_volume', 50);
} else {
  set_volume_audio(100);
}

function load_audio(url, name) {
  document.getElementById(audio_id).setAttribute('src', url);
  document.getElementById(audio_name_id).value = name;
  document.getElementById(audio_duration_id).value = 0;
  pause_audio();
}

function pause_audio() {
  document.getElementById(audio_id).pause();
  document.getElementById(audio_play_pause_id).src = 'static/img/player/play.svg';
  document.getElementById(audio_play_pause_id).onclick = function(){play_audio()};
  audio_play_bool = false;
}

function play_audio() {
  document.getElementById(audio_duration_id).max = document.getElementById(audio_id).duration;
  document.getElementById(audio_id).play();
  document.getElementById(audio_play_pause_id).src = 'static/img/player/pause.svg';
  document.getElementById(audio_play_pause_id).onclick = function(){pause_audio()};
  audio_play_bool = true;
}

function next_audio(back=false) {
  var audio_play_bool_l = audio_play_bool;
  var next_file = -1;
  for (let i = 0; i < audio_list.length; i++) {
    if (document.getElementById(audio_name_id).value == audio_list[i][1]) {
      if (!back) {
        if (i < audio_list.length - 1) next_file = i + 1;
        else next_file = 0;

      } else {
        if (i > 0) next_file = i - 1;
        else next_file = audio_list.length - 1;
      }

      break;
    }
  }
  if (next_file != -1) {
    open_fileInfo(
      audio_list[next_file][1],
      audio_list[next_file][0],
      audio_list[next_file][2],
      audio_list[next_file][3],
      audio_list[next_file][4],
      audio_list[next_file][5],
    );
  }
  if (audio_play_bool_l) {
    play_audio();
    play_audio();
  }
}

function set_volume_audio(volume) {
  document.getElementById(audio_id).volume = volume / 100;
  if (!mobile) localStorage.setItem('preview_audio_volume', volume);
}

function set_duration_audio(time) {
  document.getElementById(audio_id).currentTime = time;
}

document.getElementById(audio_id).ontimeupdate = function() {
  if (!audio_duration_hover)
    document.getElementById(audio_duration_id).value = this.currentTime;
};

document.getElementById(audio_id).onloadedmetadata = function() {
  document.getElementById(audio_duration_id).max = document.getElementById(audio_id).duration;
};

document.getElementById(audio_id).onended = function() {

  set_duration_audio(0);
  if (audio_play_bool) {
    next_audio();
  } else {
    pause_audio();
  }
};


/* VIDEO */
const video_id = "preview_video";
const video_play_pause_id = "preview_play_pause_video";
const video_duration_id = "preview_video_input_duration";
const video_duration_info = "preview_video_duration_info";
const video_duration_info_text = "preview_video_duration_info_p";
const video_volume_id = "preview_video_volume";

const video_fullscreen_id = "preview_video_fullscreen";

var video_duration_hover = false;
var video_fullscreen = false;
var video_fullscreen_nametag = '_fullscreen';
var video_pause = true;

if (!mobile) {
  set_volume_video(get_localStorage('preview_audio_volume', 50));
  document.getElementById(video_volume_id).value = get_localStorage('preview_audio_volume', 50);
} else {
  set_volume_video(100);
}

function load_video(url, name) {
  document.getElementById(video_id).setAttribute('src', url_file);
  document.getElementById(video_fullscreen_id).setAttribute('src', url_file);
  document.getElementById(video_duration_id).value = 0;
  pause_video();
  video_fullscreen = false;
}

function close_video(url) {
  document.getElementById(video_id).setAttribute('src', '');
  document.getElementById(video_fullscreen_id).setAttribute('src', '');
  document.getElementById(video_duration_id).value = 0;
  pause_video();
}

function pause_video() {
  video_pause = true;
  document.getElementById(video_id + ((video_fullscreen)? video_fullscreen_nametag: '')).pause();
  document.getElementById(video_play_pause_id + ((video_fullscreen)? video_fullscreen_nametag: '')).src = 'static/img/player/play.svg';
  document.getElementById(video_play_pause_id + ((video_fullscreen)? video_fullscreen_nametag: '')).onclick = function(){play_video()};
  document.getElementById(video_id + ((video_fullscreen)? video_fullscreen_nametag: '')).onclick = function(){play_video()};
}

function play_video() {
  video_pause = false;
  document.getElementById(video_id + ((video_fullscreen)? video_fullscreen_nametag: '')).play();
  document.getElementById(video_duration_id + ((video_fullscreen)? video_fullscreen_nametag: '')).max = document.getElementById(video_id + ((video_fullscreen)? video_fullscreen_nametag: '')).duration;
  document.getElementById(video_play_pause_id + ((video_fullscreen)? video_fullscreen_nametag: '')).src = 'static/img/player/pause.svg';
  document.getElementById(video_play_pause_id + ((video_fullscreen)? video_fullscreen_nametag: '')).onclick = function(){pause_video()};
  document.getElementById(video_id + ((video_fullscreen)? video_fullscreen_nametag: '')).onclick = function(){pause_video()};

}

function set_volume_video(volume) {
  document.getElementById(video_id + ((video_fullscreen)? video_fullscreen_nametag: '')).volume = volume / 100;
  document.getElementById(video_volume_id + ((video_fullscreen)? video_fullscreen_nametag: '')).value = volume;
  if (!mobile) localStorage.setItem('preview_audio_volume', volume);
}

function set_duration_video(time) {
  document.getElementById(video_id + ((video_fullscreen)? video_fullscreen_nametag: '')).currentTime = time;
}

function full_screen() {
  var video_pause_back = video_pause;
  pause_video();
  var duration = document.getElementById(video_id + ((video_fullscreen)? video_fullscreen_nametag: '')).currentTime;
  if (!video_fullscreen) {
    video_fullscreen = true;
    openModal('preview_video_fullscreen_div');

  } else {
    video_fullscreen = false;
    closeModal('preview_video_fullscreen_div');

  }
  set_duration_video(duration);
  set_volume_video(get_localStorage('preview_audio_volume', 50));
  if (!video_pause_back) play_video();
}

document.getElementById(video_id).ontimeupdate = function() {
  if (!video_duration_hover)
    document.getElementById(video_duration_id + ((video_fullscreen)? video_fullscreen_nametag: '')).value = this.currentTime;
};

document.getElementById(video_fullscreen_id).ontimeupdate = function() {
  if (!video_duration_hover)
    document.getElementById(video_duration_id + ((video_fullscreen)? video_fullscreen_nametag: '')).value = this.currentTime;
};

document.getElementById(video_id).onended = function() {
  pause_video();
  set_duration_video(0);
};

document.getElementById(video_fullscreen_id).onended = function() {
  pause_video();
  set_duration_video(0);
};

function showTooltip_video_duration(e) {
  let w = document.getElementById(video_duration_id + ((video_fullscreen)? video_fullscreen_nametag: '')).clientWidth;
  let x = e.offsetX;
  let percents = x / w;
  let max = parseInt(document.getElementById(video_duration_id + ((video_fullscreen)? video_fullscreen_nametag: '')).max)
  document.getElementById(video_duration_info_text + ((video_fullscreen)? video_fullscreen_nametag: '')).innerHTML = seconds_to_hms(Math.floor(percents * max + 0.5));
}

window.onmousemove = function (e) {
  let x = (e.clientX) + 'px';
  document.getElementById(video_duration_info + ((video_fullscreen)? video_fullscreen_nametag: '')).style.left = (e.clientX - 25) + "px";
  document.getElementById(video_duration_info + ((video_fullscreen)? video_fullscreen_nametag: '')).style.top = document.getElementById(video_duration_id + ((video_fullscreen)? video_fullscreen_nametag: '')).getBoundingClientRect().y - 50;
}

/* IMAGE */
function load_image(url, name) {

}

function image_fullscreen() {

}
