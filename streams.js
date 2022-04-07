import { createReadStream, createWriteStream } from "fs";
import stream from 'stream';
import jsonExt from '@discoveryjs/json-ext'

const { parseChunked } = jsonExt;

function parseCsv(readStream) {
    let unprocessed = '';

    const output = new stream.Duplex({
        write: function(chunk, encoding, next) {
            const arr = chunk
                        .toString()
                        .split(',')
                        .reduce(function (prev, curr, idx, arr) {
                            const key = 'i' + idx;
                            const data = prev.data;
                            const total = idx === 1 ? arr[1] : prev.total;
                            data.push({
                                [key]: curr,
                            })
                            return {
                                total,
                                data,
                            }
                        }, { total: 0, data: [] });

            console.log('\n>>>', arr, '<<<\n');
            this.push(JSON.stringify(arr));
            next();
        },

        read: function() {}
      });

    const parseRead = chunk => {
        let chunkString = unprocessed + chunk.toString();
        unprocessed = '';
    
        let startIndex = 0;
        for(let ch = startIndex; ch < chunkString.length; ch++) {
            if(chunkString[ch] === '\n') {
                const line = chunkString.slice(startIndex, ch);
                startIndex = ch + 1;
                // move to output stream
                output.write(line);
            }
        }
    
        if(chunkString[chunkString.length - 1] !== '\n') {
            unprocessed = chunkString.slice(startIndex);
        }
    }
    
    readStream.on('data', parseRead);

    return output;
}

const parsedStream = parseCsv(createReadStream('output/test.csv'));

// parsedStream.pipe(process.stdout);

parseChunked(parsedStream).then(data => {
    console.log(data);
});