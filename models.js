var Mongoose = require('mongoose');

var UserSchema = new Mongoose.Schema({
    "id": String,
    "username": String,
    "email": String,
    "password":String,
    "img":String,
    "post_ids":[String],
    "aisle_post_ids": [String],
    "style_ids": [String],
    "following_ids":[String],
    "followers_ids": [String],
    "recommended_user_ids": [String],
    "liked_post_ids": [String],
    "location": String,
    "description": String,
    "time": Date,
    'message_ids': [String],
    'new_message': Boolean
});

var PostSchema = new Mongoose.Schema({
    "id": String,
    "type": String,
    "userid": String,
    "username": String,
    "img":String,
    "comment_ids":[String],
    "likers":[String],
    "likes": Number,
    "time": Date,
    "price": String,
    "price_num": Number,
    "title": String,
    "x": Number,
    "y": Number,
    "retailer": String,
    "purchase_link": String,
    "tags": [String],
    "item_ids": [String]              
});

var CommentSchema = new Mongoose.Schema({
  'username': String,
  'userid': String,
  'time': Date,
  'comment': String,
  'postid': String,
  'img': String
});

var MessageSchema = new Mongoose.Schema({
  'touserid': String,
  'fromuserid': String,
  'tousername': String,
  'fromusername': String,
  'fromimg': String,
  'time': Date,
  'message': String
});

var ImageSchema = new Mongoose.Schema({
  'image': {data: Buffer, contentType: String},
  'name': String
});

var TagSchema = new Mongoose.Schema({
  'tag': String,
  'number': Number,
  'last_post_time': Date,
  'last_post_id': String,
  'last_post_image': String
});

exports.User = Mongoose.model('User', UserSchema);
exports.Post = Mongoose.model('Post', PostSchema);
exports.Comment = Mongoose.model('Comment', CommentSchema);
exports.Message = Mongoose.model('Message', MessageSchema);
exports.Image = Mongoose.model('Image', ImageSchema);
exports.Tag = Mongoose.model('Tag', TagSchema);

