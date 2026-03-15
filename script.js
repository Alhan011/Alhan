document.addEventListener('DOMContentLoaded', () => {
  // ── CURSOR ──
  const cursor = document.querySelector('.cursor');
  const cursorRing = document.querySelector('.cursor-ring');
  if (cursor && cursorRing) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    let visible = false;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) {
        visible = true;
        cursor.style.opacity = '1';
        cursorRing.style.opacity = '1';
      }
    });

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      cursorRing.style.opacity = '1';
    });

    cursor.style.opacity = '0';
    cursorRing.style.opacity = '0';

    function animCursor() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top = ry + 'px';
      requestAnimationFrame(animCursor);
    }
    animCursor();

    function addCursorListeners() {
      document.querySelectorAll('a, button, .project-card, .hobby-card, .achievement-card, .fun-fact, .currently-card, .skill-card, .nav-btn, .back-to-top').forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursor.style.width = '20px';
          cursor.style.height = '20px';
          cursor.style.background = 'var(--cyan2)';
          cursorRing.style.width = '50px';
          cursorRing.style.height = '50px';
        });
        el.addEventListener('mouseleave', () => {
          cursor.style.width = '12px';
          cursor.style.height = '12px';
          cursor.style.background = 'var(--cyan)';
          cursorRing.style.width = '36px';
          cursorRing.style.height = '36px';
        });
      });
    }
    addCursorListeners();
  }

  // ── DARK / LIGHT MODE ──
  const modeBtn = document.getElementById('mode-btn');
  if (modeBtn) {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      document.body.classList.add('light');
      modeBtn.textContent = '☀️';
    }
    modeBtn.addEventListener('click', () => {
      document.body.classList.toggle('light');
      const isLight = document.body.classList.contains('light');
      modeBtn.textContent = isLight ? '☀️' : '🌙';
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  }

  // ── FONT SIZE TOGGLE ──
  const fontBtn = document.getElementById('font-btn');
  if (fontBtn) {
    const savedFont = localStorage.getItem('fontLarge');
    if (savedFont === 'true') {
      document.body.classList.add('font-large');
      fontBtn.classList.add('active');
    }
    fontBtn.addEventListener('click', () => {
      document.body.classList.toggle('font-large');
      const isLarge = document.body.classList.contains('font-large');
      fontBtn.classList.toggle('active', isLarge);
      localStorage.setItem('fontLarge', isLarge);
    });
  }

  // ── BACK TO TOP ──
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

// ── PARTICLES + TECHY BG ──
const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const DOTS = [];
  const COUNT = 100;

  for (let i = 0; i < COUNT; i++) {
    DOTS.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2
    });
  }

  const STARS = [];
  function spawnStar() {
    STARS.push({
      x: Math.random() * W,
      y: Math.random() * H * 0.5,
      len: Math.random() * 120 + 60,
      speed: Math.random() * 6 + 4,
      opacity: 1,
      angle: Math.PI / 6
    });
  }
  setInterval(spawnStar, 3500);

  let scanY = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    scanY += 0.3;
    if (scanY > H) scanY = 0;
    const scanGrad = ctx.createLinearGradient(0, scanY - 80, 0, scanY + 80);
    scanGrad.addColorStop(0, 'rgba(6,182,212,0)');
    scanGrad.addColorStop(0.5, 'rgba(6,182,212,0.018)');
    scanGrad.addColorStop(1, 'rgba(6,182,212,0)');
    ctx.fillStyle = scanGrad;
    ctx.fillRect(0, scanY - 80, W, 160);

    for (let i = STARS.length - 1; i >= 0; i--) {
      const s = STARS[i];
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.opacity -= 0.01;
      if (s.opacity <= 0) { STARS.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(
        s.x - Math.cos(s.angle) * s.len,
        s.y - Math.sin(s.angle) * s.len
      );
      const grad = ctx.createLinearGradient(
        s.x, s.y,
        s.x - Math.cos(s.angle) * s.len,
        s.y - Math.sin(s.angle) * s.len
      );
      grad.addColorStop(0, `rgba(255,255,255,${s.opacity})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        const a = DOTS[i], b = DOTS[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const alpha = 0.15 * (1 - dist / 150);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(6,182,212,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (let i = 0; i < COUNT; i++) {
      const p = DOTS[i];
      p.x += p.dx;
      p.y += p.dy;
      p.pulse += 0.02;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;

      const pulseR = p.r + Math.sin(p.pulse) * 0.5;
      const pulseOpacity = p.opacity + Math.sin(p.pulse) * 0.1;

      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulseR * 4);
      glow.addColorStop(0, `rgba(6,182,212,${pulseOpacity * 0.3})`);
      glow.addColorStop(1, 'rgba(6,182,212,0)');
      ctx.beginPath();
      ctx.arc(p.x, p.y, pulseR * 4, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, pulseR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(6,182,212,${pulseOpacity})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
}

// ── HEADER HIDE ON SCROLL ──
const header = document.querySelector('header');
if (header) {
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.style.transform = (y > lastY && y > 100) ? 'translateY(-100%)' : 'translateY(0)';
    lastY = y;
  });
}

// ── REVEAL ON SCROLL ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('show');
      e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        setTimeout(() => bar.classList.add('animate'), 200);
      });
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-left').forEach(el => observer.observe(el));

// ── ACTIVE NAV ──
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('nav a').forEach(a => {
  if (a.getAttribute('href') === page) a.classList.add('active');
});

// ── TYPING EFFECT ──
const typingEl = document.getElementById('typing-text');
if (typingEl) {
  const words = ['Builder', 'Coder', 'Problem Solver', 'Maker', 'Volunteer'];
  let wi = 0, ci = 0, deleting = false;
  function type() {
    const word = words[wi];
    if (!deleting) {
      typingEl.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
      typingEl.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(type, deleting ? 60 : 100);
  }
  type();
}

// ── COUNTER ANIMATION ──
document.querySelectorAll('[data-target]').forEach(el => {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      let count = 0;
      const duration = 1200;
      const steps = 50;
      const increment = target / steps;
      const interval = setInterval(() => {
        count = Math.min(count + increment, target);
        el.textContent = Math.floor(count) + suffix;
        if (count >= target) clearInterval(interval);
      }, duration / steps);
      obs.disconnect();
    }
  });
  obs.observe(el);
});

// ── KONAMI CODE + CONFETTI ──
let konamiKeys = [];
const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

document.addEventListener('keydown', e => {
  konamiKeys.push(e.key);
  konamiKeys = konamiKeys.slice(-10);
  if (konamiKeys.join(',') === konami.join(',')) launchEasterEgg();
});

function launchEasterEgg() {
  const msg = document.createElement('div');
  msg.innerHTML = '🎮 CHEAT CODE ACTIVATED!<br><span style="font-size:0.7rem;font-family:Syne,sans-serif;font-weight:400;opacity:0.8;">you actually did it lol</span>';
  msg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(167,139,250,0.97);color:#0a0a1a;padding:24px 48px;border-radius:16px;font-family:Orbitron,sans-serif;font-size:1.2rem;font-weight:700;z-index:99999;text-align:center;box-shadow:0 0 80px rgba(167,139,250,0.7);pointer-events:none;line-height:1.6;';
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 3000);

  const colors = ['#06b6d4','#f472b6','#a78bfa','#34d399','#fbbf24','#f97316','#ffffff','#22d3ee'];
  for (let i = 0; i < 200; i++) {
    const piece = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 12 + 4;
    const startX = Math.random() * window.innerWidth;
    const duration = Math.random() * 2.5 + 1.5;
    const delay = Math.random() * 0.6;
    const driftX = (Math.random() - 0.5) * 300;
    const isCircle = Math.random() > 0.5;
    piece.style.cssText = `
      position:fixed;
      left:${startX}px;
      top:-20px;
      width:${size}px;
      height:${size}px;
      background:${color};
      border-radius:${isCircle ? '50%' : '2px'};
      z-index:99998;
      pointer-events:none;
      opacity:1;
      animation:confettiFall ${duration}s ${delay}s cubic-bezier(0.25,0.46,0.45,0.94) forwards;
      --drift:${driftX}px;
    `;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), (duration + delay) * 1000 + 200);
  }
}