var TaskRunner = require('../../../index');
var logger = TaskRunner.logger;



var Task = TaskRunner.Base.extend({
    id: 'chinese',
    name: '这是一个中文task',
    position: 5,
    run: function(cons) {
        logger.warn('您好，世界');
    }
});


module.exports = Task;