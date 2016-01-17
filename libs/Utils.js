'use strict';
var path = require('path');
var chalk = require('chalk');
var os = require('os');
var marked = require('marked');
var TerminalRenderer = require('marked-terminal');
var fs = require('fs');
var Q = require('q');

marked.setOptions({renderer: new TerminalRenderer()});

var convertInput = function(parameters) {
    var args = Array.prototype.slice.call(parameters);
    args = args.map(function(value, index) {
        if (typeof value === 'object') {
            try {
                return JSON.stringify(value);
            } catch (e) {
                return value.toString();
            }
        }
        return value;
    });
    return args;
};

var wrapperPromise = function(promise) {
    promise.success = function(fn) {
        promise.then(function(data) {
            fn(data);
        });
        return promise;
    };

    promise.error = function(fn) {
        promise.then(null, function(err) {
            fn(err);
        });
        return promise;
    };

};


var Utils = {
    repeat: function(ch, sz) {
        return new Array(sz + 1).join(ch);
    },
    length: function(str) {
        var len = 0;
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 256) {
                len += 2;
                continue;
            }
            len += 1;
        }
        return len;
    },
    logger: {
        success: function() {
            var args = convertInput(arguments);
            console.log(chalk.bold.green.apply(undefined, args));
        },
        info: function() {
            var args = convertInput(arguments);
            console.log(chalk.white.apply(undefined, args));
        },
        warn: function() {
            var args = convertInput(arguments);
            console.log(chalk.bold.yellow.apply(undefined, args));
        },
        error: function() {
            var args = convertInput(arguments);
            console.log(chalk.bold.red.apply(undefined, args));
        }
    },
    printFile: function(filePath) {
        console.log(marked(fs.readFileSync(filePath, {
            encoding: 'utf8'
        })));
    },
    deferred: function() {
        var deferred = Q.defer();
        var promise = deferred.promise;
        wrapperPromise(promise);
        return deferred;
    },
    promiseWith: function(value) {
        var promise = Q.fcall(function() {
            return value;
        });
        wrapperPromise(promise);
        return promise;
    }
};




module.exports = Utils;
