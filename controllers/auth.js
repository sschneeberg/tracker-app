const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('../config/ppConfig');
const moment = require('moment');


router.get('/signup', (req, res) => {
    res.render('auth/signup');
});

router.get('/login', (req, res) => {
    res.render('auth/login');
});

//POST 

router.post('/signup', (req, res) => {
    db.user.findOrCreate({
        where: { username: req.body.username },
        defaults: { name: req.body.name, password: req.body.password, avgPeriod: 7, avgCycle: 28 }
    }).then(([user, created]) => {
        if (created) {
            //redirect to home
            console.log(user.name, ' created')
            passport.authenticate('local', {
                successRedirect: `/user/${moment().format('MM')}`,
                successFlash: 'Account created'
            })(req, res);
        } else {
            //already have an exsiting account
            req.flash('error', 'Account already exists for this Username, Please try another.')
            res.redirect('/auth/signup');
        }
    }).catch(err => {
        console.log('Error', err);
        req.flash('error', 'Please try again. Password must be at least 8 characters and usernames must be unique');
        res.redirect('/auth/signup');
    })
});


router.post('/login', passport.authenticate('local', {
    successRedirect: `/user/${moment().format('MM')}`,
    failureRedirect: '/auth/login',
    successFlash: 'Welcome back',
    failureFlash: 'Username or Password incorrect. Please try again.'
}))

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('Success', 'Logging out');
    res.redirect('/')
})

module.exports = router;