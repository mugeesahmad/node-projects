// Packages
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

console.clear();

// Connecting to database

const con = 'mongodb://127.0.0.1:27017/pharmacy';
mongoose.connect(con).then(() => {
  console.log('connected');
});

// Passport Config
require('./config/passport')(passport);

// Init app

const app = express();

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Managing Routes

const home = require('./routes/home');
app.use('/', home);

const inventory = require('./routes/inventory');
app.use('/api/inventory/', inventory);

const auth = require('./routes/auth');
app.use('/api/auth/', auth);

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.render('404');
});

app.listen(3000, () => {
  console.log('server started on port 3000');
});
