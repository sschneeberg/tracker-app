const monthMap = {
    01: 'January',
    02: 'February',
    03: 'March',
    04: 'April',
    05: 'May',
    06: 'June',
    07: 'July',
    08: 'August',
    09: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
}

module.exports = function(month) {
    let key = month;
    if (month < 10) {
        key = month.split('')[1];
    }
    return monthMap[key]
}