var data = require("../data.json");

exports.view = function(req, res) {
  res.render('register', {});
};

exports.registeruser = function(req, res) {
  var user =
	{
	  "username": req.query.username,
	  "email": req.query.email,
	  "post_ids": [],
	  "style_ids": [],
	  "following_ids": ["Anna B."],
	  "followers_ids": []
	};

  data['users'][req.query.username] = user;
  
  // redirect
  res.redirect('/aisle');
};