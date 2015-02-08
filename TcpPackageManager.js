var deasync = require('deasync');

var TcpProtocol = require('./TcpProtocol');

/**
 *
 * @param {Socket} socket
 * @constructor
 */
function TcpPackageManager(socket) {
    var self;

    self = this;
    self._lastId = 0;
    self._packages = {};
    self._socket = socket;
    self._tcpProtocol = new TcpProtocol(TcpProtocol.type.REQUEST);

    self._socket.on('data', function (data) {
        var result;

        result = self._tcpProtocol.unserialize(data);

        if (result.valid && self._packages.hasOwnProperty(result.id)) {
            clearTimeout(self._packages[result.id].timeout);
            self._packages[result.id].callback(null, result.data);
            delete self._packages[result.id];
        }
    });
}

/**
 * Get next package identifier
 *
 * @returns {int}
 */
TcpPackageManager.prototype.getNextPackageId = function () {
    var i;

    i = this._lastId;
    do {
        i = i === 255 ? 0 : i + 1;
        if (!this._packages.hasOwnProperty(i)) {
            this.lastId = i;
            break;
        }
    } while (i !== this.lastId);

    this._lastId = i;

    return this._lastId;
};

/**
 * Send package via socket
 *
 * @param {int} code
 * @param {Buffer} data
 * @param dataCallback
 * @param [callback]
 *
 * @throws sending error (if no callback provided)
 *
 * @returns {null|object}
 */
TcpPackageManager.prototype.aSyncSend = function (code, data, dataCallback, callback) {
    var self, id;

    self = this;
    id = self.getNextPackageId();

    self._packages[id] = {
        callback: function (error, data) {
            if (error) {
                callback(error);
            }
            callback(null, dataCallback ? dataCallback(data) : null);
        },
        timeout : setTimeout(function () {
            callback('Package timeout reach (#' + id + '/' + code + ')');
            delete self._packages[id];
        }, 5000)
    };

    self._socket.write(this._tcpProtocol.serialize(id, code, data));
};

TcpPackageManager.prototype.syncSend = function (code, data, dataCallback) {
    var self;

    self = this;
    return deasync(function (code, data, dataCallback, callback) {
        self.aSyncSend(code, data, dataCallback, callback);
    })(code, data, dataCallback);
};

TcpPackageManager.prototype.send = function (code, data, dataCallback, callback) {
    if (!callback) {
        return this.syncSend(code, data, dataCallback);
    }

    this.aSyncSend(code, data, dataCallback, callback);
};

module.exports = TcpPackageManager;