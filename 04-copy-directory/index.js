const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const fromPath = path.join(__dirname, 'files');
const toPath = path.join(__dirname, 'files-copy');

// проверка существования директории
const isExist = async (dir) => {
  try {
    await fsPromises.access(dir);
  } catch (e) {
    return false;
  }
  return true;
};

// удаление директории
const rd = async (dir) => {
  try {
    await fsPromises.rmdir(dir, { recursive: true });
  } catch (e) {
    console.error('Ошибка удаления директории');
    process.exit(500);
  }
};

// создание директории
const md = async (dir) => {
  try {
    await fsPromises.mkdir(dir);
  } catch (e) {
    console.error('Ошибка создания директории');
    process.exit(404);
  }
};

// копирование директории с рекурсией и параллелизмом
const copyDir = async (src, dst) => {
  const [entries] = await Promise.all([
    fsPromises.readdir(src, { withFileTypes: true }),
    fsPromises.mkdir(dst, { recursive: true }),
  ]);

  await Promise.all(
    entries.map((entry) => {
      const srcPath = path.join(src, entry.name);
      const dstPath = path.join(dst, entry.name);
      return entry.isDirectory()
        ? copyDir(srcPath, dstPath)
        : fsPromises.copyFile(srcPath, dstPath);
    })
  );
};

//main
(async () => {
  if (await isExist(toPath)) {
    await rd(toPath);
  }
  await md(toPath);
  await copyDir(fromPath, toPath);
})();