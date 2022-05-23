const { stdout, stderr } = process;
const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const directoryPath = path.join(__dirname, 'secret-folder');

fs.readdir(directoryPath, function (err, files) {
  if (err) process.exit(1);
  for (const file of files) {
    const testFN = path.join(__dirname, 'secret-folder', file);
    (async () => {
      const stat = await fsPromises.lstat(testFN);
      if (stat.isFile()) {
        let ext = path.extname(testFN);
        let fName = '';
        if (ext !== '') {
          fName = path.basename(testFN, ext);
          ext = ext.replace(/^\./, '');
        } else {
          fName = path.basename(testFN);
        }
        stdout.write(`${fName} - ${ext} - ${parseInt(stat.size / 1024)}.${stat.size % 1024} kb\n`);
      }
    })().catch(console.error);
  }
});

process.on('exit', code => {
  if (code === 0) {
    stdout.write('\n');
  } else {
    stderr.write(`Что-то пошло не так. Программа завершилась с кодом ${code}\n`);
  }
});
