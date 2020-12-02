const monthLengthMap = {
    01: 31,
    02: 28,
    03: 31,
    04: 30,
    05: 31,
    06: 30,
    07: 31,
    08: 31,
    09: 30,
    10: 31,
    11: 30,
    12: 31
}

module.exports = function(month) {
    let key = month;
    if (month < 10) { key = month.split('')[1] }
    return monthLengthMap[key]
}