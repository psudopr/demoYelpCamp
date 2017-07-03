var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  expressSanitizer = require('express-sanitizer'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  flash = require('connect-flash'),
  //inport blog model from models directory
  Campground = require('./models/campground'),
  Comment = require('./models/comment'),
  User = require('./models/user'),
  secret = require('./secret/secret'),
  seedDB = require('./seeds');

var commentRoutes = require('./routes/comments'),
  campgroundRoutes = require('./routes/campgrounds'),
  indexRoutes = require('./routes/index');

const app = express();

//connect to mongoose db
mongoose.connect('mongodb://localhost/YelpCamp');

//default file type is now ejs
app.set('view engine', 'ejs');

//use Body Parser
app.use(bodyParser.urlencoded({
  extended: true
}));

//use connect flash
app.use(flash());

//serve public directory
app.use(express.static(__dirname + '/public'));

app.use(methodOverride("_method")); //must be above the routers

//seedDB();

//Passport Configuration
app.use(require('express-session')({
  secret: secret(),
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//local middleware to pass back currentUser to all pages
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

//routers
app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);




//start express server
//process.env.PORT, process.env.IP for deployment
app.listen(3000, function() {
  console.log('Server running on port 3000!');
});
