const fs = require('fs');
const path = require('path');

async function readText(fn, dn=__dirname) {
  const inputStream = fs.createReadStream(path.resolve(dn, fn), {encoding: 'utf8'});
  for await (const chunk of inputStream) { console.log(chunk); }
}

readText('text.txt');
