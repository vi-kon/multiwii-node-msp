/**
 *
 * Device format
 * 0           - $
 * 1           - M
 * 2           - <!>
 * 3           - payload length
 * 4           - no
 * 5           - code
 * 6-length    - payload
 * 7+length+1  - crc
 *
 * @param {int} type - protocol type (request, response)
 * @constructor
 */
function TcpProtocol(type) {
    this._data = [];
    this._type = type;
}

TcpProtocol.TYPE = {
    REQUEST : 1,
    RESPONSE: 2
};

/**
 *
 * @param {int}    id               - package identifier
 * @param {int}    code             - package code
 * @param {Buffer} data             - package payload
 * @param {boolean} [primary=false] - package is primary or not
 * @returns {Buffer}
 */
TcpProtocol.prototype.serialize = function (id, code, data, primary) {
    var i, length, crc, buffer;

    length = data === undefined || data === null ? 0 : data.length;

    buffer = new Buffer(8 + length);
    buffer.writeUInt8(36, 0); // $
    buffer.writeUInt8(77, 1); // M
    if (this._type === TcpProtocol.TYPE.REQUEST) {
        buffer.writeUInt8(60, 2); // <
    } else {
        buffer.writeUInt8(62, 2); // >
    }
    buffer.writeUInt8(length, 3);
    buffer.writeUInt8(id, 4);
    buffer.writeUInt8(code, 5);
    buffer.writeUInt8(primary ? 1 : 0, 6);

    crc = 0x00 ^ id ^ code ^ length ^ (primary ? 1 : 0);
    for (i = 0; i < length; i = i + 1) {
        crc ^= data.readUInt8(i);
        buffer.writeUInt8(data.readUInt8(i), i + 7);
    }
    buffer.writeUInt8(crc, buffer.length - 1);

    return buffer;
};

/**
 * Buffer from attribute is stored in data array
 * Method unserialize first valid package from data array
 * The valid package bits or invalid bits are removed from data array
 *
 * @param {Buffer} [data]
 * @returns {{valid: boolean}|{valid: boolean, id: int, code: int, length: int, data: Buffer}}
 */
TcpProtocol.prototype.unserialize = function (data) {
    var i, length, id, code, primary, crc, offset, valid, response;

    if (data) {
        for (i = 0; i < data.length; i = i + 1) {
            this._data[this._data.length] = data.readUInt8(i);
        }
    }

    valid = false;
    offset = 0;
    while (offset < this._data.length) {
        if (this._data[offset] !== 36) {
            offset = offset + 1;
        } else if (this._data[offset + 1] !== 77) {
            offset = offset + 2;
        } else if (this._data[offset + 2] !== 62 && this._type === TcpProtocol.TYPE.REQUEST) {
            offset = offset + 3;
        } else if (this._data[offset + 2] !== 60 && this._type === TcpProtocol.TYPE.RESPONSE) {
            offset = offset + 3;
        } else if (this._data[offset + 3] <= this._data.length - offset - 7) {
            length = this._data[offset + 3];
            id = this._data[offset + 4];
            code = this._data[offset + 5];
            primary = this._data[offset + 6] === 1;
            crc = 0x00 ^ id ^ code ^ length ^ (primary ? 1 : 0);

            for (i = 0; i < length; i = i + 1) {
                crc ^= this._data[offset + 7 + i];
            }

            if (crc !== this._data[offset + 7 + length]) {
                offset = offset + 7 + length;
            } else {
                data = new Buffer(length);
                for (i = 0; i < length; i = i + 1) {
                    data.writeUInt8(this._data[offset + 7 + i], i);
                }

                valid = true;
                offset = offset + 7 + length + 1;
                break;
            }
        } else {
            break;
        }
    }

    this._data = this._data.slice(offset);

    response = {
        valid: valid
    };
    if (valid) {
        response.id = id;
        response.code = code;
        response.length = length;
        response.data = data;
        response.primary = primary;
    }

    return response;
};

module.exports = TcpProtocol;