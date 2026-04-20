/* =============================================
   DAY SPRING ACADEMY — MAIN JS  v1.1
   EmailJS Service : service_ajv6t1w
   EmailJS Template: template_c2xhkvi
   EmailJS Public  : jhbIhvMHWNRMYSll6
   ============================================= */

const DSA_EMAIL = {
  publicKey : 'jhbIhvMHWNRMYSll6',
  serviceId : 'service_ajv6t1w',
  templateId: 'template_c2xhkvi',
};

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Init EmailJS ---- */
  if (typeof emailjs !== 'undefined') {
    emailjs.init(DSA_EMAIL.publicKey);
  }

  /* ---- Navbar scroll ---- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  /* ---- Hamburger ---- */
  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Active nav link ---- */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    if (link.getAttribute('href') === page) {
      link.classList.add('active');
    }
  });

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(el => obs.observe(el));
  }

  /* ---- Academics filter ---- */
  const filterBtns  = document.querySelectorAll('.filter-btn[data-filter]');
  const filterItems = document.querySelectorAll('[data-category]');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        filterItems.forEach(item => {
          const show = cat === 'all' || item.dataset.category === cat;
          item.style.display = show ? '' : 'none';
          if (show) item.style.animation = 'fadeIn 0.4s ease';
        });
      });
    });
  }

  /* ---- Accordion ---- */
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const body = btn.nextElementSibling;
      const wasOpen = body?.classList.contains('open');
      document.querySelectorAll('.accordion-body.open').forEach(b => b.classList.remove('open'));
      document.querySelectorAll('.accordion-btn').forEach(b => {
        b.innerHTML = b.innerHTML.replace('▲', '▼');
      });
      if (!wasOpen && body) {
        body.classList.add('open');
        btn.innerHTML = btn.innerHTML.replace('▼', '▲');
      }
    });
  });

  /* ---- News search ---- */
  const newsSearchInput = document.querySelector('.news-search input');
  if (newsSearchInput) {
    newsSearchInput.addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.news-card').forEach(card => {
        const title = (card.querySelector('h3')?.textContent || '').toLowerCase();
        const body  = (card.querySelector('p')?.textContent  || '').toLowerCase();
        card.style.display = (title.includes(q) || body.includes(q)) ? '' : 'none';
      });
    });
  }

  /* ---- Hidden admin dot ---- */
  const adminDot = document.querySelector('.admin-dot');
  if (adminDot) {
    adminDot.addEventListener('click', () => { window.location.href = 'admin.html'; });
  }

  /* ---- Counter animation ---- */
  initCounters();

  /* ---- Forms ---- */
  initAdmissionsForm();
  initContactForm();

  /* ---- Smooth anchor scroll ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
});

/* ================================================
   ADMISSIONS FORM
   ================================================ */
function initAdmissionsForm() {
  const form = document.getElementById('admissions-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(form, admissionsRules)) return;

    const btn = form.querySelector('button[type="submit"]');
    setBtn(btn, true, 'Sending…');

    const fd = new FormData(form);
    const params = {
      form_type   : 'Admissions Inquiry',
      from_name   : fd.get('fullName')    || '',
      from_email  : fd.get('email')       || '',
      phone       : fd.get('phone')       || 'Not provided',
      subject     : 'Admissions Inquiry',
      student_name: fd.get('studentName') || '',
      grade_level : fd.get('grade')       || 'Not specified',
      message     : fd.get('message')     || 'No additional message',
      date        : new Date().toLocaleString('en-US', { dateStyle:'full', timeStyle:'short' }),
    };

    try {
      if (typeof emailjs === 'undefined') throw new Error('EmailJS not loaded');
      await emailjs.send(DSA_EMAIL.serviceId, DSA_EMAIL.templateId, params);
      showMsg(form, 'success', '✅ Enquiry sent! We\'ll be in touch within 2 business days.');
      form.reset();
    } catch (err) {
      console.error('EmailJS:', err);
      showMsg(form, 'error', '⚠️ Could not send. Please try again or call us directly.');
    } finally {
      setBtn(btn, false, 'Submit Enquiry');
    }
  });
  liveValidate(form);
}

const admissionsRules = {
  fullName   : { required:true, minLen:2,  label:'Full name' },
  email      : { required:true, email:true, label:'Email address' },
  phone      : { required:true,             label:'Phone number' },
  studentName: { required:true, minLen:2,  label:'Student name' },
  grade      : { required:true,             label:'Grade level' },
  agree      : { required:true, checkbox:true, label:'Agreement' },
};

/* ================================================
   CONTACT FORM
   ================================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(form, contactRules)) return;

    const btn = form.querySelector('button[type="submit"]');
    setBtn(btn, true, 'Sending…');

    const fd = new FormData(form);
    const params = {
      form_type   : 'General Contact',
      from_name   : fd.get('name')    || '',
      from_email  : fd.get('email')   || '',
      phone       : 'Not provided',
      subject     : fd.get('subject') || '',
      student_name: 'N/A',
      grade_level : 'N/A',
      message     : fd.get('message') || '',
      date        : new Date().toLocaleString('en-US', { dateStyle:'full', timeStyle:'short' }),
    };

    try {
      if (typeof emailjs === 'undefined') throw new Error('EmailJS not loaded');
      await emailjs.send(DSA_EMAIL.serviceId, DSA_EMAIL.templateId, params);
      showMsg(form, 'success', '✅ Message sent! We\'ll respond within one business day.');
      form.reset();
    } catch (err) {
      console.error('EmailJS:', err);
      showMsg(form, 'error', '⚠️ Could not send. Please email us directly at info@dayspringacademy.edu');
    } finally {
      setBtn(btn, false, 'Send Message');
    }
  });
  liveValidate(form);
}

const contactRules = {
  name   : { required:true, minLen:2,  label:'Full name' },
  email  : { required:true, email:true, label:'Email address' },
  subject: { required:true, minLen:3,  label:'Subject' },
  message: { required:true, minLen:10, label:'Message' },
};

/* ================================================
   FORM UTILITIES
   ================================================ */
function validateForm(form, rules) {
  let valid = true;
  Object.entries(rules).forEach(([name, rule]) => {
    const input = form.querySelector(`[name="${name}"]`);
    const errEl = form.querySelector(`#err-${name}`);
    if (!input) return;

    let error = '';
    if (rule.checkbox) {
      if (rule.required && !input.checked) error = 'Please tick this box to continue.';
    } else {
      const val = input.value.trim();
      if      (rule.required && !val)                                   error = `${rule.label} is required.`;
      else if (rule.minLen   && val.length < rule.minLen)               error = `${rule.label} must be at least ${rule.minLen} characters.`;
      else if (rule.email    && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) error = 'Please enter a valid email address.';
    }

    if (errEl) { errEl.textContent = error; errEl.classList.toggle('show', !!error); }
    input.classList.toggle('error', !!error);
    if (error) valid = false;
  });
  return valid;
}

function liveValidate(form) {
  form.querySelectorAll('input,textarea,select').forEach(inp => {
    inp.addEventListener('input', () => {
      inp.classList.remove('error');
      const e = form.querySelector(`#err-${inp.name}`);
      if (e) e.classList.remove('show');
    });
  });
}

function setBtn(btn, loading, label) {
  if (!btn) return;
  btn.disabled = loading;
  btn.textContent = label;
  btn.style.opacity = loading ? '.65' : '1';
}

function showMsg(form, type, text) {
  form.querySelectorAll('.dsa-msg').forEach(el => el.remove());
  const div = document.createElement('div');
  div.className = 'dsa-msg';
  const isSuccess = type === 'success';
  div.style.cssText = `display:flex;align-items:center;gap:12px;padding:16px 20px;border-radius:8px;
    margin-top:18px;font-size:.92rem;font-weight:500;animation:fadeIn .4s ease;
    background:${isSuccess ? 'rgba(16,185,129,.1)' : 'rgba(239,68,68,.08)'};
    color:${isSuccess ? '#065f46' : '#991b1b'};
    border:1px solid ${isSuccess ? 'rgba(16,185,129,.3)' : 'rgba(239,68,68,.25)'};`;
  div.innerHTML = text;
  form.appendChild(div);
  div.scrollIntoView({ behavior:'smooth', block:'nearest' });
  setTimeout(() => div.remove(), 9000);
}

/* ================================================
   COUNTER ANIMATION
   ================================================ */
function initCounters() {
  const els = document.querySelectorAll('.count-up');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      let cur = 0;
      const step = target / (2000 / 16);
      const timer = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(timer); }
        el.textContent = Math.floor(cur) + suffix;
      }, 16);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(el => obs.observe(el));
}
