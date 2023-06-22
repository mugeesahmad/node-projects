// Packages
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const mongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');

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
app.use(cookieParser());

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
    rolling: true,
    cookie: { path: '/', httpOnly: true, maxAge: 86400000 },
    store: mongoStore.create({
      client: mongoose.connection.getClient(),
      dbName: 'pharmacy',
      collectionName: 'sessions',
      stringify: false,
      autoRemove: 'interval',
      autoRemoveInterval: 6 * 60,
    }),
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
  res.send();
});

app.listen(3000, () => {
  console.log('server started on port 3000');
});
