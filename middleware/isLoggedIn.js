module.exports = function(req, res, next) {
    //if there is no user, not logged in
    if (!req.user) {
        req.flash('error', 'You must be signed in to access this page')
        res.redirect('/auth/login')
    } else {
        next();
    }
}