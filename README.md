# Fauzi & Diyanah — Wedding Invitation Site

A high-end, mobile-first wedding invitation website built with vanilla HTML/CSS/JS and hosted on GitHub Pages.

**Live URL:** https://fauzimisc.github.io/wedding

---

## Quick Start (Local Preview)

No build step required. Just open in a browser:

```
index.html → right-click → Open With → your browser
```

All sections, animations, and the RSVP multi-step form work locally.
The RSVP submit will simulate a success response until you configure the Google Apps Script URL (see below).

---

## Project Structure

```
Wedding/
├── index.html                    ← Entire website
├── css/
│   └── custom.css                ← Animations, hero background, confetti
├── js/
│   ├── main.js                   ← RSVP logic, confetti, scroll animations
│   └── calendar.js               ← Add to Calendar (.ics download)
├── assets/
│   └── images/
│       └── hero-bg.jpg           ← ⬅ Replace with your hero photo
└── google-apps-script/
    ├── Code.gs                   ← Google Apps Script backend
    ├── appsscript.json           ← GAS project manifest
    └── .clasp.json               ← clasp config (optional)
```

---

## Step 1 — Add Your Hero Photo

Replace `assets/images/hero-bg.jpg` with your own atmospheric wedding photo.

**Recommendations:**
- Landscape orientation, at least 1920×1080px
- Dark/moody tones work best with the moss overlay
- Name it `hero-bg.jpg` (or update the path in `css/custom.css`)

---

## Step 2 — Set Up Google Sheets + Apps Script

### A. Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) → create a new spreadsheet
2. Rename the first tab to **`RSVPs`** (exact spelling)
3. Copy the **Sheet ID** from the URL:
   `docs.google.com/spreadsheets/d/**SHEET_ID**/edit`

### B. Create the Apps Script Project

1. Go to [script.google.com](https://script.google.com) → New Project
2. Delete the default `Code.gs` content
3. Copy-paste the contents of `google-apps-script/Code.gs`
4. Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your actual Sheet ID
5. Save the project (Ctrl+S / ⌘S)

### C. Deploy as Web App

1. Click **Deploy** → **New Deployment**
2. Click the gear icon (⚙️) → **Web App**
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy** → Copy the **Web App URL**

### D. Test the endpoint

Open the Web App URL in your browser. You should see:
```
Fauzi & Diyanah RSVP endpoint is live. ✓
```

### E. Connect the frontend

Open `js/main.js` and replace:
```javascript
const GAS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';
```
with your actual Web App URL.

---

## Step 3 — Deploy to GitHub Pages

### First-time setup

```bash
# Inside the Wedding folder:
git init
git add .
git commit -m "feat: initial wedding invitation site"
git branch -M main
git remote add origin https://github.com/fauzimisc/wedding.git
git push -u origin main
```

### Enable GitHub Pages

1. Go to your repo on GitHub: `github.com/fauzimisc/wedding`
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Source**, select: **Deploy from a branch**
4. Branch: `main` · Folder: `/ (root)`
5. Click **Save**

Your site will be live at:
**https://fauzimisc.github.io/wedding**

(Allow 1–2 minutes for the first deployment.)

### Updating the site

```bash
git add .
git commit -m "update: <describe your change>"
git push
```

---

## Step 4 — Optional: clasp (local GAS management)

[clasp](https://github.com/google/clasp) lets you manage the Apps Script project from your terminal.

```bash
# Install clasp globally
npm install -g @google/clasp

# Login with your Google account
clasp login

# Get your Script ID from the Apps Script editor URL:
# script.google.com/home/projects/SCRIPT_ID/edit
# Paste it into google-apps-script/.clasp.json

# Push local changes to Apps Script
clasp push

# Deploy a new version
clasp deploy --description "v2"
```

---

## Customisation Checklist

| Item | File | Status |
|------|------|--------|
| Hero photo | `assets/images/hero-bg.jpg` | ⬜ Replace |
| Ceremony time in .ics | `js/calendar.js` → `EVENT` | ⬜ Confirm |
| Google Sheet ID | `google-apps-script/Code.gs` | ⬜ Replace |
| GAS Web App URL | `js/main.js` → `GAS_URL` | ⬜ Replace after deploy |
| Our Story text | `index.html` → `#story` section | ⬜ Personalise |
| Schedule times | `index.html` → `#schedule` section | ⬜ Confirm |
| RSVP deadline | `index.html` → `#rsvp` section heading | ⬜ Confirm |
| Venue address detail | `index.html` → `#location` section | ⬜ Confirm |
| Google Maps embed | `index.html` → `<iframe src>` | ⬜ Get real embed URL |

---

## Tech Stack

| Layer | Tool |
|-------|------|
| HTML | Semantic HTML5, single file |
| CSS | Tailwind CSS CDN + `css/custom.css` |
| Fonts | Cormorant Garamond + DM Sans (Google Fonts) |
| JS | Vanilla ES6+, no framework |
| Backend | Google Apps Script Web App |
| Database | Google Sheets |
| Hosting | GitHub Pages |

---

*Made with love for Fauzi & Diyanah · 17 October 2026*
