const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');


async function bundleCssFiles() {

  const allFiles = await fsPromises.readdir(cssFilesDirectory); 

  const allCssFiles = allFiles.filter( (element) => { 

    return path.extname(element) === '.css';

  }); 

  const writableStream = fs.createWriteStream(bundleFilePath, 'utf8');

  appendToBundle(allCssFiles, writableStream);
}

function appendToBundle(cssFilesArray = [], writableStream) {

  if (!cssFilesArray.length) {

    return writableStream.end();

  };

  let nextCssFile = cssFilesArray.shift();
  const cssFilePath = path.join(cssFilesDirectory, nextCssFile);

  const readableStream = fs.createReadStream(cssFilePath, 'utf8');

  readableStream.pipe(writableStream, { end: false });// keeps writeStreaming even if readStream ends
  readableStream.on('end', function () {
    
    appendToBundle(cssFilesArray, writableStream);

  });  
};

const cssFilesDirectory = path.join(__dirname, 'styles');
const bundleFilePath = path.join(__dirname, 'project-dist', 'bundle.css');

bundleCssFiles();




