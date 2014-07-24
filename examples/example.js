#!/usr/bin/env node

var path = require('path');
var TaskRunner = require('../index');


TaskRunner.createMenu({
    title: 'This is Header',
    subtitle: 'here is subTitle',
    taskDir: path.resolve(__dirname, 'tasks'),
    helpFile: path.resolve(__dirname, 'help.txt'),
    version: 'v1.0.4'
});