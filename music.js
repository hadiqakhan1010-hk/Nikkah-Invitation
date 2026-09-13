/* =========================================================
   MUSIC
   ---------------------------------------------------------
   TO ADD A SONG:
     1. Drop the file into the  music/  folder.
     2. Add its filename to the PLAYLIST list below.
   That's the only edit needed — nothing else in the site
   has to change.

   One track  -> loops forever.
   Several    -> plays through in order, then starts again.
   ========================================================= */

const PLAYLIST = [
  'music/fairytale.mp3',
  // 'music/second-song.mp3',
  // 'music/third-song.mp3',
];

/* Played only if none of the files above can be loaded.
   Set to '' to have silence instead. */
const FALLBACK_TRACK =
  'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b8a6d987.mp3';

/* ------------- nothing below needs editing ------------- */

const Music = (() => {
  const audio = document.getElementById('audio');
  const btn = document.getElementById('musicBtn');
  let index = 0;
  let failures = 0;
  let onFallback = false;

  function setIcon(on) {
    btn.textContent = on ? '♪' : '♪̶';
    btn.style.opacity = on ? 1 : .5;
  }

  function load(i) {
    index = (i + PLAYLIST.length) % PLAYLIST.length;
    audio.src = PLAYLIST[index];
    audio.loop = PLAYLIST.length === 1;
    audio.load();
  }

  function play() {
    // Browsers block playback until the visitor interacts with the page,
    // so this can legitimately fail before the doors are tapped.
    audio.play().then(() => setIcon(true)).catch(() => setIcon(false));
  }

  function start() {
    if (!PLAYLIST.length && !FALLBACK_TRACK) return;
    if (!audio.src) {
      if (PLAYLIST.length) { load(0); } else { useFallback(); }
    }
    play();
  }

  function next() {
    if (onFallback || PLAYLIST.length < 2) return;
    load(index + 1);
    play();
  }

  function toggle() {
    if (audio.paused) { start(); }
    else { audio.pause(); setIcon(false); }
  }

  function useFallback() {
    if (!FALLBACK_TRACK) { setIcon(false); return; }
    onFallback = true;
    audio.src = FALLBACK_TRACK;
    audio.loop = true;
    audio.load();
  }

  // A missing or unplayable file skips to the next one; if every track
  // in the playlist fails, fall back to the remote track.
  audio.addEventListener('error', () => {
    if (onFallback) { setIcon(false); return; }
    failures++;
    if (failures < PLAYLIST.length) { load(index + 1); play(); return; }
    useFallback();
    play();
  });

  audio.addEventListener('playing', () => { failures = 0; setIcon(true); });
  audio.addEventListener('ended', next);

  btn.addEventListener('click', toggle);

  return { start, toggle, next };
})();
