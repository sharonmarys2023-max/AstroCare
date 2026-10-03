const state = {
  heart: 74,
  oxygen: 97,
  temp: 36.7,
  sleep: 7.4,
  exercise: 42,
  history: []
};

const $ = id => document.getElementById(id);

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function vary(value, amount, min, max, decimals = 0) {
  const next = value + (Math.random() - 0.5) * amount;
  return Number(clamp(next, min, max).toFixed(decimals));
}

function updateData() {
  state.heart = vary(state.heart, 10, 58, 118);
  state.oxygen = vary(state.oxygen, 2.5, 86, 99, 0);
  state.temp = vary(state.temp, 0.16, 35.7, 38.0, 1);
  state.sleep = vary(state.sleep, 0.12, 5.5, 9.0, 1);
  state.exercise = vary(state.exercise, 3, 20, 70);

  // Small chance of an oxygen dip so the alert can actually be demonstrated.
  if (Math.random() < 0.035) state.oxygen = Math.floor(87 + Math.random() * 3);

  $("heartRate").textContent = state.heart;
  $("oxygen").textContent = state.oxygen;
  $("temperature").textContent = state.temp.toFixed(1);
  $("sleep").textContent = state.sleep.toFixed(1);
  $("exercise").textContent = state.exercise;

  $("heartBar").style.width = `${clamp((state.heart / 120) * 100, 5, 100)}%`;
  $("oxygenBar").style.width = `${state.oxygen}%`;
  $("tempBar").style.width = `${clamp(((state.temp - 35) / 4) * 100, 5, 100)}%`;
  $("sleepBar").style.width = `${clamp((state.sleep / 9) * 100, 5, 100)}%`;
  $("exerciseBar").style.width = `${clamp((state.exercise / 60) * 100, 5, 100)}%`;

  const status = getStatus();
  setStatus(status);
  handleAlert(status);

  state.history.push({ heart: state.heart, oxygen: state.oxygen });
  if (state.history.length > 24) state.history.shift();
  drawChart();

  $("lastUpdate").textContent = `Last update: ${new Date().toLocaleTimeString()}`;
}

function getStatus() {
  if (state.oxygen < 90 || state.heart > 110 || state.temp < 35.9 || state.temp > 37.7) return "CRITICAL";
  if (state.oxygen < 95 || state.heart > 100 || state.temp < 36.1 || state.temp > 37.2 || state.sleep < 6) return "WARNING";
  return "NORMAL";
}

function setStatus(status) {
  const pill = $("overallStatus");
  pill.className = "status-pill " + status.toLowerCase();
  pill.innerHTML = `<i></i> ${status}`;
}

function handleAlert(status) {
  const panel = $("alertPanel");
  const title = $("alertTitle");
  const text = $("alertText");

  if (status === "CRITICAL") {
    panel.classList.remove("hidden");
    title.textContent = "CRITICAL HEALTH ALERT";
    if (state.oxygen < 90) text.textContent = `Oxygen level is ${state.oxygen}%. Threshold: below 90%. Immediate attention required.`;
    else if (state.heart > 110) text.textContent = `Heart rate is ${state.heart} BPM. Elevated heart rate requires attention.`;
    else text.textContent = "A critical biometric reading has been detected.";
  } else if (status === "WARNING") {
    panel.classList.remove("hidden");
    title.textContent = "HEALTH WARNING";
    if (state.oxygen < 95) text.textContent = `Oxygen level is ${state.oxygen}%. Monitoring closely.`;
    else if (state.sleep < 6) text.textContent = `Sleep duration is ${state.sleep.toFixed(1)} hours. Below the monitoring target.`;
    else text.textContent = "A biometric reading is outside the preferred range.";
  } else {
    panel.classList.add("hidden");
  }
}

$("dismissAlert").addEventListener("click", () => $("alertPanel").classList.add("hidden"));

function missionClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  $("missionTime").textContent = `DAY 047 · ${h}:${m}:${s}`;
}

function drawChart() {
  const canvas = $("healthChart");
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width, h = rect.height;
  ctx.clearRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(142,161,189,.13)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = 20 + (h - 40) * (i / 4);
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  if (state.history.length < 2) return;

  const x = i => (w - 20) * (i / (state.history.length - 1)) + 10;
  const yO = value => 20 + (h - 40) * ((100 - value) / 20);
  const yH = value => 20 + (h - 40) * ((120 - value) / 70);

  function line(key, yFn, stroke) {
    ctx.beginPath();
    state.history.forEach((point, i) => {
      const px = x(i), py = yFn(point[key]);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  line("oxygen", yO, "#54d9ff");
  line("heart", yH, "#ff8a9d");

  ctx.font = "10px Inter";
  ctx.fillStyle = "#54d9ff";
  ctx.fillText("OXYGEN", 12, 15);
  ctx.fillStyle = "#ff8a9d";
  ctx.fillText("HEART RATE", 72, 15);
}

window.addEventListener("resize", drawChart);
for (let i = 0; i < 12; i++) {
  state.history.push({ heart: vary(74, 8, 60, 95), oxygen: vary(97, 2, 93, 99) });
}
missionClock();
updateData();
setInterval(missionClock, 1000);
setInterval(updateData, 2000);
