const db = require('../models');
const sequelize = require('sequelize');

module.exports = async function(userid, startRange, endRange) {
    const period = await db.period.findOne({
        where: sequelize.literal(`(
                            CAST(CAST("startDate" AS Date) AS Text) IN (${startRange})
                            OR
                            CAST(CAST("endDate" AS Date) AS Text) IN (${endRange})
                            AND
                            "userId" = ${userid}
                    )`),
        include: [db.symptom]
    })
    return period;
}