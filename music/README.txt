Background music
================

TO ADD A SONG:

  1. Copy the audio file into this folder.
  2. Open  music.js  and add its filename to the PLAYLIST list
     at the very top:

         const PLAYLIST = [
           'music/background.mp3',
           'music/second-song.mp3',
         ];

That's the whole process. Nothing else in the site needs changing.

Notes
-----
* One track loops forever. Several play through in order, then repeat.
* MP3 is the safest format across phones. .m4a and .ogg also work.
* Music cannot start until the visitor taps the "TAP TO OPEN" doors --
  browsers block autoplay before a user gesture. The circular note
  button at the bottom-right toggles it after that.
* If a listed file is missing or unplayable, it is skipped. If every
  track fails, FALLBACK_TRACK in music.js plays instead; set that
  to '' if you would rather have silence.
