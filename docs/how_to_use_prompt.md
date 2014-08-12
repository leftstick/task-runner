## How to use build-in prompt ##

Calling `prompt` with `this` identifer. Check following example: 

```JavaScript
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
        }], function(res) {
                logger.info('Your name is:', res.name);
                cons();
            });
    }
});
```

For the detail usage of `prompt`, refer to: [inquirer](https://github.com/SBoudrias/Inquirer.js)