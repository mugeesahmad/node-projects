const { ensure, forward } = require('../config/authGuard');

const router = require('express').Router();

const Medicine = require('../models/Medicine');

router.get('/', (req, res) => {
  res.redirect('/login');
});

router.get('/medicine', ensure, (req, res) => {
  res.render('medicine');
});

router.get('/medicines', async (req, res) => {
  const medicines = await Medicine.find().sort({ name: 1 });
  const authenticated = req.isAuthenticated();
  res.render('medicines', { medicines, authenticated });
});

router.get('/login', forward, (req, res) => {
  res.render('login');
});

router.get(
  '/register',
  ensure,
  (req, res, next) => {
    if (req.user.role == 'admin') {
      return next();
    }
    res.status(403).json({
      status: 403,
      msg: 'You need admin privileges to access this link!',
    });
  },
  (req, res) => {
    res.render('register');
  }
);

router.get('/dashboard', ensure, (req, res) => {
  res.render('dashboard', { username: req.user.username });
});

module.exports = router;
