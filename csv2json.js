import scramjet from "scramjet";
import { createReadStream, createWriteStream } from "fs";
import { join, resolve } from "path";

const { StringStream } = scramjet;

let csvFilename = 'test.csv';
let jsonFilename = 'test.json';

if(process.argv.length > 2) {
    csvFilename = process.argv[2];

    if(process.argv.length > 3) {
        jsonFilename = process.argv[3];
    }
}

const parseChunk = chunk => {
    return chunk.slice(4);
}

StringStream
    .from(createReadStream(join(resolve(), csvFilename))) // open file stream
    .CSVParse() //get chunk
    .map(parseChunk) //do some transformations
    .toJSONArray() //transform to json
    .pipe(createWriteStream(join(resolve(), jsonFilename))) // write chunk to output stream

