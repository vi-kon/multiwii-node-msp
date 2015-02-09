var SerialPort = require('serialport').SerialPort;
var Socket = require('net').Socket;

var TcpProtocol = require('./TcpProtocol');
var MspProtocol = require('./MspProtocol');

/**
 *
 * @param {string} tcpHost
 * @param {int} tcpPort
 * @param {string} serialPort
 * @param {int} serialBaudRate
 * @param {boolean} [log=false]
 * @constructor
 */
function TcpClient(tcpHost, tcpPort, serialPort, serialBaudRate, log) {
    var tp, sp, tpProtocol, spProtocol, priorQueue, defaultQueue, current, processing, processTimeout;

    function logMsg() {
        if (log) {
            console.log.apply(this, arguments);
        }
    }

    function processQueue() {
        current = priorQueue.shift();
        if (!current) {
            current = defaultQueue.shift();
        }
        if (!current) {
            processing = false;
            return;
        }
        logMsg('CLIENT: Sp write data', current.id);
        sp.write(spProtocol.serialize(current.code, current.data));

        processTimeout = setTimeout(function () {
            logMsg('CLIENT: Timeout reached', current.id);
            processQueue();
        }, 1000);
    }

    priorQueue = [];
    defaultQueue = [];

    tp = new Socket();
    tpProtocol = new TcpProtocol();

    sp = new SerialPort(serialPort, {baudRate: serialBaudRate});
    spProtocol = new MspProtocol();

    tp.on('close', function () {
        logMsg('CLIENT: Tcp reconnecting...');
        tp.connect(tcpPort, tcpHost, function () {
            logMsg('CLIENT: Tcp reconnected');
        });
    });

    tp.on('error', function (error) {
        logMsg('CLIENT: Tcp error: ' + error);
    });

    logMsg('CLIENT: Tcp connecting...');
    tp.connect(tcpPort, tcpHost, function () {
        sp.on('data', function (data) {
            var result;

            logMsg('CLIENT: Sp data received ', data);

            result = spProtocol.unserialize(data);
            while (result.valid) {
                logMsg('CLIENT: Sp package unserialized', current.id, result.code);

                clearTimeout(processTimeout);
                tp.write(tpProtocol.serialize(current.id, result.code, result.data));
                processQueue();

                result = spProtocol.unserialize();
            }
        });
        logMsg('CLIENT: Tcp connected');
    });

    tp.on('data', function (data) {
        var result, item;

        logMsg('CLIENT: Tcp data received ', data);

        result = tpProtocol.unserialize(data);
        while (result.valid) {
            logMsg('CLIENT: Tcp package unserialized', result.id, result.code);

            item = {
                id  : result.id,
                code: result.code,
                data: result.data
            };
            if (result.prior) {
                priorQueue.push(item);
            } else {
                defaultQueue.push(item);
            }
            if (!processing) {
                processing = true;
                processQueue();
            }

            result = tpProtocol.unserialize();
        }
    });
    logMsg('CLIENT: Sp connected');
}

module.exports = TcpClient;