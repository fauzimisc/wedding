/**
 * ═══════════════════════════════════════════════
 *  Code.gs — Wedding RSVP Backend
 *  Fauzi & Diyanah · 17 October 2026
 *
 *  SETUP STEPS:
 *  1. Create a new Google Sheet and name the first tab "RSVPs"
 *  2. Paste your Sheet ID into SHEET_ID below
 *     (found in the URL: docs.google.com/spreadsheets/d/SHEET_ID/edit)
 *  3. In Apps Script: Deploy → New Deployment
 *     - Type: Web App
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  4. Copy the Web App URL → paste into js/main.js as GAS_URL
 * ═══════════════════════════════════════════════
 */

// ── CONFIGURATION ────────────────────────────────
const SHEET_ID   = 'YOUR_GOOGLE_SHEET_ID_HERE'; // ← Replace this
const SHEET_NAME = 'RSVPs';

// Column headers (written on first submission if sheet is empty)
const HEADERS = [
  'Timestamp',
  'Name',
  'Side',
  'Attendance',
  'Pax',
  'Dietary Restrictions',
  'Message / Well Wish',
];

// ════════════════════════════════════════════════
//  POST handler — receives RSVP submission
// ════════════════════════════════════════════════
function doPost(e) {
  try {
    const data  = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();

    // Add header row if the sheet is brand new
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length)
        .setFontWeight('bold')
        .setBackground('#2D4A2C')
        .setFontColor('#FAFAF7');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date(),             // A: Timestamp
      data.name       || '',  // B: Full Name
      data.side       || '',  // C: Team Bride / Team Groom
      data.attendance || '',  // D: Yes / No
      data.pax        || '',  // E: 1 / 2 / 3+
      data.dietary    || '',  // F: Dietary Restrictions
      data.message    || '',  // G: Well-Wish / Note
    ]);

    return buildResponse({ status: 'ok' });

  } catch (err) {
    console.error('RSVP submission error:', err.toString());
    return buildResponse({ status: 'error', message: err.message });
  }
}

// ════════════════════════════════════════════════
//  GET handler — health check
//  Visit the Web App URL in a browser to confirm it's live.
// ════════════════════════════════════════════════
function doGet() {
  return ContentService.createTextOutput(
    'Fauzi & Diyanah RSVP endpoint is live. ✓\n' +
    'Sheet: ' + SHEET_NAME
  );
}

// ════════════════════════════════════════════════
//  Helpers
// ════════════════════════════════════════════════

/**
 * Opens the spreadsheet and returns the RSVPs sheet.
 * Creates the sheet if it doesn't exist yet.
 */
function getOrCreateSheet() {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  let   sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  return sheet;
}

/**
 * Builds a JSON response with correct MIME type.
 * Google Apps Script handles CORS automatically for public Web Apps.
 */
function buildResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
