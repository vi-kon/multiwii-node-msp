var Util = require('util');
var EventEmitter = require('events').EventEmitter;
var Net = require('net');

var TcpPackageManager = require('./TcpPackageManager');
var Device = require('./Device');

/**
 *
 * @param {int} port
 * @param {boolean} [log=false]
 * @constructor
 */
function TcpServer(port, log) {
    var self;

    self = this;

    function logMsg() {
        if (log) {
            console.log.apply(this, arguments);
        }
    }

    this._devices = {};
    this.server = Net.createServer(function (socket) {
        var packageManager, address, key;

        logMsg('SERVER: Client connecting...');

        packageManager = new TcpPackageManager(socket);

        address = socket.address();
        key = address.address + ':' + address.port;

        if (!self._devices.hasOwnProperty(key)) {
            self._devices[key] = new Device();
            /**
             * Register event
             *
             * Fires on first device connection
             *
             * @event TcpServer#register
             * @property {string} key - registered device key
             * @property {Device} device - device object
             */
            self.emit('register', key, self._devices[key]);
        }

        self._devices[key].connect(packageManager);

        socket.on('close', function () {
            self._devices[key].disconnect();
            logMsg('SERVER: Client disconnected');
        });

        logMsg('SERVER: Client connected');
    });

    this.server.on('error', function (error) {
        logMsg('SERVER: ' + error);
    });

    this.server.listen(port, function () {
        logMsg('SERVER: Server listening...');
    });
}

Util.inherits(TcpServer, EventEmitter);

/**
 *
 * Get device by key
 *
 * @param {string} key - device key
 * @returns {null|Device}
 */
TcpServer.prototype.getDevice = function (key) {
    if (this._devices.hasOwnProperty(key)) {
        return this._devices[key];
    }

    return null;
};

/**
 *
 * Check is server has device at key
 *
 * @param {string} key
 * @returns {*|boolean}
 */
TcpServer.prototype.hasDevice = function (key) {
    return this._devices.hasOwnProperty(key);
};

/**
 *
 * Get list of devices
 *
 * @returns {object} - object with key-object pairs
 */
TcpServer.prototype.listDevices = function () {
    return this._devices;
};

module.exports = TcpServer;