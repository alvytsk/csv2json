import { generate } from 'csv-generate';
import fs from 'fs';
import path from 'path';

const rowCount = process.argv[2] ? Number(process.argv[2]) : 15;
const columnCount = process.argv[3] ? Number(process.argv[3]) : 10;
const outputFilename = process.argv[4] ? process.argv[4] : '';

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}

const columns = [...Array(columnCount)].map(() => ['int', 'bool', 'ascii'].random());

const dest = outputFilename 
                ? fs.createWriteStream(path.join(path.resolve(), outputFilename))
                : process.stdout 

generate({
  columns: columns,
  length: rowCount
})
  .pipe(dest);