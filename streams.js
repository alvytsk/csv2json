import { createReadStream, createWriteStream } from "fs";
import stream from 'stream';

function parseCsv(readStream) {
    let sum = 0;
    let unprocessed = '';

    const output = new stream.Duplex({
        write: function(chunk, encoding, next) {
            console.log('\n>>>', chunk.toString(), '<<<\n');
            this.push(chunk);
            next();
        },

        read: function( size ) {}
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

parseCsv(createReadStream('output/test.csv')).pipe(process.stdout);