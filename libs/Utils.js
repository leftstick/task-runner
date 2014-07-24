var path = require('path');
var chalk = require('chalk');
var os = require('os');
var colorsTmpl = require('colors-tmpl');
var fs = require('fs');

var isWin = os.platform().indexOf('win') > -1;

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


var Utils = {
    isWindows: isWin,
    separator: isWin ? '\\' : '/',
    joinWorkingPath: function(filePath) {
        var p = filePath.replace(/\//g, this.separator);
        return path.join('.', p);
    },
    repeat: function(ch, sz) {
        return new Array(sz + 1).join(ch);
    },
    convertPath: function(path) {
        var p = path;
        if (isWin) {
            p = p.replace(/\\/g, '\\\\');
        }
        return p;
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
        var contents;
        try {
            contents = fs.readFileSync(this.convertPath(filePath), {
                encoding: 'utf8'
            });

            contents = colorsTmpl(contents);

            console.log(contents);
        } catch (e) {
            throw e;
        }

    }
};




module.exports = Utils;