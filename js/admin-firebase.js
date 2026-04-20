/* =============================================
   DAY SPRING ACADEMY — ADMIN FIREBASE JS v1.1
   Firebase Project : my-whatsapp-2c1af
   Cloudinary Cloud : dzxckgbzp
   ============================================= */

/* ============================================================
   FIREBASE CONFIG  (real — do not modify)
   ============================================================ */
const firebaseConfig = {
  apiKey           : 'AIzaSyBzUELxbbaL6Wb_M1uNhjwlZHVTorN9XJs',
  authDomain       : 'my-whatsapp-2c1af.firebaseapp.com',
  databaseURL      : 'https://my-whatsapp-2c1af-default-rtdb.firebaseio.com',
  projectId        : 'my-whatsapp-2c1af',
  storageBucket    : 'my-whatsapp-2c1af.firebasestorage.app',
  messagingSenderId: '1089455460888',
  appId            : '1:1089455460888:web:15bd0820546c813febe96d',
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

/* ============================================================
   AUTH STATE LISTENER
   ============================================================ */
auth.onAuthStateChanged((user) => {
  const loginWrap = document.getElementById('admin-login-wrap');
  const dashboard = document.getElementById('admin-dashboard');

  if (user) {
    if (loginWrap) loginWrap.style.display = 'none';
    if (dashboard) dashboard.style.display = 'flex';

    const emailEls = document.querySelectorAll('.admin-user-email');
    emailEls.forEach(el => { el.textContent = user.email; });

    bootDashboard();
  } else {
    if (loginWrap) loginWrap.style.display = 'flex';
    if (dashboard) dashboard.style.display = 'none';
  }
});

/* ============================================================
   LOGIN
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Login form
  const form    = document.getElementById('admin-login-form');
  const errorEl = document.getElementById('admin-login-error');
  const loading = document.getElementById('login-loading');
  const btn     = document.getElementById('login-btn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email    = document.getElementById('admin-email')?.value.trim();
      const password = document.getElementById('admin-password')?.value;

      if (errorEl) { errorEl.textContent = ''; errorEl.classList.remove('show'); }
      if (loading) loading.classList.add('show');
      if (btn)     { btn.disabled = true; btn.textContent = 'Signing in…'; }

      try {
        await auth.signInWithEmailAndPassword(email, password);
        // onAuthStateChanged handles the rest
      } catch (err) {
        if (loading) loading.classList.remove('show');
        if (btn)     { btn.disabled = false; btn.textContent = 'Sign In with Firebase'; }

        const msgs = {
          'auth/user-not-found'       : 'No account found with this email.',
          'auth/wrong-password'       : 'Incorrect password. Please try again.',
          'auth/invalid-email'        : 'Please enter a valid email address.',
          'auth/invalid-credential'   : 'Invalid email or password.',
          'auth/too-many-requests'    : 'Too many attempts. Try again later.',
          'auth/network-request-failed':'Network error. Check your connection.',
        };
        const msg = msgs[err.code] || 'Login failed. Please try again.';
        if (errorEl) { errorEl.textContent = msg; errorEl.classList.add('show'); }

        if (typeof gsap !== 'undefined') {
          gsap.fromTo('.admin-login-card', { x: -14 }, { x: 0, duration: .5, ease: 'elastic.out(1,.4)' });
        }
      }
    });
  }

  // Login card entrance animation
  if (typeof gsap !== 'undefined') {
    gsap.from('.admin-login-card', { y: 40, opacity: 0, duration: .8, ease: 'power3.out', delay: .1 });
  }

  // Ann image URL live preview
  const urlInp = document.getElementById('ann-image-url');
  if (urlInp) {
    urlInp.addEventListener('input', () => {
      const v = urlInp.value.trim();
      const w = document.getElementById('ann-image-preview');
      const i = document.getElementById('ann-preview-img');
      if (v.startsWith('http')) { if (i) i.src = v; if (w) w.style.display = 'block'; }
      else if (w) w.style.display = 'none';
    });
  }

  loadMediaLibrary();
});

/* ============================================================
   LOGOUT
   ============================================================ */
function adminLogout() {
  auth.signOut().catch(console.error);
}
window.adminLogout = adminLogout;

/* ============================================================
   HELPERS
   ============================================================ */
function togglePw() {
  const inp = document.getElementById('admin-password');
  if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
}
window.togglePw = togglePw;

function switchTab(tabId) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-nav-item[data-tab]').forEach(n => n.classList.remove('active'));

  const tab = document.getElementById(tabId);
  if (tab) tab.classList.add('active');

  const nav = document.querySelector(`.admin-nav-item[data-tab="${tabId}"]`);
  if (nav) nav.classList.add('active');

  const titleEl = document.getElementById('admin-page-title');
  if (titleEl && nav) titleEl.textContent = nav.querySelector('.nav-text')?.textContent || '';

  // Close mobile sidebar
  if (window.innerWidth < 1025) {
    document.getElementById('admin-sidebar')?.classList.remove('open');
  }
}
window.switchTab = switchTab;

function toggleSidebar() {
  document.getElementById('admin-sidebar')?.classList.toggle('open');
}
window.toggleSidebar = toggleSidebar;

// Wire all [data-tab] elements
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-tab]');
  if (el && el.dataset.tab) switchTab(el.dataset.tab);
});

/* ============================================================
   BOOT DASHBOARD
   ============================================================ */
function bootDashboard() {
  setTimeout(() => {
    // Render tables from admin.js data
    if (typeof renderStats              === 'function') renderStats();
    if (typeof renderInquiriesTable     === 'function') renderInquiriesTable();
    if (typeof renderAnnouncementsTable === 'function') renderAnnouncementsTable();

    // Dashboard preview table
    const preview = document.getElementById('dashboard-inquiries-preview');
    if (preview && typeof DEMO_INQUIRIES !== 'undefined') {
      preview.innerHTML = DEMO_INQUIRIES.slice(0, 4).map(i => `
        <tr>
          <td>${i.name}</td>
          <td>${i.student}</td>
          <td>${i.grade}</td>
          <td>${i.date}</td>
          <td><span class="status-pill status-${i.status}">${i.status}</span></td>
        </tr>`).join('');
    }

    const cnt = document.getElementById('inquiry-count');
    if (cnt && typeof DEMO_INQUIRIES !== 'undefined') {
      cnt.textContent = `${DEMO_INQUIRIES.length} total`;
    }

    loadMediaLibrary();
    updateImageStat();
  }, 250);
}

/* ============================================================
   IMAGE MANAGER — CLOUDINARY UPLOAD
   ============================================================ */
const CLOUD_NAME    = 'dzxckgbzp';
const UPLOAD_PRESET = 'day_spring_academy'; // Create as Unsigned preset in Cloudinary

let lastUploadedUrl = '';
let pickMode        = false;
let mediaLibrary    = [];

function goPickImage() {
  pickMode = true;
  switchTab('tab-images');
  document.getElementById('pick-mode-banner')?.classList.add('show');
}
window.goPickImage = goPickImage;

function exitPickMode() {
  pickMode = false;
  document.getElementById('pick-mode-banner')?.classList.remove('show');
  document.querySelectorAll('.media-item.selected').forEach(el => el.classList.remove('selected'));
}
window.exitPickMode = exitPickMode;

// File input + drag-drop
document.addEventListener('DOMContentLoaded', () => {
  const inp  = document.getElementById('image-file-input');
  const zone = document.getElementById('upload-zone');
  if (!inp || !zone) return;

  inp.addEventListener('change', e => {
    if (e.target.files.length) uploadFiles(Array.from(e.target.files));
  });
  zone.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', ()  => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('drag-over');
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length) uploadFiles(files);
  });
});

async function uploadFiles(files) {
  const pw  = document.getElementById('upload-progress-wrap');
  const pf  = document.getElementById('upload-progress-fill');
  const pl  = document.getElementById('upload-progress-label');
  const err = document.getElementById('upload-error');
  const prv = document.getElementById('upload-preview');

  if (err) err.style.display = 'none';
  if (prv) prv.classList.remove('show');
  if (pw)  pw.classList.add('show');

  let uploaded = 0;

  for (const file of files) {
    if (pl) pl.textContent = `Uploading "${file.name}" (${uploaded + 1} of ${files.length})…`;

    try {
      const url = await uploadOneFile(file, pct => {
        if (pf) pf.style.width = `${Math.round((uploaded / files.length) * 100 + pct / files.length)}%`;
      });

      mediaLibrary.unshift({
        url, name: file.name,
        date: new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }),
      });
      saveMediaLibrary();
      lastUploadedUrl = url;
      uploaded++;

      const pi = document.getElementById('upload-preview-img');
      const pu = document.getElementById('upload-preview-url');
      if (pi) pi.src = url;
      if (pu) pu.textContent = url;
      if (prv) prv.classList.add('show');

    } catch (e) {
      if (err) {
        err.innerHTML = `<strong>Upload failed:</strong> ${e.message}<br>
          <small>Make sure you created an <em>Unsigned</em> upload preset named
          <strong>day_spring_academy</strong> in Cloudinary.</small>`;
        err.style.display = 'block';
      }
    }
  }

  if (pf) pf.style.width = '100%';
  if (pl) pl.textContent = uploaded
    ? `✅ ${uploaded} image${uploaded > 1 ? 's' : ''} uploaded!`
    : 'Done.';

  setTimeout(() => { if (pw) pw.classList.remove('show'); if (pf) pf.style.width = '0%'; }, 3500);
  renderMediaLibrary();
  updateImageStat();
}

function uploadOneFile(file, onProgress) {
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', UPLOAD_PRESET);
    fd.append('folder', 'day-spring-academy');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
    xhr.upload.addEventListener('progress', e => {
      if (e.lengthComputable) onProgress(Math.round(e.loaded / e.total * 100));
    });
    xhr.onload = () => {
      if (xhr.status === 200) {
        try { resolve(JSON.parse(xhr.responseText).secure_url); }
        catch { reject(new Error('Invalid Cloudinary response')); }
      } else {
        try { reject(new Error(JSON.parse(xhr.responseText).error?.message || `HTTP ${xhr.status}`)); }
        catch { reject(new Error(`HTTP ${xhr.status}`)); }
      }
    };
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send(fd);
  });
}

function copyUploadedUrl() {
  if (!lastUploadedUrl) return;
  navigator.clipboard.writeText(lastUploadedUrl).then(() => {
    const btn = document.getElementById('upload-copy-btn');
    if (btn) { btn.classList.add('copied'); btn.textContent = '✅ Copied!'; }
    showToast();
    setTimeout(() => { if (btn) { btn.classList.remove('copied'); btn.textContent = '📋 Copy URL'; } }, 2500);
  }).catch(() => showToast('⚠️ Copy the URL manually'));
}
window.copyUploadedUrl = copyUploadedUrl;

function useInAnnouncement() {
  if (!lastUploadedUrl) return;
  switchTab('tab-new-announcement');
  const inp = document.getElementById('ann-image-url');
  if (inp) { inp.value = lastUploadedUrl; inp.dispatchEvent(new Event('input')); }
  showToast('✅ Image inserted into announcement!');
}
window.useInAnnouncement = useInAnnouncement;

/* ============================================================
   MEDIA LIBRARY
   ============================================================ */
function saveMediaLibrary()  { try { sessionStorage.setItem('dsa_media', JSON.stringify(mediaLibrary)); } catch {} }
function loadMediaLibrary()  {
  try { const s = sessionStorage.getItem('dsa_media'); if (s) mediaLibrary = JSON.parse(s); } catch {}
  renderMediaLibrary();
}
function updateImageStat() {
  const el  = document.getElementById('stat-images');
  const cnt = document.getElementById('media-count');
  if (el)  el.textContent  = mediaLibrary.length;
  if (cnt) cnt.textContent = `(${mediaLibrary.length} image${mediaLibrary.length !== 1 ? 's' : ''})`;
}

function renderMediaLibrary(filter = '') {
  const grid  = document.getElementById('media-library-grid');
  const empty = document.getElementById('media-empty');
  if (!grid) return;

  const list = filter
    ? mediaLibrary.filter(m => m.name.toLowerCase().includes(filter.toLowerCase()))
    : mediaLibrary;

  if (!list.length) {
    grid.style.display = 'none';
    if (empty) empty.style.display = 'block';
  } else {
    grid.style.display = 'grid';
    if (empty) empty.style.display = 'none';

    grid.innerHTML = list.map(item => {
      const ri  = mediaLibrary.indexOf(item);
      const url = item.url.replace(/'/g, "\\'");
      return `
        <div class="media-item" data-idx="${ri}" onclick="mediaItemClick(${ri},'${url}')">
          <img src="${item.url}" alt="${item.name}" loading="lazy"
               style="width:100%;height:110px;object-fit:cover;display:block;"
               onerror="this.style.display='none'"/>
          <div class="media-item-body">
            <div class="media-item-name" title="${item.name}">${item.name}</div>
            <div style="font-size:.67rem;color:rgba(255,255,255,.22);margin-bottom:8px;">${item.date}</div>
            <div class="media-item-actions">
              <button class="media-btn media-btn-copy"   onclick="event.stopPropagation();copyMediaUrl('${url}')">Copy</button>
              <button class="media-btn media-btn-use"    onclick="event.stopPropagation();insertMediaUrl('${url}')">Use</button>
              <button class="media-btn media-btn-delete" onclick="event.stopPropagation();deleteMedia(${ri})">Del</button>
            </div>
          </div>
        </div>`;
    }).join('');
  }
  updateImageStat();
}

function filterMedia(q) { renderMediaLibrary(q); }
window.filterMedia = filterMedia;

function mediaItemClick(idx, url) {
  if (pickMode) {
    insertMediaUrl(url);
    exitPickMode();
    switchTab('tab-new-announcement');
    showToast('✅ Image inserted!');
  } else {
    document.querySelectorAll('.media-item').forEach(el => el.classList.remove('selected'));
    document.querySelector(`.media-item[data-idx="${idx}"]`)?.classList.add('selected');
  }
}
window.mediaItemClick = mediaItemClick;

function copyMediaUrl(url)   { navigator.clipboard.writeText(url).then(()=>showToast()).catch(()=>{}); }
window.copyMediaUrl = copyMediaUrl;

function insertMediaUrl(url) {
  const inp = document.getElementById('ann-image-url');
  if (inp) { inp.value = url; inp.dispatchEvent(new Event('input')); }
  lastUploadedUrl = url;
  showToast('✅ Image inserted!');
}
window.insertMediaUrl = insertMediaUrl;

function deleteMedia(idx) {
  if (!confirm('Remove from library? (Image stays on Cloudinary)')) return;
  mediaLibrary.splice(idx, 1);
  saveMediaLibrary();
  renderMediaLibrary(document.getElementById('media-search')?.value || '');
  updateImageStat();
}
window.deleteMedia = deleteMedia;

function clearMediaLibrary() {
  if (!confirm('Clear all images?\nImages will NOT be deleted from Cloudinary.')) return;
  mediaLibrary = [];
  saveMediaLibrary();
  renderMediaLibrary();
  updateImageStat();
}
window.clearMediaLibrary = clearMediaLibrary;

/* ============================================================
   TOAST
   ============================================================ */
function showToast(msg = '✅ URL copied!') {
  const t = document.getElementById('copy-toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}
window.showToast = showToast;
