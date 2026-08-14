/* ============================================================
   MAIN.JS — Core App Logic: Double Door Splash, Sidebar, Ocean Waves
   ============================================================ */

/* ── Splash Screen (Slide Left) ──────────────────────────── */
function initSplash() {
  const splash = document.getElementById('splash');
  const fill   = document.getElementById('splash-fill');
  if (!splash) return;

  // Start progress bar
  setTimeout(() => { if (fill) fill.style.width = '100%'; }, 100);

  // Trigger slide-left after 1.8s
  setTimeout(() => {
    splash.classList.add('opening');

    // Navbar / sidebar enters right as splash starts sliding (feels connected)
    setTimeout(() => {
      initSidebarEntrance();
    }, 200);

    // Hero content (photo, name, etc.) enters after slide finishes
    setTimeout(() => {
      initHeroEntrance();
    }, 750);

    // Hide splash DOM after animation done
    setTimeout(() => {
      splash.classList.add('hidden');
      document.body.classList.add('splash-done');
    }, 1000);
  }, 1900);
}

/* ── Sidebar Entrance Animation ─────────────────────────── */
function initSidebarEntrance() {
  const sidebar      = document.getElementById('sidebar');
  const mobileHeader = document.getElementById('mobile-header');
  if (sidebar)      sidebar.classList.add('entered');
  if (mobileHeader) mobileHeader.classList.add('entered');
}

/* ── Hero Staggered Entrance Animation ──────────────────── */
function initHeroEntrance() {
  const elements = document.querySelectorAll('.hero-stagger');
  elements.forEach((el, idx) => {
    const step = parseInt(el.getAttribute('data-step')) || (idx + 1);
    setTimeout(() => {
      el.classList.add('entered');
    }, step * 150);
  });
}

/* ── Sidebar Navigation & Scroll Spy ────────────────────── */
function initSidebar() {
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const mobileLinks  = document.querySelectorAll('.mobile-nav-link');
  const sectionIds   = ['hero', 'about', 'skills', 'projects', 'experience', 'certificates', 'github', 'contact'];

  function updateActiveSection() {
    const scrollY = window.scrollY;
    let currentId = 'hero';

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (!section) return;
      const top = section.offsetTop - 120;
      if (scrollY >= top) {
        currentId = id;
      }
    });

    // Update Desktop Sidebar active link
    sidebarLinks.forEach((link) => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === currentId);
    });

    // Update Mobile Nav active link
    mobileLinks.forEach((link) => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === currentId);
    });
  }

  window.addEventListener('scroll', updateActiveSection, { passive: true });
  updateActiveSection();
}

/* ── Mobile Hamburger Toggle ─────────────────────────────── */
function initMobileNav() {
  const btn       = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (!btn || !mobileNav) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  mobileNav.querySelectorAll('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      btn.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── Scroll Progress Bar ─────────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
}

/* ── Back To Top ─────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Certificate Slider ──────────────────────────────────── */
function initCertSlider() {
  const slider    = document.getElementById('cert-slider');
  const prevBtn   = document.getElementById('cert-prev');
  const nextBtn   = document.getElementById('cert-next');
  const dotsWrap  = document.getElementById('cert-dots');
  if (!slider) return;

  const cards     = slider.querySelectorAll('.cert-card');
  if (cards.length === 0) return;
  const cardWidth = () => cards[0].offsetWidth + 24; // gap=1.5rem=24px
  let   current   = 0;
  const total     = cards.length;

  // Create dots
  if (dotsWrap && dotsWrap.children.length === 0) {
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to certificate ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
  }

  function updateDots() {
    if (!dotsWrap) return;
    dotsWrap.querySelectorAll('.slider-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, total - 1));
    slider.style.transform = `translateX(-${current * cardWidth()}px)`;
    updateDots();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  // Auto-advance
  let autoTimer = setInterval(() => goTo((current + 1) % total), 4000);
  slider.parentElement.addEventListener('mouseenter', () => clearInterval(autoTimer));
  slider.parentElement.addEventListener('mouseleave', () => {
    autoTimer = setInterval(() => goTo((current + 1) % total), 4000);
  });

  // Touch/drag
  let startX = 0;
  slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend',   (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });
}

/* ── Contact Form ────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn      = form.querySelector('.btn-submit');
    const original = btn.innerHTML;

    btn.innerHTML = '<span class="spinner"></span> Sending…';
    btn.disabled  = true;

    // Simulate sending
    await new Promise((r) => setTimeout(r, 1800));

    btn.innerHTML = '✓ Message Sent!';
    showToast('Message sent successfully! I\'ll get back to you soon. 🚀', 'success');
    form.reset();

    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled  = false;
    }, 3000);
  });
}

/* ── Toast ───────────────────────────────────────────────── */
function showToast(message, type = '') {
  const toast    = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  const toastIcon= document.getElementById('toast-icon');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  if (toastIcon) toastIcon.className = 'toast-icon ' + (type === 'success' ? '✓' : 'ℹ');
  toast.className      = `toast ${type}`;

  toast.offsetHeight; // Force reflow
  toast.classList.add('show');

  setTimeout(() => toast.classList.remove('show'), 4000);
}
window.showToast = showToast;

/* ── Generate Contribution Graph ─────────────────────────── */
function generateContribGraph() {
  const grid = document.getElementById('contrib-grid');
  if (!grid) return;

  const levels = ['', 'l1', 'l2', 'l3', 'l4'];
  const cells  = 364;
  let html     = '';

  for (let i = 0; i < cells; i++) {
    const week    = Math.floor(i / 7);
    const density = week > 30 ? 0.6 : 0.35;
    const rand    = Math.random();
    let lvl = '';
    if (rand < density) {
      lvl = levels[Math.floor(Math.random() * 4) + 1];
    }
    html += `<div class="contrib-cell ${lvl}" title="Contribution"></div>`;
  }
  grid.innerHTML = html;
}

/* ── Smooth Scroll Anchors ───────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ── Ripple Effect on Cards ──────────────────────────────── */
function initRipple() {
  document.querySelectorAll('.glass-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      const rect   = card.getBoundingClientRect();
      const size   = Math.max(card.clientWidth, card.clientHeight);
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;

      ripple.style.cssText = `
        position:absolute; border-radius:50%;
        width:${size}px; height:${size}px;
        left:${x}px; top:${y}px;
        background:rgba(2, 132, 199, 0.08);
        transform:scale(0); animation:rippleAnim 0.6s ease-out;
        pointer-events:none; z-index:0;
      `;
      card.style.position   = 'relative';
      card.style.overflow   = 'hidden';
      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });
}

/* ── Entry Point ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initSplash();
  initSidebar();
  initMobileNav();
  initScrollProgress();
  initBackToTop();
  initSmoothScroll();
  initContactForm();
  initCertSlider();
  generateContribGraph();
  initRipple();

  // Init animations (from animations.js)
  if (typeof initAnimations === 'function') initAnimations();

  // Init typing (from typing.js)
  if (typeof TypeWriter === 'function') {
    new TypeWriter('hero-typing', [
      'Flutter Developer',
      'Laravel Developer',
      'Mobile App Developer',
      'UI Designer',
      'Full Stack Developer',
    ]);
  }
});
