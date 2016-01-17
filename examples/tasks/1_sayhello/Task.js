var TaskRunner = require('../../../index');
var logger = TaskRunner.logger;



var Task = TaskRunner.Base.extend({
    id: 'helloTask',
    name: 'This is only a hello world task',
    run: function(cons) {
        logger.warn('hello, world!!');
        cons();
    }
});


module.exports = Task;
