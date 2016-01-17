'use strict';
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var _ = require('lodash');
var termianlMenu = require('terminal-menu');
var chalk = require('chalk');
var Q = require('q');
var BaseTask = require('./libs/BaseTask');
var TaskManager = require('./libs/TaskManager');
var utils = require('./libs/Utils');
var Shell = require('./libs/Shell');

var logger = utils.logger;

var defaults = {
    title: '===============================================',
    subtitle: '-----------------------------------------',
    helpTxt: 'HELP',
    exitTxt: 'EXIT',
    width: 100,
    x: 3,
    y: 2,
    version: '',
    helpFile: undefined,
    preferenceName: undefined,
    onFinish: function(id, name) {
        logger.success('finish: ', name);
    },
    onError: function(id, name, err) {
        logger.error('failed: ', err);
    }
};

var exit = function(code) {
    process.exit(code);
};

var createMenu = function(opts) {
    var options = opts || {};
    options = _.defaults(options, defaults);

    var taskMgr = new TaskManager(options);

    var emitter = new EventEmitter();


    taskMgr.getTaskList().success(function(tasks) {
        var menu = termianlMenu({
            width: options.width,
            x: 3,
            y: 2
        });
        //clean up the terminal
        menu.reset();
        //display the title
        menu.write(chalk.bold(options.title.toUpperCase()) + utils.repeat(' ', options.width - utils.length(options.title, 'utf-8') - options.version.length - 2) + chalk.dim(options.version) + '\n');
        //display the subtitle
        menu.write(chalk.italic(options.subtitle) + '\n');
        //display start separator
        menu.write(utils.repeat('-', options.width) + '\n');


        tasks.forEach(function(task) {
            menu.add(chalk.bold('»') + ' ' + task.name + utils.repeat(' ', options.width - utils.length(task.name) - 3));
        });

        //display end separator
        menu.write(utils.repeat('-', options.width) + '\n');
        //display help
        if (fs.existsSync(options.helpFile)) {
            menu.add(chalk.bold(options.helpTxt) + utils.repeat(' ', options.width - utils.length(options.helpTxt) - 1));
        }
        //display exit
        menu.add(chalk.bold(options.exitTxt) + utils.repeat(' ', options.width - utils.length(options.exitTxt) - 1));

        var isTaskRunning;
        menu.on('select', function(label, index) {
            var name = chalk.stripColor(label).replace(/(^»?\s+)|(\s+$)/g, '');

            menu.y = 0;
            menu.reset();
            menu.close();

            isTaskRunning = false;


            if (name === options.exitTxt) {
                return emitter.emit('exit');
            }

            if (name === options.helpTxt) {
                utils.printFile(options.helpFile);
                return;
            }

            var task = taskMgr.getTaskByIndex(index);

            isTaskRunning = true;
            var runner = taskMgr.run(task.id);

            runner.on('finish', function() {
                options.onFinish(task.id, task.name);
                process.stdin.end();
            });

            runner.on('error', function(err) {
                options.onError(task.id, task.name, err);
                exit(0);
            });

        });

        process.stdin.pipe(menu.createStream()).pipe(process.stdout);
        process.stdin.setRawMode(true);

        menu.on('close', function() {
            process.stdin.setRawMode(false);
            if (!isTaskRunning) {
                process.stdin.end();
            }
        });
    }).error(function(err) {
        logger.error('failed: ', err);
    });


    return emitter;
};

var TaskRunner = {
    Base: BaseTask,
    logger: logger,
    printFile: utils.printFile,
    createMenu: createMenu,
    shell: Shell,
    Q: Q
};


module.exports = TaskRunner;
