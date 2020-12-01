const express = require('express');
const router = express.Router();
const db = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');
const getMonth = require('../middleware/getMonth.js');
const sequelize = require('sequelize');
const Op = sequelize.Op;

router.get('/:month', isLoggedIn, (req, res) => {
    //find user's data:
    //all info for this month
    //upcoming date or current day of period
    const month = getMonth(req.params.month);
    let user = res.locals.currentUser;
    db.period.findAll({
        where: {
            //matches user and starts or ends in this month
            userId: user.id,
            [Op.or]: [
                sequelize.where(sequelize.fn("date_part", 'month', sequelize.col('startDate')), month),
                sequelize.where(sequelize.fn("date_part", 'month', sequelize.col('endDate')), month)
            ]
        }
    }).then(periods => {
        let periodWeeks = periods.map(period => period.getDays());
        res.render('userHome', { periods, periodWeeks });
    })
});

module.exports = router