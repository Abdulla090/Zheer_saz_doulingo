const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function compress() {
  const inputPath = path.join(__dirname, '../assets/images/real-app-icon.png');
  const outputPath = path.join(__dirname, '../assets/images/logo-compressed.png');
  
  if (!fs.existsSync(inputPath)) {
    console.error("Input file not found at", inputPath);
    return;
  }
  
  console.log("Compressing logo...");
  await sharp(inputPath)
    .resize(512, 512)
    .png({ quality: 80, compressionLevel: 9 })
    .toFile(outputPath);
  
  console.log("Compressed logo written to", outputPath);
  console.log("Original size:", fs.statSync(inputPath).size);
  console.log("Compressed size:", fs.statSync(outputPath).size);
}

compress().catch(console.error);
