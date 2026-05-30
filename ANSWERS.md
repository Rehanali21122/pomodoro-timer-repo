"ANSWERS"

1. How to run
I don't know much about how to run it on a fresh machine but what I know is here:-

just open the file by doublr clicking the index.html file and it will run properly in any modern browser.

If you want to access more precisely then use this method:-(and I also got some help from AI to access thsi method)

local server....:-

Running over `http://` makes `localStorage` and audio behave exactly like production:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser.
(`npx serve` also works if you have Node.)

Deployed URL: <https://rehanali21122.github.io/pomodoro-timer-repo/
>

---

2. Stack & design choices

**Why vanilla HTML, CSS, and JavaScript.**
This is one screen with a handful of interactions: a countdown, four buttons, two inputs,
and a list. Reaching for React or Vue would mean a build step, a bundler, and a runtime
just to manage a state object that fits in a few plain variables. Vanilla means the three
files open anywhere with no setup, load instantly, and can be read and explained
top-to-bottom without understanding any framework. The task rewards *feel* and correctness,
not architecture, so I kept the stack out of the way.

Separating the code into "index.html", "style.css", and "script.js" also makes each
concern easy to navigate: you can open "style.css" to understand the
visual design and "script.js" to follow the logic without scrolling past unrelated code.

During my whole journey of this project I made two achievements, which I want to add in this section(I also learned many extra things.... which are as follows) 

1. circular SVG progress ring with the number centred inside it:-
This affects `.ring-wrap` in `index.html` and the `.ring`, `.progress`, `.countdown`
rules in `style.css`, updated every tick by `render()` in `script.js`.
I chose a ring because time-remaining maps naturally onto a depleting arc. you can
read roughly how much is left from across a desk without parsing digits. Placing the
`mm:ss` number dead-centre inside the ring gives the eye one focal point instead of
bouncing between a separate bar and a number. moreover I chose a ring because pomodoro is an italian word which means tomato in english. Since tomato is round shaped having a redish color that's why i picked the ring and gave it a redish shade as a default...

2. full-screen colour shift driven by a single body class:-
This affects the `body.mode-focus`, `body.mode-break`, and `body.paused` rules in
`style.css` and the `classList.replace()` calls in `script.js`.
The most important question a Pomodoro user has is "am I focusing or on a break?"
I answer it peripherally. before the user reads the label by shifting the entire
palette: warm coral for focus, calm teal for break, desaturated grey when paused (I picked most of  the colors in rgb from google color picker).
Implementing it as one class swap also kept `script.js` clean: it never touches
individual element colours, it just toggles one class and lets CSS handle the rest.



3. Responsive & accessibility

responsiveness on a 360 px phone and a 1440 px laptop:-
The card has `max-width: 440px`, so on a 1440 px laptop it stays a comfortable
centred panel and the mode-tinted glow fills the rest of the screen — the layout never
stretches into an ugly wide bar. The ring is sized with `min(74vw, 280px)` in
`style.css`, so on a 360 px phone it scales to roughly 74% of screen width without
overflowing, while on a laptop it is capped at 280 px. Below 420 px a "media query" in
`style.css` stacks the Start/Reset buttons vertically and makes them full-width
(easier thumb targets) and tightens the gap between the two settings inputs.

One accessibility consideration I handled:-
Every `<input>` is tied to its `<label>` via matching `for`/`id` attributes
(`<label for="focus-input">` → `<input id="focus-input">`). A screen reader announces
the field name and type when it is focused, and clicking the visible label moves focus
into the input. I also used semantic landmarks (`<main>`, `<section>`, `<h2>`) and
gave inputs a visible focus ring: the border switches to the current accent colour on
`:focus` (see `style.css`). Text-on-dark-background contrast is kept high throughout.

One I knowingly skipped:-
I did not add an `aria-live` region to announce the countdown or "session complete" to
screen readers. Marking the ticking number as `aria-live` would make the reader
announce the time every second — worse than silence. Doing it properly means a separate
visually-hidden live region that announces only state changes ("Break started", "Focus
complete"). I skipped it to ship the visual and audio experience first rather than do it
halfway. This is the clearest remaining accessibility gap.


4. AI usage

I used Claude (pro version) via its chat interface in these places:-

Most of the code is understood by me and I know its functionality but I seek some help from Claude(pro version 'cause I had one.). But still I only pick up the idea or you can say I revised the things... then used them in my code.Some things were new to me. like I didn't know the structure of a README.MD file I ask claude to give me a clue or hint to genrate such type of file. 
I recalled the concept of responsiveness but i used it on my own. 
moreover I didn't have any idea that how to run this web app on a fresh machine directly and accessing its code because i didn't use this type of method.. so clearly, I just copy pasted that... 

I used vs code AI chatbot:-
Moreover I used VS code AI chatbot to solve some problems in my JavaScript code as I haven't much experience yet...

i short I seek a lot of help from AI but most of the code has been understood by me.

5. Honest gap

The running timer does not survive a page reload ... only the history and settings do:-


If you reload mid-session, the app drops back to a fresh idle focus timer. The brief
only required the "history" to persist, so I scoped it that way, but a genuinely
polished Pomodoro app should let you recover from an accidental tab close or reload
without losing the session you are in.

"With another day":- I would persist the live timer state to `localStorage` — the
current `mode`, the target `endTime`, and the frozen `remainingMs` when paused — and
restore it on load, correctly accounting for any time that passed while the page was
closed. If a focus block would have already ended in the meantime, I would log it to
history and advance to the correct phase automatically. I would also add the classic
"long break after every 4th focus session," which the current version does not
implement — it only alternates a single short break after each focus block.
