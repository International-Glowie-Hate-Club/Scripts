const request = require('request');
const fs = require('fs');

function send(zombieIP, callback) {
    var options = {
	timeout: 80000,
        uri: 'http://' + zombieIP + ':8191/v1',
        headers: {
            "content-type": "application/json"
        },
        method: 'POST',
        json: { "cmd": "request.get", "url": "https://forum.nopixie.xyz/", "maxTimeout": 60000 }
        // json: { "cmd": "request.get", "url": ""+targetIP+"", proxy: {"url": `http://${proxyIP}`}, "maxTimeout": 30000 }
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200 && body) {
            var status = body.status;

            if (status == "ok") {
                var cok = body.solution.cookies;
    
                cok.forEach((value) => {
                    if(value.name=="__cf_bm"){
                        callback(1)
                        return
                    }else{
                        callback(0)
                        return
                    }
                    // const valueString = value.name + "=" + value.value + ";";
                    // StringCookie += valueString;
                });
                // return 1
            } else {
                return 0
            }
        } else {
            return 0
        }
    });
}

var filess = process.argv[2];
require('fs').readFileSync(filess, 'utf-8').split(/\r?\n/).forEach(function(line){
    try {
        send(line, function (results) {
            if (results == 1) {
                fs.appendFile('Captchas.txt', line + ":8191\n", err => {
                    if (err) {
                        console.error(err)
                        return
                    }

                    console.log(line + ":8191")
                })
            }
        });
    } catch (e) { }
})