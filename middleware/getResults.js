const sequelize = require('sequelize');
const db = require('../models')

module.exports = async function(type) {
    const results = await db.sequelize.query(`SELECT type, severity, symptoms.date, periods.id FROM periods 
    JOIN "periodSymptoms" ON periods.id = "periodId" JOIN symptoms ON symptoms.id = "symptomId" 
    WHERE "userId"=1 AND type='${type}' 
    ORDER BY symptoms.date DESC`);

    return results;
}