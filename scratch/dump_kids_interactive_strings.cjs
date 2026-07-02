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
      strings.push(trimmed);
    }
    cur = "";
  }
}
if (cur.trim().length >= 2) {
  strings.push(cur.trim());
}

const outputPath = path.join(__dirname, 'kids_interactive_strings.txt');
fs.writeFileSync(outputPath, strings.sort().join('\n'), 'utf8');
console.log(`Saved ${strings.length} strings to ${outputPath}`);
