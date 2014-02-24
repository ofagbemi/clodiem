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
exports.followingview = function(req, res) {
  var logged_in_user_id = profile.getloggedinuser(req);
  if(!logged_in_user_id) {
    console.log('favorites.js: no logged in user');
    res.redirect('/login');
  }
  
  models.User
    .find({'id': logged_in_user_id})
    .exec(function(err, result) {
      if(err) {console.log(err); res.send(500);}
      var logged_in_user = result[0];
      if(!logged_in_user) {
        console.log('favorites.js: couldn\'t find user ' + logged_in_user_id);
        res.send(404);
      }
      
      var ret = {};
      ret['title'] = 'Following';
      ret['users'] = [];
      
      profile.getusersfromids(
        logged_in_user['following_ids'],
        function(err, users) {
          if(err) {console.log(err);res.send(500);}
          ret['users'] = users;
          res.render('followingusers', ret);
        }
      );
    
    });
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
  var styleid = req.query.id;
  if(!styleid) {
    console.log('favorites.js: no style id provided');
    res.send(404);
  }
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
		
		// find style
		models.Post
		  .find({'id': styleid})
		  .exec(function(err, styles) {
		    if(err) {console.log(err); res.send(500)}
		    var style = styles[0];
		    if(!style) {
		      console.log('favorites.js: couldn\'t find style with id ' + styleid);
		      res.send(404);
		    }
		    
		    // find posts
		    var ret = {};
		    ret['title'] = style['title'];
			ret['icon'] = '/images/icons/shirt3/shirt3.svg';
			ret['logged_in_user'] = user;
		    ret['posts'] = [];
		    dashboard.getpostsfromids(
		      style['item_ids'],
		      null,
		      function(err, posts) {
		        if(err) {console.log(err); res.send(500);}
		        ret['posts'] = posts;
		        res.render('likedposts', ret);
		      }
		    );
		  });
	  });
  } else {
    console.log('favorites.js: no logged in user');
    res.redirect('/login');
  }
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