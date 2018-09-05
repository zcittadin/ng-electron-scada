const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const SerialPort = require('serialport');
const ModbusMaster = require('modbus-rtu').ModbusMaster;

let win;
let serialport;
let master;
let portList = [];

function createWindow() {
  mainWindow = new BrowserWindow({ width: 1000, height: 800, show: false });
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'ng-electron-scada/index.html'),
      protocol: 'file:',
      slashes: true
    })
  );
  mainWindow.maximize();
  mainWindow.setMenu(null);
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    win = null;
  });
}

ipcMain.on('readModbus', function() {
  // ID, start, lenght
  master.readHoldingRegisters(1, 0, 2).then(
    data => {
      mainWindow.webContents.send('valueReceived', data);
    },
    err => {
      console.log(err);
    }
  );
});

ipcMain.on('mainWindowLoaded', function() {
  SerialPort.list(function(err, ports) {
    mainWindow.webContents.send('detectedPorts', ports);
    portList = ports;
    serialPort = new SerialPort(portList[0].comName, {
      baudRate: 9600
    });
    master = new ModbusMaster(serialPort);
  });
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
