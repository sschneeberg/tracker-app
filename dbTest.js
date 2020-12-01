const db = require('./models');
const moment = require('moment');
const sequelize = require('sequelize');
const getMonth = require('./middleware/getMonth');
const Op = sequelize.Op;
/*
//query periods from users including symptoms and notes
db.user.findOne().then(user => {
    db.period.findAll({
        where: { userId: user.id },
        include: [db.symptom, db.note]
    }).then(periods => {
        let periodWeeks = periods.map(period => period.getDays());
        console.log(periods);
        console.log('weeks:', periodWeeks);
        console.log('notes:', periods[0].notes);
        console.log('symptoms:', periods[0].symptoms);
    })
});

//query users to meds (all)
db.user.findOne().then(user => {
    user.getMeds().then(meds => {
        console.log(meds);
    })
})

//query users to activity
db.user.findOrCreate({
    where: { name: 'Simone Schneeberg' },
    defaults: {
        username: 'sschneeberg',
        password: 'passwordsy',
        avgCycle: 28,
        avgPeriod: 7
    }
}).then(([user, created]) => {
    db.activity.findAll({ where: { userId: user.id } }).then((activity) => {
        console.log('activity', activity)
    })
})

//query activity, notes, periods, symptoms by date
const date = moment();
const today = moment();
//Note to self, modifying variable assigned to moment alters its value in future references

db.user.findOne().then(user => {
    const range = []
    for (let i = 0; i <= user.avgPeriod; i++) {
        range.push(date.subtract(1, 'd').format('M D YYYY'))
    }
    console.log(range)
    db.period.findOne({
        where: {
            startDate: {
                [Op.in]: range
            }
        },
        include: [db.note, db.symptom]
    }).then(period => {
        period.getSymptoms({ where: { date: today.subtract(7, 'd').format('M D YYYY') } }).then(symptoms => {
            db.note.findAll({ where: { date: moment().format('M D YYYY'), periodId: period.id } }).then(notes => {
                console.log('Date', today.format('M D YYYY'));
                console.log('period', period);
                console.log('symptoms', symptoms);
                console.log('note', notes);

            })
        })
    })
})

    */

//console.log(getMonth('November'))