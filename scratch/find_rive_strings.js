const fs = require('fs');
const path = require('path');

const projectRoot = 'c:\\Users\\TOTAL TECH\\Desktop\\My Ai project\\mobile app\\phingo';
const filePath = path.join(projectRoot, "assets", "rive", "largoapp3.riv");

if (!fs.existsSync(filePath)) {
  console.log("File not found");
  process.exit(1);
}

const data = fs.readFileSync(filePath);

// Simple string extractor
let cur = [];
const allStrings = [];
for (let i = 0; i < data.length; i++) {
  const b = data[i];
  if (b >= 32 && b <= 126) {
    cur.push(String.fromCharCode(b));
  } else {
    if (cur.length >= 3) {
      allStrings.push(cur.join(""));
    }
    cur = [];
  }
}
if (cur.length >= 3) {
  allStrings.push(cur.join(""));
}

console.log(`Total strings extracted: ${allStrings.length}`);

const keywords = ["click", "level", "lesson", "play", "btm", "button", "screen"];
const matches = allStrings.filter(s => {
  const lower = s.toLowerCase();
  return keywords.some(k => lower.includes(k));
});

console.log(`Matches count: ${matches.length}`);
console.log("Printing matching strings:");
const uniqueMatches = Array.from(new Set(matches)).sort();
uniqueMatches.forEach(m => console.log(`  ${m}`));
