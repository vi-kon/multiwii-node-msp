<a name="TcpServer"></a>
## class: TcpServer

* [class: TcpServer](#TcpServer)
  * [new TcpServer(port, [log])](#new_TcpServer_new)
  * _instance_
    * [.getDevice(key)](#TcpServer#getDevice) ⇒ <code>null</code> \| <code>Device</code>
    * [.hasDevice(key)](#TcpServer#hasDevice) ⇒ <code>boolean</code>
    * [.listDevices()](#TcpServer#listDevices) ⇒ <code>object</code>
  * _events_
    * ["register"](#TcpServer#event_register)

<a name="new_TcpServer_new"></a>
### new TcpServer(port, [log])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| port | <code>int</code> |  | port to listen |
| [log] | <code>boolean</code> | <code>false</code> | if TRUE enable logging |

<a name="TcpServer#getDevice"></a>
### tcpServer.getDevice(key) ⇒ <code>null</code> \| <code>Device</code>
Get device by key


| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | device key |

<a name="TcpServer#hasDevice"></a>
### tcpServer.hasDevice(key) ⇒ <code>boolean</code>
Check is server has device at key


| Param | Type |
| --- | --- |
| key | <code>string</code> | 

<a name="TcpServer#listDevices"></a>
### tcpServer.listDevices() ⇒ <code>object</code>
Get list of devices

**Returns**: <code>object</code> - - object with key-object pairs  
<a name="TcpServer#event_register"></a>
### event: "register"
Register eventFires on first device connection

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | registered device key |
| device | <code>Device</code> | device object |

