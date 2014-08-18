var describe = require('mocha').describe;
var afterEach = require('mocha').afterEach;
var it = require('mocha').it;
var should = require('should');

describe('test utils', function() {

    it('test repeat', function(done) {
        var utils = require('../libs/Utils');
        var expected = '---';
        utils.repeat('-', 3).should.equal(expected);
        done();
    });


    it('test length', function(done) {
        var utils = require('../libs/Utils');
        var str1 = 'you';
        var str2 = '你';
        utils.length(str1).should.equal(3);
        utils.length(str2).should.equal(2);
        done();
    });

});