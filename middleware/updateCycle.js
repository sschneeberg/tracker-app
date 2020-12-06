const { Model } = require("sequelize");

const updateAvgs = require('./updateAvgs');
const db = require('../models');

module.exports = function(cycleLength, date, user, periodId) {
    db.period.update({
        endDate: date,
        cycleLength: cycleLength,
    }, {
        where: { id: periodId }
    }).then(() => {
        db.period.findOne({
            where: { id: periodId }
        }).then(period => {
            periodLength = period.getLength();
            //update user avgs, call fcn, don't await b/c don't need data immediately
            updateAvgs(user, cycleLength, periodLength);
            db.period.update({
                periodLength: periodLength
            }, {
                where: { id: periodId }
            }).then(() => {}).catch(err => console.log(err))
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
}