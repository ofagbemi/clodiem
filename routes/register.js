var data = require('../data.json');
var login = require('./login.js');
var util = require('./util.js');

exports.view = function(req, res) {
  res.render('register', {});
};

exports.registeruser = function(req, res) {
  var user =
	{
	  "id": util.getuserid(req.query.username),
	  "username": req.query.username,
	  "email": req.query.email,
	  "post_ids": [],
	  "aisle_post_ids": [],
	  "style_ids": [],
	  "following_ids": [],
	  "followers_ids": [],
	  "recommended_user_ids": ["Anna B.", "Kendrick."]
	};

  data['users'][req.query.username] = user;
  
  // set this user as the logged in user
  login.setcurrentuser(util.getuserid(user['username']));
  
  res.redirect('/aisle');
};