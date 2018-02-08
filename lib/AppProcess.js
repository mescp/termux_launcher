const {spawn, execSync} = require('child_process');
const fs = require('fs');
const EventEmitter = require('events');

class AppProcess extends EventEmitter {
    constructor(config) {
        super(config);
    }

    appexec(appname) {
        var app = global.appList.find(function (item) {
            return appname == item.name;
        });

        if (!app) return;

        if (app.state && (app.state == 'error' || app.state.endsWith('runing'))) {
            return this.appkill(app);
        }

        this.appspawn(app);
    };


    running(app) {

        // try {
        //     var arg = `pgrep --count -f ${app.grep} `;
        //     var stdout = execSync(arg);
        //     return stdout.toString().split('\n')[0] > 1; // pgrep -f 参数总会找到自己
        // } catch (err) {
        //     return false;
        // }

        try {
            var arg = `ps | grep ${app.grep} | grep -v grep `;
            execSync(arg);
            return true;
        } catch (err) {
            return false;
        }
    }

    appkill(app) {
        try {
            execSync(`pgrep -f ${app.grep} | xargs kill `);
        } catch (ex) {
            fs.appendFile(`./logs/${app.name}_err.log`, ex.message, () => {
            });
        }
        app.state = 'quit';
        this.emit('state', app);
    }

    appspawn(app) {

        var args = app.args ? app.args.split(' ') : [];
        var cwd = app.cwd || "";
        const ps = spawn(app.command, args,
            {
                cwd: cwd,
            });

        app.pid = ps.pid;
        app.state = 'runing';
        this.emit('state', app);

        ps.stdout.on('data', (data) => {
            fs.appendFile(`./logs/${app.name}_info.log`, data, () => {
            });
        });

        ps.stderr.on('data', (data) => {
            fs.appendFile(`./logs/${app.name}_stderr.log`, data, () => {
            });
            app.state = '!runing';
            this.emit('state', app);
        });

        ps.on('error', (err) => {
            fs.appendFile(`./logs/${app.name}_error.log`, err, () => {
            });
            app.state = 'error';
            this.emit('state', app);
        });

        ps.on('close', (code) => {
            fs.appendFile(`./logs/${app.name}_info.log`, `close code ${code}`, () => {
            });
            if (code !== 0) {
                app.state = 'close';
                this.emit('state', app);
            }
        });

    }
}

module.exports = AppProcess;
