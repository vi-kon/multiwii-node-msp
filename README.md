# MultiWii Serial Protocol

This package is for [MultiWii](http://www.multiwii.com/) multicopters to communicate with [MSP protocol](multiwii.com/wiki/index.php?title=Multiwii_Serial_Protocol) over TCP/IP protocol. The package contains two public object the `TcpClient` and `TcpServer`.

## Features

* Communication over **TCP protocol**
* Support **async** and **sync** command calls
* **Command queue** on client side
* **Priority command** (comming)

## Installation

Simply use npm with the following command:

`npm install multiwii-msp`

## Usage

### Server

The server can listen for multiple client connection. After first successful connection new `Device` instance is created. During connection server polling client for actual data (`status`, `rawImu`, `rc`, `rawGps`, `compGps`, `attitude`, `altitude` and `analog`). The polling interval is continous.

**Note**: Device can handle maximum 255 commands simultaneously.

**Sample code**

```javascript
var TcpServer = require('multiwii-msp').TcpServer;

// Create new TCP server on 3002 port and enable logging
var server = new TcpServer(3002, true);

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

#### Device

Device instance describe each MultiWii board. It has multiple methods that represent commands. For example `ident` command:

```javascript
// Synchronous way
var ident = device.ident();
// Do something with ident

// or

// Asynchronous way
device.ident(function (error, ident) {
    // Do something with ident
});
```



### Client

The client try connect to server. After connection is established, then client is waiting for data over TCP and send response, what received from MultiWii via serial port. If connection is lost then client try to reconnect to server.

```javascript
var TcpClient = require('multiwii-msp').TcpClient;

// Create new client to connect to server via 192.168.0.1:3002 port,
// connect to serial pot via /dev/ttyAMA0 with 115200 baud rate and
// enable logging
var client = new TcpClient('192.168.0.1', 3002, '/dev/ttyAMA0', 115200, true);
```

## Public api

The library api documentation should be something like this.

### TcpServer

Tcp server inherits from node's [EventEmitter](http://nodejs.org/api/events.html#events_class_events_eventemitter).

#### Methods

##### TcpServer

This is object's constructor.

**Parameters**

Type      | Parameter | Description
----------|-----------|------------------------------
`int`     | `port`    | Port number to listen
`boolean` | `log`     | Console log is enabled or not

**Example**

```javascript
var server = new TcpServer(3002, true);
```

##### getDevice

Get device by key

**Paramters**

Type     | Parameter | Description
---------|-----------|------------------------------
`string` | `key`     | Device key

**Returns**

Returns `null` if device not found otherwise `Device`.

**Example**

```javascript
var device = server.getDevice('192.168.1.1:3005');
```

##### hasDevice

Check if device exists with key

**Paramters**

Type     | Parameter | Description
---------|-----------|------------------------------
`string` | `key`     | Device key

**Returns**

Returns  `true` if device with key exists, otherwise `false`. 

**Example**

```javascript
var exists = server.hasDevice('192.168.1.1:3005');
```

##### listDevices

List all devices registered by server.

**Returns**

Returns  `object` with `key`-`Device` pairs.

**Example**

```javascript
var devices = server.listDevices();

devices[key].ident(); // if device exists with "key"
```

#### Events

##### register

The register event fires when new client first time connected. It means if client reconnecting then this event not fires.

**Event parameters**

Type     | Parameter | Description
-------- |-----------|-------------------------------------------
`string` | `key`     | Newly connected device identifier
`Device` | `device`  | Device instance for newly connected device

**Example**

```javascript
server.on('register', function (key, device) {
    // Do something
}
```

### TcpClient

### Device

## License

This package is licensed under the MIT License