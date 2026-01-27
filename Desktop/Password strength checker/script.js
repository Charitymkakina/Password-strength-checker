function analyzePassword() {
  const password = document.getElementById("passwordInput").value;

  updateChecklist(password);

  if (password.length === 0) {
    resetUI();
    document.getElementById("tips").innerText = "";
    return;
  }
  //calculate raw entropy
  let rawEntropy = calculateEntropy(password);
  //Apply pattern penalties
  let entropy = applyPatternPenalty(password, rawEntropy);
  //Estimate crack times
  const offlineTime = estimateCrackTime(entropy, "offline");
  const onlineTime = estimateCrackTime(entropy, "online");
  //get strength rating
  const strength = getStrength(entropy);
  updateUI(entropy, offlineTime, onlineTime, strength);
  

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

function estimateCrackTime(entropy, type = "offline") {
  const guessesPerSecond =
    type === "offline" ? 1e11 : 5 / 60; // 100B/s offline, 5/min online

  let seconds = Math.pow(2, entropy) / guessesPerSecond;

  if (seconds < 60) return "< 1 minute";
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 315360000) return `${Math.round(seconds / 31536000)} years`;
  return "Centuries+";
}



/* ---------- STRENGTH ---------- */

function getStrength(entropy) {
  if (entropy < 28) return "Weak";
  if (entropy < 36) return "Moderate";
  if (entropy < 60) return "Strong";
  return "Very Strong";
}

/* ---------- UI UPDATE ---------- */

function updateUI(entropy, offlineTime, onlineTime, strength) {
  const fill = document.getElementById("strengthFill");

  let width = 0;
  let color = "";

  if (strength === "Weak") {
    width = 25; color = "#ef4444";
  } else if (strength === "Moderate") {
    width = 50; color = "#f59e0b";
  } else if (strength === "Strong") {
    width = 75; color = "#22c55e";
  } else {
    width = 100; color = "#38bdf8";
  }

  fill.style.width = width + "%";
  fill.style.background = color;

  document.getElementById("strengthLabel").innerHTML =
    `Strength: <strong>${strength}</strong>`;
  document.getElementById("entropyResult").innerHTML =
    `Entropy: <strong>${entropy} bits</strong>`;
  document.getElementById("crackTimeResult").innerHTML =
    `Offline Crack Time: <strong>${offlineTime}</strong> | Online Crack Time: <strong>${onlineTime}</strong>`;
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
    item.innerText = item.innerText.replace("❌", "✔");
    item.className = "pass";
  } else {
    item.innerText = item.innerText.replace("✔", "❌");
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
   if (password.length >= 8 && entropy < 40) {
  tips.push("Avoid predictable patterns and reused passwords");
}
   
}

/* ---------- RESET ---------- */

function resetUI() {
  document.getElementById("strengthFill").style.width = "0%";
  document.getElementById("strengthLabel").innerText = "";
  document.getElementById("entropyResult").innerText = "";
  document.getElementById("crackTimeResult").innerText = "";
}

function applyPatternPenalty(password, entropy) {
  let penalty = 0;

  // Repeating characters
  if (/^(.)\1+$/.test(password)) penalty += 30;
  // Dates like 1999, 2024
if (/(19|20)\d{2}/.test(password)) penalty += 15;

// Keyboard walks
if (/qwerty|zxcvbn|poiuy|lkjh/i.test(password)) penalty += 15;

// Repeated blocks (abcabc, 1212)
if (/(\w+)\1+/.test(password)) penalty += 20;


  // Common sequences
  if (/12345|23456|abcdef|qwerty|asdf/i.test(password)) penalty += 20;

  // Common passwords
  if (/password|admin|welcome|letmein/i.test(password)) penalty += 25;

  return Math.max(entropy - penalty, 0);

}

