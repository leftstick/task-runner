var Q = require('q');
var exec = require('child_process').exec;
var _ = require('lodash');


var Executor = function(cmds, variables) {
    this.commands = cmds.slice();

    if (!_.isArray(this.commands)) {
        throw new Error('Commands has to be an array');
    }

    if (variables) {
        this.commands = [];
        _.each(cmds, function(cmd) {
            this.push(_.template(cmd)(variables));
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

    var cp = exec(cmd, {
        maxBuffer: 5000 * 1024
    }, function(error, stdout, stderr) {
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
