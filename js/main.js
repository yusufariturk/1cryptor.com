(() => {
'use strict';

/* ══════════════════════════════════════
   Background Canvas — Particle Network
══════════════════════════════════════ */
const bgCanvas = document.getElementById('bg-canvas');
if (bgCanvas) {
  const ctx = bgCanvas.getContext('2d');
  let W, H, pts;
  const N = 65, DIST = 130, COL = '0,255,136';

  const resize = () => {
    W = bgCanvas.width  = window.innerWidth;
    H = bgCanvas.height = window.innerHeight;
  };

  const mkPt = () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 1.4 + 0.5,
  });

  const tick = () => {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${COL},.65)`;
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
          ctx.strokeStyle = `rgba(${COL},${(1 - d/DIST) * 0.18})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  };

  resize();
  pts = Array.from({ length: N }, mkPt);
  tick();
  window.addEventListener('resize', resize, { passive: true });
}

/* ══════════════════════════════════════
   Scroll: Progress Bar + Header + FAB
══════════════════════════════════════ */
const scrollBar  = document.getElementById('scroll-bar');
const header     = document.getElementById('header');
const fabTop     = document.getElementById('fab-top');

window.addEventListener('scroll', () => {
  const s = window.scrollY;
  const t = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollBar) scrollBar.style.width = `${(s / t) * 100}%`;
  if (header)    header.classList.toggle('solid', s > 60);
  if (fabTop)    fabTop.classList.toggle('show',  s > 400);
}, { passive: true });

fabTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ══════════════════════════════════════
   Reveal on Scroll (AOS replacement)
══════════════════════════════════════ */
const reveals = document.querySelectorAll('[data-reveal]');
const revealObs = new IntersectionObserver(
  (entries, io) => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  }),
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);
reveals.forEach(el => revealObs.observe(el));

/* ══════════════════════════════════════
   Text Scramble Effect on Hero
══════════════════════════════════════ */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

function scramble(el, finalText, duration = 900) {
  let frame = 0;
  const total = Math.ceil(duration / 50);
  const run = () => {
    const progress = frame / total;
    const revealed = Math.floor(progress * finalText.length);
    let out = '';
    for (let i = 0; i < finalText.length; i++) {
      if (finalText[i] === ' ' || finalText[i] === '\n') { out += finalText[i]; continue; }
      if (i < revealed) out += finalText[i];
      else out += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    el.textContent = out;
    if (frame++ < total) requestAnimationFrame(run);
    else el.textContent = finalText;
  };
  run();
}

const scrambleEls = document.querySelectorAll('.scramble');
const scrambleObs = new IntersectionObserver(
  (entries, io) => entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const text = el.getAttribute('data-text') || el.textContent;
      el.textContent = text;
      setTimeout(() => scramble(el, text, 1000), 200);
      io.unobserve(el);
    }
  }),
  { threshold: 0.5 }
);
scrambleEls.forEach(el => scrambleObs.observe(el));

/* ══════════════════════════════════════
   Code Rain in Vault
══════════════════════════════════════ */
const rain = document.getElementById('code-rain');
const WORDS = ['AES','GCM','RSA','KEY','ENC','SHA','KDF','NONCE','LOCK','VAULT','0xFF','0x13'];

if (rain) {
  setInterval(() => {
    const d = document.createElement('span');
    d.className = 'rain-drop';
    d.textContent = WORDS[Math.floor(Math.random() * WORDS.length)];
    d.style.left = `${Math.random() * 86 + 7}%`;
    d.style.animationDuration = `${Math.random() * 1.6 + 1.4}s`;
    d.style.fontSize = `${Math.random() * 0.2 + 0.6}rem`;
    rain.appendChild(d);
    setTimeout(() => d.remove(), 2800);
  }, 120);
}

/* ══════════════════════════════════════
   3D Tilt on Vault
══════════════════════════════════════ */
const vault = document.getElementById('tilt-vault');
if (vault) {
  vault.addEventListener('mousemove', e => {
    const r = vault.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    vault.style.transition = 'transform 0.08s linear';
    vault.style.transform = `perspective(900px) rotateX(${(-y*12).toFixed(2)}deg) rotateY(${(x*12).toFixed(2)}deg)`;
  });
  vault.addEventListener('mouseleave', () => {
    vault.style.transition = 'transform 0.6s ease';
    vault.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  });
}

/* ══════════════════════════════════════
   Chunk List Animation
══════════════════════════════════════ */
const chunks = document.querySelectorAll('.chunk-row');
if (chunks.length) {
  let ci = 0;
  setInterval(() => {
    chunks.forEach(c => c.classList.remove('active'));
    chunks[ci].classList.add('active');
    ci = (ci + 1) % chunks.length;
  }, 480);
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
    const dur = 1600, start = performance.now();
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
    btn.style.transform = `translate(${x * 0.09}px, ${y * 0.09}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ══════════════════════════════════════
   Mobile Hamburger
══════════════════════════════════════ */
const burger  = document.getElementById('burger');
const mobOver = document.getElementById('mob-overlay');
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
