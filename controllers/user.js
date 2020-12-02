const express = require('express');
const router = express.Router();
const db = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');
const getMonth = require('../middleware/getMonth.js');
const fillMonth = require('../middleware/fillMonth');
const getMonthNav = require('../middleware/getMonthNav');
const getDayNav = require('../middleware/getDayNav');
const getRanges = require('../middleware/getRanges');
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
                [Op.and]: [sequelize.where(sequelize.fn("date_part", 'month', sequelize.col('date')), month.num), { userId: user.id, }]
            }
        }).then(notes => {
            db.activity.findAll({
                where: {
                    [Op.and]: [sequelize.where(sequelize.fn("date_part", 'month', sequelize.col('date')), month.num), { userId: user.id, }]
                }
            }).then(activity => {
                console.log('symptoms', symptoms)
                const monthData = fillMonth(month.num, notes, symptoms, periodWeeks);
                res.render('user/userHome', { month, monthData, periods, periodWeeks, notes, symptoms, activity });
            })
        })
    })
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
        let symptoms = period.symptoms;
        symptoms = symptoms.filter(symptom => {
            return (moment(symptom.date).format('D') === day.num.toString())
        })

    })



    res.render('user/showDay', { month, day, })
})

//create new note
router.get('/:month/:day/new', isLoggedIn, (req, res) => {
    res.render('user/newDay')
})


//add period start/end
router.post('/:month/:day/period', isLoggedIn, (req, res) => {
    res.redirect(`/user/${req.params.month}/${req.params.day}`)
})

//add note
router.post('/:month/:day/note', isLoggedIn, (req, res) => {
    res.redirect(`/user/${req.params.month}/${req.params.day}`)
})

//edit note
router.put('/:month/:day', isLoggedIn, (req, res) => {
    res.redirect(`/user/${req.params.month}/${req.params.day}`)
})

//delete note
router.delete('/:month/:day', isLoggedIn, (req, res) => {
    res.redirect(`/user/${req.params.month}/${req.params.day}`)
})




module.exports = router