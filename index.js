var blessed = require('blessed'),
    screen;
var config = require('./config');
var AppProcess = require('./lib/AppProcess.js');

global.appList = config.appList;

screen = blessed.screen({
    smartCSR: true,
    fullUnicode: true,
    warnings: true,
    title: "termux_launcher"
});

var table = blessed.listtable({
    top: 'center',
    left: 'center',
    data: null,
    border: 'line',
    align: 'center',
    tags: true,
    keys: true,
    width: '90%',
    height: '90%',
    vi: true,
    pad: '#',
    style: {
        border: {
            fg: 'blue'
        },
        header: {
            fg: 'blue',
            bold: true
        },
        cell: {
            fg: 'green',
            selected: {
                bg: 'blue'
            }
        }
    }
});

var appprocess = new AppProcess();
appprocess.on('state', function (app) {
    updateTable();
    screen.render();
});

table.on('select', function (iteminfo) {
    var appname = iteminfo.getText().trim().split(' ')[0];
    appprocess.appexec(appname)
});

table.on('mouse', function (data) {
    if (data.action === 'wheelup') {
        this.up(1);
        screen.render();
    } else if (data.action === 'wheeldown') {
        this.down(1);
        screen.render();
    }
});

table.focus();
updateTable(true);
screen.append(table);
screen.render();

screen.key(['q','C-c'], function (ch, key) {
    return process.exit(0);
});

function updateTable(init) {
    var index = table.selected;
    var appdata = Object.assign([], config.appTitle);
    global.appList.forEach(function (app) {
        if (init && appprocess.running(app)) {
            app['state'] = "runing";
        }
        appdata.push([app.name, app['state'] || '-']);
    });
    table.setData(appdata);
    table.select(index);
}