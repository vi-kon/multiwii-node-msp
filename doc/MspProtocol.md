<a name="MspProtocol"></a>
## class: MspProtocol

* [class: MspProtocol](#MspProtocol)
  * [new MspProtocol()](#new_MspProtocol_new)
  * _instance_
    * [.serialize(code, [data])](#MspProtocol#serialize) ⇒ <code>Buffer</code>
    * [.unserialize([data])](#MspProtocol#unserialize) ⇒ <code>Object</code> \| <code>Object</code>

<a name="new_MspProtocol_new"></a>
### new MspProtocol()
Protocol format0           - $1           - M2           - <!>3           - payload length4           - code5-length    - payload5+length+1  - crc

<a name="MspProtocol#serialize"></a>
### mspProtocol.serialize(code, [data]) ⇒ <code>Buffer</code>

| Param | Type | Description |
| --- | --- | --- |
| code | <code>int</code> | command code |
| [data] | <code>Buffer</code> \| <code>null</code> | payload |

<a name="MspProtocol#unserialize"></a>
### mspProtocol.unserialize([data]) ⇒ <code>Object</code> \| <code>Object</code>
Buffer from attribute is stored in data arrayMethod unserialize first valid package from data arrayThe valid package bits or invalid bits are removed from data array


| Param | Type | Description |
| --- | --- | --- |
| [data] | <code>Buffer</code> | input data |

