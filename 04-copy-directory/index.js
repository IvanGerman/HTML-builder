const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises'); //use promise-based API


async function copyDir() {

  try {

    await fsPromises.access(pathToCopyDir, fs.constants.R_OK | fs.constants.W_OK);// check if directory exists

    const previousFiles = await fsPromises.readdir(pathToCopyDir);

    previousFiles.forEach(async (element) => {

      const filePath = path.join(pathToCopyDir, element);
      fsPromises.unlink(filePath); //delete file

    });

  } catch {

    await fsPromises.mkdir(pathToCopyDir, { recursive: true }); //create directory if it's not existing
                                          //returns first directory path created if recursive is true
  };


  const allFiles = await fsPromises.readdir(pathToFilesDir);//get all files from /files directory

  allFiles.forEach( async (element) => { 

    try {

      const sourceDirFile = path.join(__dirname, 'files', element);
      const destDirFile = path.join(__dirname, 'files-copy', element);
      await fsPromises.copyFile(sourceDirFile, destDirFile);

    } catch {

      console.log('The file could not be copied');

    };

  });
};

const pathToCopyDir = path.join(__dirname, 'files-copy');
const pathToFilesDir = path.join(__dirname, 'files');

copyDir();
