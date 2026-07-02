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
  console.log(`\nPatching file: ${path.basename(filePath)}`);
  let data = fs.readFileSync(filePath);
  let modified = false;
  
  replacements.forEach(r => {
    const targetBuf = Buffer.from(r.target, 'ascii');
    const replacementBuf = Buffer.from(r.replacement, 'ascii');
    
    if (targetBuf.length !== replacementBuf.length) {
      console.error(`Error: Length mismatch for "${r.target}" (${targetBuf.length}) vs "${r.replacement}" (${replacementBuf.length})`);
      process.exit(1);
    }
    
    let occurrences = [];
    let idx = 0;
    
    while (true) {
      idx = data.indexOf(targetBuf, idx);
      if (idx === -1) break;
      occurrences.push(idx);
      
      // Replace in buffer directly
      replacementBuf.copy(data, idx);
      modified = true;
      idx += targetBuf.length;
    }
    
    console.log(`  "${r.target}" -> Replaced ${occurrences.length} occurrences.`);
  });
  
  if (modified) {
    fs.writeFileSync(filePath, data);
    console.log(`Saved patched file: ${path.basename(filePath)}`);
  } else {
    console.log(`No changes made to ${path.basename(filePath)}`);
  }
});
