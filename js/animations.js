/* =============================================
   DAY SPRING ACADEMY — ANIMATIONS JS  v1.1
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') return;
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  const page = window.location.pathname.split('/').pop() || 'index.html';

  animateNavbar();
  animatePageHero();
  animateCards();
  animateFooter();

  if (page === 'index.html' || page === '') {
    animateHero();
    animateHomeSections();
  }
});

function animateNavbar() {
  const el = document.getElementById('navbar');
  if (el) gsap.from(el, { y: -80, opacity: 0, duration: .8, ease: 'power3.out', delay: .1 });
}

function animateHero() {
  const tl = gsap.timeline({ delay: .25 });

  const ring = document.querySelector('.hero-logo-ring');
  if (ring) tl.from(ring, { scale: .5, opacity: 0, duration: 1.1, ease: 'back.out(1.5)' });

  const eyebrow = document.querySelector('.hero-eyebrow');
  if (eyebrow) tl.from(eyebrow, { y: 20, opacity: 0, duration: .6, ease: 'power2.out' }, '-=.6');

  const title = document.querySelector('.hero-title');
  if (title) tl.from(title, { y: 60, opacity: 0, duration: 1, ease: 'power3.out' }, '-=.4');

  const tag = document.querySelector('.hero-tagline');
  if (tag) tl.from(tag, { y: 30, opacity: 0, duration: .8, ease: 'power2.out' }, '-=.6');

  const btns = document.querySelectorAll('.hero-buttons .btn');
  if (btns.length) tl.from(btns, { y: 25, opacity: 0, duration: .6, stagger: .12, ease: 'power2.out' }, '-=.5');

  const stats = document.querySelectorAll('.hero-stat');
  if (stats.length) tl.from(stats, { y: 30, opacity: 0, duration: .6, stagger: .1, ease: 'power2.out' }, '-=.3');

  const scroll = document.querySelector('.scroll-indicator');
  if (scroll) tl.from(scroll, { opacity: 0, duration: .8 }, '-=.2');
}

function animatePageHero() {
  const hero = document.querySelector('.page-hero-content');
  if (!hero) return;
  const tl = gsap.timeline({ delay: .3 });
  const bc = hero.querySelector('.breadcrumb');
  const ey = hero.querySelector('.section-eyebrow');
  const h1 = hero.querySelector('h1');
  const p  = hero.querySelector('p');
  if (bc) tl.from(bc, { y: 15, opacity: 0, duration: .5, ease: 'power2.out' });
  if (ey) tl.from(ey, { y: 15, opacity: 0, duration: .5, ease: 'power2.out' }, '-=.2');
  if (h1) tl.from(h1, { y: 40, opacity: 0, duration: .9, ease: 'power3.out' }, '-=.3');
  if (p)  tl.from(p,  { y: 20, opacity: 0, duration: .7, ease: 'power2.out' }, '-=.5');
}

function animateHomeSections() {
  if (typeof ScrollTrigger === 'undefined') return;

  gsap.utils.toArray('.section-header').forEach(header => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: header, start: 'top 82%', once: true } });
    const ey = header.querySelector('.section-eyebrow');
    const ti = header.querySelector('.section-title');
    const su = header.querySelector('.section-subtitle');
    if (ey) tl.from(ey, { y: 20, opacity: 0, duration: .6, ease: 'power2.out' });
    if (ti) tl.from(ti, { y: 35, opacity: 0, duration: .8, ease: 'power3.out' }, '-=.3');
    if (su) tl.from(su, { y: 20, opacity: 0, duration: .6, ease: 'power2.out' }, '-=.5');
  });

  const featureCards = document.querySelectorAll('.feature-card');
  if (featureCards.length) {
    gsap.from(featureCards, {
      scrollTrigger: { trigger: '.features-grid', start: 'top 80%', once: true },
      y: 50, opacity: 0, duration: .7, stagger: .12, ease: 'power3.out',
    });
  }

  const programCards = document.querySelectorAll('.program-card');
  if (programCards.length) {
    gsap.from(programCards, {
      scrollTrigger: { trigger: '.programs-grid', start: 'top 80%', once: true },
      y: 60, opacity: 0, duration: .8, stagger: .15, ease: 'power3.out',
    });
  }

  const testCards = document.querySelectorAll('.testimonial-card');
  if (testCards.length) {
    gsap.from(testCards, {
      scrollTrigger: { trigger: '.testimonials-grid', start: 'top 80%', once: true },
      x: -40, opacity: 0, duration: .8, stagger: .15, ease: 'power3.out',
    });
  }

  const cta = document.querySelector('.cta-band');
  if (cta) {
    const tl = gsap.timeline({ scrollTrigger: { trigger: cta, start: 'top 80%', once: true } });
    const h2 = cta.querySelector('h2');
    const p  = cta.querySelector('p');
    const bs = cta.querySelectorAll('.btn');
    if (h2) tl.from(h2, { y: 30, opacity: 0, duration: .8, ease: 'power3.out' });
    if (p)  tl.from(p,  { y: 20, opacity: 0, duration: .6, ease: 'power2.out' }, '-=.5');
    if (bs.length) tl.from(bs, { y: 20, opacity: 0, stagger: .12, duration: .5, ease: 'power2.out' }, '-=.3');
  }
}

function animateCards() {
  if (typeof ScrollTrigger === 'undefined') return;

  const groups = [
    { sel: '.academic-card', trigger: '.academics-grid' },
    { sel: '.news-card',     trigger: '.news-grid' },
    { sel: '.value-card',    trigger: '.values-grid', extra: { scale: .95 } },
    { sel: '.team-card',     trigger: '.team-grid' },
    { sel: '.contact-card',  trigger: '.contact-info-cards', x: -30 },
    { sel: '.process-step',  trigger: '.process-steps' },
    { sel: '.info-box',      trigger: '.admissions-info', x: -30 },
  ];

  groups.forEach(({ sel, trigger, extra = {}, x = 0 }) => {
    const els = document.querySelectorAll(sel);
    if (!els.length || !document.querySelector(trigger)) return;
    gsap.from(els, {
      scrollTrigger: { trigger, start: 'top 80%', once: true },
      y: x ? 0 : 50, x, opacity: 0, duration: .7, stagger: .1, ease: 'power3.out', ...extra,
    });
  });

  // Mission/vision
  const mvCards = document.querySelectorAll('.mv-card');
  if (mvCards.length && document.querySelector('.mission-vision-grid')) {
    gsap.from(mvCards, {
      scrollTrigger: { trigger: '.mission-vision-grid', start: 'top 80%', once: true },
      x: (i) => i === 0 ? -50 : 50,
      opacity: 0, duration: .9, ease: 'power3.out',
    });
  }

  // Forms
  ['.contact-form-wrap', '.admissions-form-wrap'].forEach(sel => {
    const el = document.querySelector(sel);
    if (el) {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        x: 40, opacity: 0, duration: .9, ease: 'power3.out',
      });
    }
  });
}

function animateFooter() {
  const footer = document.querySelector('.footer');
  if (!footer || typeof ScrollTrigger === 'undefined') return;
  const tl = gsap.timeline({ scrollTrigger: { trigger: footer, start: 'top 90%', once: true } });
  tl.from('.footer-brand', { y: 30, opacity: 0, duration: .7, ease: 'power2.out' });
  tl.from('.footer-col',   { y: 30, opacity: 0, duration: .6, stagger: .1, ease: 'power2.out' }, '-=.5');
}

/* Magnetic button effect */
if (typeof gsap !== 'undefined') {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top  - r.height / 2;
      gsap.to(btn, { x: x * .1, y: y * .1, duration: .3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: .5, ease: 'elastic.out(1,.5)' });
    });
  });
}
