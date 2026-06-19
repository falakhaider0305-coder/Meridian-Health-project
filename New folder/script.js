// ============ Mobile nav toggle ============
const navToggle = document.getElementById('navToggle');
const mainNav = document.querySelector('.main-nav');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
}

// ============ Doctor specialty filter ============
const pills = document.querySelectorAll('.pill');
const doctorCards = document.querySelectorAll('.doctor-card');
pills.forEach(pill => {
  pill.addEventListener('click', () => {
    pills.forEach(p => p.classList.remove('is-active'));
    pill.classList.add('is-active');
    const filter = pill.dataset.filter;
    doctorCards.forEach(card => {
      const match = filter === 'all' || card.dataset.spec === filter;
      card.style.display = match ? '' : 'none';
    });
  });
});

// ============ File upload (booking form) ============
const fileInput = document.getElementById('fileInput');
const uploadZone = document.getElementById('uploadZone');
const fileList = document.getElementById('fileList');
let selectedFiles = [];

function renderFileList() {
  fileList.innerHTML = '';
  selectedFiles.forEach((file, idx) => {
    const chip = document.createElement('div');
    chip.className = 'file-chip';
    const sizeKb = (file.size / 1024).toFixed(0);
    chip.innerHTML = `<span>📄 ${escapeHtml(file.name)} <span style="opacity:.5">(${sizeKb} KB)</span></span>`;
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
      selectedFiles.splice(idx, 1);
      renderFileList();
    });
    chip.appendChild(removeBtn);
    fileList.appendChild(chip);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

if (fileInput) {
  fileInput.addEventListener('change', (e) => {
    selectedFiles = selectedFiles.concat(Array.from(e.target.files));
    renderFileList();
  });

  ['dragenter', 'dragover'].forEach(evt => {
    uploadZone.addEventListener(evt, (e) => {
      e.preventDefault();
      uploadZone.classList.add('is-dragover');
    });
  });
  ['dragleave', 'drop'].forEach(evt => {
    uploadZone.addEventListener(evt, (e) => {
      e.preventDefault();
      uploadZone.classList.remove('is-dragover');
    });
  });
  uploadZone.addEventListener('drop', (e) => {
    const dropped = Array.from(e.dataTransfer.files);
    selectedFiles = selectedFiles.concat(dropped);
    renderFileList();
  });
}

// ============ Booking form submit (demo behavior) ============
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const doc = document.getElementById('docSelect').value;
    const date = document.getElementById('visitDate').value || 'a date you choose';
    const time = document.getElementById('visitTime').value;
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Confirming…';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = '✓ Visit requested!';
      setTimeout(() => {
        alert(`Demo booking confirmed.\n\nDoctor: ${doc}\nDate: ${date}\nTime: ${time}\nFiles attached: ${selectedFiles.length}\n\n(This is a static demo — no real payment or booking was processed.)`);
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 700);
    }, 900);
  });
}

// ============ Scroll reveal for step cards ============
const revealEls = document.querySelectorAll('.fade-up');
if ('IntersectionObserver' in window && revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('is-visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => observer.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// ============ Hero call timer (cosmetic) ============
const callTimer = document.getElementById('callTimer');
if (callTimer) {
  let seconds = 252; // 04:12
  setInterval(() => {
    seconds++;
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    callTimer.textContent = `${m}:${s}`;
  }, 1000);
}

// ============ Set min date on booking date input to today ============
const visitDate = document.getElementById('visitDate');
if (visitDate) {
  const today = new Date().toISOString().split('T')[0];
  visitDate.setAttribute('min', today);
  visitDate.value = today;
}