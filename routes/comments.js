var express = require('express');
var router = express.Router({
  mergeParams: true
}); //needed to pull :id out of express.Router on app.js
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');

/////////////////////////////////////
//Comment Routes
/////////////////////////////////////

//this isn't being used b/c the comment form in now inline
//new comment form
router.get('/new', middleware.isLoggedIn, function(req, res) {
  //find campground by ID
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', {
        title: 'Add a Comment',
        campground: campground
      });
    }
  });
});

//comments create
router.post('/', middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) { //below must match
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          req.flash("error", "Something went wrong. We're checking the server...");
          console.log(err);
        } else {
          //add user name and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.author.name = req.user.name;
          comment.save();
          campground.comments.push(comment); //this "campground" must match case above
          campground.save();
          res.redirect('/campgrounds/' + campground._id + '#C');
        }
      });
    }
  });
});


//edit comments
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/edit', {
        campgroundId: req.params.id,
        comment: foundComment,
        title: "Edit Comment | YelpCamp"
      });
    }
  });
});

//comments update
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect('/campgrounds/' + req.params.id + '#C');
    }
  });
});


//delete comments
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      req.flash("error", "Something went wrong. We're checking the server...");
      res.redirect('back');
    } else {
      req.flash("success", "Comment deleted.");
      res.redirect('/campgrounds/' + req.params.id + '#C');
    }
  });
});

module.exports = router;
