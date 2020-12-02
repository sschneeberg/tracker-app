const express = require('express');
const router = express.Router();
const db = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');
const getMonth = require('../middleware/getMonth.js');
const fillMonth = require('../middleware/fillMonth');
const getMonthNav = require('../middleware/getMonthNav');
const getDayNav = require('../middleware/getDayNav');
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
        include: [db.symptom, db.note]
    }).then(periods => {
        let periodWeeks = periods.map(period => period.getDays());
        let notes = periods.map(function(period) {
            return period.notes
        });
        let symptoms = periods.map(function(period) {
            return period.symptoms
        });
        const monthData = fillMonth(month.num, notes, symptoms, periodWeeks);
        res.render('user/userHome', { month, monthData, periods, periodWeeks, notes, symptoms });
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