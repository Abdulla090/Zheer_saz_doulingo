const fs = require('fs');
const path = require('path');

const rivPath = path.join(__dirname, '..', 'assets', 'rive', 'inappgame.riv');
const data = fs.readFileSync(rivPath);
const lowerData = data.toString('binary').toLowerCase();

const searchWords = ["groot", "stark", "thor", "avenger", "latihan", "isi bagian"];

console.log("--- SEARCH RESULTS (CASE-INSENSITIVE) ---");
searchWords.forEach(word => {
  let idx = 0;
  while (true) {
    idx = lowerData.indexOf(word, idx);
    if (idx === -1) {
      break;
    }
    console.log(`Found '${word}' at byte offset ${idx}`);
    const start = Math.max(0, idx - 50);
    const end = Math.min(data.length, idx + 50);
    const surrounding = data.subarray(start, end);
    
    let printable = "";
    for (let i = 0; i < surrounding.length; i++) {
      const b = surrounding[i];
      if (b >= 32 && b <= 126) {
        printable += String.fromCharCode(b);
      } else {
        printable += ".";
      }
    }
    console.log(`  Surrounding: {${printable}}`);
    idx += word.length;
  }
});
