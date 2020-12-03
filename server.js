require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const app = express();
const session = require('express-session');
const passport = require('./config/ppConfig');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const secret_session = process.env.SECRET_SESSION;

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);

//secret: given to used on the site as a session cookie
//resave: saves session even if it is modified (when true)
//saveUninitialized: if new session, we save it (when true)
const sessionObj = {
    secret: secret_session,
    resave: false,
    saveUninitialized: true
}
app.use(session(sessionObj));
//initialize passport and run middleware
app.use(passport.initialize());
app.use(passport.session());
//flash to send temp. messages to user
app.use(flash());
//set up middleware to have messages acessible in every view
app.use((req, res, next) => {
    //before every route, attach user to res.local
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next();
})

//middleware
const isLoggedIn = require('./middleware/isLoggedIn')

app.get('/', (req, res) => {
    console.log(res.locals.alerts)
    res.render('index', { alerts: res.locals.alerts });
});


app.use('/auth', require('./controllers/auth'));
app.use('/user', require('./controllers/user'));


const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Connected on ${port}`);
});

module.exports = server;