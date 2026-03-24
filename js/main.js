// ═══════════════════════════════════════════════
//  main.js — RSVP Form · Scroll Animations · Confetti
//  Fauzi & Diyanah Wedding · 17 October 2026
// ═══════════════════════════════════════════════

// ── CONFIGURATION ───────────────────────────────
// After deploying your Google Apps Script Web App, paste the URL here.
// See README.md for deployment instructions.
const GAS_URL = 'https://script.google.com/macros/s/AKfycbzirbwpUnH7IxTnCM2bAvAsfESRKb_VVYPNKddxE-GGTWZs964cfvEURmdXhvGHKFIzKQ/exec';

// ── WRONG TEAM LIST 🥚 ──────────────────────────
// Add guests below with the team they are SUPPOSED to be on.
// If they pick the other team, the video popup will appear.
//
// Fields:
//   name        — the guest's full name (required)
//   aliases     — other names they might type, e.g. nickname or first name only (optional)
//   correctTeam — 'Team Bride' or 'Team Groom'
//
// All name matching is case-insensitive and trims whitespace.
//
const WRONG_TEAM_LIST = [

  // ── Replace the entries below with your actual guests ─────────────────
  // Fields:
  //   name        — the full name you expect them to type (required)
  //   aliases     — other ways they might type their name (optional)
  //   correctTeam — 'Team Bride' or 'Team Groom'
  // All matching is case-insensitive and trims whitespace.
  // ──────────────────────────────────────────────────────────────────────

  // Guest who has no nickname — match full name only
  {
    name:        'Edwin Sng',
    aliases:     ['edwin'],
    correctTeam: 'Team Groom',
  },

  // Guest who might skip their surname or write it differently
  {
    name:        'Lin Yongjie',
    aliases:     ['yongjie', 'lin yongjie', 'yongjie lin'],
    correctTeam: 'Team Groom',
  },

  // Malay name — might type first name only or drop "Nur"
  {
    name:        'Nur Syahirah',
    aliases:     ['syahirah', 'nur shahira', 'shahira', 'shaheera'],
    correctTeam: 'Team Bride',
  },

  // Name with a common shortened form / nickname
  {
    name:        'Muhammad Hafiz',
    aliases:     ['hafiz', 'fiz', 'mo hafiz'],
    correctTeam: 'Team Groom',
  },

  // Chinese name — might drop surname or merge the two syllables
  {
    name:        'Tan Wei Liang',
    aliases:     ['wei liang', 'weiliang', 'tan weiliang'],
    correctTeam: 'Team Groom',
  },

  // Name with alternate romanisation spellings
  {
    name:        'Siti Norfazlina',
    aliases:     ['fazlina', 'siti fazlina', 'norfazlina', 'faz'],
    correctTeam: 'Team Bride',
  },

  // ── Add more guests below ──────────────────────────────────────────────
  // {
  //   name:        'Full Name Here',
  //   aliases:     ['nickname', 'first name only', 'alternate spelling'],
  //   correctTeam: 'Team Bride',   // or 'Team Groom'
  // },

];

// ── RSVP STATE ──────────────────────────────────
const rsvpData = {
  attendance: '',
  name:       '',
  side:       'Team Bride', // default
  pax:        '1',          // default
  dietary:    '',
  message:    '',
};

// All step IDs — used for show/hide toggling
const ALL_STEPS = [
  'step-1',
  'step-no',
  'step-yes-2',
  'step-yes-3',
  'step-yes-4',
  'step-yes-5',
  'step-success',
];

// ════════════════════════════════════════════════
//  DOM READY
// ════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollObserver();
  initRSVPForm();
  initCountdown();
});

// ── Navbar: transparent → frosted on scroll ─────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const toggle = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', toggle, { passive: true });
  toggle(); // run once on load
}

// ── IntersectionObserver: fade-up on scroll ──────
function initScrollObserver() {
  const elements = document.querySelectorAll('.fade-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once only
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

// ── Countdown Timer ──────────────────────────────
function initCountdown() {
  const elDays  = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins  = document.getElementById('cd-mins');
  const elSecs  = document.getElementById('cd-secs');
  
  if (!elDays || !elHours || !elMins || !elSecs) return;

  // The Big Day: 17 October 2026, 17:00:00 (5:00 PM) SGT (+08:00)
  // Using UTC time (09:00:00 Z) to ensure cross-browser compatibility (e.g. iOS Safari)
  const targetDate = new Date('2026-10-17T09:00:00Z').getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      elDays.textContent  = '00';
      elHours.textContent = '00';
      elMins.textContent  = '00';
      elSecs.textContent  = '00';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    elDays.textContent  = d.toString().padStart(2, '0');
    elHours.textContent = h.toString().padStart(2, '0');
    elMins.textContent  = m.toString().padStart(2, '0');
    elSecs.textContent  = s.toString().padStart(2, '0');
  }

  updateTimer(); // run immediately
  setInterval(updateTimer, 1000);
}

// ── RSVP form wiring ─────────────────────────────
function initRSVPForm() {

  // Step 1 — Yes / No
  document.getElementById('btn-yes')?.addEventListener('click', () => {
    rsvpData.attendance = 'Yes';
    showStep('step-yes-2');
  });

  document.getElementById('btn-no')?.addEventListener('click', () => {
    rsvpData.attendance = 'No';
    showStep('step-no');
  });

  // Step No — submit can't-attend
  document.getElementById('btn-submit-no')?.addEventListener('click', async () => {
    rsvpData.name    = document.getElementById('no-name')?.value.trim() || '';
    rsvpData.message = document.getElementById('well-wish')?.value.trim() || '';
    await submitRSVP({ ...rsvpData });
  });

  // Step 2 → 3 (validate name)
  document.getElementById('btn-next-2')?.addEventListener('click', () => {
    const nameInput = document.getElementById('rsvp-name');
    const nameError = document.getElementById('name-error');
    const name = nameInput?.value.trim() || '';

    if (!name) {
      nameError?.classList.remove('hidden');
      nameInput?.focus();
      return;
    }
    nameError?.classList.add('hidden');
    rsvpData.name = name;
    showStep('step-yes-3');
  });

  // Step 3 — side selection
  document.querySelectorAll('.side-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.side-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      rsvpData.side = btn.dataset.side;

      // 🥚 Easter egg: guest picks the wrong team
      const typed = rsvpData.name.toLowerCase().trim();
      const guestEntry = WRONG_TEAM_LIST.find(e =>
        e.name.toLowerCase() === typed ||
        (e.aliases && e.aliases.some(a => a.toLowerCase() === typed))
      );
      if (guestEntry && btn.dataset.side !== guestEntry.correctTeam) {
        showEdwinEasterEgg();
      } else {
        hideEdwinEasterEgg();
      }
    });
  });

  // Step 3 → 4
  document.getElementById('btn-next-3')?.addEventListener('click', () => {
    hideEdwinEasterEgg(); // tuck it away when moving on
    showStep('step-yes-4');
  });

  // Step 4 — pax selection via dropdown
  const paxSelect = document.getElementById('pax-select');
  const plusOnesContainer = document.getElementById('plus-ones-container');
  const plusOnesInputsDiv = document.getElementById('plus-ones-inputs');
  const plusOnesError = document.getElementById('plus-ones-error');

  paxSelect?.addEventListener('change', (e) => {
    const totalPax = parseInt(e.target.value);
    rsvpData.pax = e.target.value;
    
    if (totalPax > 1) {
      plusOnesContainer?.classList.remove('hidden');
      if (plusOnesInputsDiv) {
        plusOnesInputsDiv.innerHTML = ''; // clear existing inputs
        const numGuests = totalPax - 1;
        for (let i = 1; i <= numGuests; i++) {
          const input = document.createElement('input');
          input.type = 'text';
          input.className = 'rsvp-input w-full';
          input.placeholder = `Guest ${i} Full Name`;
          plusOnesInputsDiv.appendChild(input);
        }
      }
    } else {
      plusOnesContainer?.classList.add('hidden');
      if (plusOnesInputsDiv) plusOnesInputsDiv.innerHTML = '';
      if (plusOnesError) plusOnesError.classList.add('hidden');
    }
  });

  // Step 4 → 5
  document.getElementById('btn-next-4')?.addEventListener('click', () => {
    const currentPax = parseInt(paxSelect?.value || '1');
    rsvpData.pax = currentPax.toString();
    
    if (currentPax > 1) {
      const inputs = plusOnesInputsDiv?.querySelectorAll('input') || [];
      let allFilled = true;
      let names = [];
      
      inputs.forEach(input => {
        const val = input.value.trim();
        if (!val) {
          allFilled = false;
          input.style.borderColor = '#f87171'; // highlight empty in red
        } else {
          input.style.borderColor = ''; // reset border
          names.push(val);
        }
      });
      
      if (!allFilled) {
        plusOnesError?.classList.remove('hidden');
        return;
      }
      plusOnesError?.classList.add('hidden');
      rsvpData.plusOnesNames = names.join(', ');
    } else {
      rsvpData.plusOnesNames = '';
    }
    showStep('step-yes-5');
  });

  // Step 5 — final submit (attending)
  document.getElementById('btn-submit-yes')?.addEventListener('click', async () => {
    rsvpData.dietary = document.getElementById('rsvp-dietary')?.value.trim() || '';
    
    // Combine pax with plus-ones names so we don't need a new database column
    let finalPax = rsvpData.pax;
    if (rsvpData.plusOnesNames) {
      finalPax += ` (Plus Ones: ${rsvpData.plusOnesNames})`;
    }
    
    await submitRSVP({ ...rsvpData, pax: finalPax });
  });

  // Back buttons
  document.querySelectorAll('.rsvp-back').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      if (target) showStep(target);
    });
  });

  // Allow Enter key to advance from name input
  document.getElementById('rsvp-name')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('btn-next-2')?.click();
    }
  });
}

// ════════════════════════════════════════════════
//  STEP MANAGEMENT
// ════════════════════════════════════════════════
function showStep(stepId) {
  ALL_STEPS.forEach(id => {
    document.getElementById(id)?.classList.add('hidden');
  });
  const target = document.getElementById(stepId);
  if (target) {
    target.classList.remove('hidden');
    // Smooth-scroll the RSVP section into view on mobile
    target.closest('#rsvp')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  hideError();
}

// ════════════════════════════════════════════════
//  SUBMIT
// ════════════════════════════════════════════════
async function submitRSVP(payload) {
  hideError();
  setLoading(true);

  // Dev mode: GAS_URL not yet configured — simulate success locally
  if (GAS_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
    console.warn(
      '[RSVP] GAS_URL is not set. ' +
      'Deploy the Google Apps Script and update GAS_URL in js/main.js.\n' +
      'Simulating success for local preview.'
    );
    setTimeout(() => {
      setLoading(false);
      showSuccessScreen(payload.attendance === 'Yes');
    }, 800);
    return;
  }

  try {
    const res = await fetch(GAS_URL, {
      method:  'POST',
      // Content-Type: text/plain avoids a CORS preflight request with Google Apps Script
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body:    JSON.stringify(payload),
    });

    if (res.ok) {
      let json = {};
      try { json = await res.json(); } catch { /* opaque response — treat as ok */ }

      if (!json.status || json.status === 'ok') {
        showSuccessScreen(payload.attendance === 'Yes');
      } else {
        showError('Something went wrong on our end. Please try again.');
      }
    } else {
      showError(`Server error (${res.status}). Please try again.`);
    }
  } catch {
    showError('Network error. Please check your connection and try again.');
  } finally {
    setLoading(false);
  }
}

// ════════════════════════════════════════════════
//  SUCCESS SCREEN
// ════════════════════════════════════════════════
function showSuccessScreen(attending) {
  showStep('step-success');

  const title   = document.getElementById('success-title');
  const message = document.getElementById('success-message');

  if (attending) {
    if (title)   title.textContent   = 'See you there! 🥂';
    if (message) message.textContent = "Thank you for your RSVP. We can't wait to celebrate with you on 17 October 2026! Invites will be sent out closer to the date so keep your eyes peeled!";
    launchConfetti();
  } else {
    if (title)   title.textContent   = 'Thank you ♥';
    if (message) message.textContent = 'We\'ll miss you, but your kind wishes mean everything to us both.';
  }
}

// ════════════════════════════════════════════════
//  CONFETTI
// ════════════════════════════════════════════════
function launchConfetti() {
  const PARTICLE_COUNT = 90;
  const COLORS = [
    '#C9A84C', '#d4b56a', '#e8d8b8', // gold spectrum
    '#FAFAF7', '#F2EDE4',             // cloud whites
    '#3B5E3A', '#4a7a48', '#6a9e68', // moss greens
    '#a8855f', '#8C7B6B',             // warm stone
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    setTimeout(() => spawnParticle(COLORS), i * 18);
  }
}

function spawnParticle(colors) {
  const el = document.createElement('div');
  el.className = 'confetti-particle';

  const x        = Math.random() * 100;            // % across viewport
  const duration = 2.2 + Math.random() * 1.8;      // 2.2s – 4s fall
  const delay    = Math.random() * 0.4;             // stagger start
  const color    = colors[Math.floor(Math.random() * colors.length)];
  const size     = 6 + Math.floor(Math.random() * 9); // 6–14px
  const isCircle = Math.random() > 0.45;

  el.style.cssText = `
    left: ${x}%;
    background: ${color};
    width: ${size}px;
    height: ${size}px;
    border-radius: ${isCircle ? '50%' : '2px'};
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
  `;

  document.body.appendChild(el);
  setTimeout(() => el.remove(), (duration + delay + 0.5) * 1000);
}

// ════════════════════════════════════════════════
//  HELPERS
// ════════════════════════════════════════════════
function setLoading(isLoading) {
  const overlay = document.getElementById('rsvp-loading');
  if (overlay) {
    if (isLoading) {
      overlay.classList.remove('hidden');
    } else {
      overlay.classList.add('hidden');
    }
  }

  // Disable/re-enable submit buttons during loading
  document.querySelectorAll('.rsvp-submit-btn').forEach(btn => {
    btn.disabled = isLoading;
  });
}

function showError(msg) {
  const errorEl = document.getElementById('rsvp-error');
  if (errorEl) {
    errorEl.textContent = msg;
    errorEl.classList.remove('hidden');
  }
}

function hideError() {
  document.getElementById('rsvp-error')?.classList.add('hidden');
}

// ════════════════════════════════════════════════
//  EASTER EGG — Edwin Sng × Team Bride
// ════════════════════════════════════════════════
function showEdwinEasterEgg() {
  const popup = document.getElementById('edwin-popup');
  const video = document.getElementById('edwin-video');
  if (!popup || !video) return;

  // Reset animation by briefly removing the class
  popup.classList.remove('show');
  void popup.offsetWidth; // force reflow so animation replays
  popup.classList.add('show');

  video.currentTime = 0;
  video.play().catch(() => {}); // browsers may block autoplay — fail silently

  // Wire up close button (once, idempotently)
  const closeBtn = document.getElementById('edwin-close');
  if (closeBtn && !closeBtn._edwinBound) {
    closeBtn.addEventListener('click', hideEdwinEasterEgg);
    closeBtn._edwinBound = true;
  }
}

function hideEdwinEasterEgg() {
  const popup = document.getElementById('edwin-popup');
  const video = document.getElementById('edwin-video');
  if (popup) popup.classList.remove('show'); // CSS display:none kicks back in
  if (video) { video.pause(); video.currentTime = 0; }
}
