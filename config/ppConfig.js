const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');

//'serialize' info making it easier to log in
passport.serializeUser((user, callback) => {
    callback(null, user.id);
    //callback is from passport which verifies credentials and calls done and returns
});

//take user id and look up in db
passport.deserializeUser((userId, callback) => {
    db.user.findByPk(userId).then(user => {
        if (user) {
            callback(null, user);
        }
    }).catch(err => console.log(err))
});

//Rome's code:
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, (username, password, callback) => {
    db.user.findOne({
            where: { username }
        })
        .then(user => {
            if (!user || !user.validPassword(password)) {
                callback(null, false);
            } else {
                callback(null, user);
            }
        })
        .catch(callback);
}));



module.exports = passport;