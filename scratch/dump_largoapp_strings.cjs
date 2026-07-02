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
    if (trimmed.length >= 2) {
      strings.push({ text: trimmed, offset: i - trimmed.length });
    }
    cur = "";
  }
}
if (cur.trim().length >= 2) {
  strings.push({ text: cur.trim(), offset: data.length - cur.trim().length });
}

// Write all strings to a file
const outputPath = path.join(__dirname, 'largoapp_strings.txt');
fs.writeFileSync(outputPath, strings.map(s => `[Offset ${s.offset}] "${s.text}"`).join('\n'), 'utf8');
console.log(`Saved ${strings.length} strings to ${outputPath}`);
