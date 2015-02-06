var Util = require('util');
var EventEmitter = require('events').EventEmitter;
var Net = require('net');
var Fiber = require('fibers');
var TcpPackageManager = require('./TcpPackageManager');

/**
 *
 * @param {int} port
 * @param {boolean} [log=false]
 * @constructor
 */
function TcpServer(port, log) {
    var self;

    self = this;

    function logMsg(msg) {
        if (log) {
            console.log(msg);
        }
    }

    this._devices = {};
    this.server = Net.createServer(function (socket) {
        Fiber(function () {
            var packageManager, address, key;

            logMsg('SERVER: Client connecting...');

            packageManager = new TcpPackageManager(socket);

            address = socket.address();
            key = address.address + ':' + address.port;

            if (!self._devices.hasOwnProperty(key)) {
                self._devices[key] = new Device();
                self.emit('register', key);
            }

            self._devices[key].connect(packageManager);

            socket.on('close', function () {
                self._devices[key].disconnect();
                logMsg('SERVER: Client disconnected');
            });

            logMsg('SERVER: Client connected');
        }).run();
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
 * Get device by name
 *
 * @param {string} key
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
 * Check is server has named device
 *
 * @param {string} key
 * @returns {*|boolean}
 */
TcpServer.prototype.hasDevice = function (key) {
    return this._devices.hasOwnProperty(key);
};

module.exports = TcpServer;