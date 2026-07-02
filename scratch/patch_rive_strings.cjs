const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '..', 'assets', 'rive', 'kids_interactive.riv'),
  path.join(__dirname, '..', 'assets', 'rive', 'largoapp3.riv')
];

const replacements = [
  { target: "Belajar Bahasa Jawa", replacement: "English for Kurds  " },
  { target: "KELAS : 1", replacement: "LEVEL : 1" },
  { target: "LANJUTKAN", replacement: "CONTINUE " },
  { target: "LATIHAN 2 DARI 5", replacement: "EXERCISE 2 OF 5 " },
  { target: "Isi bagian yang kosong", replacement: "Fill in the blanks    " },
  { target: "3 kesalah di perbaiki", replacement: "3 mistakes corrected " },
  { target: "Pelajaran", replacement: "Lesson   " },
  { target: "selesai!", replacement: "Finished" },
  { target: "Lanjutkan", replacement: "Continue " },
  { target: "Ulangi", replacement: "Retry " },
  { target: "WAKTU", replacement: "TIME " },
  { target: "AKURASI", replacement: "ACCURAC" }
];

files.forEach(filePath => {
  console.log(`\nChecking file: ${path.basename(filePath)}`);
  const data = fs.readFileSync(filePath);
  
  replacements.forEach(r => {
    // Search in binary data
    const targetBuf = Buffer.from(r.target, 'ascii');
    let occurrences = [];
    let idx = 0;
    
    while (true) {
      idx = data.indexOf(targetBuf, idx);
      if (idx === -1) break;
      occurrences.push(idx);
      idx += targetBuf.length;
    }
    
    console.log(`  Target "${r.target}" (len ${r.target.length}) -> Found ${occurrences.length} occurrences at offsets: [${occurrences.join(', ')}]`);
  });
});
