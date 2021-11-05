const fs = require('fs');
const path = require('path');


fs.readdir(path.join(__dirname, 'secret-folder'),{ withFileTypes: true }, (err, files) => {

  files.forEach((element) => {

    if ( element.isFile()) {

      let fileInfo = '';
       
      fs.stat(path.join(__dirname, 'secret-folder', element.name), (error, stats) => {
        if (error) {
          console.log(error);
        } else {        
          
          fileInfo = element.name.split('.')[0] + ' - ' + path.extname(element.name).split('.')[1] + ' - ' + stats.size; 
          console.log(fileInfo); 

        }
      });

      
    };

    if ( element.isDirectory()) {

      fs.readdir(path.join(__dirname, 'secret-folder', element.name),{ withFileTypes: true }, (err, files) => {
        
        let directionName = element.name;
        files.forEach((element) => { 

          if ( element.isFile()) {  

            fs.stat(path.join(__dirname, 'secret-folder', directionName, element.name), (error, stats) => {

              if (error) {
                console.log(error);
              } else {        
                
                fileInfo = element.name.split('.')[1] + ' - ' + path.extname(element.name).split('.')[1] + ' - ' + stats.size; 
                console.log(fileInfo);
              }
            });
            
          };
        });
      });
    };   
  });  
});
















