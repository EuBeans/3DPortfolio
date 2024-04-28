const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const directoryPath = 'static/models';
const folders = fs.readdirSync(directoryPath, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

// Delete existing compressed files
folders.forEach(folder => {
  const folderPath = path.join(directoryPath, folder);
  fs.readdirSync(folderPath).forEach(file => {
    if (file.startsWith('low_res_')) {
      const filePath = path.join(folderPath, file);
      fs.unlinkSync(filePath);
      console.log(`Deleted: ${filePath}`);
    }
  });
});

// Compress images to 2K resolution
folders.forEach(folder => {
  const folderPath = path.join(directoryPath, folder);
  fs.readdirSync(folderPath).forEach(file => {
    if (path.extname(file).toLowerCase() === '.jpg') {
      const inputPath = path.join(folderPath, file);
      const outputPath = path.join(folderPath, `low_res_${file}`);
      sharp(inputPath)
        .resize(1024, 1024) // Resize to 1K for more compression
        .toFile(outputPath, (err, info) => {
          if (err) {
            console.error(`Error processing ${file}:`, err);
          } else {
            console.log(`Processed ${file}:`, info);
          }
        });
    }
  });
});