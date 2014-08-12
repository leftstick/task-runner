var extend = require('class-extend').extend;

var checkOpts = function(obj, key) {
    if (typeof obj[key] === 'string' && obj[key].trim() === '') {
        throw new Error('[' + key + '] must be overwritten in [' + obj.path + '] Task');
    }
    if (typeof obj[key] === 'number' && obj[key] === 0) {
        throw new Error('[' + key + '] must be overwritten in [' + obj.path + '] Task');
    }
};

var preferenceMgr = function() {
    var PreferenceMgr = require('./PreferenceMgr');
    if (!this.preferenceMgr) {
        this.preferenceMgr = new PreferenceMgr(this.preferenceName);
    }
    return this.preferenceMgr;
};

var BaseTask = function(opts) {
    this.path = opts.path;
    this.preferenceName = opts.preferenceName;
    this.validateMandatory();
};

BaseTask.prototype.id = '';

BaseTask.prototype.name = '';

BaseTask.prototype.position = 0;

BaseTask.prototype.validateMandatory = function() {
    checkOpts(this, 'id');
    checkOpts(this, 'name');
    checkOpts(this, 'position');
};

BaseTask.prototype.get = function(key, defaultValue) {
    if (!this.preferenceName) {
        throw new Error('You haven\'t set preferenceName properly');
    }
    if (!key || typeof key !== 'string') {
        throw new Error('The key must be string');
    }

    return preferenceMgr.bind(this)().get(key, defaultValue);
};

BaseTask.prototype.put = function(prefs) {
    if (!this.preferenceName) {
        throw new Error('You haven\'t set preferenceName properly');
    }
    return preferenceMgr.bind(this)().put(prefs);
};

BaseTask.prototype.remove = function(keys) {
    if (!this.preferenceName) {
        throw new Error('You haven\'t set preferenceName properly');
    }
    return preferenceMgr.bind(this)().remove(keys);
};

BaseTask.prototype.prompt = function(questions, callback) {
    var inquirer = require('inquirer');
    inquirer.prompt(questions, callback);
};

BaseTask.prototype.run = function(cons) {
    //needs to be implemented in subclass
};

BaseTask.extend = extend;

module.exports = BaseTask;