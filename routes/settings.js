var profile = require('./profile.js');
var models = require('../models');
var createpost = require('./createpost.js');

exports.view = function(req, res) {
  var ret = {};
  var logged_in_user_id = profile.getloggedinuser(req);
  
  models.User
    .find({"id": logged_in_user_id})
    .exec(afterSearch);
    
  function afterSearch(err, users) {
  var logged_in_user = users[0];
	if(logged_in_user) {
	  ret['logged_in_user'] = logged_in_user;
	  res.render('settings', ret);
	} else {
	  res.redirect('/login');
	}
  }
}

exports.setuser = function(req, res) {

  console.log(req);
  models.User
    .find({"id" : req.body.userid})
    .exec(afterSearch)

  function afterSearch(err, result) { // this is a callback
      if(err) {console.log(err); res.send(500); }
      var user = result[0];
      if(user){
      
        var settings = req.body;
        if(!settings) settings = {};
        console.log('settings.js: using settings ' + settings);
        
        if(req.files && req.files.img) {
		  createpost.uploadimage(
			req.files.img,
			function(url) {
			  settings['img'] = url;
			
			  models.User
				.update(
				  {'id': user['id']},
				  settings,
				  function(err) {
					if(err) {console.log(err);res.send(500);return;}
					console.log('settings.js: updated user settings ' + settings);
					res.redirect('/user?id=' + user['id']);
					return;
				  });
		  });
        } else {
          models.User
			.update(
			  {'id': user['id']},
			  settings,
			  function(err) {
				if(err) {console.log(err);res.send(500);return;}
				console.log('settings.js: updated user settings ' + settings);
				res.redirect('/user?id=' + user['id']);
				return;
			  });
        }
      } else {
        console.log('setuser.js: the user with id ' + req.body.userid + ' could not be found');
        res.writeHead(404);
        res.end();
      }
  }

  
  // var user = data['users'][req.body.userid];
  // if(user) {
  //   for(var key in req.body.settings) {
  //     user[key] = req.body.settings[key];
  //   }
  //   res.writeHead(200);
  //   res.end();
  // } else {
  //   console.log('setuser.js: the user with id ' + req.body.userid + ' could not be found');
  //   res.writeHead(404);
  //   res.end();
  // }

};