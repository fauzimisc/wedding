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
  description: 'You are cordially invited to the wedding of Fauzi & Diyanah. Ceremony begins at 5:00 PM. Dress code: Formal.',

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
  const isApple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);

  // Apple devices cleanly intercept .ics files and pop up an "Add Event" screen right away.
  // Windows/Android default to downloading the file, which is annoying, so we send them directly to Google Calendar.
  if (isApple) {
    downloadICS();
  } else {
    openGoogleCalendar();
  }
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

/**
 * Builds and triggers a download of the .ics calendar file for Apple devices.
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
    `DTSTART;TZID=Asia/Kuala_Lumpur:${EVENT.startDateICS}`,
    `DTEND;TZID=Asia/Kuala_Lumpur:${EVENT.endDateICS}`,
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
  if (btn) btn.addEventListener('click', handleAddToCalendar);
});
