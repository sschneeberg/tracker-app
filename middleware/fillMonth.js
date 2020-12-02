const moment = require('moment');
const getMonthLength = require('./getMonthLength');

module.exports = function(month, notes, symptoms, periodWeeks) {
    const monthLength = getMonthLength(month);
    const monthData = [];
    for (i = 1; i <= monthLength; i++) {
        const dayData = {
                day: i,
                period: false,
                notes: [],
                symptoms: [],
            }
            //check notes
        notes.forEach(notes => {
            notes.forEach(note => {
                //correct day and month
                if (moment(note.date).format('MM') === month.toString() && moment(note.date).format('D') === i.toString()) {
                    dayData.notes.push(note)
                }
            })
        });
        //checkSymptoms
        symptoms.forEach(symptoms => {
            symptoms.forEach(symptom => {
                //correct day and month
                if (moment(symptom.date).format('MM') === month.toString() && moment(symptom.date).format('D') === i.toString()) {
                    dayData.symptoms.push(symptom)
                }
            })
        });
        //check period week
        periodWeeks.forEach(week => {
            week.forEach(day => {
                if (moment(day).format('MM') === month.toString() && moment(day).format('D') === i.toString()) {
                    dayData.period = true;
                }
            })
        })
        monthData.push(dayData);
    }
    return monthData;
}