Pomodoro Timer :-

A single-screen Pomodoro timer built with "vanilla HTML, CSS, and JavaScript". no
framework, no build step, no dependencies. Focus and break lengths are configurable,
the timer chimes when a phase ends and automatically rolls into the next phase, and every
focus session you complete today is saved and listed below the clock. 

Features :-

 Start / pause / resume / reset
 mm:ss countdown with a circular SVG progress ring
 Configurable focus & break lengths (defaults: 25 / 5 minutes)
 Audible chime on phase end (Web Audio API... No sound file needed)
 Automatic focus ... break ... focus cycling
 "Session done" moment: ring fills, card pulses, chime plays
 Daily history, saved in localStorage, survives reload, resets on a new calendar day
 Fully responsive from 360 px phones to large desktops.
 (Even I checked the responsiveness by shrinking the width upto a small sized mobile...)

How to run :-

No installation needed:....

just open the file bu doublr clicking the index.html file and it will run properly in any modern browser.

If you want to access more precisely then use this method:-(and I also got some help from AI to access thsi method)

local server....:-

Running over `http://` makes `localStorage` and audio behave exactly like production:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser.
(`npx serve` also works if you have Node.)

Deployed link:-

Live demo: <poetic-dolphin-1f6185.netlify.app>

Project structure:-
I made this structure form Claude... providing it the path and then I simply copy pasted the path....

```
pomodoro-timer/
├── index.html    # markup and structure
├── style.css     # all styling, colour themes, animations
├── script.js     # timer logic, audio, localStorage history and settings
├── README.md     # this file
└── ANSWERS.md    # answers to the submission questions
```

"index.html" links the other two files in the standard way:-

<html>
<head>
<link rel="stylesheet" href="style.css">
</head>
<body>
<script src="script.js" defer></script>
</body>
</html>

