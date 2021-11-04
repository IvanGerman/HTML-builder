const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin, stdout } = process;
const input = stdin;
const output = stdout;

const rl = readline.createInterface({ input, output });


let writeableStream = fs.createWriteStream(path.join(__dirname, 'inputText.txt'));

rl.write('Hello!Write something, please\n');

rl.addListener('line', (input) => {

  if (input === 'exit') {

    rl.write('Goodbye!');
    process.exit(0);
  };

  writeableStream.write(input + '\n');

});

rl.addListener('close', () => {

  rl.write('Goodbye!');
  process.exit(0);

});