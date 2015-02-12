<a name="TcpPackageManager"></a>
## class: TcpPackageManager

* [class: TcpPackageManager](#TcpPackageManager)
  * [new TcpPackageManager(socket)](#new_TcpPackageManager_new)
  * _instance_
    * [.getNextPackageId()](#TcpPackageManager#getNextPackageId) ⇒ <code>int</code>
    * [.asyncSend(code, requestData, responseHandler, options, callback)](#TcpPackageManager#asyncSend) ⇒ <code>null</code> \| <code>object</code>
    * [.syncSend(code, requestData, responseHandler, options)](#TcpPackageManager#syncSend) ⇒ <code>null</code> \| <code>object</code>
    * [.send(code, requestData, responseHandler, [options], [callback])](#TcpPackageManager#send) ⇒ <code>null</code> \| <code>object</code>

<a name="new_TcpPackageManager_new"></a>
### new TcpPackageManager(socket)

| Param | Type |
| --- | --- |
| socket | <code>Socket</code> | 

<a name="TcpPackageManager#getNextPackageId"></a>
### tcpPackageManager.getNextPackageId() ⇒ <code>int</code>
Get next package identifier

<a name="TcpPackageManager#asyncSend"></a>
### tcpPackageManager.asyncSend(code, requestData, responseHandler, options, callback) ⇒ <code>null</code> \| <code>object</code>
Send package via socket


| Param | Type |
| --- | --- |
| code | <code>int</code> | 
| requestData | <code>Buffer</code> | 
| responseHandler |  | 
| options | <code>object</code> | 
| callback |  | 

<a name="TcpPackageManager#syncSend"></a>
### tcpPackageManager.syncSend(code, requestData, responseHandler, options) ⇒ <code>null</code> \| <code>object</code>
Send package via socket


| Param | Type |
| --- | --- |
| code | <code>int</code> | 
| requestData | <code>Buffer</code> | 
| responseHandler |  | 
| options | <code>object</code> | 

<a name="TcpPackageManager#send"></a>
### tcpPackageManager.send(code, requestData, responseHandler, [options], [callback]) ⇒ <code>null</code> \| <code>object</code>
Send package via socket


| Param | Type |
| --- | --- |
| code | <code>int</code> | 
| requestData | <code>Buffer</code> | 
| responseHandler |  | 
| [options] | <code>object</code> | 
| [callback] |  | 

