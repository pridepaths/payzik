// Payzik website server
// Simple, production-ready static file server built with Express.
// Later, when you're ready to turn this into a full web app (logins,
// dashboards, real payments), this is the file where you'll add new
// routes (e.g. app.post('/api/signup', ...)) alongside the static site.

const express = require('express');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const LEADS_FILE = path.join(__dirname, 'leads.json');

// Gzip all responses for faster load times
app.use(compression());
app.use(express.json());

// "Request Demo" form on the site posts here. Leads are appended to a local
// JSON file so you can see who asked for a demo.
// NOTE: on Render's free tier the filesystem resets on every redeploy/restart,
// so this is a lightweight starting point, not permanent storage. When you're
// ready, swap this for a real database or an email/Google Sheets integration
// and nothing on the front end needs to change.
app.post('/api/demo-request', (req, res) => {
  const email = (req.body && req.body.email || '').trim();
  const company = (req.body && req.body.company || '').trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!emailOk) {
    return res.status(400).json({ ok: false, error: 'A valid email is required.' });
  }

  const entry = { email, company, submittedAt: new Date().toISOString() };

  let leads = [];
  try {
    if (fs.existsSync(LEADS_FILE)) {
      leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
    }
  } catch (err) {
    leads = [];
  }
  leads.push(entry);

  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  } catch (err) {
    console.error('Could not save lead to disk:', err.message);
  }

  console.log('New demo request:', entry);
  res.json({ ok: true });
});

// Serve everything in /public (html, css, js, images) as static files
app.use(express.static(path.join(__dirname, 'public'), {
  extensions: ['html'],
  maxAge: '1d',
}));

// Fallback: send index.html for any unknown route (keeps things simple
// if you add client-side routing later)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Payzik website running at http://localhost:${PORT}`);
});
