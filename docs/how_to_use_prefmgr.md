## How to play with PreferenceMgr ##

There are two places from where you may find the `preferenceName`.

1. `current working directory`
2. `HOME`

Once the applicaton launched, `PreferenceMgr` loads preferences from `./preferenceName` if exists, otherwise, loads from `HOME/preferenceName`.

The same concept apply on saving preferences.


### Usage ###

You can only use `PreferenceMgr` within the `Task` by `this` identifer.

```JavaScript
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
```

#### this.get(key, defaultValue) ####

The string value of the `preference` indicated by the key returned

##### key
Type: `string`

Required: true

The identifer of a `preference`.

##### defaultValue
Type: `string`

Required: false

The value will be returned if the `preference` is not found.

#### this.put(prefs) ####

##### prefs
Type: `object`

Required: true

The `preference` will be stored in `prefName`.

#### this.remove(keys) ####

##### keys
Type: `array`

Required: true

The array of `key` you want to remove from `prefName`.

#### this.removeAll() ####


Clean the preferences.