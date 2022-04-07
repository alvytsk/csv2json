import scramjet from "scramjet";
import { createReadStream, createWriteStream } from "fs";
import { join, parse, resolve } from "path";
import jsonExt from '@discoveryjs/json-ext'

const { StringStream, DataStream } = scramjet;
const { stringifyStream } = jsonExt;

let csvFilename = 'output/test.csv';
let jsonFilename = 'output/test.json';

if(process.argv.length > 2) {
    csvFilename = process.argv[2];

    if(process.argv.length > 3) {
        jsonFilename = process.argv[3];
    }
}

const reducer = (prev, cur) => {
    const updated = cur.reduce(function (prev, curr, idx, arr) {
        const key = 'i' + idx;
        const data = prev.data;
        data.push({
            [key]: curr,
        })
        return {
            data,
        }
    }, { total: 0, data: [] });


    const newData = prev;
    newData.data?.push(updated.data);
    newData.total += Number(cur[1]);

    return newData;
}

async function csv2JsonParser(input) {
    const data = await StringStream
        .from(input)
        .CSVParse()
        .reduce(reducer, { total: 0, data: [] });

    return stringifyStream(data);
}

const inputStream = createReadStream(join(resolve(), csvFilename));
const outputStream = createWriteStream(join(resolve(), jsonFilename));

csv2JsonParser(inputStream).then(data => data.pipe(outputStream));