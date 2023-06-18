const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Model
const User = require('../models/User');

// Configuring Routes

const router = express.Router();

// router.post('/login', (req, res) => {
//   const { username, password } = req.body;
//   if (
//     username == '' ||
//     username == undefined ||
//     password == '' ||
//     password == undefined
//   ) {
//     return res.status(400).json({
//       status: 400,
//       msg: 'Please send all fields!',
//     });
//   }

//   const user = username.toLowerCase();

//   const log = async () => {
//     let result = await User.find({ username: user });
//     if (!result[0]) {
//       return res.status(404).json({
//         status: 404,
//         msg: "username or password doesn't match!",
//       });
//     }
//     bcrypt.compare(password, result[0].password, (err, found) => {
//       if (err) throw err;
//       if (found) {
//         res.redirect('/dashboard.html');
//       } else {
//         res.status(404).json({
//           status: 404,
//           msg: "username or password doesn't match!",
//           redirect_path: '/dashboard.html',
//         });
//       }
//     });
//   };

//   log();
// });

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) throw err;
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });
});

router.post('/register', (req, res) => {
  const { username, password, role } = req.body;

  if (
    username == '' ||
    username == undefined ||
    password == '' ||
    password == undefined ||
    role == undefined ||
    role == ''
  ) {
    return res.status(400).json({
      status: 400,
      msg: 'Please send all fields: username, password, and role!',
    });
  } else if (role != 'admin' && role != 'employee') {
    return res.status(400).json({
      status: 400,
      msg: 'Role can only be admin or employee!',
    });
  }

  bcrypt.genSalt(8, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(password, salt, (e, hash) => {
      if (e) throw e;
      const user = new User({
        username: username.toLowerCase().trim(),
        password: hash,
        role: role.toLowerCase().trim(),
      });

      user.save().then(
        () => {
          res.status(200).json({
            status: 200,
            msg: 'User has been successfully registered!',
            redirect_path: '/dashboard.html',
          });
        },
        (err) => {
          if (err.code == 11000) {
            res.status(400).json({
              status: 400,
              msg: 'user with this username already exists!',
            });
          } else {
            res.status(500).json({
              status: 500,
              msg: "Can't register the user right now due to some server error!",
              err: err,
            });
          }
        }
      );
    });
  });
});

module.exports = router;
