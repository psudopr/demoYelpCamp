var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//mongoose model config
var commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User" //tells mongoose to reference the user model
    },
    username: String,
    name: String,
  },
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
