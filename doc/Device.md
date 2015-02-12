<a name="Device"></a>
## class: Device ⇐ <code>EventEmitter</code>
**Extends:** <code>EventEmitter</code>  

* [class: Device](#Device) ⇐ <code>EventEmitter</code>
  * _instance_
    * [.isConnected()](#Device#isConnected) ⇒ <code>boolean</code>
    * [.connect(packageManager)](#Device#connect)
    * [.disconnect()](#Device#disconnect)
    * [.ident([options], [callback])](#Device#ident) ⇒ <code>null</code> \| <code>[identData](#Device..identData)</code>
    * [.status([options], [callback])](#Device#status) ⇒ <code>null</code> \| <code>[statusData](#Device..statusData)</code>
    * [.rawImu([options], [callback])](#Device#rawImu) ⇒ <code>null</code> \| <code>[rawImuData](#Device..rawImuData)</code>
    * [.servo([options], [callback])](#Device#servo) ⇒ <code>null</code> \| <code>Array.&lt;int&gt;</code>
    * [.motor([options], [callback])](#Device#motor) ⇒ <code>null</code> \| <code>Array.&lt;int&gt;</code>
    * [.rc([options], [callback])](#Device#rc) ⇒ <code>null</code> \| <code>[rcData](#Device..rcData)</code>
    * [.rawGps([options], [callback])](#Device#rawGps) ⇒ <code>null</code> \| <code>[rawGpsData](#Device..rawGpsData)</code>
    * [.compGps([options], [callback])](#Device#compGps) ⇒ <code>null</code> \| <code>[compGpsData](#Device..compGpsData)</code>
    * [.attitude([options], [callback])](#Device#attitude) ⇒ <code>null</code> \| <code>[attitudeData](#Device..attitudeData)</code>
  * _inner_
    * [callback: ~identCallback](#Device..identCallback) → <code>function</code>
    * [type: ~identData](#Device..identData) → <code>object</code>
    * [callback: ~statusCallback](#Device..statusCallback) → <code>function</code>
    * [type: ~statusData](#Device..statusData) → <code>object</code>
    * [callback: ~rawImuCallback](#Device..rawImuCallback) → <code>function</code>
    * [type: ~rawImuData](#Device..rawImuData) → <code>object</code>
    * [callback: ~servoCallback](#Device..servoCallback) → <code>function</code>
    * [callback: ~motorCallback](#Device..motorCallback) → <code>function</code>
    * [callback: ~rcCallback](#Device..rcCallback) → <code>function</code>
    * [type: ~rcData](#Device..rcData) → <code>object</code>
    * [callback: ~rawGpsCallback](#Device..rawGpsCallback) → <code>function</code>
    * [type: ~rawGpsData](#Device..rawGpsData) → <code>object</code>
    * [callback: ~compGpsCallback](#Device..compGpsCallback) → <code>function</code>
    * [type: ~compGpsData](#Device..compGpsData) → <code>object</code>
    * [callback: ~attitudeCallback](#Device..attitudeCallback) → <code>function</code>
    * [type: ~attitudeData](#Device..attitudeData) → <code>object</code>
  * _events_
    * ["update"](#Device#event_update)
    * ["open"](#Device#event_open)
    * ["close"](#Device#event_close)

<a name="Device#isConnected"></a>
### device.isConnected() ⇒ <code>boolean</code>
Check if Device is connected to client

<a name="Device#connect"></a>
### device.connect(packageManager)
Connect Device to the client

**Emits**: <code>[update](#Device#event_update)</code>  

| Param | Type | Description |
| --- | --- | --- |
| packageManager | <code>TcpPackageManager</code> | package manager for current connection |

<a name="Device#disconnect"></a>
### device.disconnect()
Disconnect from client

**Emits**: <code>[close](#Device#event_close)</code>  
<a name="Device#ident"></a>
### device.ident([options], [callback]) ⇒ <code>null</code> \| <code>[identData](#Device..identData)</code>
Get device ident

**Returns**: <code>null</code> \| <code>[identData](#Device..identData)</code> - - if no callback return data, otherwise null  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>object</code> | options for request |
| [callback] | <code>[identCallback](#Device..identCallback)</code> | callback that handles response |

<a name="Device#status"></a>
### device.status([options], [callback]) ⇒ <code>null</code> \| <code>[statusData](#Device..statusData)</code>
Get device actual status

**Returns**: <code>null</code> \| <code>[statusData](#Device..statusData)</code> - - if no callback return data, otherwise null  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>object</code> | options for request |
| [callback] | <code>[statusCallback](#Device..statusCallback)</code> | callback that handles response |

<a name="Device#rawImu"></a>
### device.rawImu([options], [callback]) ⇒ <code>null</code> \| <code>[rawImuData](#Device..rawImuData)</code>
Get device actual status

**Returns**: <code>null</code> \| <code>[rawImuData](#Device..rawImuData)</code> - - if no callback return data, otherwise null  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>object</code> | options for request |
| [callback] | <code>[rawImuCallback](#Device..rawImuCallback)</code> | callback that handles response |

<a name="Device#servo"></a>
### device.servo([options], [callback]) ⇒ <code>null</code> \| <code>Array.&lt;int&gt;</code>
Get device servo's status

**Returns**: <code>null</code> \| <code>Array.&lt;int&gt;</code> - - if no callback return data, otherwise null  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>object</code> | options for request |
| [callback] | <code>[servoCallback](#Device..servoCallback)</code> | callback that handles response |

<a name="Device#motor"></a>
### device.motor([options], [callback]) ⇒ <code>null</code> \| <code>Array.&lt;int&gt;</code>
Get device motor's status

**Returns**: <code>null</code> \| <code>Array.&lt;int&gt;</code> - - if no callback return data, otherwise null  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>object</code> | options for request |
| [callback] | <code>[motorCallback](#Device..motorCallback)</code> | callback that handles response |

<a name="Device#rc"></a>
### device.rc([options], [callback]) ⇒ <code>null</code> \| <code>[rcData](#Device..rcData)</code>
Get device actual rc data

**Returns**: <code>null</code> \| <code>[rcData](#Device..rcData)</code> - - if no callback return data, otherwise null  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>object</code> | options for request |
| [callback] | <code>[rcCallback](#Device..rcCallback)</code> | callback that handles response |

<a name="Device#rawGps"></a>
### device.rawGps([options], [callback]) ⇒ <code>null</code> \| <code>[rawGpsData](#Device..rawGpsData)</code>
Get device raw gps data

**Returns**: <code>null</code> \| <code>[rawGpsData](#Device..rawGpsData)</code> - - if no callback return data, otherwise null  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>object</code> | options for request |
| [callback] | <code>[rawGpsCallback](#Device..rawGpsCallback)</code> | callback that handles response |

<a name="Device#compGps"></a>
### device.compGps([options], [callback]) ⇒ <code>null</code> \| <code>[compGpsData](#Device..compGpsData)</code>
Get device computed gps data

**Returns**: <code>null</code> \| <code>[compGpsData](#Device..compGpsData)</code> - - if no callback return data, otherwise null  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>object</code> | options for request |
| [callback] | <code>[compGpsCallback](#Device..compGpsCallback)</code> | callback that handles response |

<a name="Device#attitude"></a>
### device.attitude([options], [callback]) ⇒ <code>null</code> \| <code>[attitudeData](#Device..attitudeData)</code>
Get device computed gps data

**Returns**: <code>null</code> \| <code>[attitudeData](#Device..attitudeData)</code> - - if no callback return data, otherwise null  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>object</code> | options for request |
| [callback] | <code>[attitudeCallback](#Device..attitudeCallback)</code> | callback that handles response |

<a name="Device#event_update"></a>
### event: "update"
Update event

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| time | <code>int</code> | actual update time in millisecond |
| status | <code>[statusData](#Device..statusData)</code> |  |
| rawImu | <code>[rawImuData](#Device..rawImuData)</code> |  |
| rawGps | <code>[rawGpsData](#Device..rawGpsData)</code> |  |
| compGps | <code>[compGpsData](#Device..compGpsData)</code> |  |
| attitude | <code>[attitudeData](#Device..attitudeData)</code> |  |
| altitude | <code>Device~altitudeData</code> |  |
| analog | <code>Device~analogData</code> |  |

<a name="Device#event_open"></a>
### event: "open"
Connection established

<a name="Device#event_close"></a>
### event: "close"
Connection closed

<a name="Device..identCallback"></a>
### callback: Device~identCallback → <code>function</code>
Ident command response callback


| Param | Type | Description |
| --- | --- | --- |
| error | <code>string</code> \| <code>null</code> | error message, or null if no error |
| data | <code>[identData](#Device..identData)</code> | response data |

<a name="Device..identData"></a>
### type: Device~identData → <code>object</code>
Ident command response

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| version | <code>int</code> | version of MultiWii |
| multiType | <code>int</code> | type of multicopter (multitype) |
| mspVersion | <code>int</code> | MultiWii Serial Protocol version (not used) |
| capability | <code>int</code> | indicate capability of FC board |

<a name="Device..statusCallback"></a>
### callback: Device~statusCallback → <code>function</code>
Status command response callback


| Param | Type | Description |
| --- | --- | --- |
| error | <code>string</code> \| <code>null</code> | error message, or null if no error |
| data | <code>[statusData](#Device..statusData)</code> | response data |

<a name="Device..statusData"></a>
### type: Device~statusData → <code>object</code>
Status command response

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cycleTime | <code>int</code> | unit: microseconds |
| i2cErrorCount | <code>int</code> |  |
| sensorPresent | <code>object</code> | sensor present |
| sensorPresent.acc | <code>boolean</code> | accelerometer present |
| sensorPresent.baro | <code>boolean</code> | barometer present |
| sensorPresent.mag | <code>boolean</code> | magnetometer present |
| sensorPresent.gps | <code>boolean</code> | Gps present |
| sensorPresent.sonar | <code>boolean</code> | sonar present |
| boxActivation | <code>Array</code> | indicates which BOX are activates (index order is depend on boxNames) |
| currentSettingNumber | <code>int</code> | to indicate the current configuration settings |

<a name="Device..rawImuCallback"></a>
### callback: Device~rawImuCallback → <code>function</code>
Raw imu command response callback


| Param | Type | Description |
| --- | --- | --- |
| error | <code>string</code> \| <code>null</code> | error message, or null if no error |
| data | <code>[statusData](#Device..statusData)</code> | response data |

<a name="Device..rawImuData"></a>
### type: Device~rawImuData → <code>object</code>
Raw imu command response

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| gyro.x | <code>int</code> | X axis position shift |
| gyro.y | <code>int</code> | Y axis position shift |
| gyro.z | <code>int</code> | Z axis position shift |
| acc.x | <code>int</code> | X axis acceleration |
| acc.y | <code>int</code> | Y axis acceleration |
| acc.z | <code>int</code> | Z axis acceleration |
| mag.x | <code>int</code> | X axis |
| mag.y | <code>int</code> | Y axis |
| mag.z | <code>int</code> | Z axis |

<a name="Device..servoCallback"></a>
### callback: Device~servoCallback → <code>function</code>
Servo command response callback


| Param | Type | Description |
| --- | --- | --- |
| error | <code>string</code> \| <code>null</code> | error message, or null if no error |
| data | <code>Array.&lt;int&gt;</code> | array of servo status |

<a name="Device..motorCallback"></a>
### callback: Device~motorCallback → <code>function</code>
Motor command response callback


| Param | Type | Description |
| --- | --- | --- |
| error | <code>string</code> \| <code>null</code> | error message, or null if no error |
| data | <code>Array.&lt;int&gt;</code> | array of motor status |

<a name="Device..rcCallback"></a>
### callback: Device~rcCallback → <code>function</code>
Rc command response callback


| Param | Type | Description |
| --- | --- | --- |
| error | <code>string</code> \| <code>null</code> | error message, or null if no error |
| data | <code>[rcData](#Device..rcData)</code> | response data |

<a name="Device..rcData"></a>
### type: Device~rcData → <code>object</code>
Rc command response

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| roll | <code>int</code> | roll stick value, range: [1000-2000] |
| pitch | <code>int</code> | pitch stick value, range: [1000-2000] |
| yaw | <code>int</code> | yaw stick value, range: [1000-2000] |
| throttle | <code>int</code> | throttle stick value, range: [1000-2000] |
| aux1 | <code>int</code> | aux 1 stick value, range: [1000-2000] |
| aux2 | <code>int</code> | aux 2 stick value, range: [1000-2000] |
| aux3 | <code>int</code> | aux 3 stick value, range: [1000-2000] |
| aux4 | <code>int</code> | aux 4 stick value, range: [1000-2000] |

<a name="Device..rawGpsCallback"></a>
### callback: Device~rawGpsCallback → <code>function</code>
Raw gps command response callback


| Param | Type | Description |
| --- | --- | --- |
| error | <code>string</code> \| <code>null</code> | error message, or null if no error |
| data | <code>[rawGpsData](#Device..rawGpsData)</code> | response data |

<a name="Device..rawGpsData"></a>
### type: Device~rawGpsData → <code>object</code>
Raw gps command response

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| fix | <code>boolean</code> | indicate if satellites are locked or not |
| numSat | <code>int</code> | locked satellites number |
| coord | <code>object</code> | locked coordinate object |
| coord.latitude | <code>int</code> | locked coordinate latitude, unit: degree |
| coord.longitude | <code>int</code> | locked coordinate longitude, unit: degree |
| coord.altitude | <code>int</code> | locked coordinate altitude, unit: meter |
| speed | <code>int</code> | unit: cm/s |
| groundCourse | <code>int</code> | unit: degree |

<a name="Device..compGpsCallback"></a>
### callback: Device~compGpsCallback → <code>function</code>
Computed gps command response callback


| Param | Type | Description |
| --- | --- | --- |
| error | <code>string</code> \| <code>null</code> | error message, or null if no error |
| data | <code>[compGpsData](#Device..compGpsData)</code> | response data |

<a name="Device..compGpsData"></a>
### type: Device~compGpsData → <code>object</code>
Computed gps command response

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| distanceToHome | <code>int</code> | unit: meter |
| directionToHome | <code>int</code> | unit: degree, range: [-180, 180] |
| update | <code>int</code> | flag to indicate when a new gps frame is received |

<a name="Device..attitudeCallback"></a>
### callback: Device~attitudeCallback → <code>function</code>
Attitude command response callback


| Param | Type | Description |
| --- | --- | --- |
| error | <code>string</code> \| <code>null</code> | error message, or null if no error |
| data | <code>[attitudeData](#Device..attitudeData)</code> | response data |

<a name="Device..attitudeData"></a>
### type: Device~attitudeData → <code>object</code>
Attitude command response

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| x | <code>int</code> | unit: degree, range: [-1800, 1800] |
| y | <code>int</code> | unit: degree, range: [-900, 900] |
| heading | <code>int</code> | unit: degree, range: [-180, 180] |

