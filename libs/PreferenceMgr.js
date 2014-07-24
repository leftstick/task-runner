var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var Q = require('terminal-task-runner').Q;


var HOME = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
var LOCAL_SETTING;
var SETTING;


var readJson = function(filePath) {
    var d = Q.defer();

    var jsonSettings;

    fs.readFile(filePath, {
        encoding: 'utf8'
    }, function(err, data) {
        if (err) {
            d.resolve();
            return;
        }

        if (!data.trim()) {
            d.resolve();
            return;
        }

        try {
            jsonSettings = JSON.parse(data);
        } catch (e) {
            d.reject(filePath + ' is not a valid json file');
            return;
        }

        d.resolve(jsonSettings);

    });

    return d.promise;
};

var writeJson = function(filePath, data) {
    var _this = this;
    var d = Q.defer();
    var content;
    try {
        content = JSON.stringify(data);
    } catch (e) {
        setTimeout(function() {
            d.reject('input is not a valid json');
        }, 0);
        return;
    }

    fs.writeFile(filePath, content, {
        encoding: 'utf8'
    }, function(err) {
        if (err) {
            d.reject('save ' + filePath + ' failed');
            return;
        }
        _this.preferences = data;
        d.resolve();
    });

    return d.promise;
};


var saveSettings = function(param, filePath) {
    if (!param || typeof param !== 'object') {
        throw new Error('param must be a literal object');
    }
    var _this = this;
    var newSettings;
    var promise = readJson(filePath).then(function(settings) {
        var defaults = {};
        if (settings) {
            defaults = settings;
        }
        newSettings = _.defaults(param, defaults);
        return writeJson.bind(_this)(filePath, newSettings);
    }, function(err) {
        return writeJson.bind(_this)(filePath, param);
    });

    return promise;
};


var removeSettings = function(keys, filePath) {
    if (!_.isArray(keys)) {
        throw new Error('keys must be array');
    }

    var _this = this;

    var promise = readJson(filePath).then(function(settings) {
        var defaults = {};
        if (settings) {
            defaults = settings;
        }
        newSettings = _.omit(defaults, keys);
        return writeJson.bind(_this)(filePath, newSettings);
    }, function(err) {
        return writeJson.bind(_this)(filePath, {});
    });
    return promise;
};



var PreferenceMgr = function(fileName) {
    if (!fileName) {
        throw new Error('fileName must be string');
    }

    this.localFile = fileName;
    this.homeFile = path.join(HOME, fileName);
};

PreferenceMgr.prototype.load = function() {
    var _this = this;

    var d = Q.defer();

    readJson(this.localFile)
        .then(function(settings) {
            if (settings) {
                return Q.fcall(function() {
                    return settings;
                });
            }
            return readJson(_this.homeFile);
        })
        .then(function(settings) {
            if (settings) {
                _this.preferences = settings;
                d.resolve();
                return;
            }
            _this.preferences = {};
            d.resolve();
        })
        .fail(function(err) {
        _this.preferences = {};
        d.resolve();
    });

    return d.promise;
};

PreferenceMgr.prototype.put = function(param) {
    return saveSettings.bind(this)(param, this.homeFile);
};

PreferenceMgr.prototype.putLocal = function(param) {
    return saveSettings.bind(this)(param, this.localFile);
};

PreferenceMgr.prototype.remove = function(keys) {
    return removeSettings.bind(this)(keys, this.homeFile);
};

PreferenceMgr.prototype.removeLocal = function(keys) {
    return removeSettings.bind(this)(keys, this.localFile);
};

PreferenceMgr.prototype.get = function(key, defaultValue) {
    return this.preferences[key] || defaultValue;
};

module.exports = PreferenceMgr;