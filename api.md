#Index

**Classes**

* [class: Device](#Device)
  * [device.isConnected()](#Device#isConnected)
  * [device.connect(packageManager)](#Device#connect)
  * [device.disconnect()](#Device#disconnect)
  * [device.ident([options], [callback])](#Device#ident)
  * [device.status([options], [callback])](#Device#status)
  * [device.rawImu([options], [callback])](#Device#rawImu)
  * [device.servo([options], [callback])](#Device#servo)
  * [device.motor([options], [callback])](#Device#motor)
  * [device.rc([options], [callback])](#Device#rc)
  * [device.rawGps([options], [callback])](#Device#rawGps)
  * [device.compGps([options], [callback])](#Device#compGps)
  * [device.attitude([options], [callback])](#Device#attitude)
  * [device.altitude([options], [callback])](#Device#altitude)
  * [device.analog([options], [callback])](#Device#analog)
  * [device.rcTuning([options], [callback])](#Device#rcTuning)
  * [callback: Device~identCallback](#Device..identCallback)
  * [type: Device~identData](#Device..identData)
  * [callback: Device~statusCallback](#Device..statusCallback)
  * [type: Device~statusData](#Device..statusData)
  * [callback: Device~rawImuCallback](#Device..rawImuCallback)
  * [type: Device~rawImuData](#Device..rawImuData)
  * [callback: Device~servoCallback](#Device..servoCallback)
  * [callback: Device~motorCallback](#Device..motorCallback)
  * [callback: Device~rcCallback](#Device..rcCallback)
  * [type: Device~rcData](#Device..rcData)
  * [callback: Device~rawGpsCallback](#Device..rawGpsCallback)
  * [type: Device~rawGpsData](#Device..rawGpsData)
  * [callback: Device~compGpsCallback](#Device..compGpsCallback)
  * [type: Device~compGpsData](#Device..compGpsData)
  * [callback: Device~attitudeCallback](#Device..attitudeCallback)
  * [type: Device~attitudeData](#Device..attitudeData)
  * [callback: Device~altitudeCallback](#Device..altitudeCallback)
  * [type: Device~altitudeData](#Device..altitudeData)
  * [callback: Device~analogCallback](#Device..analogCallback)
  * [type: Device~analogData](#Device..analogData)
  * [callback: Device~rcTuningCallback](#Device..rcTuningCallback)
  * [type: Device~rcTuningData](#Device..rcTuningData)
  * [event: "update"](#Device#event_update)
  * [event: "open"](#Device#event_open)
  * [event: "close"](#Device#event_close)
* [class: MspProtocol](#MspProtocol)
  * [new MspProtocol()](#new_MspProtocol)
  * [mspProtocol.serialize(code, [data])](#MspProtocol#serialize)
  * [mspProtocol.unserialize([data])](#MspProtocol#unserialize)
* [class: TcpClient](#TcpClient)
  * [new TcpClient(tcpHost, tcpPort, serialPort, serialBaudRate, [log])](#new_TcpClient)
* [class: TcpPackageManager](#TcpPackageManager)
  * [new TcpPackageManager(socket)](#new_TcpPackageManager)
  * [tcpPackageManager.getNextPackageId()](#TcpPackageManager#getNextPackageId)
  * [tcpPackageManager.asyncSend(code, requestData, responseHandler, options, callback)](#TcpPackageManager#asyncSend)
  * [tcpPackageManager.syncSend(code, requestData, responseHandler, options)](#TcpPackageManager#syncSend)
  * [tcpPackageManager.send(code, requestData, responseHandler, [options], [callback])](#TcpPackageManager#send)
* [class: TcpProtocol](#TcpProtocol)
  * [new TcpProtocol(type)](#new_TcpProtocol)
  * [tcpProtocol.serialize(id, code, data, [prior])](#TcpProtocol#serialize)
  * [tcpProtocol.unserialize([data])](#TcpProtocol#unserialize)
* [class: TcpServer](#TcpServer)
  * [new TcpServer(port, [log])](#new_TcpServer)
  * [tcpServer.getDevice(key)](#TcpServer#getDevice)
  * [tcpServer.hasDevice(key)](#TcpServer#hasDevice)
  * [tcpServer.listDevices()](#TcpServer#listDevices)
  * [event: "register"](#TcpServer#event_register)
 
<a name="Device"></a>
#class: Device
**Extends**: `EventEmitter`  
**Members**

* [class: Device](#Device)
  * [device.isConnected()](#Device#isConnected)
  * [device.connect(packageManager)](#Device#connect)
  * [device.disconnect()](#Device#disconnect)
  * [device.ident([options], [callback])](#Device#ident)
  * [device.status([options], [callback])](#Device#status)
  * [device.rawImu([options], [callback])](#Device#rawImu)
  * [device.servo([options], [callback])](#Device#servo)
  * [device.motor([options], [callback])](#Device#motor)
  * [device.rc([options], [callback])](#Device#rc)
  * [device.rawGps([options], [callback])](#Device#rawGps)
  * [device.compGps([options], [callback])](#Device#compGps)
  * [device.attitude([options], [callback])](#Device#attitude)
  * [device.altitude([options], [callback])](#Device#altitude)
  * [device.analog([options], [callback])](#Device#analog)
  * [device.rcTuning([options], [callback])](#Device#rcTuning)
  * [callback: Device~identCallback](#Device..identCallback)
  * [type: Device~identData](#Device..identData)
  * [callback: Device~statusCallback](#Device..statusCallback)
  * [type: Device~statusData](#Device..statusData)
  * [callback: Device~rawImuCallback](#Device..rawImuCallback)
  * [type: Device~rawImuData](#Device..rawImuData)
  * [callback: Device~servoCallback](#Device..servoCallback)
  * [callback: Device~motorCallback](#Device..motorCallback)
  * [callback: Device~rcCallback](#Device..rcCallback)
  * [type: Device~rcData](#Device..rcData)
  * [callback: Device~rawGpsCallback](#Device..rawGpsCallback)
  * [type: Device~rawGpsData](#Device..rawGpsData)
  * [callback: Device~compGpsCallback](#Device..compGpsCallback)
  * [type: Device~compGpsData](#Device..compGpsData)
  * [callback: Device~attitudeCallback](#Device..attitudeCallback)
  * [type: Device~attitudeData](#Device..attitudeData)
  * [callback: Device~altitudeCallback](#Device..altitudeCallback)
  * [type: Device~altitudeData](#Device..altitudeData)
  * [callback: Device~analogCallback](#Device..analogCallback)
  * [type: Device~analogData](#Device..analogData)
  * [callback: Device~rcTuningCallback](#Device..rcTuningCallback)
  * [type: Device~rcTuningData](#Device..rcTuningData)
  * [event: "update"](#Device#event_update)
  * [event: "open"](#Device#event_open)
  * [event: "close"](#Device#event_close)

<a name="Device#isConnected"></a>
##device.isConnected()
Check if Device is connected to client

**Returns**: `boolean`  
<a name="Device#connect"></a>
##device.connect(packageManager)
Connect Device to the client

**Params**

- packageManager <code>[TcpPackageManager](#TcpPackageManager)</code> - package manager for current connection  

**Fires**

- [update](#Device#event_update)

<a name="Device#disconnect"></a>
##device.disconnect()
Disconnect from client

**Fires**

- [close](#Device#event_close)

<a name="Device#ident"></a>
##device.ident([options], [callback])
Get device ident

**Params**

- \[options\] `object` - options for request  
- \[callback\] <code>[identCallback](#Device..identCallback)</code> - callback that handles response  

**Returns**: `null` | [identData](#Device..identData) - - if no callback return data, otherwise null  
<a name="Device#status"></a>
##device.status([options], [callback])
Get device actual status

**Params**

- \[options\] `object` - options for request  
- \[callback\] <code>[statusCallback](#Device..statusCallback)</code> - callback that handles response  

**Returns**: `null` | [statusData](#Device..statusData) - - if no callback return data, otherwise null  
<a name="Device#rawImu"></a>
##device.rawImu([options], [callback])
Get device actual status

**Params**

- \[options\] `object` - options for request  
- \[callback\] <code>[rawImuCallback](#Device..rawImuCallback)</code> - callback that handles response  

**Returns**: `null` | [rawImuData](#Device..rawImuData) - - if no callback return data, otherwise null  
<a name="Device#servo"></a>
##device.servo([options], [callback])
Get device servo's status

**Params**

- \[options\] `object` - options for request  
- \[callback\] <code>[servoCallback](#Device..servoCallback)</code> - callback that handles response  

**Returns**: `null` | `Array.<int>` - - if no callback return data, otherwise null  
<a name="Device#motor"></a>
##device.motor([options], [callback])
Get device motor's status

**Params**

- \[options\] `object` - options for request  
- \[callback\] <code>[motorCallback](#Device..motorCallback)</code> - callback that handles response  

**Returns**: `null` | `Array.<int>` - - if no callback return data, otherwise null  
<a name="Device#rc"></a>
##device.rc([options], [callback])
Get device actual rc data

**Params**

- \[options\] `object` - options for request  
- \[callback\] <code>[rcCallback](#Device..rcCallback)</code> - callback that handles response  

**Returns**: `null` | [rcData](#Device..rcData) - - if no callback return data, otherwise null  
<a name="Device#rawGps"></a>
##device.rawGps([options], [callback])
Get device raw gps data

**Params**

- \[options\] `object` - options for request  
- \[callback\] <code>[rawGpsCallback](#Device..rawGpsCallback)</code> - callback that handles response  

**Returns**: `null` | [rawGpsData](#Device..rawGpsData) - - if no callback return data, otherwise null  
<a name="Device#compGps"></a>
##device.compGps([options], [callback])
Get device computed gps data

**Params**

- \[options\] `object` - options for request  
- \[callback\] <code>[compGpsCallback](#Device..compGpsCallback)</code> - callback that handles response  

**Returns**: `null` | [compGpsData](#Device..compGpsData) - - if no callback return data, otherwise null  
<a name="Device#attitude"></a>
##device.attitude([options], [callback])
Get device computed attitude

**Params**

- \[options\] `object` - options for request  
- \[callback\] <code>[attitudeCallback](#Device..attitudeCallback)</code> - callback that handles response  

**Returns**: `null` | [attitudeData](#Device..attitudeData) - - if no callback return data, otherwise null  
<a name="Device#altitude"></a>
##device.altitude([options], [callback])
Get device altitude

**Params**

- \[options\] `object` - options for request  
- \[callback\] <code>[altitudeCallback](#Device..altitudeCallback)</code> - callback that handles response  

**Returns**: `null` | [altitudeData](#Device..altitudeData) - - if no callback return data, otherwise null  
<a name="Device#analog"></a>
##device.analog([options], [callback])
Get device analog data

**Params**

- \[options\] `object` - options for request  
- \[callback\] <code>[analogCallback](#Device..analogCallback)</code> - callback that handles response  

**Returns**: `null` | [analogData](#Device..analogData) - - if no callback return data, otherwise null  
<a name="Device#rcTuning"></a>
##device.rcTuning([options], [callback])
Get device rc tuning

**Params**

- \[options\] `object` - options for request  
- \[callback\] <code>[rcTuningCallback](#Device..rcTuningCallback)</code> - callback that handles response  

**Returns**: `null` | [rcTuningData](#Device..rcTuningData) - - if no callback return data, otherwise null  
<a name="Device..identCallback"></a>
##callback: Device~identCallback
Ident command response callback

**Params**

- error `string` | `null` - error message, or null if no error  
- data <code>[identData](#Device..identData)</code> - response data  

**Scope**: inner typedef of [Device](#Device)  
**Type**: `function`  
<a name="Device..identData"></a>
##type: Device~identData
Ident command response

**Properties**

- version `int` - version of MultiWii  
- multiType `int` - type of multicopter (multitype)  
- mspVersion `int` - MultiWii Serial Protocol version (not used)  
- capability `int` - indicate capability of FC board  

**Scope**: inner typedef of [Device](#Device)  
**Type**: `object`  
<a name="Device..statusCallback"></a>
##callback: Device~statusCallback
Status command response callback

**Params**

- error `string` | `null` - error message, or null if no error  
- data <code>[statusData](#Device..statusData)</code> - response data  

**Scope**: inner typedef of [Device](#Device)  
**Type**: `function`  
<a name="Device..statusData"></a>
##type: Device~statusData
Status command response

**Properties**

- cycleTime `int` - unit: microseconds  
- i2cErrorCount `int`  
- sensorPresent `object` - sensor present  
  - sensorPresent.acc `boolean` - accelerometer present  
  - sensorPresent.baro `boolean` - barometer present  
  - sensorPresent.mag `boolean` - magnetometer present  
  - sensorPresent.gps `boolean` - Gps present  
  - sensorPresent.sonar `boolean` - sonar present  
- boxActivation `Array` - indicates which BOX are activates (index order is depend on boxNames)  
- currentSettingNumber `int` - to indicate the current configuration settings  

**Scope**: inner typedef of [Device](#Device)  
**Type**: `object`  
<a name="Device..rawImuCallback"></a>
##callback: Device~rawImuCallback
Raw imu command response callback

**Params**

- error `string` | `null` - error message, or null if no error  
- data <code>[statusData](#Device..statusData)</code> - response data  

**Scope**: inner typedef of [Device](#Device)  
**Type**: `function`  
<a name="Device..rawImuData"></a>
##type: Device~rawImuData
Raw imu command response

**Properties**

  - gyro.x `int` - X axis position shift  
  - gyro.y `int` - Y axis position shift  
  - gyro.z `int` - Z axis position shift  
  - acc.x `int` - X axis acceleration  
  - acc.y `int` - Y axis acceleration  
  - acc.z `int` - Z axis acceleration  
  - mag.x `int` - X axis  
  - mag.y `int` - Y axis  
  - mag.z `int` - Z axis  

**Scope**: inner typedef of [Device](#Device)  
**Type**: `object`  
<a name="Device..servoCallback"></a>
##callback: Device~servoCallback
Servo command response callback

**Params**

- error `string` | `null` - error message, or null if no error  
- data `Array.<int>` - array of servo status  

**Scope**: inner typedef of [Device](#Device)  
**Type**: `function`  
<a name="Device..motorCallback"></a>
##callback: Device~motorCallback
Motor command response callback

**Params**

- error `string` | `null` - error message, or null if no error  
- data `Array.<int>` - array of motor status  

**Scope**: inner typedef of [Device](#Device)  
**Type**: `function`  
<a name="Device..rcCallback"></a>
##callback: Device~rcCallback
Rc command response callback

**Params**

- error `string` | `null` - error message, or null if no error  
- data <code>[rcData](#Device..rcData)</code> - response data  

**Scope**: inner typedef of [Device](#Device)  
**Type**: `function`  
<a name="Device..rcData"></a>
##type: Device~rcData
Rc command response

**Properties**

- roll `int` - roll stick value, range: [1000-2000]  
- pitch `int` - pitch stick value, range: [1000-2000]  
- yaw `int` - yaw stick value, range: [1000-2000]  
- throttle `int` - throttle stick value, range: [1000-2000]  
- aux1 `int` - aux 1 stick value, range: [1000-2000]  
- aux2 `int` - aux 2 stick value, range: [1000-2000]  
- aux3 `int` - aux 3 stick value, range: [1000-2000]  
- aux4 `int` - aux 4 stick value, range: [1000-2000]  

**Scope**: inner typedef of [Device](#Device)  
**Type**: `object`  
<a name="Device..rawGpsCallback"></a>
##callback: Device~rawGpsCallback
Raw gps command response callback

**Params**

- error `string` | `null` - error message, or null if no error  
- data <code>[rawGpsData](#Device..rawGpsData)</code> - response data  

**Scope**: inner typedef of [Device](#Device)  
**Type**: `function`  
<a name="Device..rawGpsData"></a>
##type: Device~rawGpsData
Raw gps command response

**Properties**

- fix `boolean` - indicate if satellites are locked or not  
- numSat `int` - locked satellites number  
- coord `object` - locked coordinate object  
  - coord.latitude `int` - locked coordinate latitude, unit: degree  
  - coord.longitude `int` - locked coordinate longitude, unit: degree  
  - coord.altitude `int` - locked coordinate altitude, unit: meter  
- speed `int` - unit: cm/s  
- groundCourse `int` - unit: degree  

**Scope**: inner typedef of [Device](#Device)  
**Type**: `object`  
<a name="Device..compGpsCallback"></a>
##callback: Device~compGpsCallback
Computed gps command response callback

**Params**

- error `string` | `null` - error message, or null if no error  
- data <code>[compGpsData](#Device..compGpsData)</code> - response data  

**Scope**: inner typedef of [Device](#Device)  
**Type**: `function`  
<a name="Device..compGpsData"></a>
##type: Device~compGpsData
Computed gps command response

**Properties**

- distanceToHome `int` - unit: meter  
- directionToHome `int` - unit: degree, range: [-180, 180]  
- update `int` - flag to indicate when a new gps frame is received  

**Scope**: inner typedef of [Device](#Device)  
**Type**: `object`  
<a name="Device..attitudeCallback"></a>
##callback: Device~attitudeCallback
Attitude command response callback

**Params**

- error `string` | `null` - error message, or null if no error  
- data <code>[attitudeData](#Device..attitudeData)</code> - response data  

**Scope**: inner typedef of [Device](#Device)  
**Type**: `function`  
<a name="Device..attitudeData"></a>
##type: Device~attitudeData
Attitude command response

**Properties**

- x `int` - unit: degree, range: [-1800, 1800]  
- y `int` - unit: degree, range: [-900, 900]  
- heading `int` - unit: degree, range: [-180, 180]  

**Scope**: inner typedef of [Device](#Device)  
**Type**: `object`  
<a name="Device..altitudeCallback"></a>
##callback: Device~altitudeCallback
Altitude command response callback

**Params**

- error `string` | `null` - error message, or null if no error  
- data <code>[altitudeData](#Device..altitudeData)</code> - response data  

**Scope**: inner typedef of [Device](#Device)  
**Type**: `function`  
<a name="Device..altitudeData"></a>
##type: Device~altitudeData
Altitude command response

**Properties**

- estimated `int` - unit: cm  
- vario `int` - unit: cm/s  

**Scope**: inner typedef of [Device](#Device)  
**Type**: `object`  
<a name="Device..analogCallback"></a>
##callback: Device~analogCallback
Analog command response callback

**Params**

- error `string` | `null` - error message, or null if no error  
- data <code>[analogData](#Device..analogData)</code> - response data  

**Scope**: inner typedef of [Device](#Device)  
**Type**: `function`  
<a name="Device..analogData"></a>
##type: Device~analogData
Analog command response

**Properties**

- vbat `int` - unit: volt  
- intPowerMeterSum `int`  
- rssi `int` - range: [0, 1023]  
- amperage `int`  

**Scope**: inner typedef of [Device](#Device)  
**Type**: `object`  
<a name="Device..rcTuningCallback"></a>
##callback: Device~rcTuningCallback
Rc tuning command response callback

**Params**

- error `string` | `null` - error message, or null if no error  
- data <code>[rcTuningData](#Device..rcTuningData)</code> - response data  

**Scope**: inner typedef of [Device](#Device)  
**Type**: `function`  
<a name="Device..rcTuningData"></a>
##type: Device~rcTuningData
Rc tuning command response

**Properties**

- rcRate `int` - range: [0, 100]  
- rcExpo `int` - range: [0, 100]  
- rollPitchRate `int` - range: [0, 100]  
- yawRate `int` - range: [0, 100]  
- dynThrottlePid `int` - range: [0, 100]  
- throttleMid `int` - range: [0, 100]  
- throttleExpo `int` - range: [0, 100]  

**Scope**: inner typedef of [Device](#Device)  
**Type**: `object`  
<a name="Device#event_update"></a>
##event: "update"
Update event

**Properties**

- time `int` - actual update time in millisecond  
- status <code>[statusData](#Device..statusData)</code>  
- rawImu <code>[rawImuData](#Device..rawImuData)</code>  
- rawGps <code>[rawGpsData](#Device..rawGpsData)</code>  
- compGps <code>[compGpsData](#Device..compGpsData)</code>  
- attitude <code>[attitudeData](#Device..attitudeData)</code>  
- altitude <code>[altitudeData](#Device..altitudeData)</code>  
- analog <code>[analogData](#Device..analogData)</code>  

**Type**: `object`  
<a name="Device#event_open"></a>
##event: "open"
Connection established

<a name="Device#event_close"></a>
##event: "close"
Connection closed

<a name="MspProtocol"></a>
#class: MspProtocol
**Members**

* [class: MspProtocol](#MspProtocol)
  * [new MspProtocol()](#new_MspProtocol)
  * [mspProtocol.serialize(code, [data])](#MspProtocol#serialize)
  * [mspProtocol.unserialize([data])](#MspProtocol#unserialize)

<a name="new_MspProtocol"></a>
##new MspProtocol()
Protocol format0           - $1           - M2           - <!>3           - payload length4           - code5-length    - payload5+length+1  - crc

<a name="MspProtocol#serialize"></a>
##mspProtocol.serialize(code, [data])
**Params**

- code `int` - command code  
- \[data\] `Buffer` | `null` - payload  

**Returns**: `Buffer`  
<a name="MspProtocol#unserialize"></a>
##mspProtocol.unserialize([data])
Buffer from attribute is stored in data arrayMethod unserialize first valid package from data arrayThe valid package bits or invalid bits are removed from data array

**Params**

- \[data\] `Buffer` - input data  

**Returns**: `Object` | `Object`  
<a name="TcpClient"></a>
#class: TcpClient
**Members**

* [class: TcpClient](#TcpClient)
  * [new TcpClient(tcpHost, tcpPort, serialPort, serialBaudRate, [log])](#new_TcpClient)

<a name="new_TcpClient"></a>
##new TcpClient(tcpHost, tcpPort, serialPort, serialBaudRate, [log])
**Params**

- tcpHost `string`  
- tcpPort `int`  
- serialPort `string`  
- serialBaudRate `int`  
- \[log=false\] `boolean`  

<a name="TcpPackageManager"></a>
#class: TcpPackageManager
**Members**

* [class: TcpPackageManager](#TcpPackageManager)
  * [new TcpPackageManager(socket)](#new_TcpPackageManager)
  * [tcpPackageManager.getNextPackageId()](#TcpPackageManager#getNextPackageId)
  * [tcpPackageManager.asyncSend(code, requestData, responseHandler, options, callback)](#TcpPackageManager#asyncSend)
  * [tcpPackageManager.syncSend(code, requestData, responseHandler, options)](#TcpPackageManager#syncSend)
  * [tcpPackageManager.send(code, requestData, responseHandler, [options], [callback])](#TcpPackageManager#send)

<a name="new_TcpPackageManager"></a>
##new TcpPackageManager(socket)
**Params**

- socket `Socket`  

<a name="TcpPackageManager#getNextPackageId"></a>
##tcpPackageManager.getNextPackageId()
Get next package identifier

**Returns**: `int`  
<a name="TcpPackageManager#asyncSend"></a>
##tcpPackageManager.asyncSend(code, requestData, responseHandler, options, callback)
Send package via socket

**Params**

- code `int`  
- requestData `Buffer`  
- responseHandler   
- options `object`  
- callback   

**Returns**: `null` | `object`  
<a name="TcpPackageManager#syncSend"></a>
##tcpPackageManager.syncSend(code, requestData, responseHandler, options)
Send package via socket

**Params**

- code `int`  
- requestData `Buffer`  
- responseHandler   
- options `object`  

**Returns**: `null` | `object`  
<a name="TcpPackageManager#send"></a>
##tcpPackageManager.send(code, requestData, responseHandler, [options], [callback])
Send package via socket

**Params**

- code `int`  
- requestData `Buffer`  
- responseHandler   
- \[options\] `object`  
- \[callback\]   

**Returns**: `null` | `object`  
<a name="TcpProtocol"></a>
#class: TcpProtocol
**Members**

* [class: TcpProtocol](#TcpProtocol)
  * [new TcpProtocol(type)](#new_TcpProtocol)
  * [tcpProtocol.serialize(id, code, data, [prior])](#TcpProtocol#serialize)
  * [tcpProtocol.unserialize([data])](#TcpProtocol#unserialize)

<a name="new_TcpProtocol"></a>
##new TcpProtocol(type)
Device format0           - $1           - M2           - <!>3           - payload length4           - no5           - code6-length    - payload7+length+1  - crc

**Params**

- type `int` - protocol type (request, response)  

<a name="TcpProtocol#serialize"></a>
##tcpProtocol.serialize(id, code, data, [prior])
**Params**

- id `int` - package identifier  
- code `int` - package code  
- data `Buffer` - package payload  
- \[prior=false\] `boolean` - package has priority or not  

**Returns**: `Buffer`  
<a name="TcpProtocol#unserialize"></a>
##tcpProtocol.unserialize([data])
Buffer from attribute is stored in data arrayMethod unserialize first valid package from data arrayThe valid package bits or invalid bits are removed from data array

**Params**

- \[data\] `Buffer`  

**Returns**: `Object` | `Object`  
<a name="TcpServer"></a>
#class: TcpServer
**Members**

* [class: TcpServer](#TcpServer)
  * [new TcpServer(port, [log])](#new_TcpServer)
  * [tcpServer.getDevice(key)](#TcpServer#getDevice)
  * [tcpServer.hasDevice(key)](#TcpServer#hasDevice)
  * [tcpServer.listDevices()](#TcpServer#listDevices)
  * [event: "register"](#TcpServer#event_register)

<a name="new_TcpServer"></a>
##new TcpServer(port, [log])
**Params**

- port `int` - port to listen  
- \[log=false\] `boolean` - if TRUE enable logging  

<a name="TcpServer#getDevice"></a>
##tcpServer.getDevice(key)
Get device by key

**Params**

- key `string` - device key  

**Returns**: `null` | [Device](#Device)  
<a name="TcpServer#hasDevice"></a>
##tcpServer.hasDevice(key)
Check is server has device at key

**Params**

- key `string`  

**Returns**: `boolean`  
<a name="TcpServer#listDevices"></a>
##tcpServer.listDevices()
Get list of devices

**Returns**: `object` - - object with key-object pairs  
<a name="TcpServer#event_register"></a>
##event: "register"
Register eventFires on first device connection

**Properties**

- key `string` - registered device key  
- device <code>[Device](#Device)</code> - device object  

