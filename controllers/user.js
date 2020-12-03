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
const sequelize = require('sequelize');
const Op = sequelize.Op;
const moment = require('moment');


router.get('/', isLoggedIn, (req, res) => {
    res.redirect(`/user/${moment().format('MM')}`)
})

router.get('/:month', isLoggedIn, (req, res) => {
    //find user's data:
    //all info for this month
    //upcoming date or current day of period
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
                res.render('user/userHome', { month, monthData, periods, periodWeeks, notes, symptoms });
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
});

router.get('/:month/:day', isLoggedIn, (req, res) => {
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
    let [startRange, endRange] = getRanges(day.num, user.avgPeriod);
    db.period.findOne({
        where: {
            userId: user.id,
            [Op.or]: [{
                    startDate: {
                        [Op.in]: startRange
                    }
                },
                {
                    endDate: {
                        [Op.in]: endRange
                    }
                }
            ]
        },
        include: [db.symptom]
    }).then(period => {
        let symptoms = null;
        if (period) {
            symptoms = period.symptoms;
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
            console.log(notes)
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
                res.render('user/showDay', { month, day, notes, activity, symptoms, periodInfo })
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
})

//create new note
router.get('/:month/:day/new', isLoggedIn, (req, res) => {
    const month = {
        name: getMonth(req.params.month),
        num: req.params.month
    };
    const day = {
        num: req.params.day,
    };
    res.render('user/newDay', { month, day })
})

//edit note
router.get('/:month/:day/edit', isLoggedIn, (req, res) => {
    res.render('user/editDay')
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
    })

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
    })
})

//add symptom
router.post('/:month/:day/symptom', isLoggedIn, (req, res) => {
    res.redirect(`/user/${req.params.month}/${req.params.day}/new`)
})

//update note
router.put('/:month/:day', isLoggedIn, (req, res) => {
    res.redirect(`/user/${req.params.month}/${req.params.day}/new`)
})

//delete note
router.delete('/:month/:day', isLoggedIn, (req, res) => {
    res.redirect(`/user/${req.params.month}/${req.params.day}/new`)
})




module.exports = router