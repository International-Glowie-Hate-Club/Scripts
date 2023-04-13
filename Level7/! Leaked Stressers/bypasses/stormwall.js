module.exports = function Stormwall() {
    const request = require('request'),
        document = {
            cookie: ''
        };

    global.window = {navigator: {}};

    const STORMWALL_DETECTION_REGEXP = /https:\/\/static\.stormwall\.pro\/(.+).js/gm;
    const CE_REGEXP = /cE = "(.+)"/;
    const CK_REGEXP = /cK = (.+);/;
    const SUBSTITUTION_ALPHABET = '0123456789qwertyuiopasdfghjklzxcvbnm:?!';

    function extract(string, regexp, errorMessage) {
    const match = string.match(regexp);
    if (match) {
        return match[1];
    }
    if (errorMessage) {
        throw new Error(errorMessage);
    }
    }

    function decipherChar(startIndex, char) {
        const charIndex = SUBSTITUTION_ALPHABET.indexOf(char);
        if (charIndex !== -1) {
            let index = startIndex + charIndex;
            if (index < 0) {
                index += SUBSTITUTION_ALPHABET.length;
            }
            return SUBSTITUTION_ALPHABET[index];
        }
        return char;
    }

    function getCookie(cE, cK) {
        const swpToken = cE
            .split('')
            .map((c) => decipherChar((cK++ * -1) % SUBSTITUTION_ALPHABET.length, c))
            .join('');
        return `swp_token=${swpToken};path=/;max-age=1800`;
    }

    function getStormwallCookie(body) {
        const cE = extract(body, CE_REGEXP, "could't find cE variable to bypass stormwall");
        const cK = extract(body, CK_REGEXP, "could't find cK variable to bypass stormwall");
        return getCookie(cE, parseInt(cK));
    }

    function isProtectedByStormwall(body) {
        return STORMWALL_DETECTION_REGEXP.test(body);
    }

    function Bypasser(body) {
        return new Promise((resolve, reject) => {
            resolve(getStormwallCookie(body));
        });
    }

    return function bypass(proxy, uagent, callback) {
        request({
            method: "GET",
            url: storm.target,
            gzip: true,
            proxy: proxy,
            followAllRedirects: true,
            headers: {
                'Connection': 'keep-alive',
                'Cache-Control': 'max-age=0',
                'Upgrade-Insecure-Requests': 1,
                'User-Agent': uagent,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        }, (err, res, body) => {
            if (err || !res || !body || body.indexOf('const cN = ') == -1) {
                if (body && body.indexOf('Your browser cannot be verified automatically, please confirm you are not a robot.') !== -1) {
                    return console.log('[stormwall] Captcha received, IP reputation died.');
                }
                return false;
            }
            Bypasser(body).then(cookie => {
                request({
                    method: "GET",
                    url: storm.target,
                    gzip: true,
                    proxy: proxy,
                    followAllRedirects: true,
                    headers: {
                        'Connection': 'keep-alive',
                        'Cache-Control': 'max-age=0',
                        'Upgrade-Insecure-Requests': 1,
                        'User-Agent': uagent,
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Accept-Language': 'en-US,en;q=0.5',
                        "Cookie": cookie
                    }
                }, (err, res, body) => {
                    if (err || !res) {
                        return false;
                    }
                    callback(cookie);
                })
            });
        });
    }
}