const { ensure, forward } = require('../config/authGuard');

const router = require('express').Router();

const Medicine = require('../models/Medicine');

router.get('/medicine', (req, res) => {
  res.render('medicine');
});

router.get('/medicines', async (req, res) => {
  const medicines = await Medicine.find();
  res.render('medicines', { medicines });
});

router.get('/login', forward, (req, res) => {
  res.render('login');
});

router.get('/dashboard', ensure, (req, res) => {
  res.render('dashboard', { username: req.user.username });
});

module.exports = router;
