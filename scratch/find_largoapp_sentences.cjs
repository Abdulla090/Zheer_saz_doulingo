const fs = require('fs');
const path = require('path');

const rivPath = path.join(__dirname, '..', 'assets', 'rive', 'largoapp3.riv');
const data = fs.readFileSync(rivPath);

const strings = [];
let cur = "";

for (let i = 0; i < data.length; i++) {
  const b = data[i];
  if ((b >= 32 && b <= 126)) {
    cur += String.fromCharCode(b);
  } else {
    const trimmed = cur.trim();
    if (trimmed.length >= 4 && /[a-zA-Z\s]{4,}/.test(trimmed)) {
      strings.push({ text: trimmed, offset: i - trimmed.length });
    }
    cur = "";
  }
}
if (cur.trim().length >= 4) {
  strings.push({ text: cur.trim(), offset: data.length - cur.trim().length });
}

// Filter strings
const commonRive = ['state', 'machine', 'animation', 'timeline', 'artboard', 'boolean', 'trigger', 'number', 'input', 'property', 'instance', 'layer', 'transition'];
const filtered = strings.filter(s => {
  const lower = s.text.toLowerCase();
  if (commonRive.some(word => lower.includes(word))) return false;
  if ((lower.match(/[^a-zA-Z\s0-9]/g) || []).length > 2) return false;
  return true;
});

console.log("--- LARGOAPP3 POTENTIAL SENTENCES / TEXT RUN VALUES ---");
filtered.forEach(s => {
  console.log(`[Offset ${s.offset}] "${s.text}"`);
});
