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
        if(err) {console.log(err);res.send(500);return;}
        var user = result[0];
        if(user) {
          // console.log('favorites.js: found user ' + user['id']);
          dashboard.getpostsfromids(
            user['post_ids'],
            user,
            function(err, posts) {
              if(err) {console.log(err);res.send(500);return;}
              user['posts'] = posts;
              res.render('favorites', {'logged_in_user': user});
              return;
          });
        } else {
          // console.log('favorites.js: couldn\'t find user ' + user_id);
          res.send(404);
        }
      });
  } else {
    // console.log('favorites.js: no logged in user');
    res.redirect('/login');
    return;
  }
};
exports.followersview = function(req, res) {
  var logged_in_user_id = profile.getloggedinuser(req);
  if(!logged_in_user_id) {
    // console.log('favorites.js: no logged in user');
    res.redirect('/login');
    return;
  }
  
  models.User
    .find({'id': logged_in_user_id})
    .exec(function(err, result) {
      if(err) {console.log(err); res.send(500);}
      var logged_in_user = result[0];
      if(!logged_in_user) {
        // console.log('favorites.js: couldn\'t find user ' + logged_in_user_id);
        res.send(404);
      }
      
      var ret = {};
      ret['logged_in_user'] = logged_in_user;
      ret['title'] = 'Followers';
      ret['users'] = [];
      
      profile.getusersfromids(
        logged_in_user['followers_ids'],
        function(err, users) {
          if(err) {console.log(err);res.send(500);return;}
          ret['users'] = users;
          res.render('followingusers', ret);
          return;
        }, logged_in_user
      );
    
    });
}
exports.followingview = function(req, res) {
  var logged_in_user_id = profile.getloggedinuser(req);
  if(!logged_in_user_id) {
    // console.log('favorites.js: no logged in user');
    res.redirect('/login');
    return;
  }
  
  models.User
    .find({'id': logged_in_user_id})
    .exec(function(err, result) {
      if(err) {console.log(err); res.send(500);return;}
      var logged_in_user = result[0];
      if(!logged_in_user) {
        // console.log('favorites.js: couldn\'t find user ' + logged_in_user_id);
        res.send(404);
        return;
      }
      
      var ret = {};
      ret['logged_in_user'] = logged_in_user;
      ret['title'] = 'Following';
      ret['users'] = [];
      
      profile.getusersfromids(
        logged_in_user['following_ids'],
        function(err, users) {
          if(err) {console.log(err);res.send(500);}
          ret['users'] = users;
          res.render('followingusers', ret);
          return;
        }, logged_in_user
      );
    
    });
};
exports.postsview = function(req, res) {
  var logged_in_user_id = profile.getloggedinuser(req);
  if(logged_in_user_id) {
    models.User
      .find({'id': logged_in_user_id})
      .exec(function(err, result) {
        if(err) {console.log(err); res.send(500);return;}
        var logged_in_user = result[0];
        if(!logged_in_user) {
          // console.log('favorites.js: couldn\'t find logged in user ' + logged_in_user_id);
          res.send(404);
          return;
        }
        
        var ret = {};
        ret['logged_in_user'] = logged_in_user;
        ret['title'] = 'Posts';
		ret['icon'] = '/images/icons/pencil_and_paper/pencil_and_paper.svg';
		ret['posts'] = [];
		
		dashboard.getpostsfromids(
		  logged_in_user['post_ids'],
		  logged_in_user,
		  function(err, posts) {
		    if(err) {console.log(err);res.send(500);}
		    ret['posts'] = posts;
		    res.render('likedposts', ret);
		    return;
		  }
		);
      
      });
  } else {
    res.redirect('/login');
    return;
  }
}
exports.stylesview = function(req, res) {
  var logged_in_user_id = profile.getloggedinuser(req);
  
  if(logged_in_user_id) {
    models.User
      .find({'id': logged_in_user_id})
      .exec(function(err, result) {
        if(err) {console.log(err);res.send(500);}
        var logged_in_user = result[0];
        if(!logged_in_user) {
          // console.log('favorites.js: couldn\'t find user ' + logged_in_user_id);
          res.send(404);
          return;
        }
        
        var ret = {};
        ret['logged_in_user'] = logged_in_user;
        ret['title'] = 'Collections';
        ret['posts'] = [];
        
        dashboard.getpostsfromids(
          logged_in_user['style_ids'],
          logged_in_user,
          function(err, styles) {
            if(err) {console.log(err); res.send(500);}
            ret['posts'] = styles;
            res.render('styles', ret);
            return;
          }
        );
      });
  } else {
    // console.log('favorites.js: no logged in user');
    res.send(404);
    return;
  }
};
exports.stylepostsview = function(req, res) {
  var styleid = req.query.id;
  if(!styleid) {
    // console.log('favorites.js: no style id provided');
    res.send(404);
    return;
  }
  var logged_in_user_id = profile.getloggedinuser(req);
  
  if(logged_in_user_id) {
	models.User
	  .find({'id': logged_in_user_id})
	  .exec(function(err, users) {
		if(err) {console.log(err); res.send(500);}
		var user = users[0];
		if(!user) {
		  // console.log('favorites.js: couldn\'t find user ' + logged_in_user_id);
		  res.send(404);
		  return;
		}
		
		// find style
		models.Post
		  .find({'id': styleid})
		  .exec(function(err, styles) {
		    if(err) {console.log(err); res.send(500)}
		    var style = styles[0];
		    if(!style) {
		      // console.log('favorites.js: couldn\'t find style with id ' + styleid);
		      res.send(404);
		      return;
		    }
		    
		    // find posts
		    var ret = {};
		    ret['logged_in_user'] = user;
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
		        return;
		      }
		    );
		  });
	  });
  } else {
    // console.log('favorites.js: no logged in user');
    res.redirect('/login');
    return;
  }
};
exports.recommendedusersview = function(req, res) {
  var logged_in_user_id = profile.getloggedinuser(req);
  if(!logged_in_user_id) {
    // console.log('favorites.js: no logged in user');
    res.redirect('/login');
    return;
  }
  
  models.User
    .find({'id': logged_in_user_id})
    .exec(function(err, result) {
      if(err) {console.log(err); res.send(500);return;}
      var logged_in_user = result[0];
      if(!logged_in_user) {
        // console.log('favorites.js couldn\'t find find logged in user ' + logged_in_user_id);
        res.send(404);
        return;
      }
      
      ret = {};
      ret['logged_in_user'] = logged_in_user;
      ret['title'] = 'Recommended Users';
      ret['icon'] = '/images/icons/dialog/dialog.svg';
      
      ret['user_posts'] = [];
      
      
      // console.log('favorites.js: getting recommended users ' +
                  // ret['logged_in_user']['recommended_user_ids']);
      profile.getusersfromids(
        ret['logged_in_user']['recommended_user_ids'],
        function(err, users) {
          // get first post from each recommended user
          // console.log('favorites.js: building user_posts list');
          for(var i=0;i<users.length;i++) {
            var user = users[i];
            ret['user_posts'].push({'user': user});
          }
          
          // console.log('favorites.js: building post id list');
          // build list of posts to use
          var postlist = [];
          for(var i=0;i<ret['user_posts'].length;i++) {
            postlist.push(ret['user_posts'][i]['user']['post_ids'][0]);
          }
          
          // console.log('favorites.js: getting posts from ids [' + postlist + ']');
          dashboard.getpostsfromids(postlist, logged_in_user,
            function(err, posts) {
              if(err) {console.log(err);res.send(500);return;}
              for(var i=0;i<ret['user_posts'].length;i++) {
                ret['user_posts'][i]['posts'] = [];
                var u = ret['user_posts'][i]['user'];
                
                for(var j=0;j<posts.length;j++) {
                  if(posts[j]['username'] == u['username']) {
                    ret['user_posts'][i]['posts'].push(posts[j]);
                  }
                }
              }
              
              // console.log('favorites.js: rendering recommended users');
              res.render('user_posts', ret);
              return;
          });
          
        }, logged_in_user);
    });
};
exports.populartags = function(req, res) {
  var logged_in_user_id = profile.getloggedinuser(req);
  
  var ret = {};
  models.User
    .find({'id': logged_in_user_id})
    .exec(function(err, users) {
      if(err) {console.log(err); res.send(500);}
      var logged_in_user = users[0];
      
      // get popular tags
	  models.Tag
		.find({})
		.sort('-number')
		.limit(7)
		.exec(function(err, popular_tags) {
		  if(err) {console.log(err);res.send(500);return;}
		  
		  ret['popular_tags'] = popular_tags;
		  // console.log('dashboard.js: sending popular tags ' + ret['popular_tags']);
		  
		  ret['logged_in_user'] = logged_in_user;
		  // console.log('logged in user' + logged_in_user);
		  res.render('popular_tags', ret);
		  return;
		
		
		});
    });
}
exports.likedpostsview = function(req, res) {
  var logged_in_user_id = profile.getloggedinuser(req);
  if(logged_in_user_id) {
    models.User
      .find({'id': logged_in_user_id})
      .exec(function(err, result) {
        if(err) {console.log(err); res.send(500);return;}
        var logged_in_user = result[0];
        if(!logged_in_user) {
          // console.log('favorites.js: couldn\'t find logged in user ' + logged_in_user_id);
          res.send(404);
          return;
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
		    return;
		  }
		);
      
      });
  } else {
    res.redirect('/login');
    return;
  }
};