const db = require('../models');

module.exports = function(user, cycleLength, periodLength) {
    //not super accurate but will give a decent avg with more entries
    let newAvgCycle = Math.floor((user.avgCycle + cycleLength) / 2);
    let newAvgperiod = Math.floor((user.avgPeriod + periodLength) / 2);
    db.user.update({
        avgPeriod: newAvgperiod,
        avgCycle: newAvgCycle
    }, {
        where: { id: user.id }
    }).catch(err => { console.log(err) })
}