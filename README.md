# Payzik Website

This is your Payzik landing page, built with Node.js + Express. It is fully responsive (desktop, tablet, and mobile).

## What's inside

- `server.js` — the Node.js server that serves the website. This is what you (or a hosting provider) run to make the site live.
- `public/` — the actual website: `index.html` (all the page content), `assets/css/styles.css` (all the design/colors/layout), `assets/js/main.js` (the mobile menu + dropdown behavior), and `assets/img/` (all the photos and illustrations, already compressed for fast loading).
- `package.json` — the list of small helper libraries the server needs (Express, for serving files; compression, for faster loading).

## Running it yourself (optional — only if you want to preview it on your own computer)

You do not need to know how to code to do this, just follow the steps:

1. Install Node.js from https://nodejs.org (choose the "LTS" version) if you don't already have it.
2. Open a terminal in this folder.
3. Run: `npm install` (this downloads the small helper libraries — only needs to be done once).
4. Run: `npm start`
5. Open your browser to `http://localhost:3000` — that's your site.

## Deploying it so it's live on the internet at payzik.in

You don't have to do this yourself — I can walk you through it step by step, or set it up for you if you connect a hosting account. In short, here's how it works:

1. **Pick a host.** Since this is a Node.js app, easy beginner-friendly options are Render.com, Railway.app, or Vercel — all have free tiers and a simple "connect your code, click deploy" flow.
2. **Upload this project** to the host (usually by connecting a GitHub repository — I can help you create one and push this code to it).
3. **Point payzik.in at it.** Once the host gives you a live URL (like `payzik.onrender.com`), you go to wherever you registered payzik.in (GoDaddy, Namecheap, etc.), open its DNS settings, and add the record the host tells you to add. This usually takes a few minutes to set up and a few hours to fully activate.

Just tell me which registrar you bought payzik.in from and which host you'd like to use (or ask me to recommend one), and I'll give you exact click-by-click steps — or do it together with you live.

## Growing this into a full web app later

The project is already structured for that:
- New pages/screens go in `public/` as new `.html` files.
- When you're ready for logins, dashboards, or real payments, that logic gets added to `server.js` as new routes (e.g. `/api/login`), plus a database. Just come back and ask — I'll build that on top of this same project so nothing here needs to be redone.
