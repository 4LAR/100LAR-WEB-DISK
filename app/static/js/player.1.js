

const audio_id = "preview_audio";
const audio_name_id = "preview_audio_name";
const audio_play_pause_id = "preview_play_pause_audio";
const audio_duration_id = "preview_audio_input_duration";
const audio_volume_id = "preview_audio_volume";

var audio_duration_hover = false;

set_volume_audio(get_localStorage('preview_audio_volume', 50));

function load_audio(url, name) {
  document.getElementById(audio_id).setAttribute('src', url_file);
  document.getElementById(audio_name_id).value = name
  document.getElementById(audio_duration_id).value = 0;
  pause_audio();
}

function pause_audio() {
  document.getElementById(audio_id).pause();
  document.getElementById(audio_play_pause_id).src = 'static/img/player/pause.svg';
  document.getElementById(audio_play_pause_id).onclick = function(){play_audio()};
}

function play_audio() {
  document.getElementById(audio_duration_id).max = document.getElementById(audio_id).duration;
  document.getElementById(audio_id).play();
  document.getElementById(audio_play_pause_id).src = 'static/img/player/play.svg';
  document.getElementById(audio_play_pause_id).onclick = function(){pause_audio()};

}

function set_volume_audio(volume) {
  document.getElementById(audio_id).volume = volume / 100;
  localStorage.setItem('preview_audio_volume', volume);
}

function set_duration_audio(time) {
  document.getElementById(audio_id).currentTime = time;
}

document.getElementById(audio_id).ontimeupdate = function() {
  if (!audio_duration_hover)
    document.getElementById(audio_duration_id).value = this.currentTime;
};

document.getElementById(audio_id).onended = function() {
  pause_audio();
  set_duration_audio(0);
};
