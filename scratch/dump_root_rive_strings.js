const fs = require('fs');
const path = require('path');

const rivPath = path.join(__dirname, '..', '27975-52851-fully-interactive-learning-app-with-rive.riv');
if (!fs.existsSync(rivPath)) {
  console.log("File not found at", rivPath);
  process.exit(1);
}
const data = fs.readFileSync(rivPath);
const lowerData = data.toString('binary').toLowerCase();

const searchWords = ["groot", "stark", "thor", "avenger", "latihan", "isi bagian"];

console.log("--- SEARCH RESULTS IN ROOT RIVE FILE ---");
searchWords.forEach(word => {
  let idx = 0;
  while (true) {
    idx = lowerData.indexOf(word, idx);
    if (idx === -1) {
      break;
    }
    console.log(`Found '${word}' at byte offset ${idx}`);
    idx += word.length;
  }
});
