const expect = require('chai').expect;
const request = require('supertest');
const getMonth = require('../middleware/getMonth');

describe('Grabbing month name from number', function() {
    it('should return a string', function(done) {
        let monthName = getMonth('11');
        if ((typeof monthName) === 'string') {
            done();
        } else {
            done(monthName);
        }
    });

    it('should successfully handle any exsisting key', function(done) {
        let months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        for (i = 0; i < months.length; i++) {
            if (monthNames.indexOf(months[i]) === -1) {
                done(months[i]);
            }
        }

    });

});