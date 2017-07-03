var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');

//home page route
router.get('/', function(req, res) {
  res.render('index', {
    title: 'Welcome to YelpCamp'
  });
});

//home page route
router.get('/alt', function(req, res) {
  res.render('concept', {
    title: 'Welcome to YelpCamp'
  });
});


/////////////////////////////////////
//Auth Routes
/////////////////////////////////////

//show register form
router.get('/register', function(req, res) {
  res.render('register', {
    title: 'Create Account | YelpCamp'
  });
});

//handle new accounts
router.post('/register', function(req, res) {
  // console.log(req.body.username);
  // console.log(req.body.password);

  var newUser = new User({
    username: req.body.username,
    name: req.body.name
  });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render('register', {
        'error': err.message,
        title: 'Whoops, try again | YelpCamp'
      });
    } //no else becuase of return
    passport.authenticate('local')(req, res, function() {
      req.flash("success", "Successfully singed up! Nice to meet you " + req.body.username);
      res.redirect('/campgrounds');
    });
  });
});

//show login form
router.get('/login', function(req, res) {
  res.render('login', {
    title: 'Login to YelpCamp'
  });
});

//handle login form logic
router.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login',
  failureFlash: true //enable flash error messages
}), function(req, res) {});

//logout
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('error', 'Successfully Logged Out.');
  res.redirect('/campgrounds');
});

module.exports = router;
