const moment = require('moment');

module.exports = function(monthNum, dayNum, cycleLength) {
    let day = new Date(2020, (monthNum - 1), dayNum)
    let startDay = moment(day);
    let endDay = moment(day);
    let startRange = [];
    let endRange = [];
    for (let i = 0; i < cycleLength; i++) {
        startRange.push(`CAST('${startDay.format('YYYY MM DD').split(' ').join('-')}' AS Text)`);
        endRange.push(`CAST('${endDay.format('YYYY MM DD').split(' ').join('-')}' AS Text)`);
        startDay.subtract(1, 'd');
        endDay.add(1, 'd');
    }
    return [startRange, endRange];
}