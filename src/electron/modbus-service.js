const SerialPort = require('serialport');

let portList = [];
module.exports = function ModbusService() {
  this.listPorts = function() {
    return SerialPort.list();
  };
};
