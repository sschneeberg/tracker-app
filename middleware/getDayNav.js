const getMonthLength = require("./getMonthLength");

module.exports = function(day, month) {
    let monthLength = getMonthLength(month);
    let prevDay = parseInt(day) - 1;
    let nextDay = parseInt(day) + 1;
    if (prevDay === 0) {
        prevDay = monthLength;
    }
    if (nextDay === (monthLength + 1)) {
        nextDay = 1;
    }
    return [prevDay, nextDay]
}