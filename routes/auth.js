const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('../config/ppConfig');


router.get('/signup', (req, res) => {
    res.render('auth/signup');
});

router.get('/login', (req, res) => {
    res.render('auth/login');
});

//POST 

router.post('/signup', (req, res) => {
    db.user.findOrCreate({
        where: { email: req.body.email },
        defaults: { name: req.body.name, password: req.body.password }
    }).then(([user, created]) => {
        if (created) {
            //redirect to home
            console.log(user.name, ' created')
            passport.authenticate('local', {
                successRedirect: '/',
                successFlash: 'Account created'
            })(req, res);
        } else {
            //already have an exsiting account
            req.flash('error', 'Account already exists for this email')
            res.redirect('/auth/signup');
        }
    }).catch(err => {
        console.log('Error', err);
        req.flash('error', 'Please try again.');
        res.redirect('/auth/signup');
    })
});
/* Rome's code
router.post('/signup', (req, res) => {
    console.log(req.body);

    db.user.findOrCreate({
            where: { email: req.body.email },
            defaults: {
                name: req.body.name,
                password: req.body.password
            }
        })
        .then(([user, created]) => {
            if (created) {
                // if created, success and redirect back to home
                console.log(`${user.name} was created`);
                // Flash Message
                const successObject = {
                    successRedirect: '/',
                    successFlash: 'Account created and logging in...'
                }
                passport.authenticate('local', successObject)(req, res);
            } else {
                // Email already exists
                req.flash('error', 'Email already exists...')
                res.redirect('/auth/signup');
            }
        })
        .catch(err => {
            console.log('Error', err);
            req.flash('error', 'Either email or password is incorrect. Please try again.');
            res.redirect('/auth/signup');
        })
}); */



router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    successFlash: 'Welcome back',
    failureFlash: 'Email or Password incorrect. Please try again.'
}))

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('Success', 'Logging out');
    res.redirect('/')
})

module.exports = router;