const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const fromPath = path.join(__dirname, 'styles');
const toPath = path.join(__dirname, 'project-dist');

let outStream = null;

// проверка существования файла
async function isExist(file) {
  try {
    await fsPromises.access(file);
  } catch (e) {
    return false;
  }
  return true;
}

// удаление файла
async function rm(file) {
  try {
    await fsPromises.unlink(file);
  } catch (e) {
    console.error('Ошибка удаления файл');
    process.exit(500);
  }
}

// main
(async () => {
  const outFile = path.join(toPath, 'bundle.css');
  if (await isExist(outFile)) {
    await rm(outFile);
  }
  outStream = new fs.createWriteStream(outFile);
  fs.readdir(fromPath, function (err, files) {
    if (err) process.exit(1);
    const cssFiles = files.filter(e => path.extname(e).toLowerCase() === '.css')
    for (const file of cssFiles) {
      let string = '';
      let inStream = new fs.ReadStream(path.join(fromPath, file));

      inStream.on('data', function (data) {
        string += data.toString();
      });

      inStream.on('end', function () {
        if (string.slice(-1) !== '\n') string += '\n';
        string += '\n';
        outStream.write(string);
      });

    }
  });
})();
