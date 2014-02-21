
var login = require('./login.js');
var util = require('./util.js');
var passwordHash = require('password-hash');
var profile = require('./profile.js');
var models = require('../models');

exports.view = function(req, res) {
  if(profile.getloggedinuser(req)) {
    res.redirect('/aisle');
  } else {
    res.render('register', {});
  }
};

exports.registeruser = function(req, res) {
  var userid = util.getuserid(req.body.username);
    
    models.User
    .find({"id" : userid})
    .exec(afterSearch)
    
    function afterSearch(err, result) { // this is a callback
        if(err) {console.log(err); res.send(500); }
        if(!result[0]){
		//if(!data['users'][userid]) { //checking
			var user = new models.User //changed
			  ({
				"id": userid,
				"username": req.body.username,
				"email": req.body.email,
				"password": passwordHash.generate(
				  req.body.password,
				  {
				    'algorithm': 'sha256',
				    'saltLength': 32
				  }
				),
				"post_ids": [],
				"aisle_post_ids": [],
				"style_ids": [],
				"following_ids": [],
				"followers_ids": [],
				"recommended_user_ids": [util.getuserid('Anna B.'), util.getuserid('Kendrick.')],
				"liked_post_ids": []
			  });
			  
			// add user to data
			//data['users'][user['id']] = user;
		      user.save(afterSave);
		      function afterSave(err) { // this is a callback
		          if(err) {console.log(err); res.send(500); }
		          console.log("user saved");
		      }
		      

		    console.log('register.js: registered user ' + userid + ' successfully!');
			// set this user as the logged in user
			login.setcurrentuser(req, user['id']);
		  
			res.redirect('/aisle');
		  } else {
              
		    console.log('register.js: user with id ' + userid + ' already exists');

		    res.writeHead(403);
		    res.end();
		  }
		}
};