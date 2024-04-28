const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const directoryPath = 'static/textures';
const folders = fs.readdirSync(directoryPath, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

// Delete existing compressed files
folders.forEach(folder => {
  const folderPath = path.join(directoryPath, folder);
  fs.readdirSync(folderPath).forEach(file => {
    if (file.startsWith('lowRes_')) {
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
        .resize(2048, 2048) // Resize to 2K
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