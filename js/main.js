(() => {
'use strict';

/* ══════════════════════════════════════
   Background Canvas — Hero Particle Network
   (white/light particles on dark green hero)
══════════════════════════════════════ */
const heroCanvas = document.getElementById('hero-canvas');
if (heroCanvas) {
  const ctx = heroCanvas.getContext('2d');
  let W, H, pts;
  const N = 70, DIST = 140, COL = '255,255,255';

  const resize = () => {
    W = heroCanvas.width  = heroCanvas.offsetWidth;
    H = heroCanvas.height = heroCanvas.offsetHeight;
  };

  const mkPt = () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 1.5 + 0.6,
  });

  const tick = () => {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${COL},0.55)`;
      ctx.fill();
    });
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < DIST) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(${COL},${(1 - d/DIST) * 0.13})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  };

  resize();
  pts = Array.from({ length: N }, mkPt);
  tick();
  window.addEventListener('resize', () => { resize(); pts = Array.from({ length: N }, mkPt); }, { passive: true });
}

/* ══════════════════════════════════════
   Scroll: Progress Bar + Header + FAB
══════════════════════════════════════ */
const scrollBar = document.getElementById('scroll-bar');
const header    = document.getElementById('header');
const fab       = document.getElementById('fab');

window.addEventListener('scroll', () => {
  const s = window.scrollY;
  const t = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollBar) scrollBar.style.width = `${(s / t) * 100}%`;
  if (header)    header.classList.toggle('scrolled', s > 60);
  if (fab)       fab.classList.toggle('show', s > 400);
}, { passive: true });

fab?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ══════════════════════════════════════
   Reveal on Scroll
══════════════════════════════════════ */
const reveals = document.querySelectorAll('[data-reveal]');
const revealObs = new IntersectionObserver(
  (entries, io) => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  }),
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);
reveals.forEach(el => revealObs.observe(el));

/* ══════════════════════════════════════
   Text Scramble on Hero
══════════════════════════════════════ */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

function scramble(el, finalText, duration = 900) {
  const start = performance.now();
  const run = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const revealed = Math.floor(progress * finalText.length);
    let out = '';
    for (let i = 0; i < finalText.length; i++) {
      if (finalText[i] === ' ' || finalText[i] === '\n') { out += finalText[i]; continue; }
      if (i < revealed) out += finalText[i];
      else out += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    el.textContent = out;
    if (progress < 1) requestAnimationFrame(run);
    else el.textContent = finalText;
  };
  requestAnimationFrame(run);
}

const scrambleEls = document.querySelectorAll('.scramble');
const scrambleObs = new IntersectionObserver(
  (entries, io) => entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const text = el.getAttribute('data-text') || el.textContent;
      el.textContent = text;
      setTimeout(() => scramble(el, text, 1300), 400);
      io.unobserve(el);
    }
  }),
  { threshold: 0.5 }
);
scrambleEls.forEach(el => scrambleObs.observe(el));

/* ══════════════════════════════════════
   Code Stream in Encryption Panel
══════════════════════════════════════ */
const stream = document.getElementById('code-stream');
const STREAM_WORDS = ['AES·256', 'GCM', 'RSA·4096', 'Argon2id', 'KDF', 'NONCE', 'HMAC', 'SHA·512', 'KEY·WRAP', 'VAULT', '0xFF3A', '0x1B9C', 'PBKDF2', 'SALT', 'IV·96', 'TAG·128', 'CHUNK·5MB', 'ZERO·KN'];

if (stream) {
  setInterval(() => {
    const d = document.createElement('span');
    d.className = 'cs-drop';
    d.textContent = STREAM_WORDS[Math.floor(Math.random() * STREAM_WORDS.length)];
    d.style.left = `${Math.random() * 80 + 10}%`;
    d.style.animationDuration = `${Math.random() * 1.4 + 1.2}s`;
    d.style.opacity = String(Math.random() * 0.5 + 0.3);
    stream.appendChild(d);
    setTimeout(() => d.remove(), 2600);
  }, 130);
}

/* ══════════════════════════════════════
   3D Tilt on Encryption Panel
══════════════════════════════════════ */
const tiltPanel = document.getElementById('tilt-panel');
if (tiltPanel) {
  tiltPanel.addEventListener('mousemove', e => {
    const r = tiltPanel.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    tiltPanel.style.transition = 'transform 0.08s linear';
    tiltPanel.style.transform = `perspective(900px) rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg)`;
  });
  tiltPanel.addEventListener('mouseleave', () => {
    tiltPanel.style.transition = 'transform 0.6s ease';
    tiltPanel.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  });
}

/* ══════════════════════════════════════
   Chunk Row Animation (video section)
══════════════════════════════════════ */
const chunks = document.querySelectorAll('.cr');
if (chunks.length) {
  let ci = 0;
  setInterval(() => {
    chunks.forEach(c => c.classList.remove('active'));
    chunks[ci].classList.add('active');
    ci = (ci + 1) % chunks.length;
  }, 500);
}

/* ══════════════════════════════════════
   Counter Animation
══════════════════════════════════════ */
const counters = document.querySelectorAll('.counter');
const cntObs = new IntersectionObserver(
  (entries, io) => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = Number(el.dataset.target) || 0;
    const dur = 1800, start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.floor(target * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    io.unobserve(el);
  }),
  { threshold: 0.7 }
);
counters.forEach(c => cntObs.observe(c));

/* ══════════════════════════════════════
   Magnetic Buttons
══════════════════════════════════════ */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top  - r.height / 2;
    btn.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ══════════════════════════════════════
   Mobile Hamburger
══════════════════════════════════════ */
const burger   = document.getElementById('burger');
const mobOver  = document.getElementById('mob-overlay');
const mobLinks = document.querySelectorAll('.mob-nav a');

const closeMenu = () => {
  burger?.classList.remove('open');
  mobOver?.classList.remove('open');
  document.body.style.overflow = '';
};

burger?.addEventListener('click', () => {
  const open = burger.classList.toggle('open');
  mobOver?.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

mobOver?.addEventListener('click', e => { if (e.target === mobOver) closeMenu(); });
mobLinks.forEach(a => a.addEventListener('click', closeMenu));

})();
