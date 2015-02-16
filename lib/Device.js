var Util = require('util');
var EventEmitter = require('events').EventEmitter;
var Fiber = require('fibers');

/**
 *
 * @constructor
 * @extends EventEmitter
 */
function Device() {
    this._packageManager = null;
    this._log = [];
}

Util.inherits(Device, EventEmitter);


/**
 * Check if Device is connected to client
 *
 * @returns {boolean}
 */
Device.prototype.isConnected = function () {
    return this._packageManager !== null;
};


/**
 * Connect Device to the client
 *
 * @param {TcpPackageManager} packageManager package manager for current connection
 * @fires Device#update
 */
Device.prototype.connect = function (packageManager) {
    var self, logger;

    self = this;
    self._packageManager = packageManager;

    logger = function () {
        setImmediate(function () {
            Fiber(function () {
                var startTime, data;

                if (self._packageManager !== null) {
                    startTime = new Date().getTime();

                    data = {
                        time    : new Date().getTime(),
                        status  : self.status(),
                        rawImu  : self.rawImu(),
                        rc      : self.rc(),
                        rawGps  : self.rawGps(),
                        compGps : self.compGps(),
                        attitude: self.attitude(),
                        altitude: self.altitude(),
                        analog  : self.analog()
                    };
                    data.cycleTime = new Date().getTime() - startTime;

                    self._log.push(data);

                    /**
                     * Update event
                     *
                     * @event Device#update
                     *
                     * @type {object}
                     * @property {int}                 time     - actual update time in millisecond
                     * @property {Device~statusData}   status
                     * @property {Device~rawImuData}   rawImu
                     * @property {Device~rawGpsData}   rawGps
                     * @property {Device~compGpsData}  compGps
                     * @property {Device~attitudeData} attitude
                     * @property {Device~altitudeData} altitude
                     * @property {Device~analogData}   analog
                     */
                    self.emit('update', data);

                }

                logger();
            }).run();
        });
    };

    logger();

    /**
     * Connection established
     *
     * @event Device#open
     *
     */
    self.emit('open');
};

/**
 * Disconnect from client
 *
 * @fires Device#close
 */
Device.prototype.disconnect = function () {
    if (this._packageManager !== null) {
        this._packageManager = null;
        /**
         * Connection closed
         *
         * @event Device#close
         *
         */
        this.emit('close');
    }
};

/**
 * Ident command response callback
 *
 * @callback Device~identCallback
 *
 * @param {string|null}      error - error message, or null if no error
 * @param {Device~identData} data  - response data
 */

/**
 * Ident command response
 *
 * @typedef {object} Device~identData
 *
 * @property {int} version    - version of MultiWii
 * @property {int} multiType  - type of multicopter (multitype)
 * @property {int} mspVersion - MultiWii Serial Protocol version (not used)
 * @property {int} capability - indicate capability of FC board
 */

/**
 * Get device ident
 *
 * @param {object}               [options]  - options for request
 * @param {Device~identCallback} [callback] - callback that handles response
 *
 * @returns {null|Device~identData} - if no callback return data, otherwise null
 */
Device.prototype.ident = function (options, callback) {
    var responseHandler = function (data) {
        return {
            version   : data.readUInt8(0),
            multiType : data.readUInt8(1),
            mspVersion: data.readUInt8(2),
            capability: data.readUInt32LE(3)
        };
    };

    return this._packageManager.send(100, null, responseHandler, options, callback);
};

/**
 * Status command response callback
 *
 * @callback Device~statusCallback
 *
 * @param {string|null}       error - error message, or null if no error
 * @param {Device~statusData} data  - response data
 */

/**
 * Status command response
 *
 * @typedef {object} Device~statusData
 *
 * @property {int}     cycleTime            - unit: microseconds
 * @property {int}     i2cErrorCount
 * @property {object}  sensorPresent        - sensor present
 * @property {boolean} sensorPresent.acc    - accelerometer present
 * @property {boolean} sensorPresent.baro   - barometer present
 * @property {boolean} sensorPresent.mag    - magnetometer present
 * @property {boolean} sensorPresent.gps    - Gps present
 * @property {boolean} sensorPresent.sonar  - sonar present
 * @property {Array}   boxActivation        - indicates which BOX are activates (index order is depend on boxNames)
 * @property {int}     currentSettingNumber - to indicate the current configuration settings
 */

/**
 * Get device actual status
 *
 * @param {object}                [options]  - options for request
 * @param {Device~statusCallback} [callback] - callback that handles response
 *
 * @returns {null|Device~statusData} - if no callback return data, otherwise null
 */
Device.prototype.status = function (options, callback) {
    var self, responseHandler;

    self = this;
    responseHandler = function (data) {
        var i, sensorPresentSum, boxActivationSum, boxActivation, boxNames;

        sensorPresentSum = data.readUInt16LE(4);
        boxActivationSum = data.readUInt32LE(6); // flag
        boxActivation = [];
        boxNames = self.boxNames();

        for (i = 0; i < boxNames.length; i = i + 1) {
            boxActivation[i] = (boxActivationSum & (1 << i)) > 0;
        }

        return {
            cycleTime           : data.readUInt16LE(0),
            i2cErrorCount       : data.readUInt16LE(2),
            sensorPresent       : {
                acc  : (sensorPresentSum & 1) !== 0,
                baro : (sensorPresentSum & 2) !== 0,
                mag  : (sensorPresentSum & 4) !== 0,
                gps  : (sensorPresentSum & 8) !== 0,
                sonar: (sensorPresentSum & 16) !== 0
            },
            boxActivation       : boxActivation,
            currentSettingNumber: data.readUInt8(10)
        };
    };

    return this._packageManager.send(101, null, responseHandler, options, callback);
};

/**
 * Raw imu command response callback
 *
 * @callback Device~rawImuCallback
 *
 * @param {string|null}       error - error message, or null if no error
 * @param {Device~statusData} data  - response data
 */

/**
 * Raw imu command response
 *
 * @typedef {object} Device~rawImuData
 *
 * @property {int} gyro.x - X axis position shift
 * @property {int} gyro.y - Y axis position shift
 * @property {int} gyro.z - Z axis position shift
 * @property {int} acc.x  - X axis acceleration
 * @property {int} acc.y  - Y axis acceleration
 * @property {int} acc.z  - Z axis acceleration
 * @property {int} mag.x  - X axis
 * @property {int} mag.y  - Y axis
 * @property {int} mag.z  - Z axis
 */

/**
 * Get device actual status
 *
 * @param {object}                [options]  - options for request
 * @param {Device~rawImuCallback} [callback] - callback that handles response
 *
 * @returns {null|Device~rawImuData} - if no callback return data, otherwise null
 */
Device.prototype.rawImu = function (options, callback) {
    var responseHandler = function (data) {
        return {
            gyro: {
                x: data.readInt16LE(0),
                y: data.readInt16LE(2),
                z: data.readInt16LE(4)
            },
            acc : {
                x: data.readInt16LE(6),
                y: data.readInt16LE(8),
                z: data.readInt16LE(10)
            },
            mag : {
                x: data.readInt16LE(12),
                y: data.readInt16LE(14),
                z: data.readInt16LE(16)
            }
        };
    };

    return this._packageManager.send(102, null, responseHandler, options, callback);
};

/**
 * Servo command response callback
 *
 * @callback Device~servoCallback
 *
 * @param {string|null} error - error message, or null if no error
 * @param {int[]}       data  - array of servo status
 */

/**
 * Get device servo's status
 *
 * @param {object}               [options]  - options for request
 * @param {Device~servoCallback} [callback] - callback that handles response
 *
 * @returns {null|int[]} - if no callback return data, otherwise null
 */
Device.prototype.servo = function (options, callback) {
    var responseHandler = function (data) {
        return [
            data.readUInt16LE(0),
            data.readUInt16LE(2),
            data.readUInt16LE(4),
            data.readUInt16LE(6),
            data.readUInt16LE(8),
            data.readUInt16LE(10),
            data.readUInt16LE(12),
            data.readUInt16LE(14)
        ];
    };

    return this._packageManager.send(103, null, responseHandler, options, callback);
};

/**
 * Motor command response callback
 *
 * @callback Device~motorCallback
 *
 * @param {string|null} error - error message, or null if no error
 * @param {int[]}       data  - array of motor status
 */

/**
 * Get device motor's status
 *
 * @param {object}               [options]  - options for request
 * @param {Device~motorCallback} [callback] - callback that handles response
 *
 * @returns {null|int[]} - if no callback return data, otherwise null
 */
Device.prototype.motor = function (options, callback) {
    var responseHandler = function (data) {
        return [
            data.readUInt16LE(0),
            data.readUInt16LE(2),
            data.readUInt16LE(4),
            data.readUInt16LE(6),
            data.readUInt16LE(8),
            data.readUInt16LE(10),
            data.readUInt16LE(12),
            data.readUInt16LE(14)
        ];
    };

    return this._packageManager.send(104, null, responseHandler, options, callback);
};

/**
 * Rc command response callback
 *
 * @callback Device~rcCallback
 *
 * @param {string|null}   error - error message, or null if no error
 * @param {Device~rcData} data  - response data
 */

/**
 * Rc command response
 *
 * @typedef {object} Device~rcData
 *
 * @property {int} roll     - roll stick value, range: [1000-2000]
 * @property {int} pitch    - pitch stick value, range: [1000-2000]
 * @property {int} yaw      - yaw stick value, range: [1000-2000]
 * @property {int} throttle - throttle stick value, range: [1000-2000]
 * @property {int} aux1     - aux 1 stick value, range: [1000-2000]
 * @property {int} aux2     - aux 2 stick value, range: [1000-2000]
 * @property {int} aux3     - aux 3 stick value, range: [1000-2000]
 * @property {int} aux4     - aux 4 stick value, range: [1000-2000]
 */

/**
 * Get device actual rc data
 *
 * @param {object}            [options]  - options for request
 * @param {Device~rcCallback} [callback] - callback that handles response
 *
 * @returns {null|Device~rcData} - if no callback return data, otherwise null
 */
Device.prototype.rc = function (options, callback) {
    var responseHandler = function (data) {
        return {
            roll    : data.readUInt16LE(0),
            pitch   : data.readUInt16LE(2),
            yaw     : data.readUInt16LE(4),
            throttle: data.readUInt16LE(6),
            aux1    : data.readUInt16LE(8),
            aux2    : data.readUInt16LE(10),
            aux3    : data.readUInt16LE(12),
            aux4    : data.readUInt16LE(14)
        };
    };

    return this._packageManager.send(105, null, responseHandler, options, callback);
};

/**
 * Raw gps command response callback
 *
 * @callback Device~rawGpsCallback
 *
 * @param {string|null}       error - error message, or null if no error
 * @param {Device~rawGpsData} data  - response data
 */

/**
 * Raw gps command response
 *
 * @typedef {object} Device~rawGpsData
 *
 * @property {boolean} fix             - indicate if satellites are locked or not
 * @property {int}     numSat          - locked satellites number
 * @property {object}  coord           - locked coordinate object
 * @property {int}     coord.latitude  - locked coordinate latitude, unit: degree
 * @property {int}     coord.longitude - locked coordinate longitude, unit: degree
 * @property {int}     coord.altitude  - locked coordinate altitude, unit: meter
 * @property {int}     speed           - unit: cm/s
 * @property {int}     groundCourse    - unit: degree
 */

/**
 * Get device raw gps data
 *
 * @param {object}                [options]  - options for request
 * @param {Device~rawGpsCallback} [callback] - callback that handles response
 *
 * @returns {null|Device~rawGpsData} - if no callback return data, otherwise null
 */
Device.prototype.rawGps = function (options, callback) {
    var responseHandler = function (data) {
        return {
            fix         : data.readUInt8(0) === 1,
            numSat      : data.readUInt8(1),
            coord       : {
                latitude : data.readUInt32LE(2) / 10000000,
                longitude: data.readUInt32LE(6) / 10000000,
                altitude : data.readUInt16LE(10)
            },
            speed       : data.readUInt16LE(12),
            groundCourse: data.readUInt16LE(14) / 10
        };
    };

    return this._packageManager.send(106, null, responseHandler, options, callback);
};

/**
 * Computed gps command response callback
 *
 * @callback Device~compGpsCallback
 *
 * @param {string|null}        error - error message, or null if no error
 * @param {Device~compGpsData} data  - response data
 */

/**
 * Computed gps command response
 *
 * @typedef {object} Device~compGpsData
 *
 * @property {int} distanceToHome  - unit: meter
 * @property {int} directionToHome - unit: degree, range: [-180, 180]
 * @property {int} update          - flag to indicate when a new gps frame is received
 */

/**
 * Get device computed gps data
 *
 * @param {object}                 [options]  - options for request
 * @param {Device~compGpsCallback} [callback] - callback that handles response
 *
 * @returns {null|Device~compGpsData} - if no callback return data, otherwise null
 */
Device.prototype.compGps = function (options, callback) {
    var responseHandler = function (data) {
        return {
            distanceToHome : data.readUInt16LE(0),
            directionToHome: data.readUInt16LE(2),
            update         : data.readUInt8(4)
        };
    };

    return this._packageManager.send(107, null, responseHandler, options, callback);
};

/**
 * Attitude command response callback
 *
 * @callback Device~attitudeCallback
 *
 * @param {string|null}         error - error message, or null if no error
 * @param {Device~attitudeData} data  - response data
 */

/**
 * Attitude command response
 *
 * @typedef {object} Device~attitudeData
 *
 * @property {int} x       - unit: degree, range: [-1800, 1800]
 * @property {int} y       - unit: degree, range: [-900, 900]
 * @property {int} heading - unit: degree, range: [-180, 180]
 */

/**
 * Get device computed attitude
 *
 * @param {object}                  [options]  - options for request
 * @param {Device~attitudeCallback} [callback] - callback that handles response
 *
 * @returns {null|Device~attitudeData} - if no callback return data, otherwise null
 */
Device.prototype.attitude = function (options, callback) {
    var responseHandler = function (data) {
        return {
            x      : data.readInt16LE(0) / 10,
            y      : data.readInt16LE(2) / 10,
            heading: data.readInt16LE(4)
        };
    };

    return this._packageManager.send(108, null, responseHandler, options, callback);
};

/**
 * Altitude command response callback
 *
 * @callback Device~altitudeCallback
 *
 * @param {string|null}         error - error message, or null if no error
 * @param {Device~altitudeData} data  - response data
 */

/**
 * Altitude command response
 *
 * @typedef {object} Device~altitudeData
 *
 * @property {int} estimated - unit: cm
 * @property {int} vario     - unit: cm/s
 */

/**
 * Get device altitude
 *
 * @param {object}                  [options]  - options for request
 * @param {Device~altitudeCallback} [callback] - callback that handles response
 *
 * @returns {null|Device~altitudeData} - if no callback return data, otherwise null
 */
Device.prototype.altitude = function (options, callback) {
    var responseHandler = function (data) {
        return {
            estimated: data.readInt32LE(0),
            vario    : data.readInt16LE(4)
        };
    };

    return this._packageManager.send(109, null, responseHandler, options, callback);
};

/**
 * Analog command response callback
 *
 * @callback Device~analogCallback
 *
 * @param {string|null}         error - error message, or null if no error
 * @param {Device~analogData} data  - response data
 */

/**
 * Analog command response
 *
 * @typedef {object} Device~analogData
 *
 * @property {int} vbat             - unit: volt
 * @property {int} intPowerMeterSum
 * @property {int} rssi             - range: [0, 1023]
 * @property {int} amperage
 */

/**
 * Get device analog data
 *
 * @param {object}                [options]  - options for request
 * @param {Device~analogCallback} [callback] - callback that handles response
 *
 * @returns {null|Device~analogData} - if no callback return data, otherwise null
 */
Device.prototype.analog = function (options, callback) {
    var responseHandler = function (data) {
        return {
            vbat            : data.readUInt8(0) / 10,
            intPowerMeterSum: data.readUInt16LE(1),
            rssi            : data.readUInt16LE(3),
            amperage        : data.readUInt16LE(5)
        };
    };

    return this._packageManager.send(110, null, responseHandler, options, callback);
};

/**
 * Rc tuning command response callback
 *
 * @callback Device~rcTuningCallback
 *
 * @param {string|null}         error - error message, or null if no error
 * @param {Device~rcTuningData} data  - response data
 */

/**
 * Rc tuning command response
 *
 * @typedef {object} Device~rcTuningData
 *
 * @property {int} rcRate         - range: [0, 100]
 * @property {int} rcExpo         - range: [0, 100]
 * @property {int} rollPitchRate  - range: [0, 100]
 * @property {int} yawRate        - range: [0, 100]
 * @property {int} dynThrottlePid - range: [0, 100]
 * @property {int} throttleMid    - range: [0, 100]
 * @property {int} throttleExpo   - range: [0, 100]
 */

/**
 * Get device rc tuning
 *
 * @param {object}                  [options]  - options for request
 * @param {Device~rcTuningCallback} [callback] - callback that handles response
 *
 * @returns {null|Device~rcTuningData} - if no callback return data, otherwise null
 */
Device.prototype.rcTuning = function (options, callback) {
    var responseHandler = function (data) {
        return {
            rcRate        : data.readUInt8(0),
            rcExpo        : data.readUInt8(1),
            rollPitchRate : data.readUInt8(2),
            yawRate       : data.readUInt8(3),
            dynThrottlePid: data.readUInt8(4),
            throttleMid   : data.readUInt8(5),
            throttleExpo  : data.readUInt8(6)
        };
    };

    return this._packageManager.send(111, null, responseHandler, options, callback);
};

Device.prototype.pid = function (options, callback) {
    var responseHandler = function (data) {
        return {
            roll    : {
                p: data.readUInt8(0),
                i: data.readUInt8(1),
                d: data.readUInt8(2)
            },
            pitch   : {
                p: data.readUInt8(3),
                i: data.readUInt8(4),
                d: data.readUInt8(5)
            },
            yaw     : {
                p: data.readUInt8(6),
                i: data.readUInt8(7),
                d: data.readUInt8(8)
            },
            altitude: {
                p: data.readUInt8(9),
                i: data.readUInt8(10),
                d: data.readUInt8(11)
            },
            pos     : {
                p: data.readUInt8(12),
                i: data.readUInt8(13),
                d: data.readUInt8(14)
            },
            posr    : {
                p: data.readUInt8(15),
                i: data.readUInt8(16),
                d: data.readUInt8(17)
            },
            navr    : {
                p: data.readUInt8(18),
                i: data.readUInt8(19),
                d: data.readUInt8(20)
            },
            level   : {
                p: data.readUInt8(21),
                i: data.readUInt8(22),
                d: data.readUInt8(23)
            },
            mag     : {
                p: data.readUInt8(24),
                i: data.readUInt8(25),
                d: data.readUInt8(26)
            },
            vel     : {
                p: data.readUInt8(27),
                i: data.readUInt8(28),
                d: data.readUInt8(29)
            }
        };
    };

    return this._packageManager.send(112, null, responseHandler, options, callback);
};

Device.prototype.box = function (options, callback) {
    var responseHandler = function (data) {
        var i, item, box, boxObject;

        box = [];
        for (i = 0; i < data.length; i = i + 2) {
            item = data.readUInt16LE(i);
            boxObject = {
                aux1: {
                    low : (item & (1 << 0)) !== 0,
                    mid : (item & (1 << 1)) !== 0,
                    high: (item & (1 << 2)) !== 0
                },
                aux2: {
                    low : (item & (1 << 3)) !== 0,
                    mid : (item & (1 << 4)) !== 0,
                    high: (item & (1 << 5)) !== 0
                },
                aux3: {
                    low : (item & (1 << 6)) !== 0,
                    mid : (item & (1 << 7)) !== 0,
                    high: (item & (1 << 8)) !== 0
                },
                aux4: {
                    low : (item & (1 << 9)) !== 0,
                    mid : (item & (1 << 10)) !== 0,
                    high: (item & (1 << 11)) !== 0
                }
            };
            box[box.length] = boxObject;
        }
        return box;
    };

    return this._packageManager.send(113, null, responseHandler, options, callback);
};


Device.prototype.misc = function (options, callback) {
    var responseHandler = function (data) {
        return {
            intPowerTrigger: data.readUInt16LE(0),
            conf           : {
                minThrottle     : data.readUInt16LE(2),
                maxThrottle     : data.readUInt16LE(4),
                minCommand      : data.readUInt16LE(6),
                failSafeThrottle: data.readUInt16LE(8),
                magDeclination  : data.readUInt16LE(16) / 10,
                vbat            : {
                    scale: data.readUInt8(18),
                    level: {
                        warn1   : data.readUInt8(19) / 10,
                        warn2   : data.readUInt8(20) / 10,
                        critical: data.readUInt8(21) / 10
                    }
                }
            },
            plog           : {
                arm     : data.readUInt16LE(10),
                lifetime: data.readUInt32LE(12)
            }
        };
    };

    return this._packageManager.send(114, null, responseHandler, options, callback);
};


Device.prototype.motorPins = function (options, callback) {
    var responseHandler = function (data) {
        return [
            data.readUInt8(0),
            data.readUInt8(1),
            data.readUInt8(2),
            data.readUInt8(3),
            data.readUInt8(4),
            data.readUInt8(5),
            data.readUInt8(6),
            data.readUInt8(7)
        ];
    };

    return this._packageManager.send(115, null, responseHandler, options, callback);
};


Device.prototype.boxNames = function (options, callback) {
    var responseHandler = function (data) {
        return data.toString().split(';').filter(function (value) {
            return value !== '';
        });
    };

    return this._packageManager.send(116, null, responseHandler, options, callback);
};

Device.prototype.pidNames = function (options, callback) {
    var responseHandler = function (data) {
        return data.toString().split(';').filter(function (value) {
            return value !== '';
        });
    };

    return this._packageManager.send(117, null, responseHandler, options, callback);
};

Device.prototype.wp = function (options, callback) {
    var responseHandler = function (data) {
        return {
            wpNo      : data.readUInt8(0),
            latitude  : data.readUInt32LE(1),
            longitude : data.readUInt32LE(5),
            altHold   : data.readUInt32LE(9),
            heading   : data.readUInt16LE(11),
            timeToStay: data.readUInt16LE(13),
            navFlag   : data.readUInt8(15)
        };
    };

    return this._packageManager.send(118, null, responseHandler, options, callback);
};

Device.prototype.boxIds = function (options, callback) {
    var responseHandler = function (data) {
        var i, boxIds;

        boxIds = [];
        for (i = 0; i < data.length; i = i + 1) {
            boxIds[boxIds.length] = data.readInt8(i);
        }

        return boxIds;
    };

    return this._packageManager.send(119, null, responseHandler, options, callback);
};

Device.prototype.servoConf = function (options, callback) {
    var responseHandler = function (data) {
        var i, servoConf;

        servoConf = [];
        for (i = 0; i < 8; i = i + 1) {
            servoConf[servoConf.length] = {
                min   : data.readUInt16LE(i * 7),
                max   : data.readUInt16LE(i * 7 + 2),
                middle: data.readUInt16LE(i * 7 + 4),
                rate  : data.readUInt8(i * 7 + 6)
            };
        }

        return servoConf;
    };

    return this._packageManager.send(120, null, responseHandler, options, callback);
};

Device.prototype.setRawRc = function (dataObject, options, callback) {
    var data = new Buffer(16);

    data.writeUInt16LE(dataObject.roll, 0);
    data.writeUInt16LE(dataObject.pitch, 2);
    data.writeUInt16LE(dataObject.yaw, 4);
    data.writeUInt16LE(dataObject.throttle, 6);
    data.writeUInt16LE(dataObject.aux1, 8);
    data.writeUInt16LE(dataObject.aux2, 10);
    data.writeUInt16LE(dataObject.aux3, 12);
    data.writeUInt16LE(dataObject.aux4, 14);

    this._packageManager.send(200, data, null, options, callback);
};

Device.prototype.setRawGps = function (dataObject, options, callback) {
    var data = new Buffer(14);

    data.writeUInt8(dataObject.fix ? 1 : 0, 0);
    data.writeUInt8(dataObject.numSat, 1);
    data.writeUInt32LE(dataObject.latitude * 10000000, 2);
    data.writeUInt32LE(dataObject.longitude * 10000000, 6);
    data.writeUInt16LE(dataObject.altitude, 10);
    data.writeUInt16LE(dataObject.speed, 12);

    this._packageManager.send(201, data, null, options, callback);
};

Device.prototype.setPid = function (dataObject, options, callback) {
    var data = new Buffer(30);

    data.writeUInt8(dataObject.roll.p, 0);
    data.writeUInt8(dataObject.roll.i, 1);
    data.writeUInt8(dataObject.roll.d, 2);

    data.writeUInt8(dataObject.pitch.p, 3);
    data.writeUInt8(dataObject.pitch.i, 4);
    data.writeUInt8(dataObject.pitch.d, 5);

    data.writeUInt8(dataObject.yaw.p, 6);
    data.writeUInt8(dataObject.yaw.i, 7);
    data.writeUInt8(dataObject.yaw.d, 8);

    data.writeUInt8(dataObject.alt.p, 9);
    data.writeUInt8(dataObject.alt.i, 10);
    data.writeUInt8(dataObject.alt.d, 11);

    data.writeUInt8(dataObject.pos.p, 12);
    data.writeUInt8(dataObject.pos.i, 13);
    data.writeUInt8(dataObject.pos.d, 14);

    data.writeUInt8(dataObject.posr.p, 15);
    data.writeUInt8(dataObject.posr.i, 16);
    data.writeUInt8(dataObject.posr.d, 17);

    data.writeUInt8(dataObject.navr.p, 18);
    data.writeUInt8(dataObject.navr.i, 19);
    data.writeUInt8(dataObject.navr.d, 20);

    data.writeUInt8(dataObject.level.p, 21);
    data.writeUInt8(dataObject.level.i, 22);
    data.writeUInt8(dataObject.level.d, 23);

    data.writeUInt8(dataObject.mag.p, 24);
    data.writeUInt8(dataObject.mag.i, 25);
    data.writeUInt8(dataObject.mag.d, 26);

    data.writeUInt8(dataObject.vel.p, 27);
    data.writeUInt8(dataObject.vel.i, 28);
    data.writeUInt8(dataObject.vel.d, 29);

    this._packageManager.send(202, data, null, options, callback);
};

Device.prototype.setBox = function (box, options, callback) {
    var i, data, item;

    data = new Buffer(box.length * 2);

    for (i = 0; i < box.length; i = i + 1) {
        item = 0;

        item ^= box[i].aux1.low ? (1 << 0) : 0;
        item ^= box[i].aux1.mid ? (1 << 1) : 0;
        item ^= box[i].aux1.high ? (1 << 2) : 0;

        item ^= box[i].aux2.low ? (1 << 3) : 0;
        item ^= box[i].aux2.mid ? (1 << 4) : 0;
        item ^= box[i].aux2.high ? (1 << 5) : 0;

        item ^= box[i].aux3.low ? (1 << 6) : 0;
        item ^= box[i].aux3.mid ? (1 << 7) : 0;
        item ^= box[i].aux3.high ? (1 << 8) : 0;

        item ^= box[i].aux4.low ? (1 << 9) : 0;
        item ^= box[i].aux4.mid ? (1 << 10) : 0;
        item ^= box[i].aux4.high ? (1 << 11) : 0;

        data.writeUInt16LE(item, i * 2);
    }

    this._packageManager.send(203, data, null, options, callback);
};

Device.prototype.setRcTuning = function (dataObject, options, callback) {
    var data = new Buffer(7);

    data.writeUInt8(dataObject.rcRate, 0);
    data.writeUInt8(dataObject.rcExpo, 1);
    data.writeUInt8(dataObject.rollPitchRate, 2);
    data.writeUInt8(dataObject.yawRate, 3);
    data.writeUInt8(dataObject.dynThrottlePid, 4);
    data.writeUInt8(dataObject.throttleMid, 5);
    data.writeUInt8(dataObject.throttleExpo, 6);

    this._packageManager.send(204, data, null, options, callback);
};

Device.prototype.accCalibration = function (options, callback) {
    this._packageManager.send(205, null, null, options, callback);
};

Device.prototype.magCalibration = function (options, callback) {
    this._packageManager.send(206, null, null, options, callback);
};

Device.prototype.setMisc = function (dataObject, options, callback) {
    var data = new Buffer(22);

    data.writeUInt16LE(dataObject.intPowerTrigger, 0);
    data.writeUInt16LE(dataObject.minThrottle, 2);
    data.writeUInt16LE(dataObject.maxThrottle, 4);
    data.writeUInt16LE(dataObject.minCommand, 6);
    data.writeUInt16LE(dataObject.failSafeThrottle, 8);
    data.writeUInt16LE(dataObject.arm, 10);
    data.writeUInt32LE(dataObject.lifetime, 12);
    data.writeUInt16LE(dataObject.magDeclination, 16);
    data.writeUInt8(dataObject.vbat.scale, 18);
    data.writeUInt8(dataObject.vbat.level.warn1 * 10, 19);
    data.writeUInt8(dataObject.vbat.level.warn2 * 10, 20);
    data.writeUInt8(dataObject.vbat.level.critical * 10, 21);

    this._packageManager.send(207, data, null, options, callback);
};

Device.prototype.resetConf = function (options, callback) {
    this._packageManager.send(208, null, null, options, callback);
};

Device.prototype.setWp = function (dataObject, options, callback) {
    var data = new Buffer(18);

    data.writeUInt8(dataObject.wpNo, 0);
    data.writeUInt32LE(dataObject.latitude, 1);
    data.writeUInt32LE(dataObject.longitude, 5);
    data.writeUInt32LE(dataObject.altHold, 9);
    data.writeUInt16LE(dataObject.heading, 13);
    data.writeUInt16LE(dataObject.timeToStay, 15);
    data.writeUInt8(dataObject.navFlag, 17);

    this._packageManager.send(209, data, null, options, callback);
};

Device.prototype.selectSetting = function (currentSet, options, callback) {
    var data = new Buffer(1);

    data.writeUInt8(currentSet, 0);

    this._packageManager.send(210, data, null, options, callback);
};

Device.prototype.setHead = function (head, options, callback) {
    var data = new Buffer(2);

    data.writeInt16LE(head, 0);

    this._packageManager.send(211, data, null, options, callback);
};

Device.prototype.setServoConf = function (servo, options, callback) {
    var i, data;

    data = new Buffer(56);

    for (i = 0; i < 8; i = i + 1) {
        data.writeUInt16LE(servo[i].min, i * 7);
        data.writeUInt16LE(servo[i].max, i * 7 + 2);
        data.writeUInt16LE(servo[i].middle, i * 7 + 4);
        data.writeUInt8(servo[i].rate, i * 7 + 6);
    }

    this._packageManager.send(212, data, null, options, callback);
};

module.exports = Device;