var SerialPort = require('serialport').SerialPort;
var Socket = require('net').Socket;

var TcpProtocol = require('TcpProtocol');
var MspProtocol = require('MspProtocol');

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
        logMsg('Reconnecting...');
        tp.connect(tcpPort, tcpHost, function () {
            logMsg('Reconnected');
        });
    });

    tp.on('error', function (error) {
        logMsg('Error: ' + error);
    });

    logMsg('Connecting...');
    tp.connect(tcpPort, tcpHost, function () {
        sp.on('data', function (data) {
            var result;
            result = spProtocol.unserialize(data);
            if (result.valid) {
                clearTimeout(processTimeout);
                tp.write(tpProtocol.serialize(current.id, result.code, result.data));
                processQueue();
            }
        });
        logMsg('TCP: Connected');
    });

    tp.on('data', function (data) {
        var result;
        logMsg('TCP: Received ', data);
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
    console.log('SP: Connected');
}

module.exports = TcpClient;