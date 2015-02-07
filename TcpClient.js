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
    var tp, sp, tpProtocol, spProtocol, queue, current, processing, processTimeout;

    function logMsg(msg) {
        if (log) {
            console.log(msg);
        }
    }

    function processQueue() {
        current = queue.shift();
        if (!current) {
            processing = false;
            return;
        }
        sp.write(spProtocol.serialize(current.code, current.data));

        processTimeout = setTimeout(function () {
            processQueue();
        }, 1000);
    }

    queue = [];

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
            if (result.valid) {
                clearTimeout(processTimeout);
                tp.write(tpProtocol.serialize(current.id, result.code, result.data));
                processQueue();
            }
        });
        logMsg('CLIENT: Tcp connected');
    });

    tp.on('data', function (data) {
        var result;

        logMsg('CLIENT: Tcp data received ', data);

        result = tpProtocol.unserialize(data);
        if (result.valid) {
            queue.push({
                           id  : result.id,
                           code: result.code,
                           data: result.data
                       });
            if (!processing) {
                processing = true;
                processQueue();
            }
        }
    });
    logMsg('CLIENT: Sp connected');
}

module.exports = TcpClient;