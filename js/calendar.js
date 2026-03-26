// ═══════════════════════════════════════════════
//  calendar.js — Add to Calendar (.ics) Generator
//  Fauzi & Diyanah Wedding · 17 October 2026
//
//  UPDATE the EVENT constants below with your
//  actual ceremony start and end times.
// ═══════════════════════════════════════════════

const EVENT = {
  title:       'Wedding of Ahmad Fauzi & Sharifah Diyanah',
  location:    'Anggun On Marina One, 5 Straits View #02-04/05/06 West Tower, Marina One, Singapore 018935',
  description: 'You are cordially invited to the wedding of Ahmad Fauzi & Sharifah Diyanah. Ceremony begins at 5:00 PM. Dress code: Formal.',

  // ICS format local time for Apple: YYYYMMDDTHHMMSS
  startDateICS: '20261017T170000',
  endDateICS:   '20261017T220000',

  // Google Calendar format UTC: YYYYMMDDTHHMMSSZ (5:00 PM SGT = 09:00:00Z)
  startDateGoogle: '20261017T090000Z',
  endDateGoogle:   '20261017T140000Z',

  // Optional: set a reminder (e.g. 1 day before = P1D)
  reminderOffset: '-P1D',
};

/**
 * Handles exactly how the event is added based on the guest's device
 */
function handleAddToCalendar() {
  // Opening the Google Calendar web app entirely bypasses the file download behavior on all iOS & Mac devices
  openGoogleCalendar();
}

/**
 * Opens Google Calendar directly in a new tab pre-filled with the event details.
 */
function openGoogleCalendar() {
  const params = new URLSearchParams({
    action:  'TEMPLATE',
    text:    EVENT.title,
    dates:   `${EVENT.startDateGoogle}/${EVENT.endDateGoogle}`,
    details: EVENT.description,
    location: EVENT.location
  });
  window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
}

// Wire up the button once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('addToCalendar');
  if (btn) btn.addEventListener('click', handleAddToCalendar);
});
