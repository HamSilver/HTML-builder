const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const fromPath = path.join(__dirname, 'styles');
const toPath = path.join(__dirname, 'project-dist');
const outFile = path.join(toPath, 'bundle.css');

// проверка существования файла
const isExist = async (file) => {
  try {
    await fsPromises.access(file);
  } catch (e) {
    return false;
  }
  return true;
}

// удаление файла
const rm = async (file) => {
  try {
    await fsPromises.unlink(file);
  } catch (e) {
    console.error('Ошибка удаления файл');
    process.exit(500);
  }
}

// чтение файла в строку
const fileToString = (filename) => {
  const read = async (stream) => {
    stream.setEncoding('utf8');
    let data = '';
    for await (const chunk of stream) {
      data += chunk;
    }
    return data;
  }

  return read(fs.createReadStream(filename)).catch(console.error);
}

// сборка CSS
const bundleCss = async (src, dst) => {
  const outStream = new fs.createWriteStream(dst);
  await fs.readdir(src, async (err, files) => {
    if (err) process.exit(1);
    const cssFiles = files.filter(e => path.extname(e).toLowerCase() === '.css');
    for (const file of cssFiles) {
      const string = await fileToString(path.join(src, file));
      outStream.write(string + '\r\n');
    }
  });
}

// main
(async () => {
  if (await isExist(outFile)) {
    await rm(outFile);
  }
  await bundleCss(fromPath, outFile);
})();
