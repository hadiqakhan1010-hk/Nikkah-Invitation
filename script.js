/* ===================================================
   1. GLOBAL CONSTANTS
=================================================== */
const EVENT_DATE = new Date("2027-01-29T18:00:00").getTime();

/* ===================================================
   2. DOOR REVEAL LOGIC (FIXED WITH MUSIC.JS INTEGRATION)
=================================================== */
function initDoorReveal() {
  const doors = document.getElementById('doors');
  const doorVideo = document.getElementById('door-video');

  if (!doors) return;

  let isOpened = false;

  function triggerOpen(e) {
    if (isOpened) return;
    isOpened = true;

    // 1. Trigger Music.js module on Direct User Gesture (Mobile Fix)
    if (typeof Music !== 'undefined') {
      Music.start();
    }

    // 2. Hide Hint Overlay
    const hint = doors.querySelector('.door-overlay');
    if (hint) hint.style.opacity = '0';

    // 3. Play Video (Muted to ensure audio doesn't get blocked)
    if (doorVideo) {
      doorVideo.muted = true;
      doorVideo.playsInline = true; 
      doorVideo.setAttribute('playsinline', '');
      doorVideo.setAttribute('webkit-playsinline', '');

      const playPromise = doorVideo.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          const checkSparkleTime = () => {
            if (doorVideo.currentTime >= 3.8 || doorVideo.ended) {
              doorVideo.removeEventListener('timeupdate', checkSparkleTime);
              doors.classList.add('open');
              setTimeout(() => doors.classList.add('gone'), 1200);
            }
          };
          doorVideo.addEventListener('timeupdate', checkSparkleTime);
        }).catch(err => {
          console.log("Video Play Error:", err);
          doors.classList.add('open');
          setTimeout(() => doors.classList.add('gone'), 1200);
        });
      }
    } else {
      doors.classList.add('open');
      setTimeout(() => doors.classList.add('gone'), 1200);
    }
  }

  // Dual listener fix for Mobile
  doors.addEventListener('click', triggerOpen);
}
/* ===================================================
   3. SCRATCH CARD FEATURE
=================================================== */
function initScratchCard() {
  const canvas = document.getElementById('scratch');
  if (!canvas) return;
  const wrap = canvas.parentElement;
  if (!wrap) return;

  const ctx = canvas.getContext('2d');
  let scratching = false;
  let cleared = false;

  canvas.width = wrap.offsetWidth || 320;
  canvas.height = wrap.offsetHeight || 200;

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#E8B4B8');
  gradient.addColorStop(0.5, '#F3D2D5');
  gradient.addColorStop(1, '#D89A9F');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#6E2D36';
  ctx.font = '600 13px "Cinzel", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✶ SCRATCH HERE ✶', canvas.width / 2, canvas.height / 2);

  function scratch(e) {
    if (!scratching || cleared) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    checkCleared();
  }

  function checkCleared() {
    if (cleared) return;
    const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < pixelData.length; i += 32) {
      if (pixelData[i] === 0) transparent++;
    }
    if (transparent / (pixelData.length / 32) > 0.5) {
      cleared = true;
      canvas.style.transition = 'opacity 0.8s ease';
      canvas.style.opacity = '0';
      setTimeout(() => (canvas.style.pointerEvents = 'none'), 800);
    }
  }

  canvas.addEventListener('mousedown', (e) => { scratching = true; scratch(e); });
  window.addEventListener('mouseup', () => (scratching = false));
  canvas.addEventListener('mousemove', scratch);

  canvas.addEventListener('touchstart', (e) => { scratching = true; scratch(e); }, { passive: true });
  window.addEventListener('touchend', () => (scratching = false));
  canvas.addEventListener('touchmove', (e) => {
    if (scratching) { e.preventDefault(); scratch(e); }
  }, { passive: false });
}


/* ===================================================
   4. COUNTDOWN TIMER
=================================================== */
function tickCountdown() {
  const container = document.getElementById('countdown');
  const dd = document.getElementById('dd');
  const hh = document.getElementById('hh');
  const mm = document.getElementById('mm');
  const ss = document.getElementById('ss');

  if (!container || !dd || !hh || !mm || !ss) return;

  const now = new Date().getTime();
  const diff = EVENT_DATE - now;

  if (diff <= 0) {
    container.innerHTML = '<div class="cd-cell"><div class="cd-num">Today!</div></div>';
    return;
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);

  const p = n => String(n).padStart(2, '0');

  dd.textContent = p(d);
  hh.textContent = p(h);
  mm.textContent = p(m);
  ss.textContent = p(s);
}


/* ===================================================
   5. RSVP LOGIC
=================================================== */
function initRSVP() {
  const rsvpForm = document.getElementById('rsvpForm');
  if (!rsvpForm) return;

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const thanksMsg = document.getElementById('thanks');
    if (thanksMsg) {
      thanksMsg.style.display = 'block';
    }

    const submitBtn = e.target.querySelector('.btn');
    if (submitBtn) {
      submitBtn.style.display = 'none';
    }
  });
}


/* ===================================================
   6. INITIALIZE ALL ON DOM LOAD
=================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initDoorReveal();
  initScratchCard();
  initRSVP();
  setInterval(tickCountdown, 1000);
  tickCountdown();
});