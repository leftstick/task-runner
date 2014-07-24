var extend = require('class-extend').extend;
var utils = require('./Utils');

var checkOpts = function (obj, key) {
    if (typeof obj[key] === 'string' && obj[key].trim() === '') {
        throw new Error('[' + key + '] must be overwritten in [' + obj.path + '] Task');
    }
    if (typeof obj[key] === 'number' && obj[key] === 0) {
        throw new Error('[' + key + '] must be overwritten in [' + obj.path + '] Task');
    }
};

var BaseTask = function (path, preferenceMgr) {
    this.path = path;
    this.preferenceMgr = preferenceMgr;
    this.validateMandatory();
};

BaseTask.prototype.id = '';

BaseTask.prototype.name = '';

BaseTask.prototype.position = 0;

BaseTask.prototype.validateMandatory = function () {
    checkOpts(this, 'id');
    checkOpts(this, 'name');
    checkOpts(this, 'position');
};

BaseTask.prototype.get = function (key, defaultValue) {
    if (!this.preferenceMgr) {
        throw new Error('You haven\'t set PreferenceMgr properly');
    }
    if (!key || typeof key !== 'string') {
        throw new Error('The key must be string');
    }
    return this.preferenceMgr.get(key, defaultValue);
};

BaseTask.prototype.put = function (prefs) {
    if (!this.preferenceMgr) {
        throw new Error('You haven\'t set PreferenceMgr properly');
    }
    return this.preferenceMgr.put(prefs);
};

BaseTask.prototype.remove = function (keys) {
    if (!this.preferenceMgr) {
        throw new Error('You haven\'t set PreferenceMgr properly');
    }
    return this.preferenceMgr.remove(keys);
};

BaseTask.prototype.run = function (cons) {
    //needs to be implemented in subclass
};

BaseTask.extend = extend;

module.exports = BaseTask;