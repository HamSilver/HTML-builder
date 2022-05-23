const fs = require('fs');
const path = require('path');
const { stdout } = process;

const stream = new fs.ReadStream(path.join(__dirname, 'text.txt'));
 
stream.on('readable', function(){
  const data = stream.read();
  if (data != null) stdout.write(data.toString());
});
 
