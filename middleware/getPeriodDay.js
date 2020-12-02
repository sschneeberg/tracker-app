const moment = require('moment');

module.exports = function(period, dayNum) {
    if (!period) { return null; }
    let periodDay = 0;
    //get week
    let periodWeek = period.getDays();
    for (day of periodWeek) {
        //find matching day
        if (moment(day).format('D') === dayNum) {
            periodDay = periodWeek.indexOf(day) + 1
        }
    }
    return periodDay;
}