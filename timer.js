

  const card        = document.getElementById("card");
  const modeLabel   = document.getElementById("mode-label");
  const statusEl    = document.getElementById("status");
  const countdownEl = document.getElementById("countdown");
  const progressEl  = document.getElementById("progress");
  const startBtn    = document.getElementById("start-btn");
  const resetBtn    = document.getElementById("reset-btn");
  const focusInput  = document.getElementById("focus-input");
  const breakInput  = document.getElementById("break-input");
  const historyList = document.getElementById("history-list");
  const historySummary = document.getElementById("history-summary");

  const CIRCUMFERENCE = 2 * Math.PI * 44;
  progressEl.style.strokeDasharray = CIRCUMFERENCE;

  let mode = "focus";      
  let running = false;
  let totalMs = 25 * 60 * 1000;   
  let remainingMs = totalMs;      
  let endTime = null;             
  let ticker = null;              
  let audioCtx = null;            
 
  
  function focusMs() { return Math.max(1, parseInt(focusInput.value) || 25) * 60 * 1000; }
  function breakMs() { return Math.max(1, parseInt(breakInput.value) || 5)  * 60 * 1000; }

  
  function formatTime(ms) {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }

  function render() {
    countdownEl.textContent = formatTime(remainingMs);
    const fractionLeft = totalMs > 0 ? remainingMs / totalMs : 0;

    progressEl.style.strokeDashoffset = CIRCUMFERENCE * (1 - fractionLeft);
  }

  function setStatus(text) { statusEl.textContent = text; }

  function startTimer() {
    if (running) return;
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    running = true;
    document.body.classList.remove("paused");
    endTime = Date.now() + remainingMs;   
    startBtn.textContent = "Pause";
    setStatus(mode === "focus" ? "Focusing" : "On a break");
    lockSettings(true);

    ticker = setInterval(tick, 250);
  }

  function pauseTimer() {
    if (!running) return;
    running = false;
    clearInterval(ticker);
    remainingMs = endTime - Date.now();  
    document.body.classList.add("paused");
    startBtn.textContent = "Resume";
    setStatus("Paused");
  }

  function resetTimer() {
    running = false;
    clearInterval(ticker);
    mode = "focus";
    totalMs = focusMs();
    remainingMs = totalMs;
    endTime = null;
    document.body.classList.remove("paused");
    document.body.classList.remove("mode-break");
    document.body.classList.add("mode-focus");
    modeLabel.textContent = "Focus";
    startBtn.textContent = "Start";
    setStatus("Ready");
    lockSettings(false);
    render();
  }

  function tick() {
    remainingMs = endTime - Date.now();
    if (remainingMs <= 0) {
      remainingMs = 0;
      render();
      completePhase();
      return;
    }
    render();
  }

  function completePhase() {
    clearInterval(ticker);
    running = false;
    playChime();

    if (mode === "focus") {

        saveSession(totalMs);
      celebrate();
      mode = "break";
      document.body.classList.replace("mode-focus", "mode-break");
      modeLabel.textContent = "Break";
      totalMs = breakMs();
    } else {

        mode = "focus";
      document.body.classList.replace("mode-break", "mode-focus");
      modeLabel.textContent = "Focus";
      totalMs = focusMs();
    }

    remainingMs = totalMs;
    render();

    startTimer();
  }

  function celebrate() {
    card.classList.remove("celebrate");
    void card.offsetWidth;      
    card.classList.add("celebrate");
  }

  function lockSettings(locked) {
    focusInput.disabled = locked;
    breakInput.disabled = locked;
  }


  function playChime() {
    if (!audioCtx) return;
    const notes = mode === "focus" ? [880, 1175] : [659, 880]; 
    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const start = audioCtx.currentTime + i * 0.18;
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.3, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.4);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(start);
      osc.stop(start + 0.4);
    });
  }


  function todayKey() {
    const d = new Date();

    return d.getFullYear() + "-" +
           String(d.getMonth() + 1).padStart(2, "0") + "-" +
           String(d.getDate()).padStart(2, "0");
  }



  function loadSessions() {
    const raw = localStorage.getItem("pomodoro-history");
    if (!raw) return [];
    try {
      const data = JSON.parse(raw);
      return data.date === todayKey() ? data.sessions : [];
    } catch {
      return [];
    }
  }

  function storeSessions(sessions) {
    localStorage.setItem("pomodoro-history",
      JSON.stringify({ date: todayKey(), sessions: sessions }));
  }

  function saveSession(durationMs) {
    const sessions = loadSessions();
    const now = new Date();
    let h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, "0");
    const ampm = h >= 12 ? "pm" : "am";
    h = h % 12 || 12;
    sessions.push({
      length: formatTime(durationMs),
      time: h + ":" + m + ampm
    });
    storeSessions(sessions);
    renderHistory();
  }

  function renderHistory() {
    const sessions = loadSessions();
    historyList.innerHTML = "";

    if (sessions.length === 0) {
      const li = document.createElement("li");
      li.className = "empty";
      li.textContent = "No sessions yet — press Start to begin.";
      historyList.appendChild(li);
      historySummary.textContent = "";
      return;
    }

    historySummary.textContent = sessions.length +
      (sessions.length === 1 ? " session" : " sessions");


    sessions.slice().reverse().forEach(s => {
      const li = document.createElement("li");
      li.innerHTML = '<span class="check">&#10003; ' + s.length +
                     ' focus</span><span class="when">' + s.time + '</span>';
      historyList.appendChild(li);
    });
  }

  startBtn.addEventListener("click", () => {
    running ? pauseTimer() : startTimer();
  });

  resetBtn.addEventListener("click", resetTimer);


  function applySettings() {
    if (running) return;
    if (mode === "focus") {
      totalMs = focusMs();
      remainingMs = totalMs;
      render();
    }
  }
  focusInput.addEventListener("change", applySettings);
  breakInput.addEventListener("change", applySettings);


  render();
  renderHistory();