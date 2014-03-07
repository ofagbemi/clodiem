var login = require('./login.js');
var util = require('./util.js');
var passwordHash = require('password-hash');
var profile = require('./profile.js');
var models = require('../models');
var nodemailer = require('nodemailer');

exports.view = function(req, res) {
  if(profile.getloggedinuser(req)) {
    res.redirect('/aisle');
  } else {
    res.render('register', {});
  }
};

function sendmail(user) {
  var transport = nodemailer.createTransport('SMTP',{
    service: 'Gmail',
    auth: {
      user: 'clodiemteam',
      pass: 'clodiemteam1234'
    }
  });
  
  var email_html = '\
  <div style="width:640px;">\
	<div style="width:100%;text-align:center;">\
	  <h1 style="margin-bottom:0;font-weight:200;font-family:\'Helvetica Neue\',\'Helvetica\',sans-serif;">\
		Clodiem\
	  </h1>\
	</div>\
	<div style="background:#fff;width:100%;box-sizing:border-box;padding:14px;">\
	  <div style="border-radius:4px;padding:14px;box-sizing:border-box;width:100%;font-size:14px;font-family:\'Helvetica Neue\',\'Helvetica\',sans-serif;">\
		<div style="margin-bottom:11px;">Hi, ' + user['username'] + '!</div><div>Thanks for signing up! We hope you enjoy your stay!</div>\
	  </div>\
	</div>\
  </div>'
  
  var mail_options = {
    from: 'us@clodiem.com',
    to: user['email'],
    subject: 'Thanks for joining Clodiem!',
    text: 'Hi, ' + user['username'] + '!\n\nThanks for signing up! We hope you enjoy your stay!',
    html: email_html
  };
  
  transport.sendMail(mail_options, function(err, response) {
    if(err) {console.log(err);return}
    // console.log('register.js: sent message ' + response.message);
  });
}

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
				"liked_post_ids": [],
				"time": req.body.time
			  });
			  
			models.User
			  .find({})
			  .limit(4)
			  .sort('-followers_ids.length')
			  .exec(function(err, rec_users) {
			    // add some recommended users
			    if(err) {console.log(err); res.send(500);}
			    user['recommended_user_ids'] = [];
			    for(var i=0;i<rec_users.length;i++) {
			      user['recommended_user_ids'].push(rec_users[i]['id']);
			    }
			    
			    // console.log('register.js: adding recommended users ' + user['recommended_user_ids']);
				
				user.save(afterSave);
				function afterSave(err) { // this is a callback
				  if(err) {console.log(err); res.send(500); }
				  // console.log("register.js: user saved");
				  // console.log('register.js: registered user ' + userid + ' successfully!');
				  // set this user as the logged in user
				  login.setcurrentuser(req, user['id']);
		  
		          sendmail(user);
				  res.redirect('/aisle');
				}
			  });
		  } else {
		    // console.log('register.js: user with id ' + userid + ' already exists');

		    res.writeHead(403);
		    res.end();
		  }
		}
};