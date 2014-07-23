## How to write your own task ##

### Specify the location where the tasks placed ###

```JavaScript
var TaskRunner = require('terminal-task-runner');

TaskRunner.createMenu({
    title: 'This is Header',
    subtitle: 'here is subTitle',
    taskDir: '/d/users/tasks'
});
```

### Create folder for your first task ###

The folder should be created under the above `tasks`'s directory.

Like:

<pre>
tasks
    |--firsttask
    |--another
    ......
</pre>

### Write your first task ###

Create `Task.js` file under `~/tasks/firsttask/`, like:

<pre>
tasks
    |--firsttask
               |--Task.js
</pre>

Copy following codes in it:

```JavaScript
var TaskRunner = require('terminal-task-runner');
var logger = TaskRunner.logger;



var Task = TaskRunner.Base.extend({
    id: 'helloTask',
    name: 'This is only a hello world task',
    priority: 1,
    run: function(cons) {
        //Task has to be asynchronous, otherwise, you won't receive the finish/error event
        setTimeout(function() {
            logger.warn('hello, world!!');
            cons();
        });
    }
});


module.exports = Task;
```

| Attribute        | Type           | Required  | Description |
| :------------- |:-------------| :-----:| :-----|
| id | string | Yes | the unique identifier of the task |
| name | string | Yes | the description display on the terminal ui |
| priority | number | Yes | indicates the position on the terminal ui of the task |
| run | function | Yes | the callback while user selected the task. One argument `cons` will be passed into this function, once the task executed completely, you should call `cons`. If error occurs, call `cons` with the err as argument. Note: the `run` callback has to be asynchronous, otherwise, you won't receive the finish/error event |