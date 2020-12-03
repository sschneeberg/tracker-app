const moment = require('moment');

module.exports = function(day, periodWeek, multiple) {
    let dayOf = false;
    //check if day in period week
    if (multiple) {
        periodWeek.forEach(week => {
            for (let i = 0; i < week.length; i++) {
                if (moment(day).format('YYYY MM DD') === moment(week[i]).format('YYYY MM DD')) {
                    dayOf = (i + 1);
                }
            }
        })
    } else {
        for (let i = 0; i < periodWeek.length; i++) {
            if (moment(day).format('YYYY MM DD') === moment(periodWeek[i]).format('YYYY MM DD')) {
                dayOf = (i + 1);
            }
        }
    }
    return dayOf;
}