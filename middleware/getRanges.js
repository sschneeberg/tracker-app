module.exports = function(dayNum, cycleLength) {
    let startRange = [];
    let endRange = [];
    for (i = 0; i >= cycleLength; i++) {
        startRange.push(dayNum - i);
        endRange.push(dayNum + i);
    }
    return [startRange, endRange];
}