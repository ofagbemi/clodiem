
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
    "description": String
});

var PostSchema = new Mongoose.Schema({
    "id": String,
    "type": String,
    "userid": String,
    "username": String,
    "img":String,
    "comments":[String],
    "likers":[String],
    "likes": Number,
    "time": Date,
    "price": String,
    "title": String,
    "x": Number,
    "y": Number,
    "retailer": String,
    "purchase_link": String,
    "tags": [String],
    "item_ids": [String]
                                     
});

exports.User = Mongoose.model('User', UserSchema);
exports.Post = Mongoose.model('Post', PostSchema);

