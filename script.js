function togglePassword() {
    let input = document.getElementById("password");
    input.type = input.type === "password" ? "text" : "password";
}

function checkPassword() {
    let password = document.getElementById("password").value;

    let length = document.getElementById("length");
    let uppercase = document.getElementById("uppercase");
    let lowercase = document.getElementById("lowercase");
    let number = document.getElementById("number");
    let symbol = document.getElementById("symbol");

    let message = document.getElementById("message");
    let strengthFill = document.getElementById("strength-fill");
    let entropyText = document.getElementById("entropy");

    let rules = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        symbol: /[^A-Za-z0-9]/.test(password)
    };

    length.className = rules.length ? "valid" : "";
    uppercase.className = rules.uppercase ? "valid" : "";
    lowercase.className = rules.lowercase ? "valid" : "";
    number.className = rules.number ? "valid" : "";
    symbol.className = rules.symbol ? "valid" : "";

    let score = Object.values(rules).filter(Boolean).length;

    // Strength bar
    strengthFill.style.width = (score / 5) * 100 + "%";

    if (score <= 2) {
        message.textContent = "Weak password ❌";
        message.style.color = "#ff6b6b";
        strengthFill.style.backgroundColor = "#ff6b6b";
    } else if (score <= 4) {
        message.textContent = "Moderate password ⚠️";
        message.style.color = "#facc15";
        strengthFill.style.backgroundColor = "#facc15";
    } else {
        message.textContent = "Strong password ✅";
        message.style.color = "#4caf50";
        strengthFill.style.backgroundColor = "#4caf50";
    }

    // Entropy explanation (simple estimation)
    let charsetSize = 0;
    if (rules.lowercase) charsetSize += 26;
    if (rules.uppercase) charsetSize += 26;
    if (rules.number) charsetSize += 10;
    if (rules.symbol) charsetSize += 32;

    if (password.length > 0 && charsetSize > 0) {
        let entropy = Math.round(password.length * Math.log2(charsetSize));
        entropyText.textContent =
            `Estimated entropy: ~${entropy} bits. Higher entropy means more resistance to brute-force attacks.`;
    } else {
        entropyText.textContent = "";
    }
}
