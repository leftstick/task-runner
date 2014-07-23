task-runner
===========

![](http://img.shields.io/badge/npm_module-v1.0.0-green.svg?style=flat)  ![](http://img.shields.io/badge/dependencies-latest-yellowgreen.svg?style=flat)
![](http://img.shields.io/badge/build-passing-brightgreen.svg?style=flat)

> Terminal task execution system

![](https://raw.githubusercontent.com/leftstick/task-runner/master/docs/img/example.png)

Task-runner is a node UI framework for task execution. Developer can only focus on the task logic. Framework will generate the terminal menu for you.

**task-runner** is now used by [sero-cli](https://github.com/leftstick/Sero-cli).

## High-level overview ##

`task-runner` is runner system with a lovely terminal UI. Which also provide some cool features to ease the way of implementing tasks. 

## Installation ##

```shell
npm install task-runner --save
```

## Usage ##

```JavaScript
var TaskRunner = require('task-runner');

TaskRunner.createMenu({
    title: 'This is Header',
    subtitle: 'here is subTitle'
});
```

By doing above, you've created a very simple terminal menu as following:

![](https://raw.githubusercontent.com/leftstick/task-runner/master/docs/img/step01.png)


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


[How to write your own task](./docs/how_to_write_task.md)


Welcome to play with the example as your skeleton. 


## LICENSE ##

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
