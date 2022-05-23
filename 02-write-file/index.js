const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const outputStream = require('fs').createWriteStream(
  require('path').resolve(__dirname, 'output.txt'),  {encoding: 'utf8'}
);

console.log('Enter your text line by line, it will be mirrored in output.txt.');
console.log('Type "exit" or press Ctrl+C to stop.');

const stop = () => { console.log('\nTerminating.'); rl.close(); };
rl.on('line', (line) => {
  if (line == 'exit') { stop(); }
  else { outputStream.write(line + '\n'); }
});
rl.on('SIGINT', stop);
