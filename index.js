/**
 * This package is for MultiWii multicopters to communicate with MSP protocol over TCP/IP protocol. The package
 * contains two public object the TcpClient and TcpServer.
 *
 * @module multiwii-msp
 */

var TcpServer = require('./TcpServer');
var TcpClient = require('./TcpClient');

module.exports = {
    TcpServer: TcpServer,
    TcpClient: TcpClient
};