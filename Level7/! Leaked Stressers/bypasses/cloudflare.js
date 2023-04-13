module.exports = function Cloudflare() {
    const cloudflareScraper = require('cloudflare-scraper');

    function bypass(proxy, uagent, callback) 
    {
        (async () => {
            try { 
                const jar = cloudflareScraper.jar();
                const url = storm.target;
                let result = await cloudflareScraper.get(url, { 
                    jar: jar,
                    proxy: 'http://' + proxy,
                    headers: {
                        'User-Agent': uagent
                    },
					puppeteerOptions: { 
						args: [
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
						]
					}
                });

                //const cookiesObject = await jar.getCookies(url); 
                const cookieStr = await jar.getCookieString(url);
                console.log(cookieStr);
                //console.log(result)

                await callback(cookieStr);
            } catch (error) {
                //console.log(error)
                await callback();
                //return module.exports(proxy, uagent, callback);
            }
        })();
    }

    return bypass;
}