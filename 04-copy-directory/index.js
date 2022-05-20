const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const fromPath = path.join(__dirname, 'files');
const toPath = path.join(__dirname, 'files-copy');

// проверка существования директории
async function isExist(dir) {
  try {
    await fsPromises.access(dir);
  } catch (e) {
    return false;
  }
  return true;
}

// удаление директории
async function rd(dir) {
  try {
    await fsPromises.rmdir(dir, { recursive: true });
  } catch (e) {
    console.error('Ошибка удаления директории');
    process.exit(500);
  }
}

// создание директории
async function md(dir) {
  try {
    await fsPromises.mkdir(dir);
  } catch (e) {
    console.error('Ошибка создания директории');
    process.exit(404);
  }
}

//main
(async () => {
  if (await isExist(toPath)) {
    await rd(toPath);
  }
  await md(toPath);
  fs.readdir(fromPath, function (err, files) {
    if (err) process.exit(1);
    for (const file of files) {
      fs.copyFile(path.join(fromPath, file), path.join(toPath, file), (err) => {
        if (err) {
          console.error('Ошибка копирования файла: ' + file);
          throw err;
        }
      });
    }
  });
})();