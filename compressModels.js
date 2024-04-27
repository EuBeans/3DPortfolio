const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

const directoryPath = 'static/models'; // Update this path
const folders = fs.readdirSync(directoryPath, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

folders.forEach(folder => {
  const folderPath = path.join(directoryPath, folder);
  fs.readdirSync(folderPath).forEach(file => {
    if (path.extname(file) === '.glb') {
      const inputPath = path.join(folderPath, file);
      const outputPath = path.join(folderPath, 'compressed_' + file);
      const command = `gltf-pipeline -i ${inputPath} -o ${outputPath} -d`;
      console.log(`Compressing: ${file} in folder ${folder}`);
      execSync(command, { stdio: 'inherit' });
      console.log(`Compressed: ${file} -> ${outputPath}`);
    }
  });
});

