//all middleware goes here
var Campground = require('../models/campground');
var Comment = require('../models/comment');

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, foundCampground) {
      if (err) {
        console.log(err);
        req.flash("error", "Campground not found.");
        res.redirect('back');
      } else {
        //does the user own the campground
        if (foundCampground.author.id.equals(req.user._id)) { //mongoose ID is an opject, .equals convers to a string to compare (== or === won't work)
          next();
        } else {
          req.flash("error", "You don't have permission to do that.");
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash("error", "Please login to continue.");
    res.redirect('back');
  }
};


middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        console.log(err);
        req.flash("error", "Comment not found.");
        res.redirect('back');
      } else {
        //does the user own the campground
        if (foundComment.author.id.equals(req.user._id)) { //mongoose ID is an opject, .equals convers to a string to compare (== or === won't work)
          next();
        } else {
          req.flash("error", "You don't have permission to do that.");
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash("error", "Please login to continue.");
    res.redirect('back');
  }
};

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You must login to access this part of YelpCamp.");
  res.redirect('/login');
};

module.exports = middlewareObj;
