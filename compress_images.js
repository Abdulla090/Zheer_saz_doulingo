const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const filesToCompress = [
  'assets/images/characters/dolphinmascot.png',
  'assets/images/characters/phingo charecter.png',
  'assets/images/Welcome.png'
];

async function compressImages() {
  for (const file of filesToCompress) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      console.log(`Compressing ${file}...`);
      const tempPath = filePath + '.tmp.png';
      
      try {
        await sharp(filePath)
          .resize({ width: 1080, withoutEnlargement: true }) // Resize to max 1080p width to save huge space
          .png({ quality: 80, compressionLevel: 9 }) // Compress
          .toFile(tempPath);
          
        fs.renameSync(tempPath, filePath);
        console.log(`Successfully compressed ${file}`);
      } catch (err) {
        console.error(`Error compressing ${file}:`, err);
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      }
    } else {
      console.log(`File not found: ${filePath}`);
    }
  }
}

compressImages();
