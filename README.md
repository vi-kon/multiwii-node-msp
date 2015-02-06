# MultiWii Serial Protocol

This package is for [MultiWii](http://www.multiwii.com/) multicopters to communicate with [MSP protocol](multiwii.com/wiki/index.php?title=Multiwii_Serial_Protocol) over TCP/IP protocol. The package contains two public object the `TcpClient` and `TcpServer`.

## Installation

Simply use npm with the following command:

`npm install multiwii-msp`

## Usage

### Server

The server can listen for multiple client connection. After first successful connection new `Device` instance is created. During connection server polling client for actual data (`status`, `rawImu`, `rc`, `rawGps`, `compGps`, `attitude`, `altitude` and `analog`). The polling interval is **one** second.

**Note**: Device can handle maximum 255 connection simultaneously.

**Sample code**

```javascript
var server;

// Create new TCP server on 3002 port and enable logging
server = new TcpServer(3002, true);

// Register device's first connection
server.on('register', function (key, device) {
    
    // Register device's open event
    device.on('open', function () {
        // Do something
    });
    
    // Register device's update event
    device.on('update', function (data) {
        // Do something
    });
    
    // Register device's close event
    device.on('close', function () {
        // Do something
    });
});
```

### Client

The client try connect to server. After connection is established, then client is waiting for data over TCP and send response, what received from MultiWii via serial port. If connection is lost then client try to reconnect to server.

## License

This package is licensed under the MIT License