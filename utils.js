import { statSync } from "fs";
import { join, resolve } from "path";

const utils = {
    timer: function timer(info) { 
        if (info) 
            console.log(`\x1b[32m${info} in: ${(performance.now()-timer.prev).toFixed(1)} ms\x1b[0m`, );
        
        timer.prev = performance.now();
    },
    printFileStats: async function printFileStats(filename, description = '') {
        const size = statSync(join(resolve(), filename)).size;
        let sizeString = '';

        if(!(Math.floor(size / 1024))) {
            sizeString = `${size} bytes`;
        } else if (!(Math.floor(size / 1024 / 1024))) {
            sizeString = `${(size / 1024).toFixed(1)} Kb`;
        } else {
            sizeString = `${(size / 1024 / 1024).toFixed(1)} Mb`;
        }

        console.log(`${description}: ${filename} size is\x1b[33m ${sizeString} \x1b[0m`);
    }
};

export { utils as default };



