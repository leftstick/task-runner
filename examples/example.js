#!/usr/bin/env node

'use strict';
var path = require('path');
var TaskRunner = require('../index');
var pkg = require('../package');
var taskList = require('./taskList');


TaskRunner.createMenu({
    title: 'This is Header',
    subtitle: 'here is subTitle',
    helpTxt: '帮助',
    taskDir: path.resolve(__dirname, 'tasks'),
    taskList: taskList,
    helpFile: path.resolve(__dirname, 'help.txt'),
    version: pkg.version,
    preferenceName: '.runner'
});
