var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//mongoose model config
var campgroundSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: String,
  _isFeatured: Boolean,
  author: { //associates the signed in user w/ the created campground
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment" //tells mongoose to reference the comment model
    }
  ]
});

var Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;
