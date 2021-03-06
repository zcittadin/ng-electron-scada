const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const SerialPort = require('serialport');
const ModbusMaster = require('modbus-rtu').ModbusMaster;
const LogService = require('./log-service');

let win;
let serialport;
let master;
let modbusInterval;

let knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, '../DB/', 'ng-electron-scada.db')
  },
  useNullAsDefault: true
});

const logService = new LogService(knex);

function createWindow() {
  mainWindow = new BrowserWindow({ width: 1000, height: 800, show: false });
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'ng-electron-scada/index.html'),
      protocol: 'file:',
      slashes: true
    })
  );
  mainWindow.webContents.openDevTools();
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
  console.log(serialport);
  if(serialport === undefined) {
    serialPort = new SerialPort(port, {
      baudRate: 9600
    });
    master = new ModbusMaster(serialPort);
  }
});

ipcMain.on('readModbus', function() {
  modbusInterval = setInterval(() => {
    // ID, start, lenght
    master.readHoldingRegisters(1, 0, 1).then(
      data => {
        let now = new Date();
        let dataHorario =
          now.getFullYear() +
          '-' +
          (now.getMonth() + 1) +
          '-' +
          now.getDate() +
          ' ' +
          (now.getHours() < 10 ? '0' + now.getHours() : now.getHours()) +
          ':' +
          now.getMinutes() +
          ':' +
          now.getSeconds();
        let obj = {
          dataHorario: dataHorario,
          valor: data[0]
        };
        mainWindow.webContents.send('valueReceived', obj);
        logService
          .insertLog({
            data_hora: dataHorario,
            value: data[0]
          })
          .then(
            data => {
              console.log(data);
            },
            error => {
              console.log(error);
            }
          );
      },
      err => {
        console.log(err);
      }
    );
  }, 5000);
});

ipcMain.on('stopModbus', function () {
  clearInterval(modbusInterval);
  modbusInterval = null;
});

ipcMain.on('mainWindowLoaded', function() {
  SerialPort.list().then(ports => {
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
