/* =============================================
   DAY SPRING ACADEMY — ADMIN DATA JS  v1.1
   Demo data + table rendering + announcement form
   Auth is handled by admin-firebase.js
   ============================================= */

/* ---- Demo Data ---- */
const DEMO_INQUIRIES = [
  { id:1, name:'Mrs. Ada Johnson',     email:'ada.j@gmail.com',      student:'Michael Johnson',   grade:'Grade 7',  date:'Apr 18, 2026', status:'pending'   },
  { id:2, name:'Mr. Emeka Okonkwo',   email:'emeka@yahoo.com',      student:'Chisom Okonkwo',    grade:'Grade 3',  date:'Apr 17, 2026', status:'reviewed'  },
  { id:3, name:'Mrs. Grace Eze',      email:'grace.eze@mail.com',   student:'David Eze',         grade:'Grade 10', date:'Apr 16, 2026', status:'contacted' },
  { id:4, name:'Mr. Tunde Abiodun',   email:'tunde.a@gmail.com',    student:'Sade Abiodun',      grade:'Grade 1',  date:'Apr 15, 2026', status:'pending'   },
  { id:5, name:'Mrs. Ngozi Nwachukwu',email:'ngozi@mail.com',       student:'Obinna Nwachukwu',  grade:'Grade 6',  date:'Apr 14, 2026', status:'pending'   },
];

const DEMO_ANNOUNCEMENTS = [
  { id:1, title:'End of Term Examinations Begin',  category:'Update',      date:'Apr 19, 2026', author:'Admin' },
  { id:2, title:'Inter-House Sports Day 2026',     category:'Event',       date:'Apr 12, 2026', author:'Admin' },
  { id:3, title:'Science Fair Winners Announced',  category:'Achievement', date:'Apr 5,  2026', author:'Admin' },
  { id:4, title:'Parent-Teacher Conference Date',  category:'Event',       date:'Mar 28, 2026', author:'Admin' },
];

/* ---- Render Stats ---- */
function renderStats() {
  const pending = DEMO_INQUIRIES.filter(i => i.status === 'pending').length;
  setText('stat-inquiries',     DEMO_INQUIRIES.length);
  setText('stat-pending',       pending);
  setText('stat-announcements', DEMO_ANNOUNCEMENTS.length);
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

/* ---- Render Inquiries Table ---- */
function renderInquiriesTable() {
  const tbody = document.getElementById('inquiries-tbody');
  if (!tbody) return;

  tbody.innerHTML = DEMO_INQUIRIES.map(inq => `
    <tr>
      <td>${inq.name}</td>
      <td style="font-size:.82rem;">${inq.email}</td>
      <td>${inq.student}</td>
      <td>${inq.grade}</td>
      <td>${inq.date}</td>
      <td>
        <select class="status-select" onchange="updateStatus(${inq.id},this.value)" style="background:transparent;border:1px solid rgba(255,255,255,.15);color:#fff;border-radius:20px;padding:4px 10px;font-size:.78rem;font-family:var(--font-body);cursor:pointer;outline:none;">
          <option value="pending"   ${inq.status==='pending'   ?'selected':''}>Pending</option>
          <option value="reviewed"  ${inq.status==='reviewed'  ?'selected':''}>Reviewed</option>
          <option value="contacted" ${inq.status==='contacted' ?'selected':''}>Contacted</option>
        </select>
      </td>
    </tr>
  `).join('');

  styleStatusSelects();
}

function styleStatusSelects() {
  const colors = {
    pending  : { bg:'rgba(245,158,11,.15)',  color:'#fbbf24' },
    reviewed : { bg:'rgba(59,130,246,.15)',  color:'#60a5fa' },
    contacted: { bg:'rgba(16,185,129,.15)', color:'#34d399' },
  };
  document.querySelectorAll('.status-select').forEach(sel => {
    const c = colors[sel.value] || colors.pending;
    sel.style.backgroundColor = c.bg;
    sel.style.color            = c.color;
    sel.style.borderColor      = c.color + '55';
    sel.addEventListener('change', () => {
      const nc = colors[sel.value] || colors.pending;
      sel.style.backgroundColor = nc.bg;
      sel.style.color            = nc.color;
      sel.style.borderColor      = nc.color + '55';
    });
  });
}

window.updateStatus = function(id, status) {
  const inq = DEMO_INQUIRIES.find(i => i.id === id);
  if (inq) { inq.status = status; renderStats(); }
};

/* ---- Render Announcements Table ---- */
function renderAnnouncementsTable() {
  const tbody = document.getElementById('announcements-tbody');
  if (!tbody) return;

  tbody.innerHTML = DEMO_ANNOUNCEMENTS.map(ann => `
    <tr>
      <td>${ann.title}</td>
      <td><span class="badge badge-blue">${ann.category}</span></td>
      <td>${ann.date}</td>
      <td>${ann.author}</td>
      <td>
        <button onclick="deleteAnnouncement(${ann.id})" style="background:rgba(239,68,68,.1);color:#f87171;border:1px solid rgba(239,68,68,.2);border-radius:6px;padding:5px 12px;font-size:.78rem;cursor:pointer;font-family:var(--font-body);">Delete</button>
      </td>
    </tr>
  `).join('');
}

window.deleteAnnouncement = function(id) {
  if (!confirm('Delete this announcement?')) return;
  const idx = DEMO_ANNOUNCEMENTS.findIndex(a => a.id === id);
  if (idx !== -1) {
    DEMO_ANNOUNCEMENTS.splice(idx, 1);
    renderAnnouncementsTable();
    renderStats();
  }
};

/* ---- New Announcement Form ---- */
document.addEventListener('DOMContentLoaded', () => {
  const annForm = document.getElementById('announcement-form');
  if (!annForm) return;

  annForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title    = annForm.querySelector('[name="ann-title"]')?.value.trim();
    const content  = annForm.querySelector('[name="ann-content"]')?.value.trim();
    const category = annForm.querySelector('[name="ann-category"]')?.value || 'Update';

    if (!title || !content) {
      alert('Please fill in the title and content.');
      return;
    }

    DEMO_ANNOUNCEMENTS.unshift({
      id      : Date.now(),
      title,
      content,
      category,
      date    : new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }),
      author  : 'Admin',
    });

    renderAnnouncementsTable();
    renderStats();
    annForm.reset();

    // Clear image preview
    const prevWrap = document.getElementById('ann-image-preview');
    const prevImg  = document.getElementById('ann-preview-img');
    if (prevWrap) prevWrap.style.display = 'none';
    if (prevImg)  prevImg.src = '';

    const success = document.getElementById('ann-success');
    if (success) {
      success.style.display = 'block';
      setTimeout(() => { success.style.display = 'none'; }, 4000);
    }
  });
});
