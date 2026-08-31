// Payzik website server
// Simple, production-ready static file server built with Express.
// Later, when you're ready to turn this into a full web app (logins,
// dashboards, real payments), this is the file where you'll add new
// routes (e.g. app.post('/api/signup', ...)) alongside the static site.

const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Gzip all responses for faster load times
app.use(compression());

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
