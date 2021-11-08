const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');


async function startHTMLbuilder() {

  await createProjectDist();
  await copyDir(pathToNewAssetsDir, pathToOldAssetsDir);
  await bundleCssFiles();
  await createIndexHTML();  

}

startHTMLbuilder();




//create project-dist directory--------------------------------------------------------

async function createProjectDist() {

  await fsPromises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });

};

//-------------------------------------------------------------------------------------


//copy directory /assets into project-dist/assets-------------------------------------

async function copyDir(pathToNewAssetsDir, pathToOldAssetsDir) {

  await fsPromises.mkdir(pathToNewAssetsDir, { recursive: true });

  const oldAssetsDirContent = await fsPromises.readdir(pathToOldAssetsDir);

  oldAssetsDirContent.forEach(async (element) => {

    const sourceFile = path.join(pathToOldAssetsDir, element);
    const copiedSourceFile = path.join(pathToNewAssetsDir, element);

    const sourceFileInfo = await fsPromises.stat(sourceFile);

    if (sourceFileInfo.isDirectory()) {

      copyDir(copiedSourceFile, sourceFile);

    } else {

      await fsPromises.copyFile(sourceFile, copiedSourceFile);

    }
  });
}

const pathToNewAssetsDir = path.join(__dirname, 'project-dist', 'assets');
const pathToOldAssetsDir = path.join(__dirname, 'assets');

//--------------------------------------------------------------------------------------


//bundle all css files to style.css-----------------------------------------------------

async function bundleCssFiles() {

  const allFiles = await fsPromises.readdir(cssFilesDirectory); 

  const allCssFiles = allFiles.filter( (element) => { 

    return path.extname(element) === '.css';

  }); 

  const writableStream = fs.createWriteStream(bundleFilePath, 'utf8');

  appendToBundle(allCssFiles, writableStream);
}

function appendToBundle(cssFilesArray = [], writableStream) {

  let nextCssFile = cssFilesArray.shift();

  if (nextCssFile === undefined) {

    return writableStream.end();

  };

  const cssFilePath = path.join(cssFilesDirectory, nextCssFile);

  const readableStream = fs.createReadStream(cssFilePath, 'utf8');

  readableStream.pipe(writableStream, { end: false });
  readableStream.on('end', function () {
    
    appendToBundle(cssFilesArray, writableStream);

  });  
};

const cssFilesDirectory = path.join(__dirname, 'styles');
const bundleFilePath = path.join(__dirname, 'project-dist', 'style.css');

//---------------------------------------------------------------------------------------


//create index.html----------------------------------------------------------------------

async function readTemplate() {

  let template = await fsPromises.readFile(path.join(__dirname, 'template.html'), 'utf-8');
  return template;

};

async function getAllHTMLfiles() {
 
  let allHTMLfiles = await fsPromises.readdir(path.join(__dirname, 'components'), 'utf-8');
  return allHTMLfiles; 

};

async function changeTemplate() {

  let template  = await readTemplate(); 
  let allHTMLfiles = await getAllHTMLfiles();


  for (let i = 0; i < allHTMLfiles.length; i++) {
    
    let replacement = await fsPromises.readFile(path.join(__dirname, 'components', `${allHTMLfiles[i]}`), 'utf-8');
    let element = allHTMLfiles[i].split('.')[0]; 
    template = template.replace(`{{${element}}}`, replacement);
    
    if( i === allHTMLfiles.length - 1) {
      return template;
    };
  };   
};

async function createIndexHTML() {

  let template = await changeTemplate();
  await createProjectDist();

  fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), template, 'utf-8', (err) => {
    
    if (err) throw err;

  });

};


//---------------------------------------------------------------------------------------


