const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 12);
});

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const form = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  formMsg.textContent = 'Skickar...';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      formMsg.textContent = 'Tack! Vi hör av oss inom kort.';
      form.reset();
    } else {
      formMsg.textContent = 'Något gick fel. Prova igen om en stund.';
    }
  } catch (error) {
    formMsg.textContent = 'Något gick fel. Kontrollera din internetanslutning och prova igen.';
  } finally {
    submitBtn.disabled = false;
  }
});


/* =====================================================================
   Mjuk scroll + scroll-animationer
   ===================================================================== */
(() => {
  // Sätt till true om sidan ska följa besökarens inställning
  // "minska rörelse" i operativsystemet (då används vanlig scroll).
  const RESPECT_REDUCED_MOTION = false;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (RESPECT_REDUCED_MOTION && prefersReduced) return;

  const root = document.documentElement;
  root.classList.add('fx');

  const EASE = 0.1; // lägre = mjukare/långsammare, högre = snabbare respons
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const maxY = () => root.scrollHeight - window.innerHeight;

  /* ---------- Mjuk scroll för mushjul och styrplatta ---------- */
  let cur = window.scrollY;
  let tgt = cur;
  let animating = false;
  let raf = 0;

  function loop() {
    const d = tgt - cur;
    if (Math.abs(d) < 0.4) {
      cur = tgt;
      window.scrollTo({ top: cur, behavior: 'instant' });
      animating = false;
      return;
    }
    cur += d * EASE;
    window.scrollTo({ top: cur, behavior: 'instant' });
    raf = requestAnimationFrame(loop);
  }

  function glideTo(y) {
    tgt = clamp(y, 0, maxY());
    if (!animating) {
      cur = window.scrollY;
      animating = true;
      raf = requestAnimationFrame(loop);
    }
  }

  function stopGlide() {
    animating = false;
    cancelAnimationFrame(raf);
  }

  function canScrollInside(el) {
    const box = el.closest && el.closest('textarea');
    return !!box && box.scrollHeight > box.clientHeight;
  }

  window.addEventListener('wheel', (e) => {
    if (e.ctrlKey || e.defaultPrevented) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    if (canScrollInside(e.target)) return;
    e.preventDefault();
    const unit = e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? window.innerHeight : 1;
    glideTo((animating ? tgt : window.scrollY) + e.deltaY * unit);
  }, { passive: false });

  // Tangentbord, scrollbar-dragning och touch får ta över direkt
  window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) stopGlide();
  });
  window.addEventListener('mousedown', stopGlide);
  window.addEventListener('touchstart', stopGlide, { passive: true });

  // Ankarlänkar (#om-oss, #kontakt ...) glider på samma sätt
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = id.length > 1 ? document.querySelector(id) : null;
      if (!target) return;
      e.preventDefault();
      glideTo(target.getBoundingClientRect().top + window.scrollY);
      history.pushState(null, '', id);
    });
  });

  /* ---------- Framsteg, parallax och linjer som fylls ---------- */
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  const heroImg = document.querySelector('.hero-visual img');
  const steps = Array.from(document.querySelectorAll('.step'));

  function update() {
    const y = window.scrollY;
    const vh = window.innerHeight;
    const max = maxY();
    bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0).toFixed(4) + ')';
    if (heroImg && y < vh * 1.2) {
      heroImg.style.transform = 'translate3d(0,' + (y * 0.14).toFixed(1) + 'px,0)';
    }
    steps.forEach((s, i) => {
      const top = s.getBoundingClientRect().top;
      s.style.setProperty('--p', clamp((vh * 0.92 - top - i * 30) / (vh * 0.3), 0, 1).toFixed(3));
    });
  }

  let queued = false;
  window.addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; update(); });
  }, { passive: true });
  window.addEventListener('resize', update);
  update();

  /* ---------- Element som tonas in när de syns ---------- */
  function countUp(el) {
    const finalText = el.textContent.trim();
    const n = parseInt(finalText, 10);
    if (isNaN(n)) return;
    const from = n > 100 ? n - 40 : 0;
    const t0 = performance.now();
    const dur = 1400;
    (function tick(now) {
      const k = clamp((now - t0) / dur, 0, 1);
      el.textContent = Math.round(from + (n - from) * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(tick);
      else el.textContent = finalText;
    })(t0);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      io.unobserve(el);
      el.classList.add('in');
      const num = el.querySelector('.stat-num');
      if (num) countUp(num);
      // Städa upp när övergången är klar så att t.ex. knappars hover fungerar som förut
      const delay = parseFloat(el.style.getPropertyValue('--d')) || 0;
      setTimeout(() => {
        el.classList.remove('reveal', 'in');
        el.style.removeProperty('--d');
      }, delay * 1000 + 1100);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });

  function reveal(parentSel, childSel, step = 0.1, base = 0) {
    document.querySelectorAll(parentSel).forEach((parent) => {
      parent.querySelectorAll(childSel).forEach((el, i) => {
        el.classList.add('reveal');
        el.style.setProperty('--d', (base + i * step).toFixed(2) + 's');
        io.observe(el);
      });
    });
  }

  reveal('.hero .wrap > div:first-child', ':scope > *', 0.12, 0.1);
  reveal('.section-head', ':scope > *', 0.1);
  reveal('.om-text', 'p', 0.12);
  reveal('.stat-row', ':scope > div', 0.12);
  reveal('.tjanster .wrap', ':scope > .service-row', 0);
  reveal('.steps', '.step', 0.1);
  reveal('.kontakt-grid > div:first-child', ':scope > *', 0.1);
  reveal('#contactForm', ':scope > *', 0.08);
})();


/* =====================================================================
   Bakgrundsfärg bakom sidan (syns vid överscroll och i mobilens verktygsfält):
   burgundy överst, mörkare burgundy nederst. Körs alltid, oavsett effekter.
   ===================================================================== */
(() => {
  const root = document.documentElement;
  const css = getComputedStyle(root);
  const top = css.getPropertyValue('--wine').trim() || '#522834';
  const bottom = css.getPropertyValue('--wine-deep').trim() || '#3F1C27';
  let last = '';
  function paint() {
    const max = root.scrollHeight - window.innerHeight;
    const c = max > 0 && window.scrollY / max > 0.5 ? bottom : top;
    if (c !== last) { root.style.backgroundColor = c; last = c; }
  }
  window.addEventListener('scroll', paint, { passive: true });
  window.addEventListener('resize', paint);
  paint();
})();