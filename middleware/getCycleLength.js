module.exports = function(end, prevEnd) {
    let cycleLength = Math.floor((Date.parse(end) - Date.parse(prevEnd)) / 86400000) + 1;
    return cycleLength
}