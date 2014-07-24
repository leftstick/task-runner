var TaskRunner = require('../../../index');
var logger = TaskRunner.logger;



var Task = TaskRunner.Base.extend({
    id: 'helloTask',
    name: 'This is only a hello world task',
    position: 1,
    run: function (cons) {
        //Task has to be asynchronous, otherwise, you won't receive the finish/error event
        process.nextTick(function () {
            logger.warn('hello, world!!');
            cons();
        });
    }
});


module.exports = Task;