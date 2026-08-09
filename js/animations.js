/* ============================================================
   ANIMATIONS.JS — Scroll Reveal, Parallax, Mouse Glow
   ============================================================ */

/* ── Scroll Reveal ───────────────────────────────────────── */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Optionally unobserve for performance
          // observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* ── Mouse Glow Effect ───────────────────────────────────── */
function initMouseGlow() {
  const glow = document.getElementById('mouse-glow');
  if (!glow) return;

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY + window.scrollY;
  });

  function lerp(start, end, t) {
    return start + (end - start) * t;
  }

  function animate() {
    glowX = lerp(glowX, mouseX, 0.08);
    glowY = lerp(glowY, mouseY, 0.08);
    glow.style.left = glowX + 'px';
    glow.style.top  = glowY + 'px';
    raf = requestAnimationFrame(animate);
  }
  animate();
}

/* ── Parallax Hero Blobs ─────────────────────────────────── */
function initParallax() {
  const blobs = document.querySelectorAll('.hero-blob');
  if (!blobs.length) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        blobs.forEach((blob, i) => {
          const speed = (i + 1) * 0.15;
          blob.style.transform = `translateY(${scrollY * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ── Counter Animation ───────────────────────────────────── */
function animateCounter(el, target, duration = 1600) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // easeOut cubic
    el.textContent = Math.round(eased * target) + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseInt(el.dataset.counter, 10);
          animateCounter(el, target);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((el) => observer.observe(el));
}

/* ── Skill Bar Animation ─────────────────────────────────── */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill   = entry.target;
          const target = fill.dataset.pct;
          fill.style.width = target + '%';
          observer.unobserve(fill);
        }
      });
    },
    { threshold: 0.3 }
  );
  bars.forEach((bar) => observer.observe(bar));
}

/* ── Section Active Nav Highlight ───────────────────────── */
function initActiveSectionHighlight() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link[href^="#"]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + entry.target.id) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ── Stagger Children ────────────────────────────────────── */
function staggerChildren(selector, baseDelay = 0, step = 100) {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.style.transitionDelay = (baseDelay + i * step) + 'ms';
  });
}

/* ── Init All Animations ─────────────────────────────────── */
function initAnimations() {
  initScrollReveal();
  initMouseGlow();
  initParallax();
  initCounters();
  initSkillBars();
  initActiveSectionHighlight();

  // Stagger cards
  staggerChildren('.skill-card.reveal', 0, 80);
  staggerChildren('.project-card.reveal', 0, 150);
  staggerChildren('.cert-card', 0, 100);
  staggerChildren('.timeline-item.reveal', 0, 200);
  staggerChildren('.github-stat-card.reveal', 0, 120);
}

window.initAnimations = initAnimations;
