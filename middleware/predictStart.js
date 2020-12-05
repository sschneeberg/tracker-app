const moment = require('moment');

module.exports = function(today, periods, user) {
    if (periods.length > 0) {
        let recentPeriod = periods[periods.length - 1];
        let endDate = recentPeriod.endDate;
        let length = user.avgCycle;
        if (moment(today).format('M') === moment(endDate).format('M')) {
            let predictedStart = moment(endDate).add(length, 'd')
            return moment(predictedStart).format('MMM D, YYYY');
        }
    } else {
        return false;
    }
}