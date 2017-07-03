var mongoose = require('mongoose'),
  passportLocalMongoose = require('passport-local-mongoose');

mongoose.Promise = global.Promise;

//mongoose model config
//validation isn't working w/ the required statements - turned it off, fix later
var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    //required: true
  },
  name: {
    type: String
  },
  password: {
    type: String,
    //required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
});

UserSchema.plugin(passportLocalMongoose);

var User = mongoose.model('User', UserSchema);

module.exports = User;
