// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

function waitForNetworkIdle(page, timeout, maxInflightRequests = 0) {
  page.on('request', onRequestStarted);
  page.on('requestfinished', onRequestFinished);
  page.on('requestfailed', onRequestFinished);

  let inflight = 0;
  let fulfill;
  let promise = new Promise(x => fulfill = x);
  let timeoutId = setTimeout(onTimeoutDone, timeout);
  return promise;

  function onTimeoutDone() {
    page.removeListener('request', onRequestStarted);
    page.removeListener('requestfinished', onRequestFinished);
    page.removeListener('requestfailed', onRequestFinished);
    fulfill();
  }

  function onRequestStarted() {
    ++inflight;
    if (inflight > maxInflightRequests)
      clearTimeout(timeoutId);
  }

  function onRequestFinished() {
    if (inflight === 0)
      return;
    --inflight;
    if (inflight === maxInflightRequests)
      timeoutId = setTimeout(onTimeoutDone, timeout);
  }
}
const blockedResourceTypes = [
  'image',
  'media',
  'font',
  'texttrack',
  'object',
  'beacon',
  'csp_report',
  'imageset',
];

const skippedResources = [
  'quantserve',
  'adzerk',
  'doubleclick',
  'adition',
  'exelator',
  'sharethrough',
  'cdn.api.twitter',
  'google-analytics',
  'googletagmanager',
  'google',
  'fontawesome',
  'facebook',
  'analytics',
  'optimizely',
  'clicktale',
  'mixpanel',
  'zedo',
  'clicksor',
  'tiqcdn',
];
async function uam(url, proxy, callback) {

  var userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36';
  var proxy_auth = false;
  if (proxy.indexOf('@') !== -1) { //Auth:
    let splitter = proxy.split('://');
    proxy_auth = splitter[1].split('@')[0].split(':');
    proxy = splitter[0] + '://' + splitter[1].split('@')[1];
  }
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    headless: true,
    defaultViewport: null,
    args: [
      '--disable-web-security',
      '--disable-site-isolation-trials',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--ignore-certifcate-errors',
      '--ignore-certifcate-errors-spki-list',
      '--disable-gpu',
      '--proxy-server=' + proxy,
      '--no-sandbox'
    ]
  });
  var cookie = false;
  try {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined
      });
      // overwrite the `languages` property to use a custom getter
      Object.defineProperty(navigator, "languages", {
        get: () => {
          return ["en-US", "en"];
        }
      });

      // overwrite the `plugins` property to use a custom getter
      Object.defineProperty(navigator, 'plugins', {
        get: () => {
          // this just needs to have `length > 0`, but we could mock the plugins too
          return [1, 2, 3, 4, 5];
        },
      });
    });
    if (proxy_auth) {
      await page.authenticate({
        username: proxy_auth[0],
        password: proxy_auth[1]
      });
    }
    await page.emulate({
      'viewport': {
        'width': 1920,
        'height': 969,
        'isMobile': false
      },
      'userAgent': userAgent,
      deviceScaleFactor: 1
    });

    await page.setRequestInterception(true);
    await page.on('request', request => {
      const requestUrl = request._url.split('?')[0].split('#')[0];
      if (
        blockedResourceTypes.indexOf(request.resourceType()) !== -1 ||
        skippedResources.some(resource => requestUrl.indexOf(resource) !== -1)
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });

    await page.goto(url, {
      timeout: 10e3,
      waitUntil: 'load'
    });

    await page.waitFor(5e3);

    await page.waitFor(5e3);

    await page.reload({
      timeout: 10e3,
      waitUntil: 'load'
    });

    await page.waitFor(5e3);
    let pageCookies = await page.cookies();
    if (pageCookies.length > 0) cookie = false;
    pageCookies.forEach(acookie => {
      if (cookie) {
        cookie += '; ' + acookie.name + '=' + acookie.value;
      } else {
        cookie = acookie.name + '=' + acookie.value;
      }
    });
  } catch (err) {
    callback(false, false);
  } finally {
    callback(cookie, userAgent);

    console.log(proxy, cookie);
    await browser.close();
  }
}

module.exports = uam;