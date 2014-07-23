var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var _ = require('lodash');
var termianlMenu = require('terminal-menu');
var chalk = require('chalk');
var BaseTask = require('./libs/BaseTask');
var TaskManager = require('./libs/TaskManager');
var utils = require('./libs/Utils');
var Shell = require('./libs/Shell');
var logger = utils.logger;

var defaults = {
    title: '===============================================',
    subtitle: '-----------------------------------------',
    width: 100,
    x: 3,
    y: 2,
    version: ''
};

var exit = function(code) {
    process.exit(code);
};

var createMenu = function(opts) {
    var options = opts || {};
    options = _.defaults(options, defaults);

    var taskMgr = new TaskManager(options);

    var emitter = new EventEmitter();

    var menu = termianlMenu({
        width: options.width,
        x: 3,
        y: 2
    });

    //clean up the terminal
    menu.reset();
    //display the title
    menu.write(chalk.bold(options.title.toUpperCase()) + utils.repeat(' ', options.width - options.title.length - options.version.length - 2) + chalk.dim(options.version) + '\n');
    //display the subtitle
    menu.write(chalk.italic(options.subtitle) + '\n');
    //display start separator
    menu.write(utils.repeat('-', options.width) + '\n');


    taskMgr.getTaskList().forEach(function(task, index) {
        menu.add(chalk.bold('»') + ' ' + task.name + utils.repeat(' ', options.width - task.name.length - 1));
    });

    //display end separator
    menu.write(utils.repeat('-', options.width) + '\n');
    //display help
    menu.add(chalk.bold('HELP'));
    //display exit
    menu.add(chalk.bold('EXIT'));

    menu.on('select', function(label, index) {
        var name = chalk.stripColor(label).replace(/(^»?\s+)/g, '');

        menu.y = 0;
        menu.reset();
        menu.close();

        if (name === 'EXIT') {
            return emitter.emit('exit');
        }

        if (name === 'HELP') {
            if (fs.existsSync(options.helpFile)) {
                utils.printFile(options.helpFile);
            }
            return;
        }

        var task = taskMgr.getTaskByIndex(index);

        var runner = taskMgr.run(task.id);

        runner.on('finish', function() {
            logger.success('finish: ', task.name);
        });

        runner.on('error', function(err) {
            logger.error('failed: ', err);
            exit(0);
        });

    });

    menu.createStream().pipe(process.stdout);
    return emitter;
};

var TaskRunner = {
    Base: BaseTask,
    logger: logger,
    createMenu: createMenu,
    shell: Shell
};


module.exports = TaskRunner;