<a name="TcpProtocol"></a>
## class: TcpProtocol

* [class: TcpProtocol](#TcpProtocol)
  * [new TcpProtocol(type)](#new_TcpProtocol_new)
  * _instance_
    * [.serialize(id, code, data, [prior])](#TcpProtocol#serialize) ⇒ <code>Buffer</code>
    * [.unserialize([data])](#TcpProtocol#unserialize) ⇒ <code>Object</code> \| <code>Object</code>

<a name="new_TcpProtocol_new"></a>
### new TcpProtocol(type)
Device format0           - $1           - M2           - <!>3           - payload length4           - no5           - code6-length    - payload7+length+1  - crc


| Param | Type | Description |
| --- | --- | --- |
| type | <code>int</code> | protocol type (request, response) |

<a name="TcpProtocol#serialize"></a>
### tcpProtocol.serialize(id, code, data, [prior]) ⇒ <code>Buffer</code>

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>int</code> |  | package identifier |
| code | <code>int</code> |  | package code |
| data | <code>Buffer</code> |  | package payload |
| [prior] | <code>boolean</code> | <code>false</code> | package has priority or not |

<a name="TcpProtocol#unserialize"></a>
### tcpProtocol.unserialize([data]) ⇒ <code>Object</code> \| <code>Object</code>
Buffer from attribute is stored in data arrayMethod unserialize first valid package from data arrayThe valid package bits or invalid bits are removed from data array


| Param | Type |
| --- | --- |
| [data] | <code>Buffer</code> | 

