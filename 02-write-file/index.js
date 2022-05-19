const fs = require('fs');
const path = require('path');
const { stdin, stdout, stderr } = process;

const stream = new fs.createWriteStream(path.join(__dirname, 'savedText.txt'));

const showInvt = () => stdout.write('SkyNet> ');

stdin.on('data', data => {
  const dataStr = data.toString();
  if (dataStr.trim() === 'exit') process.exit(0);
  stream.write(dataStr);
  showInvt();
});

process.on('exit', code => {
  if (code === 0) {
    stdout.write('Hasta la vista, baby!');
  } else {
    stderr.write(`Somthing wrong. App crashed w/code: ${code}`);
  }
});

process.on('SIGINT', function () {
  process.exit(0);
});

showInvt();
