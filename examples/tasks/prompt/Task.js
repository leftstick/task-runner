'use strict';

var TaskRunner = require('../../../index');
var logger = TaskRunner.logger;

var Task = TaskRunner.Base.extend({
    id: 'prompttest',
    name: 'This task helps you understand how to play with inner prompt',
    position: 4,
    run: function(cons) {
        this.prompt([{
            type: 'input',
            name: 'name',
            message: 'your name',
            validate: function(pass) {
                return !!pass;
            }
        }, {
            type: 'input',
            name: 'project',
            message: 'your project',
            default: 'project'
        }], function(res) {
            logger.info('Your input is:', res);
            cons();
        });
    }
});


module.exports = Task;
