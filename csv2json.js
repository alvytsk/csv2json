import scramjet from "scramjet";
import { createReadStream, createWriteStream } from "fs";
import { join, parse, resolve } from "path";
import jsonExt from '@discoveryjs/json-ext'

const { StringStream, DataStream } = scramjet;
const { parseChunked } = jsonExt;

let csvFilename = 'output/test.csv';
let jsonFilename = 'output/test.json';

if(process.argv.length > 2) {
    csvFilename = process.argv[2];

    if(process.argv.length > 3) {
        jsonFilename = process.argv[3];
    }
}

const dataParser = async (chunk) => {

    return chunk;
}

async function csv2JsonParser(inputStream) {
    return StringStream
        .from(inputStream)
        .CSVParse()
        .map(dataParser)
        .toJSONArray();
}

const inputStream = createReadStream(join(resolve(), csvFilename));
const outputStream = createWriteStream(join(resolve(), jsonFilename));

let count = 0;

parseChunked(StringStream.from(csv2JsonParser(inputStream))).then(data => {
    console.log(count++);
    console.log(data);

    outputStream.write();
})