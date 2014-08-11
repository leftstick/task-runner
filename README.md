terminal-task-runner
===========

![](http://img.shields.io/badge/npm_module-v1.1.0-green.svg?style=flat)  ![](http://img.shields.io/badge/dependencies-latest-yellowgreen.svg?style=flat)
![](http://img.shields.io/badge/build-passing-brightgreen.svg?style=flat)

> Terminal task execution system

![](https://raw.githubusercontent.com/leftstick/task-runner/master/docs/img/example.png)

Terminal-task-runner is a node UI framework for task execution. Developer can only focus on the task logic. Framework will generate the terminal menu for you.

**terminal-task-runner** is now used by [sero-cli](https://github.com/leftstick/Sero-cli).

## High-level overview ##

`terminal-task-runner` is runner system with a lovely terminal UI. Which also provide some cool features to ease the way of implementing tasks. 

## Installation ##

```shell
npm install terminal-task-runner --save
```

## Usage ##

```JavaScript
var TaskRunner = require('terminal-task-runner');

TaskRunner.createMenu({
    title: 'This is Header',
    subtitle: 'here is subTitle'
});
```

By doing above, you've created a very simple terminal menu as following:

![](https://raw.githubusercontent.com/leftstick/task-runner/master/docs/img/step01.png)

[How to write your own task](./docs/how_to_write_task.md)
> Welcome to play with the example as your skeleton. 


## API ##

### TaskRunner.createMenu(options) ###

#### options
Type: `Object`

Options to pass to `createMenu`

#### options.title
Type: `String`
Default: `=====================`

The title displayed on the top of the terminal ui. 

#### options.subtitle
Type: `String`
Default: `--------------------`

The subtitle displayed below the `title`.

#### options.width
Type: `number`
Default: 100

menu width in columns.

#### options.x
Type: `number`
Default: 3

top-left corner x offset.


#### options.y
Type: `number`
Default: 2

top-left corner y offset.

#### options.taskDir
Type: `String`

The location of where the tasks placed.

#### options.taskList
Type: `array`
Optional: true

The the list of task folders. If not specified, `task-runner` will go through all the folders under `taskDir`.

#### options.helpFile
Type: `String`

The location of where the help file placed. A help file should be written in [colors-tmpl](https://github.com/rvagg/colors-tmpl) style.

#### options.version
Type: `String`
Default: ''

The version will be displayed at the right of the title.

### TaskRunner.Base ###

Your own task should extend from it.

```JavaScript
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
```

### TaskRunner.logger ###

Print stuff to the terminal instead of the original `console`.

```JavaScript
var logger = TaskRunner.logger;

logger.info('information');          //print in white
logger.success('congratulation');    //print in green
logger.warn('warning');              //print in yellow
logger.error('error');               //print in red
```

### TaskRunner.shell(commands, variables) ###

#### commands
Type: `Array`

Commands to pass to `new Shell`

##### command
Type: `String`

The command you'd like to execute. A command can contains variable which will be replaced later before executed by `Shell`, the varible syntax should apply [lodash](http://lodash.com/docs#template)

#### variables
Type: `Object`

The object used to replace the variable in command by using [lodash](http://lodash.com/docs#template)'s template engine.

```JavaScript
var Shell = TaskRunner.shell;

new Shell(['ls -l *<%= suffix %>'], {
                suffix: '.js'
    }).start().then(function() {
        cons();
    }, function(err) {
        cons(err);
});
```


### TaskRunner.Q ###

[Q](https://github.com/kriskowal/q) as default promise implementation is recommended.

### TaskRunner.getPrefMgr(prefName) ###

The instance of PreferenceMgr returned.

#### prefName
Type: `string`

The preference file name. For example: `.sero`

[How to play with PreferenceMgr](./docs/how_to_use_prefmgr.md)


## LICENSE ##

[MIT License](https://raw.githubusercontent.com/leftstick/task-runner/master/LICENSE)
