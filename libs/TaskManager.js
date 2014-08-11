'use strict';
var fs = require('fs');
var path = require('path');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var utils = require('./Utils');

var finishHandler = function(err) {
    var args = Array.prototype.slice.call(arguments, 1);
    if (!err) {
        args.unshift('finish');
    } else {
        args.unshift(err);
        args.unshift('error');
    }

    EventEmitter.prototype.emit.apply(this.emitter, args);
};

var TaskManager = function(opts) {
    this.taskDir = opts.taskDir;
    this.preferenceMgr = opts.preferenceMgr;
    this.emitter = new EventEmitter();
};

TaskManager.prototype.getTaskList = function() {
    var _this = this;
    if (this._tasks) {
        return utils.promiseWith(_this._tasks);
    }
    if (!this.taskDir) {
        return utils.promiseWith([]);
    }

    var deferred = utils.deferred();
    fs.readdir(this.taskDir, function(err, files) {
        if (err) {
            deferred.reject(err);
            return;
        }
        _this._tasks = files.map(function(file, index) {
            var p = path.resolve(_this.taskDir, file, 'Task');
            var TaskMod = require(p);
            var task = new TaskMod(p, _this.preferenceMgr);
            return task;
        });

        _this._tasks = _.sortBy(_this._tasks, function(task) {
            return task.position;
        });

        deferred.resolve(_this._tasks);

    });

    return deferred.promise;
};

TaskManager.prototype.getTaskByIndex = function(index) {
    return this._tasks[index];
};

TaskManager.prototype.run = function(taskId) {
    var task = _.find(this._tasks, function(task) {
        return task.id === taskId;
    });


    if (!task) {
        throw new Error('Task [' + taskId + '] is not valid.');
    }

    task.run(finishHandler.bind(this));

    return this.emitter;
};

module.exports = TaskManager;