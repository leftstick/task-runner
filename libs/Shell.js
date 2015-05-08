'use strict';

var Q = require('q');
var exec = require('child_process').exec;
var _ = require('lodash');


var Executor = function(cmds, variables, displayCmdItself) {
    this.commands = cmds.slice();
    this.variables = variables;
    this.displayCmdItself = displayCmdItself;
    if (typeof variables === 'boolean') {
        this.variables = undefined;
        this.displayCmdItself = variables;
    }
    var self = this;

    if (!_.isArray(this.commands)) {
        throw new Error('Commands has to be an array');
    }

    if (this.variables) {
        this.commands = [];
        _.each(cmds, function(cmd) {
            this.push(_.template(cmd)(self.variables));
        }, this.commands);
    }
    this._run = function(defer) {
        var _this = this;
        if (!this.hasNext()) {
            defer.resolve();
            return;
        }

        this.next().then(function() {
            _this._run(defer);
        }, function(err) {
            defer.reject(err);
        });
    };

};


Executor.prototype.hasNext = function() {
    return this.commands.length > 0;
};

Executor.prototype.next = function() {
    var cmd = this.commands.shift();
    var d = Q.defer();

    if (this.displayCmdItself) {
        console.log(cmd);
    }

    var cp = exec(cmd, {
        maxBuffer: 5000 * 1024
    }, function(error) {
        if (error) {
            d.reject(error);
            return;
        }
        d.resolve();
    });

    cp.stdout.pipe(process.stdout);
    cp.stderr.pipe(process.stderr);

    return d.promise;
};

Executor.prototype.start = function() {
    var d = Q.defer();

    this._run(d);

    return d.promise;
};

/**
 *
 * @param cmds(array) consist of cmd
 * @param variable(object) replace the variable in each command by using lodash's template engine
 *
 *
 **/
module.exports = Executor;
