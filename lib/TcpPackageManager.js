var Future = require('fibers/future');
var Fiber = require('fibers');

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
    self._cache = {};
    self._packages = {};
    self._socket = socket;
    self._tcpProtocol = new TcpProtocol(TcpProtocol.TYPE.REQUEST);

    self._socket.on('data', function (data) {
        Fiber(function () {
            var result;

            result = self._tcpProtocol.unserialize(data);
            while (result.valid) {
                if (self._packages.hasOwnProperty(result.id)) {
                    clearTimeout(self._packages[result.id].timeout);
                    self._packages[result.id].callback(null, result.data);
                    delete self._packages[result.id];
                }
                result = self._tcpProtocol.unserialize();
            }
        }).run();
    });

    self._socket.on('close', function () {
        var key;

        for (key in self._packages) {
            if (self._packages.hasOwnProperty(key)) {
                clearTimeout(self._packages[key].timeout);
            }
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
 * @param {int}    code
 * @param {Buffer} requestData
 * @param          responseHandler
 * @param {object} options
 * @param          callback
 *
 * @returns {null|object}
 */
TcpPackageManager.prototype.asyncSend = function (code, requestData, responseHandler, options, callback) {
    var self, id;

    self = this;
    id = self.getNextPackageId();

    if (options === undefined || options === null) {
        options = {};
    }

    if (!options.hasOwnProperty('prior')) {
        options.prior = false;
    }
    if (!options.hasOwnProperty('cache')) {
        options.cache = false;
    }

    if (options.cache && self._cache.hasOwnProperty(code)) {
        callback(null, responseHandler ? responseHandler(self._cache[code]) : null);
    }
    self._packages[id] = {
        callback: function (error, data) {
            if (error) {
                callback(error);
            }
            if (options.cache) {
                self._cache[code] = data;
            }
            callback(null, responseHandler ? responseHandler(data) : null);
        },
        timeout : setTimeout(function () {
            callback('Package timeout reach (#' + id + '/' + code + ')');
            delete self._packages[id];
        }, 5000)
    };

    self._socket.write(this._tcpProtocol.serialize(id, code, requestData, options.prior));
};

/**
 * Send package via socket
 *
 * @param {int}    code
 * @param {Buffer} requestData
 * @param          responseHandler
 * @param {object} options
 *
 * @returns {null|object}
 */
TcpPackageManager.prototype.syncSend = function (code, requestData, responseHandler, options) {
    var self, future;

    self = this;
    future = new Future();
    self.asyncSend(code, requestData, responseHandler, options, function (error, data) {
        if (error) {
            future.throw(error);
        } else {
            future.return(data);
        }
    });

    return future.wait();
};


/**
 * Send package via socket
 *
 * @param {int}    code
 * @param {Buffer} requestData
 * @param          responseHandler
 * @param {object} [options]
 * @param          [callback]
 *
 * @returns {null|object}
 */
TcpPackageManager.prototype.send = function (code, requestData, responseHandler, options, callback) {
    if (!callback) {
        return this.syncSend(code, requestData, responseHandler, options);
    }

    this.asyncSend(code, requestData, responseHandler, options, callback);
};

module.exports = TcpPackageManager;