/* ===================================================
   1. GLOBAL CONSTANTS
=================================================== */
const EVENT_DATE = new Date("2027-01-29T18:00:00").getTime();


/* ===================================================
   2. DOOR REVEAL LOGIC (FIXED FOR LIVE SERVER AUDIO)
=================================================== */
function initDoorReveal() {
  const doors = document.getElementById('doors');
  const doorVideo = document.getElementById('door-video');
  const heroVideo = document.getElementById('hero-bg-video');
  const audio = document.getElementById('audio');

  if (!doors) return;

  let isOpened = false;

  function startAudio() {
    if (!audio) return;
    audio.muted = false;
    audio.play().catch(() => {});
  }

  function playHeroVideo() {
    if (heroVideo) {
      heroVideo.muted = true;
      heroVideo.currentTime = 0;
      const promise = heroVideo.play();
      if (promise !== undefined) {
        promise.catch(err => console.log("Hero video play error:", err));
      }
    }
  }

  function triggerOpen() {
    if (isOpened) return;
    isOpened = true;

    startAudio();

    const hint = doors.querySelector('.door-overlay');
    if (hint) hint.style.opacity = '0';

    if (doorVideo) {
      doorVideo.muted = true; 
      doorVideo.setAttribute('playsinline', '');
      
      doorVideo.play().then(() => {
        const checkSparkleTime = () => {
          if (doorVideo.currentTime >= 3.8 || doorVideo.ended) {
            doorVideo.removeEventListener('timeupdate', checkSparkleTime);
            doors.classList.add('open');
            // Jab doors hat jayein, tab hero video fresh play ho
            playHeroVideo();
            setTimeout(() => doors.classList.add('gone'), 1200);
          }
        };
        doorVideo.addEventListener('timeupdate', checkSparkleTime);
      }).catch(() => {
        doors.classList.add('open');
        playHeroVideo();
        setTimeout(() => doors.classList.add('gone'), 1200);
      });
    } else {
      doors.classList.add('open');
      playHeroVideo();
      setTimeout(() => doors.classList.add('gone'), 1200);
    }
  }

  doors.addEventListener('click', triggerOpen);
}

/* ===================================================
   HIGH DENSITY GOLD GLITTER SCRATCH CARD (NO WHITE BORDER)
=================================================== */
function initScratchCard() {
  const canvas = document.getElementById('scratch');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const w = canvas.width = 280;
  const h = canvas.height = 250;

  // Exact Symmetrical Plump Heart Path
  function drawPlumpHeart(c) {
    c.beginPath();
    c.moveTo(w / 2, h * 0.82);
    c.bezierCurveTo(w * 0.08, h * 0.55, w * 0.02, h * 0.16, w * 0.28, h * 0.09);
    c.bezierCurveTo(w * 0.43, h * 0.04, w / 2, h * 0.22, w / 2, h * 0.22);
    c.bezierCurveTo(w / 2, h * 0.22, w * 0.57, h * 0.04, w * 0.72, h * 0.09);
    c.bezierCurveTo(w * 0.98, h * 0.16, w * 0.92, h * 0.55, w / 2, h * 0.82);
    c.closePath();
  }

  // Draw Rich Gold & Dense Sparkle Glitter
  function renderGlitterGoldHeart() {
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    
    drawPlumpHeart(ctx);
    ctx.clip();

    // Warm Rich Metallic Gold Base Gradient
    const goldGrad = ctx.createLinearGradient(0, 0, w, h);
    goldGrad.addColorStop(0, '#EBD28B');   /* Bright Gold Highlight */
    goldGrad.addColorStop(0.3, '#C29841');  /* Main Warm Gold */
    goldGrad.addColorStop(0.7, '#A3792C');  /* Deep Gold Shadow */
    goldGrad.addColorStop(1, '#7C581A');    /* Rich Gold Edge Accent */

    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, w, h);

    // Dense Multi-Sized Glitter Particles (1200+ Sparkles)
    for (let i = 0; i < 1200; i++) {
      const rx = Math.random() * w;
      const ry = Math.random() * h;
      const size = Math.random() * 2.2;
      const opacity = Math.random() * 0.95;
      
      // Random Gold & Bright White Sparkles Mix
      const randColor = Math.random();
      if (randColor > 0.6) {
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      } else if (randColor > 0.3) {
        ctx.fillStyle = `rgba(255, 243, 176, ${opacity})`;
      } else {
        ctx.fillStyle = `rgba(255, 215, 0, ${opacity})`;
      }

      ctx.beginPath();
      ctx.arc(rx, ry, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }

  renderGlitterGoldHeart();

  // Smooth Scratch Interaction
  let isScratching = false;

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (w / rect.width),
      y: (clientY - rect.top) * (h / rect.height)
    };
  }

  function doScratch(e) {
    if (!isScratching) return;
    const pos = getPos(e);
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 22, 0, Math.PI * 2);
    ctx.fill();
  }

  function startScratch(e) {
    isScratching = true;
    doScratch(e);
  }

  function stopScratch() {
    isScratching = false;
  }

  canvas.addEventListener('mousedown', startScratch);
  canvas.addEventListener('mousemove', doScratch);
  window.addEventListener('mouseup', stopScratch);

  canvas.addEventListener('touchstart', (e) => { startScratch(e); }, { passive: true });
  canvas.addEventListener('touchmove', (e) => { 
    if (isScratching) {
      e.preventDefault(); 
      doScratch(e); 
    }
  }, { passive: false });
  window.addEventListener('touchend', stopScratch);
}

document.addEventListener('DOMContentLoaded', initScratchCard);
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

