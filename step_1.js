import scramjet from "scramjet";
import { createReadStream, createWriteStream, statSync } from "fs";
import { pipeline } from 'stream/promises';
import { join, resolve } from "path";

const { StringStream } = scramjet;

// --- Utils functions ---

function timer(info) { 
    if (info) 
        console.log(`\x1b[32m${info} in: ${(performance.now()-timer.prev).toFixed(3)}ms\x1b[0m`, );
    
    timer.prev = performance.now();
}

function printFileStats(filename, description = '') {
    const stats = statSync(join(resolve(), filename));
    console.log(`${description}: ${filename} size is \x1b[33m ${stats.size / 1024 / 1024} Mb \x1b[0m`);
}

// -----------------------

const csvFilename = process.argv[2] ? process.argv[2] : 'output/test.csv';
const jsonFilename = process.argv[3] ? process.argv[3] : 'output/test.json';

const csvFilepath = join(resolve(), csvFilename);
const jsonFilepath = join(resolve(), jsonFilename);

const parseChunk = chunk => {

    const data = chunk.slice(chunk.length - (chunk.length * 0.2));

    const updated = data.reduce(function (prev, curr, idx) {
        const key = 'item' + (idx+1);
        return {
            ...prev,
            [key]: curr,
        };
    }, {});

    return updated;
}

timer();

const inputStream = createReadStream(csvFilepath);
const outputStream = createWriteStream(jsonFilepath);

printFileStats(csvFilename, 'Input');

StringStream
    .from(inputStream) // open file stream
    .CSVParse() //get chunk
    .map(parseChunk) //do some transformations
    .toJSONArray() //transform to json
    .tee(outputStream) // write chunk to output stream
    .whenEnd()
    .then(() => {
        timer('JSON generated');
        printFileStats(jsonFilename, 'Output');
    })
