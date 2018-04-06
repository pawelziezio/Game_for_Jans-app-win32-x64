const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;

let win;

function createWindow(){
    win = new BrowserWindow({with:1000, height:800});
    win.loadURL(`file://${__dirname}/index.html`)
}

app.on('ready', createWindow);