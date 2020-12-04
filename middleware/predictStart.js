const moment = require('moment');

module.exports = function(periods, user) {
    if (periods.length > 0) {
        let recentPeriod = periods[periods.length - 1];
        let endDate = recentPeriod.endDate;
        let length = user.avgCycle;
        let predictedStart = moment(endDate).add(length, 'd')
        return moment(predictedStart).format('MMM D, YYYY');
    } else {
        return null;
    }
}