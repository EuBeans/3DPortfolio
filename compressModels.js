const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

const directoryPath = 'static/models'; // Update this path
const folders = fs.readdirSync(directoryPath, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

// Delete existing compressed files
folders.forEach(folder => {
  const folderPath = path.join(directoryPath, folder);
  fs.readdirSync(folderPath).forEach(file => {
    if (file.startsWith('compressed_')) {
      const filePath = path.join(folderPath, file);
      fs.unlinkSync(filePath);
      console.log(`Deleted: ${filePath}`);
    }
  });
});

// Compress files with more aggressive quantization
folders.forEach(folder => {
  const folderPath = path.join(directoryPath, folder);
  fs.readdirSync(folderPath).forEach(file => {
    if (path.extname(file) === '.glb' && !file.startsWith('compressed_')) {
      const inputPath = path.join(folderPath, file);
      const outputPath = path.join(folderPath, 'compressed_' + file);
      const command = `gltf-pipeline -i ${inputPath} -o ${outputPath} -d --draco.quantizePositionBits 8 --draco.quantizeTexcoordBits 8 --draco.quantizeNormalBits 6 --draco.quantizeGenericBits 6`;
      console.log(`Compressing: ${file} in folder ${folder}`);
      execSync(command, { stdio: 'inherit' });
      console.log(`Compressed: ${file} -> ${outputPath}`);
    }
  });
});