const fs = require('fs');
const path = require('path');

const rivPath = path.join(__dirname, '..', 'assets', 'rive', 'kids_interactive.riv');
const data = fs.readFileSync(rivPath);

const targets = [
  { name: "groot", offset: 2012074 },
  { name: "stark", offset: 2012315 },
  { name: "thor", offset: 2012604 },
  { name: "avenger", offset: 2031448 },
  { name: "latihan", offset: 2155679 },
  { name: "isi bagian", offset: 2155811 }
];

targets.forEach(t => {
  console.log(`\n=================== TARGET: ${t.name} (Offset ${t.offset}) ===================`);
  const start = Math.max(0, t.offset - 60);
  const end = Math.min(data.length, t.offset + 60);
  const chunk = data.subarray(start, end);
  
  // Format chunk as printable characters & hex
  let text = "";
  let hex = "";
  for (let i = 0; i < chunk.length; i++) {
    const b = chunk[i];
    const char = (b >= 32 && b <= 126) ? String.fromCharCode(b) : ".";
    text += char;
    hex += b.toString(16).padStart(2, '0') + " ";
  }
  console.log("TEXT: " + text);
  console.log("HEX : " + hex);
});
