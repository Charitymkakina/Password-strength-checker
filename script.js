function analyzePassword() {
  const password = document.getElementById("passwordInput").value;

  updateChecklist(password);

  if (password.length === 0) {
    resetUI();
    document.getElementById("tips").innerText = "";
    return;
  }

  const entropy = calculateEntropy(password);
  const crackTime = estimateCrackTime(entropy);
  const strength = getStrength(entropy);

  updateUI(entropy, crackTime, strength);
  generateTips(password);
}

/* ---------- ENTROPY ---------- */

function calculateEntropy(password) {
  let charset = 0;

  if (/[a-z]/.test(password)) charset += 26;
  if (/[A-Z]/.test(password)) charset += 26;
  if (/[0-9]/.test(password)) charset += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charset += 32;

  if (charset === 0) return 0;

  return Math.round(Math.log2(Math.pow(charset, password.length)));
}

/* ---------- CRACK TIME ---------- */

function estimateCrackTime(entropy) {
  const guessesPerSecond = 1e9;
  const seconds = Math.pow(2, entropy) / guessesPerSecond;

  if (seconds < 60) return "Seconds";
  if (seconds < 3600) return "Minutes";
  if (seconds < 86400) return "Hours";
  if (seconds < 31536000) return "Days";
  if (seconds < 315360000) return "Years";

  return "Centuries";
}

/* ---------- STRENGTH ---------- */

function getStrength(entropy) {
  if (entropy < 28) return "Weak";
  if (entropy < 36) return "Moderate";
  if (entropy < 60) return "Strong";
  return "Very Strong";
}

/* ---------- UI UPDATE ---------- */

function updateUI(entropy, crackTime, strength) {
  const fill = document.getElementById("strengthFill");

  let width = 0;
  let color = "";

  if (strength === "Weak") {
    width = 25;
    color = "#ef4444";
  } else if (strength === "Moderate") {
    width = 50;
    color = "#f59e0b";
  } else if (strength === "Strong") {
    width = 75;
    color = "#22c55e";
  } else {
    width = 100;
    color = "#38bdf8";
  }

  fill.style.width = width + "%";
  fill.style.background = color;

  document.getElementById("strengthLabel").innerHTML =
    `Strength: <strong>${strength}</strong>`;
  document.getElementById("entropyResult").innerHTML =
    `Entropy: <strong>${entropy} bits</strong>`;
  document.getElementById("crackTimeResult").innerHTML =
    `Estimated Crack Time: <strong>${crackTime}</strong>`;
}

/* ---------- CHECKLIST ---------- */

function updateChecklist(password) {
  updateItem("lengthCheck", password.length >= 8);
  updateItem("lowerCheck", /[a-z]/.test(password));
  updateItem("upperCheck", /[A-Z]/.test(password));
  updateItem("numberCheck", /[0-9]/.test(password));
  updateItem("symbolCheck", /[^a-zA-Z0-9]/.test(password));
}

function updateItem(id, condition) {
  const item = document.getElementById(id);

  if (condition) {
    item.innerText = item.innerText.replace;
    item.className = "pass";
  } else {
    item.innerText = item.innerText.replace;
    item.className = "fail";
  }
}

/* ---------- TIPS ---------- */

function generateTips(password) {
  const tips = [];

  if (password.length < 8) tips.push("Use at least 8 characters");
  if (!/[a-z]/.test(password)) tips.push("Add lowercase letters");
  if (!/[A-Z]/.test(password)) tips.push("Add uppercase letters");
  if (!/[0-9]/.test(password)) tips.push("Include numbers");
  if (!/[^a-zA-Z0-9]/.test(password)) tips.push("Add special characters");

  document.getElementById("tips").innerText =
    tips.length > 0
      ? "Tips: " + tips.join(" • ")
      : "Excellent password! You are well protected!";
}

/* ---------- RESET ---------- */

function resetUI() {
  document.getElementById("strengthFill").style.width = "0%";
  document.getElementById("strengthLabel").innerText = "";
  document.getElementById("entropyResult").innerText = "";
  document.getElementById("crackTimeResult").innerText = "";
}

