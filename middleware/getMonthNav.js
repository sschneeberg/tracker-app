module.exports = function(monthNum) {
    let prevMonth = parseInt(monthNum) - 1;
    let nextMonth = parseInt(monthNum) + 1;
    if (prevMonth === 0) {
        prevMonth = 12;
    }
    if (nextMonth === 13) {
        nextMonth = 1;
    }
    if (prevMonth < 10) {
        prevMonth = '0' + prevMonth;
    }
    if (nextMonth < 10) {
        nextMonth = '0' + nextMonth
    }

    return [prevMonth.toString(), nextMonth.toString()]

}