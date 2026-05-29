# Pomodoro Timer

A single-screen Pomodoro timer built with **vanilla HTML, CSS, and JavaScript** — no
framework, no build step, no dependencies. Focus and break lengths are configurable,
the timer chimes when a phase ends and automatically rolls into the next one, and every
focus session you complete today is saved and listed below the clock.

## Features

- Start / pause / resume / reset
- `mm:ss` countdown with a circular SVG progress ring
- Configurable focus & break lengths (defaults: 25 / 5 minutes) — saved between visits
- Audible chime on phase end (Web Audio API — no sound file needed)
- Automatic focus → break → focus cycling
- "Session done" moment: ring fills, card pulses, chime plays
- Daily history saved in `localStorage` — survives reload, resets on a new calendar day
- Colour-coded states: focus = warm coral, break = teal, paused = dimmed
- Fully responsive from 360 px phones to large desktops

## How to run

No installation needed. Two options:

**Option A — just open the file (quickest)**

Double-click `index.html` — it opens directly in any modern browser.

**Option B — local server (recommended)**

Running over `http://` makes `localStorage` and audio behave exactly like production:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser.
(`npx serve` also works if you have Node.)

## Deployed

Live demo: **<ADD-YOUR-URL-HERE>**

## Project structure

```
pomodoro-timer/
├── index.html    # markup and structure
├── style.css     # all styling, colour themes, animations
├── script.js     # timer logic, audio, localStorage history and settings
├── README.md     # this file
└── ANSWERS.md    # answers to the submission questions
```

`index.html` links the other two files in the standard way:

```html
<link rel="stylesheet" href="style.css">
<script src="script.js" defer></script>
```
