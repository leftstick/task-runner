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
    this.emitter = new EventEmitter();
};

TaskManager.prototype.getTaskList = function() {
    var _this = this;
    if (this._tasks) {
        return this._tasks;
    }
    if (!this.taskDir) {
        return [];
    }
    var taskFolders = fs.readdirSync(this.taskDir);

    this._tasks = taskFolders.map(function(file, index) {
        var p = path.resolve(_this.taskDir, file, 'Task');
        var TaskMod = require(p);
        var task = new TaskMod(p);
        return task;
    });

    this._tasks = _.sortBy(_this._tasks, function(task) {
        return task.priority;
    });

    return this._tasks;
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