var path = require('path');
var fs = require('fs');



var HOME = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;


var readJson = function(filePath) {
    var content;
    var pref;

    try {
        content = fs.readFileSync(filePath, {
            encoding: 'utf8'
        });
    } catch ( e ) {
        return;
    }

    try {
        pref = JSON.parse(content);
    } catch ( e ) {
        return {};
    }

    return pref;
};

var writeJson = function(filePath, data) {
    var content = JSON.stringify(data);
    fs.writeFileSync(filePath, content);
};


var savePref = function(prefs) {
    if (!prefs || typeof prefs !== 'object') {
        throw new Error('prefs must be a literal object');
    }
    var _ = require('lodash');
    var data = _.defaults(prefs, this.preferences);
    this.preferences = data;
    if (fs.existsSync(this.localFile)) {
        writeJson(this.localFile, data);
        return;
    }

    writeJson(this.homeFile, data);
};


var removePref = function(keys) {
    var _ = require('lodash');
    if (!_.isArray(keys)) {
        throw new Error('keys must be array');
    }
    var data = _.omit(this.preferences, keys);
    this.preferences = data;
    if (fs.existsSync(this.localFile)) {
        writeJson(this.localFile, data);
        return;
    }
    writeJson(this.homeFile, data);
};

var removeAllPref = function() {
    var data = {};
    this.preferences = data;
    if (fs.existsSync(this.localFile)) {
        writeJson(this.localFile, data);
        return;
    }
    writeJson(this.homeFile, data);
};



var PreferenceMgr = function(fileName) {
    if (!fileName || typeof fileName !== 'string') {
        throw new Error('fileName must be string');
    }
    this.localFile = fileName;
    this.homeFile = path.join(HOME, fileName);

    var pref = readJson(this.localFile);
    if (pref) {
        this.preferences = pref;
        return;
    }
    pref = readJson(this.homeFile);
    this.preferences = pref === undefined ? {} : pref;

};

PreferenceMgr.prototype.put = function(prefs) {
    savePref.bind(this)(prefs);
};

PreferenceMgr.prototype.remove = function(keys) {
    removePref.bind(this)(keys);
};

PreferenceMgr.prototype.removeAll = function() {
    removeAllPref.bind(this)();
};

PreferenceMgr.prototype.get = function(key, defaultValue) {
    return this.preferences[key] || defaultValue || '';
};

module.exports = PreferenceMgr;