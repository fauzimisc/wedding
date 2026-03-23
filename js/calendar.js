// ═══════════════════════════════════════════════
//  calendar.js — Add to Calendar (.ics) Generator
//  Fauzi & Diyanah Wedding · 17 October 2026
//
//  UPDATE the EVENT constants below with your
//  actual ceremony start and end times.
// ═══════════════════════════════════════════════

const EVENT = {
  title:       'Wedding of Fauzi & Diyanah',
  location:    'Anggun On Marina One, 5 Straits View #02-04/05/06 West Tower, Marina One, Singapore 018935',
  description: 'You are cordially invited to the wedding of Fauzi & Diyanah. Ceremony begins at 10:00 AM. Dress code: Formal.',

  // Format: YYYYMMDDTHHMMSS  (local time — no trailing Z)
  // Update these to match the actual ceremony start/end
  startDate: '20261017T100000',
  endDate:   '20261017T170000',

  // Optional: set a reminder (e.g. 1 day before = P1D, 2 hours before = PT2H)
  reminderOffset: '-P1D',
};

/**
 * Builds and triggers a download of the .ics calendar file.
 */
function downloadICS() {
  const uid = `fauzi-diyanah-wedding-${Date.now()}@invitation`;
  const stamp = formatDateUTC(new Date());

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Fauzi & Diyanah Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=Asia/Kuala_Lumpur:${EVENT.startDate}`,
    `DTEND;TZID=Asia/Kuala_Lumpur:${EVENT.endDate}`,
    `SUMMARY:${escapeICS(EVENT.title)}`,
    `LOCATION:${escapeICS(EVENT.location)}`,
    `DESCRIPTION:${escapeICS(EVENT.description)}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `TRIGGER:${EVENT.reminderOffset}`,
    `DESCRIPTION:Reminder: ${EVENT.title}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  const icsContent = lines.join('\r\n');
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url  = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href     = url;
  anchor.download = 'fauzi-diyanah-wedding.ics';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  // Release the object URL after a short delay
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/** Formats a Date object to ICS UTC timestamp: 20261017T100000Z */
function formatDateUTC(date) {
  return date.toISOString()
    .replace(/[-:]/g, '')
    .split('.')[0] + 'Z';
}

/** Escapes special characters for ICS field values */
function escapeICS(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g,  '\\;')
    .replace(/,/g,  '\\,')
    .replace(/\n/g, '\\n');
}

// Wire up the button once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('addToCalendar');
  if (btn) btn.addEventListener('click', downloadICS);
});
