const moment = require('moment');

module.exports = function(day, periodWeek, multiple) {
    //check if day in period week
    if (multiple) {
        periodWeek.forEach(week => {
            for (let i = 0; i < week.length; i++) {
                console.log(moment(week[i]))
                if (moment(day).format('YYYY MM DD') === moment(week[i]).format('YYYY MM DD')) {
                    console.log('here')
                    return (i + 1);
                }
            }
        })
    } else {
        for (let i = 0; i < periodWeek.length; i++) {
            console.log('hello!!')
            if (moment(day).format('YYYY MM DD') === moment(periodWeek[i]).format('YYYY MM DD')) {
                console.log('here')
                return (i + 1);
            }
        }
    }
    return false;
}