import { statSync } from "fs";
import { join, resolve } from "path";

const utils = {
    timer: function timer(info) { 
        if (info) 
            console.log(`\x1b[32m${info} in: ${(performance.now()-timer.prev).toFixed(3)}ms\x1b[0m`, );
        
        timer.prev = performance.now();
    },
    printFileStats: function printFileStats(filename, description = '') {
        const stats = statSync(join(resolve(), filename));
        console.log(`${description}: ${filename} size is \x1b[33m ${stats.size / 1024 / 1024} Mb \x1b[0m`);
    }
};

export { utils as default };



