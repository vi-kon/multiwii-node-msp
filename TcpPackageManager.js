var Future = require('fibers/future');

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
 * @param onDataCallback
 * @param [callback]
 *
 * @throws sending error (if no callback provided)
 *
 * @returns {null|object}
 */
TcpPackageManager.prototype.send = function (code, data, onDataCallback, callback) {
    var self, id, future;

    self = this;
    id = self.getNextPackageId();
    future = new Future();
    self._packages[id] = {
        callback: function (error, data) {
            data = onDataCallback ? onDataCallback(data) : null;
            if (callback) {
                callback(null, data);
            } else {
                future.return(data);
            }
        },
        timeout : setTimeout(function () {
            var error;

            error = 'Package timeout reach (#' + id + '/' + code + ')';
            if (callback) {
                callback(error);
            } else {
                future.throw(error);
            }
            delete self._packages[id];
        }, 5000)
    };

    self._socket.write(this._tcpProtocol.serialize(id, code, data));

    if (!callback) {
        return future.wait();
    }

    return null;
};

module.exports = TcpPackageManager;