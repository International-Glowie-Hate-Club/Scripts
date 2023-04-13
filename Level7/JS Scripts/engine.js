const playwright = require('playwright');
const colors = require('colors');

process.on('uncaughtException', function(er) {
    //console.log(er);
});
process.on('unhandledRejection', function(er) {
    //console.log(er);
});

const susDetection = {
	"js": [{
		"name": "CloudFlare",
		"navigations": 2,
		"locate": "<h2 class=\"h2\" id=\"challenge-running\">"
	}, {
		"name": "React",
		"navigations": 1,
		"locate": "Check your browser..."
	}, {
		"name": "DDoS-Guard",
		"navigations": 1,
		"locate": "DDoS protection by DDos-Guard"
	}, {
		"name": "VShield",
		"navigations": 1,
		"locate": "fw.vshield.pro/v2/bot-detector.js"
	}, {
		"name": "GameSense",
		"navigations": 1,
		"locate": "<title>GameSense</title>"
	}]
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function log(string) {
	let d = new Date();
	let hours = (d.getHours() < 10 ? '0' : '') + d.getHours();
	let minutes = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
	let seconds = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
	console.log(`(${hours}:${minutes}:${seconds}) ${string}`);
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function cookiesToStr(cookies) {
	if (Array.isArray(cookies)) {
		return cookies.reduce((prev, {
			name,
			value
		}) => {
			if (!prev) return `${name}=${value}`;
			return `${prev}; ${name}=${value}`;
		}, "");
		return "";
	}
}

function findJs(argument) {
	for (let i = 0; i < susDetection['js'].length; i++) {
		if (argument.includes(susDetection['js'][i].locate)) {
			return susDetection['js'][i]
		}
	}
}

function solverInstance(args) {
	return new Promise((resolve, reject) => {
		log('['.red + 'Star'.white + 'Less'.red + '] '.white +  'Browser (Firefox)'.red + ' -> '.white + 'created.'.red);

		playwright.firefox.launch({
			headless: true,

			proxy: {
				server: 'http://' + args.Proxy
			},
		}).then(async (browser) => {

			const page = await browser.newPage();

			try {
				await page.goto(args.Target);
			} catch (e) {
				console.log('[info] '.yellow + `Failed with ${args.Proxy}`.red)

				await browser.close();
				reject(e);
			}

			const ua = await page.evaluate(
				() => navigator.userAgent
			);

			log('['.red + 'Star'.white + 'Less'.red + '] '.white + 'Browser got User-Agent'.red + ' -> '.white + `${ua}`.red)
			
			const source = await page.content();
			const JS = await findJs(source);

			if (JS) {
				log('['.red + 'Star'.white + 'Less'.red + '] '.white + `Browser detected`.red + ` -> `.white + `(${JS.name})`.red);

				if (JS.name == "VShield") {
					await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
					await page.mouse.down();
					await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
					await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
					await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
					await page.mouse.move(randomIntFromInterval(100), randomIntFromInterval(100));
					await page.mouse.up();
				}

				for (let i = 0; i < JS.navigations; i++) {
					var [response] = await Promise.all([
						page.waitForNavigation(),
					])

					log('['.red + 'Star'.white + 'Less'.red + '] '.white + 'Browser waiting navigations'.red + ' -> '.white + `${i}`.red)
				}
			} else {
				log('['.red + 'Star'.white + 'Less'.red + '] '.white + 'No JS/Captcha'.red)
			}

	//////////////////////////////////////////////////////////////////////////////////////

			const source2 = await page.content();
			const JS2 = await findJs(source2);

			if (JS2) {
				log('['.red + 'Star'.white + 'Less'.red + '] '.white + `Browser detected`.red + ` -> `.white + `(${JS2.name})`.red);

				if (JS2.name == "VShield") {
					await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
					await page.mouse.down();
					await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
					await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
					await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
					await page.mouse.move(randomIntFromInterval(100), randomIntFromInterval(100));
					await page.mouse.up();
				}

				for (let i = 0; i < JS2.navigations; i++) {
					var [response] = await Promise.all([
						page.waitForNavigation(),
					])

					log('['.red + 'Star'.white + 'Less'.red + '] '.white + 'Browser waiting navigations'.red + ' -> '.white + `${i}`.red)
				}
			} else {
				log('['.red + 'Star'.white + 'Less'.red + '] '.white + 'No JS/Captcha'.red)
			}			


			const cookies = cookiesToStr(await page.context().cookies());
			const titleParsed = await page.title();

			log('['.red + 'Star'.white + 'Less'.red + '] '.white + 'Browser got Cookies'.red + ' -> '.white + `${cookies}`.red)
			log('['.red + 'Star'.white + 'Less'.red + '] '.white + 'Browser got Title'.red + ' -> '.white + `${titleParsed}`.red)

			await browser.close();
			resolve(cookies);
		})
	})
}

module.exports = {
	solverInstance: solverInstance
};