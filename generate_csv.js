import { generate } from 'csv-generate';
import fs from 'fs';
import path from 'path';

var rowCount = 15;
var outputFilename = null;

if(process.argv.length > 2) {
    rowCount = Number(process.argv[2]);

    if(process.argv.length > 3) {
        outputFilename = process.argv[3];
    }
}

const dest = outputFilename 
                ? fs.createWriteStream(path.join(path.resolve(), outputFilename))
                : process.stdout 

generate({
  columns: ['int', 'bool', 'ascii', 'ascii', 'int', 'bool', 'ascii'],
  length: rowCount
})
  .pipe(dest);