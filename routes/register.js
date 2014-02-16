var data = require('../data.json');
var login = require('./login.js');
var util = require('./util.js');

exports.view = function(req, res) {
  res.render('register', {});
};

exports.registeruser = function(req, res) {
  var userid = util.getuserid(req.query.username);
  if(!data['users'][userid]) {
	var user =
	  {
		'id': userid,
		'username': req.query.username,
		'email': req.query.email,
		'post_ids': [],
		'aisle_post_ids': [],
		'style_ids': [],
		'following_ids': [],
		'followers_ids': [],
		'recommended_user_ids': [util.getuserid('Anna B.'), util.getuserid('Kendrick.')],
		'liked_post_ids': []
	  };
	  
	// add user to data
	data['users'][user['id']] = user;
  
	// set this user as the logged in user
	login.setcurrentuser(req, user['id']);
  
	res.redirect('/aisle');
  } else {
    cosole.log('register.js: user with id ' + userid + ' already exists');
    res.writeHead(403);
    res.end();
  }
};