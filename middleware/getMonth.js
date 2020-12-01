const monthMap = {
    January: 01,
    February: 02,
    March: 03,
    April: 04,
    May: 05,
    June: 06,
    July: 07,
    August: 08,
    September: 09,
    October: 10,
    November: 11,
    December: 12
}

module.exports = function(month) {
    return monthMap[month]
}