var expect = require('chai').expect;
var db = require('../models');
const Op = require('sequelize');
var moment = require('moment');

before(function(done) {
    db.sequelize.sync({ force: true }).then(function() {
        done();
    });
});

describe('Finding User data', function() {
    it('Should find all periods linked to a user', function(done) {
        db.user.findOne().then(user => {
            db.period.findAll({ where: { userId: user.id } }).then(() => {
                done();
            }).catch(err => { done(err); })
        }).catch(err => { done(err); })
    });

    it('Should find all information for a given date for a user', function(done) {
        db.user.findOne().then(user => {
            db.period.findOne({
                where: {
                    [Op.and]: [{ userId: user.id },
                        {
                            date: {
                                [Op.between]: [moment().format('M D YYYY').subtract(7, 'd'), moment().format('M D YYYY').add(7, 'd')]
                            }
                        }
                    ]
                },
                include: [db.symptom, db.note]
            }).then(() => {
                done();
            }).catch(err => { done(err); })
        }).catch(err => { done(err); })
    }).catch(err => { done(err); })
})