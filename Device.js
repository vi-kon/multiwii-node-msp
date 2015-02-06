var Fiber = require('fibers');
var Util = require('util');
var EventEmitter = require('events').EventEmitter;

var SimpleClone = require('./SimpleClone');


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
    self._cache = {};

    logger = function () {
        var startTime, data;

        startTime = new Date().getTime();

        data = {
            time    : new Date().getTime(),
            status  : self.status(),
            rawImu  : self.rawImu(),
            rc      : self.rc(),
            rawGPS  : self.rawGPS(),
            compGPS : self.compGPS(),
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
         * @type {object}
         * @property {int} time - actual update time in millisecond
         * @property {object} status
         * @property {object} rawImu
         * @property {object} rawGPS
         * @property {object} compGPS
         * @property {object} attitude
         * @property {object} altitude
         * @property {object} analog
         */
        self.emit('update', data);

        if (self._packageManager !== null) {
            logger();
        }
    };

    self.ident(null, false);
    self.boxNames(null, false);
    self.pidNames(null, false);

    Fiber(logger).run();

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
    this._packageManager = null;
    /**
     * Connection closed
     *
     * @event Device#close
     *
     */
    this.emit('close');
};

/**
 * Ident command response callback
 *
 * @callback Device~identCallback
 * @param {string|null}      error - error message, or null if no error
 * @param {Device~identData} data  - response data
 */

/**
 * Ident command response
 *
 * @typedef {object} Device~identData
 * @property {int} version    - version of MultiWii
 * @property {int} multiType  - type of multicopter (multitype)
 * @property {int} mspVersion - MultiWii Serial Protocol version (not used)
 * @property {int} capability - indicate capability of FC board
 */

/**
 * Get device ident
 *
 * @param {Device~identCallback} [callback]   - callback that handles response
 * @param {boolean}              [cache=true] - load ident from device cache
 *
 * @returns {null|Device~identData} - if no callback return data, otherwise null
 */
Device.prototype.ident = function (callback, cache) {
    if (!this._cache.hasOwnProperty('ident') || cache === false) {
        this._cache.ident = this._packageManager.send(100, null, function (data) {
            return {
                version   : data.readUInt8(0),
                multiType : data.readUInt8(1),
                mspVersion: data.readUInt8(2),
                capability: data.readUInt32LE(3)
            };
        });
    }

    if (callback) {
        return callback(null, SimpleClone(this._cache.ident));
    }

    return SimpleClone(this._cache.ident);
};

/**
 * Status command response callback
 *
 * @callback Device~statusCallback
 * @param {string|null}       error - error message, or null if no error
 * @param {Device~statusData} data  - response data
 */

/**
 * Status command response
 *
 * @typedef {object} Device~statusData
 * @property {int}     cycleTime            - unit: microseconds
 * @property {int}     i2cErrorCount
 * @property {object}  sensorPresent        - sensor present
 * @property {boolean} sensorPresent.acc    - accelerometer present
 * @property {boolean} sensorPresent.baro   - barometer present
 * @property {boolean} sensorPresent.mag    - magnetometer present
 * @property {boolean} sensorPresent.gps    - GPS present
 * @property {boolean} sensorPresent.sonar  - sonar present
 * @property {Array}   boxActivation        - indicates which BOX are activates (index order is depend on boxNames)
 * @property {int}     currentSettingNumber - to indicate the current configuration settings
 */

/**
 * Get device actual status
 *
 * @param {Device~statusCallback} [callback] - callback that handles response
 *
 * @returns {null|Device~statusData} - if no callback return data, otherwise null
 */
Device.prototype.status = function (callback) {
    var self;

    self = this;

    return this._packageManager.send(101, null, function (data) {
        var i, sensorPresentSum, boxActivationSum, boxActivation, boxNames;

        sensorPresentSum = data.readUInt16LE(4);
        boxActivationSum = data.readUInt32LE(6); // flag
        boxActivation = [];
        boxNames = self.boxNames();

        for (i = 0; i < boxNames.length; i++) {
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
    }, callback);
};

/**
 * Raw imu command response callback
 *
 * @callback Device~rawImuCallback
 * @param {string|null}       error - error message, or null if no error
 * @param {Device~statusData} data  - response data
 */

/**
 * Raw imu command response
 *
 * @typedef {object} Device~rawImuData
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
 * @param {Device~rawImuCallback} [callback] - callback that handles response
 *
 * @returns {null|Device~rawImuData} - if no callback return data, otherwise null
 */
Device.prototype.rawImu = function (callback) {
    return this._packageManager.send(102, null, function (data) {
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
    }, callback);
};


Device.prototype.servo = function (callback) {
    return this._packageManager.send(103, null, function (data) {
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
    }, callback);
};


Device.prototype.motor = function (callback) {
    return this._packageManager.send(104, null, function (data) {
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
    }, callback);
};


Device.prototype.rc = function (callback) {
    return this._packageManager.send(105, null, function (data) {
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
    }, callback);
};

Device.prototype.rawGPS = function (callback) {
    return this._packageManager.send(106, null, function (data) {
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
    }, callback);
};


Device.prototype.compGPS = function (callback) {
    return this._packageManager.send(107, null, function (data) {
        return {
            distanceToHome : data.readUInt16LE(0),
            directionToHome: data.readUInt16LE(2),
            update         : data.readUInt8(4)
        };
    }, callback);
};


Device.prototype.attitude = function (callback) {
    return this._packageManager.send(108, null, function (data) {
        return {
            x      : data.readInt16LE(0) / 10,
            y      : data.readInt16LE(2) / 10,
            heading: data.readInt16LE(4)
        };
    }, callback);
};


Device.prototype.altitude = function (callback) {
    return this._packageManager.send(109, null, function (data) {
        return {
            estimated: data.readInt32LE(0),
            vario    : data.readInt16LE(4)
        };
    }, callback);
};


Device.prototype.analog = function (callback) {
    return this._packageManager.send(110, null, function (data) {
        return {
            vbat            : data.readUInt8(0) / 10,
            intPowerMeterSum: data.readUInt16LE(1),
            rssi            : data.readUInt16LE(3),
            amperage        : data.readUInt16LE(5)
        };
    }, callback);
};


Device.prototype.rcTuning = function (callback) {
    return this._packageManager.send(111, null, function (data) {
        return {
            rcRate        : data.readUInt8(0),
            rcExpo        : data.readUInt8(1),
            rollPitchRate : data.readUInt8(2),
            yawRate       : data.readUInt8(3),
            dynThrottlePID: data.readUInt8(4),
            throttleMid   : data.readUInt8(5),
            throttleExpo  : data.readUInt8(6)
        };
    }, callback);
};

Device.prototype.pid = function (callback) {
    return this._packageManager.send(112, null, function (data) {
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
    }, callback);
};

Device.prototype.box = function (callback) {
    return this._packageManager.send(113, null, function (data) {
        var i, box;

        box = [];
        for (i = 0; i < data.length; i = i + 2) {
            box[box.length] = data.readUInt16LE(i);
        }
        return box;
    }, callback);
};


Device.prototype.misc = function (callback) {
    return this._packageManager.send(114, null, function (data) {
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
    }, callback);
};


Device.prototype.motorPins = function (callback) {
    return this._packageManager.send(115, null, function (data) {
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
    }, callback);
};


Device.prototype.boxNames = function (callback, cache) {
    if (!this._cache.hasOwnProperty('boxNames') || cache === false) {
        this._cache.boxNames = this._packageManager.send(116, null, function (data) {
            return data.toString().split(';').filter(function (value) {
                return value !== '';
            });
        });
    }

    if (callback) {
        return callback(SimpleClone(this._cache.boxNames));
    }

    return SimpleClone(this._cache.boxNames);
};

Device.prototype.pidNames = function (callback, cache) {
    if (!this._cache.hasOwnProperty('pidNames') || cache === false) {
        this._cache.pidNames = this._packageManager.send(117, null, function (data) {
            return data.toString().split(';').filter(function (value) {
                return value !== '';
            });
        });
    }

    if (callback) {
        return callback(null, SimpleClone(this._cache.pidNames));
    }

    return SimpleClone(this._cache.pidNames);
};

Device.prototype.wp = function (callback) {
    return this._packageManager.send(118, null, function (data) {
        return {
            wpNo      : data.readUInt8(0),
            latitude  : data.readUInt32LE(1),
            longitude : data.readUInt32LE(5),
            altHold   : data.readUInt32LE(9),
            heading   : data.readUInt16LE(11),
            timeToStay: data.readUInt16LE(13),
            navFlag   : data.readUInt8(15)
        };
    }, callback);
};

Device.prototype.boxIDs = function (callback) {
    return this._packageManager.send(119, null, function (data) {
        var i, boxIDs;

        boxIDs = [];
        for (i = 0; i < data.length; i = i + 1) {
            boxIDs[boxIDs.length] = data.readInt8(i);
        }

        return boxIDs;
    }, callback);
};

Device.prototype.servoConf = function (callback) {
    return this._packageManager.send(120, null, function (data) {
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
    }, callback);
};

Device.prototype.setRawRc = function (options, callback) {
    var data = new Buffer(16);

    data.writeUInt16LE(options.roll, 0);
    data.writeUInt16LE(options.pitch, 2);
    data.writeUInt16LE(options.yaw, 4);
    data.writeUInt16LE(options.throttle, 6);
    data.writeUInt16LE(options.aux1, 8);
    data.writeUInt16LE(options.aux2, 10);
    data.writeUInt16LE(options.aux3, 12);
    data.writeUInt16LE(options.aux4, 14);

    this._packageManager.send(200, data, null, callback);
};

Device.prototype.setRawGPS = function (options, callback) {
    var data = new Buffer(14);

    data.writeUInt8(options.fix ? 1 : 0, 0);
    data.writeUInt8(options.numSat, 1);
    data.writeUInt32LE(options.latitude * 10000000, 2);
    data.writeUInt32LE(options.longitude * 10000000, 6);
    data.writeUInt16LE(options.altitude, 10);
    data.writeUInt16LE(options.speed, 12);

    this._packageManager.send(201, data, null, callback);
};

Device.prototype.setPID = function (options, callback) {
    var data = new Buffer(30);

    data.writeUInt8(options.roll.p, 0);
    data.writeUInt8(options.roll.i, 1);
    data.writeUInt8(options.roll.d, 2);

    data.writeUInt8(options.pitch.p, 3);
    data.writeUInt8(options.pitch.i, 4);
    data.writeUInt8(options.pitch.d, 5);

    data.writeUInt8(options.yaw.p, 6);
    data.writeUInt8(options.yaw.i, 7);
    data.writeUInt8(options.yaw.d, 8);

    data.writeUInt8(options.alt.p, 9);
    data.writeUInt8(options.alt.i, 10);
    data.writeUInt8(options.alt.d, 11);

    data.writeUInt8(options.pos.p, 12);
    data.writeUInt8(options.pos.i, 13);
    data.writeUInt8(options.pos.d, 14);

    data.writeUInt8(options.posr.p, 15);
    data.writeUInt8(options.posr.i, 16);
    data.writeUInt8(options.posr.d, 17);

    data.writeUInt8(options.navr.p, 18);
    data.writeUInt8(options.navr.i, 19);
    data.writeUInt8(options.navr.d, 20);

    data.writeUInt8(options.level.p, 21);
    data.writeUInt8(options.level.i, 22);
    data.writeUInt8(options.level.d, 23);

    data.writeUInt8(options.mag.p, 24);
    data.writeUInt8(options.mag.i, 25);
    data.writeUInt8(options.mag.d, 26);

    data.writeUInt8(options.vel.p, 27);
    data.writeUInt8(options.vel.i, 28);
    data.writeUInt8(options.vel.d, 29);

    this._packageManager.send(202, data, null, callback);
};

Device.prototype.setBox = function (box, callback) {
    var i, data;

    data = new Buffer(box.length * 2);

    for (i = 0; i < box.length; i = i + 1) {
        data.writeUInt16LE(box[i]);
    }

    this._packageManager.send(203, data, null, callback);
};

Device.prototype.setRCTuning = function (options, callback) {
    var data = new Buffer(7);

    data.writeUInt8(options.rcRate, 0);
    data.writeUInt8(options.rcExpo, 1);
    data.writeUInt8(options.rollPitchRate, 2);
    data.writeUInt8(options.yawRate, 3);
    data.writeUInt8(options.dynThrottlePID, 4);
    data.writeUInt8(options.throttleMid, 5);
    data.writeUInt8(options.throttleExpo, 6);

    this._packageManager.send(204, data, null, callback);
};

Device.prototype.accCalibration = function (callback) {
    this._packageManager.send(205, null, null, callback);
};

Device.prototype.magCalibration = function (callback) {
    this._packageManager.send(206, null, null, callback);
};

Device.prototype.setMisc = function (options, callback) {
    var data = new Buffer(22);

    data.writeUInt16LE(options.intPowerTrigger, 0);
    data.writeUInt16LE(options.minThrottle, 2);
    data.writeUInt16LE(options.maxThrottle, 4);
    data.writeUInt16LE(options.minCommand, 6);
    data.writeUInt16LE(options.failSafeThrottle, 8);
    data.writeUInt16LE(options.arm, 10);
    data.writeUInt32LE(options.lifetime, 12);
    data.writeUInt16LE(options.magDeclination, 16);
    data.writeUInt8(options.vbat.scale, 18);
    data.writeUInt8(options.vbat.level.warn1 * 10, 19);
    data.writeUInt8(options.vbat.level.warn2 * 10, 20);
    data.writeUInt8(options.vbat.level.critical * 10, 21);

    this._packageManager.send(207, data, null, callback);
};

Device.prototype.resetConf = function (callback) {
    this._packageManager.send(208, null, null, callback);
};

Device.prototype.setWp = function (options, callback) {
    var data = new Buffer(18);

    data.writeUInt8(options.wpNo, 0);
    data.writeUInt32LE(options.latitude, 1);
    data.writeUInt32LE(options.longitude, 5);
    data.writeUInt32LE(options.altHold, 9);
    data.writeUInt16LE(options.heading, 13);
    data.writeUInt16LE(options.timeToStay, 15);
    data.writeUInt8(options.navFlag, 17);

    this._packageManager.send(209, data, null, callback);
};

Device.prototype.selectSetting = function (currentSet, callback) {
    var data = new Buffer(1);

    data.writeUInt8(currentSet, 0);

    this._packageManager.send(210, data, null, callback);
};

Device.prototype.setHead = function (head, callback) {
    var data = new Buffer(2);

    data.writeInt16LE(head, 0);

    this._packageManager.send(211, data, null, callback);
};

Device.prototype.setServoConf = function (servo, callback) {
    var i, data;

    data = new Buffer(56);

    for (i = 0; i < 8; i = i + 1) {
        data.writeUInt16LE(servo[i].min, i * 7);
        data.writeUInt16LE(servo[i].max, i * 7 + 2);
        data.writeUInt16LE(servo[i].middle, i * 7 + 4);
        data.writeUInt8(servo[i].rate, i * 7 + 6);
    }

    this._packageManager.send(212, data, null, callback);
};

module.exports = Device;