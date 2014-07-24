var TaskRunner = require('../../../index');
var logger = TaskRunner.logger;



var Task = TaskRunner.Base.extend({
    id: 'preftest',
    name: 'This task helps you understand how PreferenceMgr works',
    position: 3,
    run: function (cons) {
        logger.warn('[' + this.get('name') + ']');
        this.put({
            what: 'nanfeng'
        });
        logger.info('[' + this.get('what') + ']');
    }
});


module.exports = Task;