/* ═══════════════════════════════════════════════════
   ALI ZOUINE PORTFOLIO — JavaScript Logic
   ═══════════════════════════════════════════════════ */

"use strict";

/* ─────────────────────────────────────────────────────
   1. ANIMATED CANVAS BACKGROUND (particle grid)
───────────────────────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles, mouse = { x: -9999, y: -9999 };

  const PARTICLE_COUNT = 90;
  const MAX_DIST = 130;
  const COLORS = ['rgba(0,229,255,', 'rgba(0,255,179,', 'rgba(21,101,255,'];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : -10;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = Math.random() * 0.3 + 0.1;
      this.r = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.15;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y > H + 10) this.reset(false);
      if (this.x < 0 || this.x > W) this.vx *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  function init() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          const a = (1 - d / MAX_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,229,255,${a})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
      // Mouse interaction
      const dx = particles[i].x - mouse.x;
      const dy = particles[i].y - mouse.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 120) {
        const a = (1 - d / 120) * 0.4;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(0,229,255,${a})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  resize();
  init();
  animate();
})();

/* ─────────────────────────────────────────────────────
   2. TYPING ANIMATION
───────────────────────────────────────────────────── */
(function initTyping() {
  const el = document.getElementById('typingText');
  const texts = ['Étudiant en IA', 'Développeur Java', 'Passionné de Linux', 'Agent CrewAI'];
  let t = 0, i = 0, deleting = false;
  const SPEED_TYPE = 75, SPEED_DEL = 40, PAUSE = 2000;

  function tick() {
    const cur = texts[t];
    if (!deleting) {
      el.textContent = cur.slice(0, ++i);
      if (i === cur.length) { deleting = true; setTimeout(tick, PAUSE); return; }
    } else {
      el.textContent = cur.slice(0, --i);
      if (i === 0) { deleting = false; t = (t + 1) % texts.length; }
    }
    setTimeout(tick, deleting ? SPEED_DEL : SPEED_TYPE);
  }
  setTimeout(tick, 1200);
})();

/* ─────────────────────────────────────────────────────
   3. COUNTER ANIMATION (hero stats)
───────────────────────────────────────────────────── */
function animateCounter(el, target, duration = 1400) {
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ─────────────────────────────────────────────────────
   4. INTERSECTION OBSERVER — reveal & skill bars
───────────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);

// Auto-add reveal class to cards & sections
document.querySelectorAll('.project-card, .skill-card, .info-card, .social-btn, .contact-form, .tags-cloud, .hero-stats, .flagship-detail-item, .flagship-tech-badges, .flagship-visual, .flagship-hackathon-badge, .flagship-title, .flagship-accroche, .flagship-cta, .darija-detail-item, .darija-tech-badges, .darija-visual, .darija-title, .darija-accroche, .darija-cta').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Skill bar observer
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target.querySelector('.skill-bar-fill');
        const width = entry.target.querySelector('.skill-bar').dataset.width;
        if (bar) {
          setTimeout(() => { bar.style.width = width + '%'; }, 200);
        }
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll('.skill-card').forEach(el => skillObserver.observe(el));

// Hero stat counters observer
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-count]').forEach(el => {
          animateCounter(el, parseInt(el.dataset.count));
        });
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ─────────────────────────────────────────────────────
   5. NAVBAR — scroll effect & active section
───────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Shrink navbar on scroll
  navbar.classList.toggle('scrolled', window.scrollY > 60);

  // Highlight active nav link
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
});

/* ─────────────────────────────────────────────────────
   6. MOBILE NAV TOGGLE
───────────────────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navLinksEl = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
});

// Close on link click
navLinks.forEach(link => {
  link.addEventListener('click', () => navLinksEl.classList.remove('open'));
});

/* ─────────────────────────────────────────────────────
   7. CONTACT FORM
───────────────────────────────────────────────────── */
const form = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');
const btn = document.getElementById('submitBtn');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    // Shake invalid fields
    [document.getElementById('name'), document.getElementById('email'), document.getElementById('message')].forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = '#ff4d6d';
        input.style.animation = 'none';
        requestAnimationFrame(() => {
          input.style.animation = 'shake 0.4s ease';
        });
        setTimeout(() => { input.style.borderColor = ''; }, 2000);
      }
    });
    return;
  }

  // Simulate submission
  btn.querySelector('span').textContent = 'Envoi en cours…';
  btn.disabled = true;

  setTimeout(() => {
    btn.querySelector('span').textContent = 'Envoyer le message';
    btn.disabled = false;
    success.classList.add('visible');
    form.reset();
    setTimeout(() => success.classList.remove('visible'), 4000);
  }, 1500);
});

/* ─────────────────────────────────────────────────────
   8. CARD 3D TILT EFFECT (subtle)
───────────────────────────────────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.6s cubic-bezier(0.4,0,0.2,1)';
    card.style.transform = '';
    setTimeout(() => { card.style.transition = ''; }, 600);
  });
});

/* ─────────────────────────────────────────────────────
   9. CSS KEYFRAME: shake (injected)
───────────────────────────────────────────────────── */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-6px); }
    40%      { transform: translateX(6px); }
    60%      { transform: translateX(-4px); }
    80%      { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);

console.log('%c⚡ Ali Zouine Portfolio loaded', 'background:#050a0f;color:#00e5ff;font-size:14px;padding:4px 8px;');

/* -------------------------------------------------
   10. RADAR CHART - Skills Visualization
------------------------------------------------- */
(function initRadarChart() {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const legend = document.getElementById('radarLegend');
  const tooltip = document.getElementById('radarTooltip');

  const SKILLS = [
    { name: 'Java', pct: 85, color: '#e53935', icon: String.fromCodePoint(0x2615) },
    { name: 'Python', pct: 80, color: '#00e5ff', icon: String.fromCodePoint(0x1F40D) },
    { name: 'Linux/Bash', pct: 82, color: '#ffca28', icon: String.fromCodePoint(0x1F427) },
    { name: 'SQL', pct: 70, color: '#00ffb3', icon: String.fromCodePoint(0x1F5C4) },
    { name: 'Machine Learning', pct: 68, color: '#7c3aed', icon: String.fromCodePoint(0x1F916) },
    { name: 'LaTeX', pct: 65, color: '#1565ff', icon: String.fromCodePoint(0x1F4C4) },
  ];

  const N = SKILLS.length;
  const W = canvas.width, H = canvas.height;
  const CX = W / 2, CY = H / 2;
  const LEVELS = 5, MAX_R = Math.min(W, H) * 0.37;
  const ANGLE = (Math.PI * 2) / N;
  let hoveredIndex = -1, animProgress = 0, animStart = null;
  const ANIM_DUR = 1200;

  legend.innerHTML = SKILLS.map((s, i) =>
    '<div class="legend-item" data-i="' + i + '">' +
    '<span class="legend-dot" style="background:' + s.color + ';color:' + s.color + '"></span>' +
    '<div class="legend-label">' +
    '<span class="legend-name">' + s.icon + ' ' + s.name + '</span>' +
    '<span class="legend-pct">' + s.pct + '%</span>' +
    '</div></div>'
  ).join('');

  legend.querySelectorAll('.legend-item').forEach(function (item) {
    var i = parseInt(item.dataset.i);
    item.addEventListener('mouseenter', function () { hoveredIndex = i; drawRadar(animProgress); });
    item.addEventListener('mouseleave', function () { hoveredIndex = -1; drawRadar(animProgress); });
  });

  function getPoint(si, r) {
    var a = ANGLE * si - Math.PI / 2;
    return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
  }

  function drawRadar(progress) {
    ctx.clearRect(0, 0, W, H);
    var i, l, r, p;
    for (l = 1; l <= LEVELS; l++) {
      r = (l / LEVELS) * MAX_R;
      ctx.beginPath();
      for (i = 0; i < N; i++) {
        p = getPoint(i, r);
        if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.strokeStyle = l === LEVELS ? 'rgba(0,229,255,0.22)' : 'rgba(0,229,255,0.07)';
      ctx.lineWidth = l === LEVELS ? 1.2 : 0.7;
      ctx.stroke();
      if (l < LEVELS) {
        p = getPoint(0, r);
        ctx.fillStyle = 'rgba(122,155,189,0.45)';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(Math.round((l / LEVELS) * 100) + '%', p.x - 5, p.y);
      }
    }
    for (i = 0; i < N; i++) {
      p = getPoint(i, MAX_R);
      ctx.beginPath(); ctx.moveTo(CX, CY); ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = 'rgba(0,229,255,0.12)'; ctx.lineWidth = 1; ctx.stroke();
    }
    for (i = 0; i < N; i++) {
      p = getPoint(i, MAX_R + 30);
      var isH = hoveredIndex === i;
      ctx.fillStyle = isH ? SKILLS[i].color : 'rgba(232,244,255,0.85)';
      ctx.font = isH ? 'bold 13px Inter,sans-serif' : '600 12px Inter,sans-serif';
      ctx.textAlign = p.x < CX - 8 ? 'right' : p.x > CX + 8 ? 'left' : 'center';
      ctx.textBaseline = p.y < CY - 8 ? 'bottom' : p.y > CY + 8 ? 'top' : 'middle';
      ctx.fillText(SKILLS[i].icon + ' ' + SKILLS[i].name, p.x, p.y);
    }
    ctx.beginPath();
    for (i = 0; i < N; i++) {
      r = (SKILLS[i].pct / 100) * MAX_R * progress;
      p = getPoint(i, r);
      if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    var grad = ctx.createRadialGradient(CX, CY, 0, CX, CY, MAX_R);
    grad.addColorStop(0, 'rgba(0,229,255,0.28)');
    grad.addColorStop(0.55, 'rgba(0,255,179,0.14)');
    grad.addColorStop(1, 'rgba(124,58,237,0.06)');
    ctx.fillStyle = grad; ctx.fill();
    ctx.strokeStyle = 'rgba(0,229,255,0.6)'; ctx.lineWidth = 2; ctx.stroke();
    for (i = 0; i < N; i++) {
      r = (SKILLS[i].pct / 100) * MAX_R * progress;
      p = getPoint(i, r);
      var isHov = hoveredIndex === i;
      var dotR = isHov ? 7 : 4.5;
      ctx.beginPath(); ctx.arc(p.x, p.y, dotR + 5, 0, Math.PI * 2);
      ctx.fillStyle = SKILLS[i].color + '33'; ctx.fill();
      ctx.beginPath(); ctx.arc(p.x, p.y, dotR, 0, Math.PI * 2);
      ctx.fillStyle = isHov ? SKILLS[i].color : '#00e5ff';
      ctx.fill(); ctx.strokeStyle = '#050a0f'; ctx.lineWidth = 1.5; ctx.stroke();
      if (isHov && progress > 0.7) {
        var badge = SKILLS[i].pct + '%';
        ctx.font = 'bold 12px JetBrains Mono,monospace';
        var bw = ctx.measureText(badge).width + 16;
        var bx = p.x - bw / 2, by = p.y - 30;
        ctx.fillStyle = 'rgba(13,21,32,0.92)';
        ctx.beginPath(); ctx.roundRect(bx, by, bw, 20, 5); ctx.fill();
        ctx.strokeStyle = SKILLS[i].color; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = SKILLS[i].color;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(badge, p.x, by + 10);
      }
    }
    ctx.beginPath(); ctx.arc(CX, CY, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,229,255,0.6)'; ctx.fill();
  }

  function animate(ts) {
    if (!animStart) animStart = ts;
    var rawP = Math.min((ts - animStart) / ANIM_DUR, 1);
    animProgress = 1 - Math.pow(1 - rawP, 3);
    drawRadar(animProgress);
    if (rawP < 1) requestAnimationFrame(animate);
  }

  var radarView = document.getElementById('skillsRadarView');
  var radarObs = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      animStart = null; requestAnimationFrame(animate); radarObs.disconnect();
    }
  }, { threshold: 0.25 });
  if (radarView) radarObs.observe(radarView);

  canvas.addEventListener('mousemove', function (e) {
    var rect = canvas.getBoundingClientRect();
    var sx = canvas.width / rect.width, sy = canvas.height / rect.height;
    var mx = (e.clientX - rect.left) * sx, my = (e.clientY - rect.top) * sy;
    var found = -1;
    SKILLS.forEach(function (s, i) {
      var r = (s.pct / 100) * MAX_R * animProgress;
      var p = getPoint(i, r);
      var dx = mx - p.x, dy = my - p.y;
      if (Math.sqrt(dx * dx + dy * dy) < 22) found = i;
    });
    if (found !== hoveredIndex) {
      hoveredIndex = found; drawRadar(animProgress);
      legend.querySelectorAll('.legend-item').forEach(function (el, i) {
        el.classList.toggle('highlighted', i === found);
      });
    }
    if (found >= 0) {
      var s = SKILLS[found];
      tooltip.textContent = s.icon + ' ' + s.name + ' - ' + s.pct + '%';
      tooltip.style.left = (e.clientX + 14) + 'px';
      tooltip.style.top = (e.clientY - 28) + 'px';
      tooltip.classList.add('visible');
    } else { tooltip.classList.remove('visible'); }
  });

  canvas.addEventListener('mouseleave', function () {
    hoveredIndex = -1; tooltip.classList.remove('visible');
    legend.querySelectorAll('.legend-item').forEach(function (el) { el.classList.remove('highlighted'); });
    drawRadar(animProgress);
  });

  var btnRadar = document.getElementById('btn-radar');
  var btnBars = document.getElementById('btn-bars');
  var barsView = document.getElementById('skillsBarsView');

  function showRadar() {
    if (radarView) radarView.style.display = '';
    if (barsView) barsView.style.display = 'none';
    btnRadar.classList.add('active'); btnBars.classList.remove('active');
    btnRadar.setAttribute('aria-pressed', 'true'); btnBars.setAttribute('aria-pressed', 'false');
    animStart = null; requestAnimationFrame(animate);
  }
  function showBars() {
    if (radarView) radarView.style.display = 'none';
    if (barsView) barsView.style.display = '';
    btnBars.classList.add('active'); btnRadar.classList.remove('active');
    btnBars.setAttribute('aria-pressed', 'true'); btnRadar.setAttribute('aria-pressed', 'false');
    document.querySelectorAll('.skill-card').forEach(function (card) {
      var bar = card.querySelector('.skill-bar-fill');
      var w = card.querySelector('.skill-bar') ? card.querySelector('.skill-bar').dataset.width : null;
      if (bar && w) { bar.style.width = '0'; setTimeout(function () { bar.style.width = w + '%'; }, 120); }
    });
  }
  if (btnRadar) btnRadar.addEventListener('click', showRadar);
  if (btnBars) btnBars.addEventListener('click', showBars);
})();

/* -------------------------------------------------
   11. INTERACTIVE SOUND WAVE CANVAS — OTA SUPPORT
------------------------------------------------- */
(function initWaveCanvas() {
  const canvas = document.getElementById('waveCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const container = document.getElementById('waveContainer');

  let W, H;
  let isHovered = false;
  let hoverFactor = 0; // 0 → 1 when hovering, smooth interpolation

  function resize() {
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    W = canvas.width = rect.width * dpr;
    H = canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }

  const WAVES = [
    { freq: 0.015, amp: 25, speed: 0.025, color: 'rgba(0,229,255,', baseAlpha: 0.5, hoverAmp: 50 },
    { freq: 0.022, amp: 18, speed: -0.018, color: 'rgba(0,255,179,', baseAlpha: 0.35, hoverAmp: 40 },
    { freq: 0.008, amp: 30, speed: 0.012, color: 'rgba(124,58,237,', baseAlpha: 0.25, hoverAmp: 55 },
    { freq: 0.035, amp: 10, speed: 0.04,  color: 'rgba(0,229,255,', baseAlpha: 0.2, hoverAmp: 28 },
    { freq: 0.018, amp: 14, speed: -0.03, color: 'rgba(251,191,36,', baseAlpha: 0.15, hoverAmp: 32 },
  ];

  let time = 0;

  function drawWave(wave, t) {
    const dispW = W / (window.devicePixelRatio || 1);
    const dispH = H / (window.devicePixelRatio || 1);
    const midY = dispH / 2;
    const amp = wave.amp + (wave.hoverAmp - wave.amp) * hoverFactor;
    const alpha = wave.baseAlpha + hoverFactor * 0.2;

    ctx.beginPath();
    for (let x = 0; x <= dispW; x += 2) {
      const y = midY + Math.sin(x * wave.freq + t * wave.speed) * amp
                     + Math.sin(x * wave.freq * 1.8 + t * wave.speed * 0.6) * amp * 0.3;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = wave.color + alpha + ')';
    ctx.lineWidth = 1.5 + hoverFactor * 0.8;
    ctx.stroke();

    // Glow effect
    ctx.strokeStyle = wave.color + (alpha * 0.3) + ')';
    ctx.lineWidth = 4 + hoverFactor * 3;
    ctx.beginPath();
    for (let x = 0; x <= dispW; x += 2) {
      const y = midY + Math.sin(x * wave.freq + t * wave.speed) * amp
                     + Math.sin(x * wave.freq * 1.8 + t * wave.speed * 0.6) * amp * 0.3;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  function drawCenterLine() {
    const dispW = W / (window.devicePixelRatio || 1);
    const dispH = H / (window.devicePixelRatio || 1);
    const midY = dispH / 2;
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(dispW, midY);
    ctx.strokeStyle = 'rgba(0,229,255,0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function animate() {
    const dispW = W / (window.devicePixelRatio || 1);
    const dispH = H / (window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, dispW, dispH);

    // Smoothly interpolate hover factor
    const target = isHovered ? 1 : 0;
    hoverFactor += (target - hoverFactor) * 0.06;

    drawCenterLine();
    WAVES.forEach(w => drawWave(w, time));

    time += 1 + hoverFactor * 2;
    requestAnimationFrame(animate);
  }

  container.addEventListener('mouseenter', () => { isHovered = true; });
  container.addEventListener('mouseleave', () => { isHovered = false; });

  window.addEventListener('resize', resize);
  resize();
  animate();
})();

/* -------------------------------------------------
   12. KNOWLEDGE GRAPH CANVAS — DARIJA ANALYSER
------------------------------------------------- */
(function initKnowledgeGraph() {
  const canvas = document.getElementById('kgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const container = document.getElementById('kgContainer');

  let W, H, dpr;
  let mouseX = -9999, mouseY = -9999;
  let isHovered = false;

  function resize() {
    const rect = container.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    W = canvas.width = rect.width * dpr;
    H = canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Recalculate display dimensions for nodes
    dispW = rect.width;
    dispH = rect.height;
    initNodes();
  }

  let dispW = 500, dispH = 360;

  const LABELS = [
    { text: 'Darija', size: 22, color: '#3b82f6' },
    { text: 'NLP', size: 18, color: '#93c5fd' },
    { text: 'CrewAI', size: 17, color: '#a78bfa' },
    { text: 'Python', size: 16, color: '#60a5fa' },
    { text: 'Scraping', size: 15, color: '#34d399' },
    { text: 'Dataset', size: 15, color: '#93c5fd' },
    { text: 'BeautifulSoup', size: 13, color: '#f59e0b' },
    { text: 'Dialecte', size: 14, color: '#818cf8' },
    { text: 'Morphologie', size: 13, color: '#60a5fa' },
    { text: 'Sémantique', size: 14, color: '#3b82f6' },
    { text: 'Agents', size: 15, color: '#a78bfa' },
    { text: 'Tokenizer', size: 13, color: '#93c5fd' },
  ];

  const EDGES = [
    [0, 1], [0, 3], [0, 7], [0, 8], [0, 9],
    [1, 2], [1, 5], [1, 9], [1, 11],
    [2, 3], [2, 10],
    [3, 4], [3, 6],
    [4, 5], [4, 6],
    [7, 8], [7, 9],
    [8, 11], [9, 11],
    [10, 2], [10, 5],
  ];

  let nodes = [];

  function initNodes() {
    nodes = LABELS.map((label, i) => {
      const angle = (i / LABELS.length) * Math.PI * 2;
      const radiusX = dispW * 0.32;
      const radiusY = dispH * 0.32;
      // Center node (Darija) stays at center
      const cx = i === 0 ? dispW / 2 : dispW / 2 + Math.cos(angle) * radiusX * (0.5 + Math.random() * 0.5);
      const cy = i === 0 ? dispH / 2 : dispH / 2 + Math.sin(angle) * radiusY * (0.5 + Math.random() * 0.5);
      return {
        x: Math.max(50, Math.min(dispW - 50, cx)),
        y: Math.max(30, Math.min(dispH - 30, cy)),
        baseX: cx,
        baseY: cy,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        label: label.text,
        size: label.size,
        color: label.color,
        phase: Math.random() * Math.PI * 2,
      };
    });
  }

  let time = 0;

  function drawGraph() {
    ctx.clearRect(0, 0, dispW, dispH);
    time += 0.008;

    // Update node positions (gentle float)
    nodes.forEach((n, i) => {
      if (i === 0) {
        // Center node stays centered
        n.x = dispW / 2 + Math.sin(time * 0.5) * 3;
        n.y = dispH / 2 + Math.cos(time * 0.7) * 2;
      } else {
        n.x = n.baseX + Math.sin(time + n.phase) * 8;
        n.y = n.baseY + Math.cos(time * 0.8 + n.phase) * 6;
      }
    });

    // Draw edges
    EDGES.forEach(([a, b]) => {
      const na = nodes[a], nb = nodes[b];
      const dx = mouseX - (na.x + nb.x) / 2;
      const dy = mouseY - (na.y + nb.y) / 2;
      const distToMouse = Math.sqrt(dx * dx + dy * dy);
      const isNear = isHovered && distToMouse < 120;

      // Animated dash
      const dashOffset = time * 60;

      ctx.beginPath();
      ctx.moveTo(na.x, na.y);
      ctx.lineTo(nb.x, nb.y);
      ctx.strokeStyle = isNear ? 'rgba(59,130,246,0.4)' : 'rgba(59,130,246,0.1)';
      ctx.lineWidth = isNear ? 1.5 : 0.8;
      ctx.setLineDash(isNear ? [] : [4, 6]);
      ctx.lineDashOffset = -dashOffset;
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw a small dot at edge midpoint
      if (isNear) {
        const mx = (na.x + nb.x) / 2, my = (na.y + nb.y) / 2;
        ctx.beginPath();
        ctx.arc(mx, my, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59,130,246,0.5)';
        ctx.fill();
      }
    });

    // Draw nodes
    nodes.forEach((n, i) => {
      const dx = mouseX - n.x;
      const dy = mouseY - n.y;
      const distToMouse = Math.sqrt(dx * dx + dy * dy);
      const isNear = isHovered && distToMouse < 80;
      const nodeR = i === 0 ? 28 : (n.size * 0.7 + 4);
      const displayR = isNear ? nodeR + 4 : nodeR;

      // Glow ring
      if (isNear || i === 0) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, displayR + 6, 0, Math.PI * 2);
        ctx.fillStyle = n.color + '15';
        ctx.fill();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(n.x, n.y, displayR, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? 'rgba(59,130,246,0.15)' : 'rgba(15,26,39,0.85)';
      ctx.fill();
      ctx.strokeStyle = isNear ? n.color : (n.color + '55');
      ctx.lineWidth = isNear ? 1.5 : 1;
      ctx.stroke();

      // Label
      ctx.fillStyle = isNear ? '#ffffff' : (n.color + 'cc');
      ctx.font = (i === 0 ? 'bold ' : '600 ') + (isNear ? n.size + 1 : n.size - 1) + 'px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(n.label, n.x, n.y);
    });

    requestAnimationFrame(drawGraph);
  }

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    isHovered = true;
  });

  container.addEventListener('mouseleave', () => {
    isHovered = false;
    mouseX = -9999;
    mouseY = -9999;
  });

  window.addEventListener('resize', resize);
  resize();
  drawGraph();
})();
