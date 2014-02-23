var util = require('./util.js');
var profile = require('./profile.js');
var dashboard = require('./dashboard.js');
var models = require('../models');

exports.view = function(req, res) {
  var user_id = profile.getloggedinuser(req);
  
  if(user_id) {
    models.User
      .find({'id': user_id})
      .exec(function(err, result) {
        if(err) {console.log(err);res.send(500);}
        var user = result[0];
        if(user) {
          console.log('favorites.js: found user ' + user);
          res.render('favorites', {'logged_in_user': user});
        } else {
          console.log('favorites.js: couldn\'t find user ' + user_id);
          res.send(404);
        }
      });
  } else {
    console.log('favorites.js: no logged in user');
    res.redirect('/login');
  }
};

exports.stylesview = function(req, res) {
  var logged_in_user_id = profile.getloggedinuser(req);
  
  if(logged_in_user_id) {
    models.User
      .find({'id': logged_in_user_id})
      .exec(function(err, result) {
        if(err) {console.log(err);res.send(500);}
        var logged_in_user = result[0];
        if(!logged_in_user) {
          console.log('favorites.js: couldn\'t find user ' + logged_in_user_id);
          res.send(404);
        }
        
        var ret = {};
        ret['title'] = 'Styles';
        ret['posts'] = [];
        
        dashboard.getpostsfromids(
          logged_in_user['style_ids'],
          logged_in_user,
          function(err, styles) {
            if(err) {console.log(err); res.send(500);}
            ret['posts'] = styles;
            res.render('styles', ret);
          }
        );
      });
  } else {
    console.log('favorites.js: no logged in user');
    res.send(404);
  }
};
exports.stylepostsview = function(req, res) {
  var logged_in_user_id = profile.getloggedinuser(req);
  
  if(logged_in_user_id) {
	models.User
	  .find({'id': logged_in_user_id})
	  .exec(function(err, users) {
		if(err) {console.log(err); res.send(500);}
		var user = users[0];
		if(!user) {
		  console.log('favorites.js: couldn\'t find user ' + logged_in_user_id);
		  res.send(404);
		}
		
		// find posts
		
		
		
		
		
		
		
	  });
  } else {
    console.log('favorites.js: no logged in user');
    res.redirect('/login');
  }
  
  /*
  
  
  models.Post.
		find("id", req.query.id).
		exec(afterSearchPost);
			function afterSearchPost(err, result) {
				if(err) {console.log(err); res.send(500); }
				var style = result[0];
				if(logged_in_user && style) {
					var ret = {};
					ret['title'] = style['title'];
					ret['icon'] = '/images/icons/shirt3/shirt3.svg';
					ret['posts'] = [];
					
					// populate ret['posts'] with all of the logged in user's aisle posts
					if(logged_in_user && logged_in_user['liked_post_ids']) {
					  ret['posts'] = dashboard.getpostsfromids(
					                   style['item_ids'],
					                   logged_in_user);
					} else {
					  style['item_ids'] = [];
					}
				  
				    // populate each post with the item posts for each of the items
				    // belonging to that post
					for(var i=0;i<ret['posts'].length;i++) {
					  var post = ret['posts'][i];
					  post['items'] = [];
					  if(post['item_ids']) {
					    post['items'] = dashboard.getpostsfromids(post['item_ids']);
					  }
					}
					ret['logged_in_user'] = logged_in_user;
					
					res.render('likedposts', ret);
				  } else {
				    // if no one's logged in, redirect to log in page
				    console.log('favorites.js: no logged in user');
				    res.redirect('/login');
				  }
			}	*/
};
exports.likedpostsview = function(req, res) {
  var logged_in_user_id = profile.getloggedinuser(req);
  if(logged_in_user_id) {
    models.User
      .find({'id': logged_in_user_id})
      .exec(function(err, result) {
        if(err) {console.log(err); res.send(500);}
        var logged_in_user = result[0];
        if(!logged_in_user) {
          console.log('favorites.js: couldn\'t find logged in user ' + logged_in_user_id);
          res.send(404);
        }
        
        var ret = {};
        ret['logged_in_user'] = logged_in_user;
        ret['title'] = 'Likes';
		ret['icon'] = '/images/icons/black_heart/black_heart.svg';
		ret['posts'] = [];
		
		dashboard.getpostsfromids(
		  logged_in_user['liked_post_ids'],
		  logged_in_user,
		  function(err, posts) {
		    if(err) {console.log(err);res.send(500);}
		    ret['posts'] = posts;
		    res.render('likedposts', ret);
		  }
		);
      
      });
  } else {
    res.redirect('/login');
  }
};