var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');

//all campgrounds route
router.get('/', function(req, res) {
  if (req.query.q) {
    var noMatch = "";
    const regex = new RegExp(escapeRegex(req.query.q), 'gi');
    //Get query campground
    Campground.find({
      name: regex
    }, function(err, allCampgrounds) {
      if (err) {
        console.log(err);
      } else { //render campgrounds template w/ campgrounds
        if (allCampgrounds.length < 1) {
          noMatch = "No campgrounds match your query. Please try again.";
        }
        res.render('campgrounds/campgrounds', {
          title: 'Campgrounds | YelpCamp',
          campgrounds: allCampgrounds,
          noMatch: noMatch
        });
      }
    });
  } else {
    //if no q, then get all campgrounds
    Campground.find({}, function(err, allCampgrounds) {
      if (err) {
        console.log(err);
      } else { //render campgrounds template w/ campgrounds
        res.render('campgrounds/campgrounds', {
          title: 'Campgrounds | YelpCamp',
          campgrounds: allCampgrounds,
          noMatch: noMatch
        });
      }
    });
  }
});

//create new campgrounds
router.post('/', middleware.isLoggedIn, function(req, res) {
  //get data from form and add to campgrounds array
  // var newCampground = {name: req.body.new['name'], image: req.body.new['image']};
  // var newCampground = {name: req.body.new.name, image: req.body.new.image};
  // var info = {
  // 	name: req.body.new.name,
  // 	image: req.body.new.image,
  // 	description: req.body.new.description
  // };

  var author = {
    id: req.user._id,
    username: req.user.username,
    name: req.user.name
  };

  var newCampground = {
    name: req.body.new.name,
    image: req.body.new.image,
    description: req.body.new.description,
    author: author
  };

  Campground.create(newCampground, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
      console.log(newlyCreated);
    }
  });
});

//show form to create new campground route
router.get('/new', middleware.isLoggedIn, function(req, res) {
  res.render('campgrounds/new', {
    title: 'New Campground | YelpCamp'
  });
});

//show route - more info about a single campground
router.get('/:id', function(req, res) {
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/show', {
        title: foundCampground.name,
        campground: foundCampground
      });
    }
  });
});

//edit route
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    res.render('campgrounds/edit', {
      campground: foundCampground,
      title: 'Edit' + foundCampground.name
    });
  });
});

//update route
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res) {
  //find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds/' + updatedCampground._id);
    }
  });
});

//destroy campground route
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds');
    }
  });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "//$&");
}

module.exports = router;
