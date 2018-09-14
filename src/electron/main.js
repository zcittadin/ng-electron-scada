const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const SerialPort = require('serialport');
const ModbusMaster = require('modbus-rtu').ModbusMaster;
const ModbusService = require('./modbus-service');

let win;
let serialport;
let master;
let modbusInterval;
let modbusService = new ModbusService();

function createWindow() {
  mainWindow = new BrowserWindow({ width: 1000, height: 800, show: false });
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'ng-electron-scada/index.html'),
      protocol: 'file:',
      slashes: true
    })
  );
  //mainWindow.webContents.openDevTools();
  mainWindow.maximize();
  mainWindow.setMenu(null);
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  mainWindow.on('closed', () => {
    win = null;
  });
}

ipcMain.on('connectModbus', function(evt, port) {
  serialPort = new SerialPort(port, {
    baudRate: 9600
  });
  master = new ModbusMaster(serialPort);
});

ipcMain.on('readModbus', function() {
  modbusInterval = setInterval(() => {
    master.readHoldingRegisters(1, 0, 1).then(
      data => {
        // ID, start, lenght
        mainWindow.webContents.send('valueReceived', data);
      },
      err => {
        console.log(err);
      }
    );
  }, 100);
});

ipcMain.on('mainWindowLoaded', function() {
  modbusService.listPorts().then(ports => {
    mainWindow.webContents.send('detectedPorts', ports);
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
