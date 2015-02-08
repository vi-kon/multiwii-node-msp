/**
 *
 * Protocol format
 * 0           - $
 * 1           - M
 * 2           - <!>
 * 3           - payload length
 * 4           - code
 * 5-length    - payload
 * 5+length+1  - crc
 *
 * @constructor
 */
function MspProtocol() {
    this._data = [];
}

/**
 *
 * @param {int}         code   - command code
 * @param {Buffer|null} [data] - payload
 * @return {Buffer}
 */
MspProtocol.prototype.serialize = function (code, data) {
    var i, length, crc, buffer;

    length = data === undefined || data === null ? 0 : data.length;

    buffer = new Buffer(6 + length);
    buffer.write('$M<');
    buffer.writeUInt8(length, 3);
    buffer.writeUInt8(code, 4);

    crc = 0x00 ^ code ^ length;
    for (i = 0; i < length; i = i + 1) {
        crc ^= data.readUInt8(i);
        buffer.writeUInt8(data.readUInt8(i), i + 5);
    }
    buffer.writeUInt8(crc, buffer.length - 1);

    return buffer;
};

module.exports = MspProtocol;

/**
 * Buffer from attribute is stored in data array
 * Method unserialize first valid package from data array
 * The valid package bits or invalid bits are removed from data array
 *
 * @param {Buffer} [data] - input data
 * @return {{valid:boolean}|{valid: boolean, code: int, length: int, data: Buffer}}
 */
MspProtocol.prototype.unserialize = function (data) {
    var i, length, code, crc, offset, valid, response;

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
        } else if (this._data[offset + 2] !== 62) {
            offset = offset + 3;
        } else if (this._data[offset + 3] <= this._data.length - 6 - offset) {
            length = this._data[offset + 3];
            code = this._data[offset + 4];
            crc = 0x00 ^ code ^ length;

            for (i = 0; i < length; i = i + 1) {
                crc ^= this._data[offset + 5 + i];
            }

            if (crc !== this._data[offset + 5 + length]) {
                offset = offset + 5 + length;
            } else {
                data = new Buffer(length);
                for (i = 0; i < length; i = i + 1) {
                    data.writeUInt8(this._data[offset + 5 + i], i);
                }

                valid = true;
                offset = offset + 5 + length + 1;
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
        response.code = code;
        response.length = length;
        response.data = data;
    }

    return response;
};