const fs = require('fs');
const path = require('path');

const rivPath = path.join(__dirname, '..', 'assets', 'rive', 'kids_interactive.riv');
const data = fs.readFileSync(rivPath);

const strings = [];
let cur = "";

for (let i = 0; i < data.length; i++) {
  const b = data[i];
  if ((b >= 32 && b <= 126)) {
    cur += String.fromCharCode(b);
  } else {
    const trimmed = cur.trim();
    if (trimmed.length >= 2) {
      strings.push({ text: trimmed, offset: i - trimmed.length });
    }
    cur = "";
  }
}
if (cur.trim().length >= 2) {
  strings.push({ text: cur.trim(), offset: data.length - cur.trim().length });
}

// Find index of "latihan"
const targetIndex = strings.findIndex(s => s.text.toLowerCase().includes("latihan"));
console.log("Target index in unsorted strings list:", targetIndex);

if (targetIndex !== -1) {
  const start = Math.max(0, targetIndex - 20);
  const end = Math.min(strings.length, targetIndex + 20);
  console.log("--- SURROUNDING UNSORTED STRINGS ---");
  for (let i = start; i < end; i++) {
    const prefix = i === targetIndex ? ">>> " : "    ";
    console.log(`${prefix}[Index ${i}, Offset ${strings[i].offset}] "${strings[i].text}"`);
  }
}
