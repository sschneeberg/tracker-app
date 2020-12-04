const express = require('express');
const router = express.Router();
const db = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');
const getMonth = require('../middleware/getMonth.js');
const fillMonth = require('../middleware/fillMonth');
const getMonthNav = require('../middleware/getMonthNav');
const getDayNav = require('../middleware/getDayNav');
const getRanges = require('../middleware/getRanges');
const getPeriodDay = require('../middleware/getPeriodDay');
const getResults = require('../middleware/getResults');
const getDayOf = require('../middleware/getDayOf');
const predictStart = require('../middleware/predictStart');

//const findPeriod = require('../middleware/findPeriod');  <-- Work in progress
const sequelize = require('sequelize');
const Op = sequelize.Op;
const moment = require('moment');
const axios = require('axios');




router.get('/', isLoggedIn, (req, res) => {
    res.redirect(`/user/${moment().format('MM')}`)
})

router.get('/advice', isLoggedIn, (req, res) => {
    const suggestions = [];
    res.render('user/advice', { suggestions })
})

//api results
router.get('/advice/results', isLoggedIn, (req, res) => {
    // API CALL
    axios.get(`http://mapi-us.iterar.co/api/${req.query.drug}/substances.json`).then(data => {
        let activeIngredients = data.data
            //data.data is an array
        if (activeIngredients.length === 0) {
            axios.get(`http://mapi-us.iterar.co/api/autocomplete?query=${req.query.drug.slice(0,3)}`).then(data => {
                let suggestions = data.data.suggestions;
                if (suggestions.length === 0) { suggestions[0] = 'No matches found' }
                res.render('user/advice', { suggestions })
            }).catch(err => console.log(err))
        } else {
            res.render('user/adviceResults', { activeIngredients, drug: req.query.drug })
        }
    }).catch(err => console.log(err))
})

//user data summary
router.get('/summary', isLoggedIn, (req, res) => {
    let user = res.locals.currentUser;
    db.user.findOne({
        where: { id: user.id },
        include: [db.med]
    }).then(user => {
        const meds = user.meds;
        res.render('user/summary', { results: [], meds })
    }).catch(err => console.log(err))

})

//data results
router.get('/summary/symptoms', isLoggedIn, (req, res) => {
    const type = req.query.type.toLowerCase();
    let user = res.locals.currentUser;
    let meds = [];
    db.user.findOne({
        where: { id: user.id },
        include: [db.med]
    }).then(user => {
        meds = user.meds;
        getResults(type).then(results => {
            res.render('user/summary', { results: results[0], meds })
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))

})

//data results
router.get('/summary/date', isLoggedIn, (req, res) => {
    //date value in form "MMM DD, YYYY"
    let date = req.query.date.split(',').join('');
    date = moment(date, 'MMM DD YYYY').format('MM D YYYY');
    const [month, day, year] = date.split(' ');
    res.redirect(`/user/${month}/${day}`)


})

router.get('/:month', isLoggedIn, (req, res) => {
    //find user's data:
    //all info for this month
    //upcoming date or current day of period
    if (!req.params.month.match(/^[0-9]+$/)) {
        res.render('error');
    }
    const month = {
        name: getMonth(req.params.month),
        num: req.params.month
    };
    [month.previousMonth, month.nextMonth] = getMonthNav(month.num);
    let user = res.locals.currentUser;
    db.period.findAll({
        where: {
            //matches user and starts or ends in this month
            userId: user.id,
            [Op.or]: [
                sequelize.where(sequelize.fn("date_part", 'month', sequelize.col('startDate')), month.num),
                sequelize.where(sequelize.fn("date_part", 'month', sequelize.col('endDate')), month.num)
            ]
        },
        include: [db.symptom]
    }).then(periods => {
        let periodWeeks = periods.map(period => period.getDays());
        const today = new Date();
        let dayOf = getDayOf(today, periodWeeks, true);
        let predictedStart = predictStart(periods, user);
        let symptoms = periods.map(function(period) {
            return period.symptoms
        });
        db.note.findAll({
            where: {
                [Op.and]: [
                    sequelize.where(sequelize.fn("date_part", 'month', sequelize.col('date')), month.num),
                    { userId: user.id, }
                ]
            }
        }).then(notes => {
            db.activity.findAll({
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn("date_part", 'month', sequelize.col('date')), month.num),
                        { userId: user.id, }
                    ]
                }
            }).then(activity => {
                const monthData = fillMonth(month.num, notes, symptoms, periodWeeks, activity);
                res.render('user/userHome', { month, monthData, periods, periodWeeks, notes, symptoms, dayOf, predictedStart });
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
});

router.get('/:month/:day', isLoggedIn, (req, res) => {
    if (!req.params.month.match(/^[0-9]+$/) || !req.params.day.match(/^[0-9]+$/)) {
        res.render('error');
    }
    //find user's data for the day
    //add ability to add note on view
    const month = {
        name: getMonth(req.params.month),
        num: req.params.month
    };
    const day = {
        num: req.params.day,
    };
    [day.previousDay, day.nextDay] = getDayNav(day.num, month.num);
    let user = res.locals.currentUser;
    //find period that started or ended within range/cycle length of current day
    let [startRange, endRange] = getRanges(month.num, day.num, user.avgPeriod);
    //try to change this to a function to be DRY
    db.period.findOne({
        where: sequelize.literal(`(
                            CAST(CAST("startDate" AS Date) AS Text) IN (${startRange})
                            OR
                            CAST(CAST("endDate" AS Date) AS Text) IN (${endRange})
                            AND
                            "userId" = ${user.id}
                    )`),
        include: [db.symptom]
    }).then(period => {
        let periodWeek = null;
        let symptoms = null;
        let dayOf = null;
        let today = new Date(2020, month.num - 1, day.num);
        if (period) {
            symptoms = period.symptoms;
            periodWeek = period.getDays();
            dayOf = getDayOf(today, periodWeek, false)
            symptoms = symptoms.filter(symptom => {
                return (moment(symptom.date).format('D') === day.num.toString())
            })
        }
        db.note.findAll({
            where: {
                [Op.and]: [{
                        [Op.and]: [
                            sequelize.where(sequelize.fn("date_part", 'month', sequelize.col('date')), month.num),
                            sequelize.where(sequelize.fn("date_part", 'day', sequelize.col('date')), day.num),
                        ]
                    },
                    { userId: user.id, }
                ]
            }
        }).then(notes => {
            db.activity.findAll({
                where: {
                    [Op.and]: [{
                            [Op.and]: [
                                sequelize.where(sequelize.fn("date_part", 'month', sequelize.col('date')), month.num),
                                sequelize.where(sequelize.fn("date_part", 'day', sequelize.col('date')), day.num),
                            ]
                        },
                        { userId: user.id, }
                    ]
                }
            }).then(activity => {
                //pass data needed, find day of period if there is one
                const periodInfo = getPeriodDay(period, day.day);
                res.render('user/showDay', { month, day, notes, activity, symptoms, periodInfo, dayOf })
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
})

//create new note
router.get('/:month/:day/new', isLoggedIn, (req, res) => {
    if (!req.params.month.match(/^[0-9]+$/) || !req.params.day.match(/^[0-9]+$/)) {
        res.render('error');
    }
    const month = {
        name: getMonth(req.params.month),
        num: req.params.month
    };
    const day = {
        num: req.params.day,
    };
    [day.previousDay, day.nextDay] = getDayNav(day.num, month.num);
    let user = res.locals.currentUser;
    //find if there is a period this day
    let [startRange, endRange] = getRanges(month.num, day.num, user.avgPeriod);
    //try to change this to a function to be DRY
    db.period.findOne({
        where: sequelize.literal(`(
                            CAST(CAST("startDate" AS Date) AS Text) IN (${startRange})
                            OR
                            CAST(CAST("endDate" AS Date) AS Text) IN (${endRange})
                            AND
                            "userId" = ${user.id}
                    )`),
        include: [db.symptom]
    }).then(period => {
        res.render('user/newDay', { month, day, period })
    }).catch(err => console.log(err))
})

//edit note
router.get('/:month/:day/:id/edit', isLoggedIn, (req, res) => {
    if (!req.params.month.match(/^[0-9]+$/) || !req.params.day.match(/^[0-9]+$/)) {
        res.redirect('*');
    }
    const month = {
        name: getMonth(req.params.month),
        num: req.params.month
    };
    const day = {
        num: req.params.day,
    };
    db.note.findOne({
        where: { id: req.params.id }
    }).then((note) => {
        res.render('user/editDay', { month, day, note })
    }).catch(err => console.log(err))
})


//add period start/end
router.post('/:month/:day/period', isLoggedIn, (req, res) => {
    res.redirect(`/user/${req.params.month}/${req.params.day}`)
})

//add note to db
router.post('/:month/:day/note', isLoggedIn, (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const date = req.body.date;
    const user = res.locals.currentUser;
    db.note.create({
        title: title,
        content: content,
        date: date,
        userId: user.id

    }).then(() => {
        res.redirect(`/user/${req.params.month}/${req.params.day}/new`)
    }).catch(err => console.log(err))

})

//add activity
router.post('/:month/:day/activity', isLoggedIn, (req, res) => {
    const user = res.locals.currentUser;
    const protection = req.body.protection;
    const date = req.body.date;
    db.activity.create({
        userId: user.id,
        date: date,
        protection: protection
    }).then(() => {
        res.redirect(`/user/${req.params.month}/${req.params.day}/new`)
    }).catch(err => console.log(err))
})

//add symptom
router.post('/:month/:day/symptom', isLoggedIn, (req, res) => {
    const type = req.body.type;
    const date = req.body.date;
    const severity = req.body.severity;
    const user = res.locals.currentUser;
    db.symptom.create({
        date: date,
        type: type.toLowerCase(),
        severity: severity
    }).then(symptom => {
        //find correct period and add to period
        db.period.findOne({
            where: {
                userId: user.id,
                id: req.body.periodId
            }
        }).then((period) => {
            period.addSymptom(symptom);
            res.redirect(`/user/${req.params.month}/${req.params.day}/new`)
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))

})

//add medication
router.post('/meds', isLoggedIn, (req, res) => {
    let user = res.locals.currentUser;
    db.med.findOrCreate({
        where: { name: req.body.name }
    }).then(([med, created]) => {
        db.user.findOne({
            where: { id: user.id }
        }).then(user => {
            user.addMed(med);
            res.redirect('/user/summary')
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
})

//update note
router.put('/:month/:day/:id/note', isLoggedIn, (req, res) => {
    db.note.update({
        title: req.body.title,
        content: req.body.conent,
    }, {
        where: req.params.id
    }).then(() => {
        res.redirect(`/user/${req.params.month}/${req.params.day}/new`)
    }).catch(err => console.log(err))
})


//delete note
router.delete('/:month/:day/:id/note', isLoggedIn, (req, res) => {
    db.note.destroy({
        where: { id: req.params.id }
    }).then(() => {
        res.redirect(`/user/${req.params.month}/${req.params.day}`)
    }).catch(err => console.log(err))
})


//errors
router.get('*', (req, res) => {
    res.render('error')
})



module.exports = router