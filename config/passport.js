const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/User');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'username' },
      (username, password, done) => {
        // Match user
        User.findOne({
          username: username,
        }).then((user) => {
          if (!user) {
            return done(null, false, {
              message: 'No account registered by this username!',
            });
          }

          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Password incorrect' });
            }
          });
        });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.username);
  });

  passport.deserializeUser(function (username, done) {
    User.findOne({ username, username }).then(function (user) {
      done(null ,user);
    });
  });
};
