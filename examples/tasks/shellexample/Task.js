'use strict';
var TaskRunner = require('../../../index');
var Shell = TaskRunner.shell;

var Task = TaskRunner.Base.extend({
    id: 'shellexample',
    name: 'The task show you how to play with shell',
    position: 2,
    run: function(cons) {
        //display all the .js files under current working directory
        new Shell(['ls -l *<%= suffix %>'], {
            suffix: '.js'
        }, true).start().then(function() {
            cons();
        }, function(err) {
            cons(err);
        });
    }
});


module.exports = Task;
