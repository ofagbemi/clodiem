var login = require('./login.js');
var util = require('./util.js');
var passwordHash = require('password-hash');
var profile = require('./profile.js');

exports.view = function(req, res) {
  if(profile.getloggedinuser(req)) {
    res.redirect('/aisle');
  } else {
    res.render('register', {});
  }
};

exports.registeruser = function(req, res) {
  var userid = util.getuserid(req.body.username);
   models.User.
        find("id", userid).
        exec(afterSearchUser);

        function afterSearchUser(err, result) {
		  if(!result[0]) {
		  	var user = new models.User({
				'id': userid,
				'username': req.body.username,
				'email': req.body.email,
				'password': passwordHash.generate(
				  req.body.password,
				  {
				    'algorithm': 'sha256',
				    'saltLength': 32
				  }
				),
				'post_ids': [],
				'aisle_post_ids': [],
				'style_ids': [],
				'following_ids': [],
				'followers_ids': [],
				'recommended_user_ids': [util.getuserid('Anna B.'), util.getuserid('Kendrick.')],
				'liked_post_ids': []
			  });

			user.save(afterSaving);
			console.log(user);

			  function afterSaving(err) {
			    if(err) {
			      console.log(err);
			      res.send(500);
			    }
			    res.send(200);
			  }
		  			  
		    console.log('register.js: registered user ' + userid + ' successfully!');
			// set this user as the logged in user
			login.setcurrentuser(req, user['id']);
		  
			res.redirect('/aisle');
		  } else {
		    cosole.log('register.js: user with id ' + userid + ' already exists');
		    res.writeHead(403);
		    res.end();
		  }
		}
};