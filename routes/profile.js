var data = require('../data.json');
var util = require('./util.js');
var follow = require('./follow.js');
var dashboard = require('./dashboard.js');
var models = require('../models');

/* getloggedinuser
 *
 * returns the user object of the currently logged in
 * user
 */
function getloggedinuser(req) {
    return req.session.userid;
}

exports.getloggedinuser = getloggedinuser;

exports.usernametaken = function(req, res) {
  var ret = {'exists': false};
  if(data['users'][util.getuserid(req.query.username)]) {
    console.log('profile.js: username ' + req.query.username + ' (or username with same hash) found');
    ret['exists'] = true;
  }
  res.json(ret);
}

// takes in a list of ids and passes a list of
// the user objects that correspond to the given
// ids to the callback
function getusersfromids(ids, callback) {
  if(ids) {
    models.User.find({
      'id': {$in: ids}
    })
    .exec(afterSearch);
    
    function afterSearch(err, users) {
      console.log('hi');
      if(err) {
        if(callback) callback(err, null);
        console.log('bye');
      }
      if(callback) callback(err, users);
      console.log(users);
    }
  }
  /*
  var ret = [];
  if(ids) {
    for(var i=0;i<ids.length;i++) {
      var user = data['users'][ids[i]];
      ret.push(user);
    }
  }
  return ret;
  */
};

exports.getusersfromids = getusersfromids;

/* view
 *
 * Renders a profile page given a user's id or username
 * the returned object has the format:
 * {
 *    'logged_in_user': { logged in user stuff },
 *    'username': username of the profile being viewed,
 *    'posts': posts of the profile being viewed,
 *    etc...
 * }
 */
exports.view = function(req, res) {
  var ret = null;
  
  // allow to query by username or user id
  // if(req.query.id) ret = data['users'][req.query.id];
  // else if(req.query.username) ret = data['users'][util.getuserid(req.query.username)];
  
  /*
  if(!ret) {
    console.log('profile.js: The user \'' + req.query.id + '\' ' +
                '(username: ' + req.query.username + ') could not be found');
    res.writeHead(404);
    res.end();
  }*/
  
  var ret = {};
  var logged_in_user_id = getloggedinuser(req);
  
  models.User
    .find({"id": req.query.id})
    .exec(renderprofile)
  
  function renderprofile(err, result) {
    var user = result[0];
    if(!user) {
      console.log('profile.js: couldn\'t find user ' + req.query.id);
      res.writeHead(404);
      res.send();
    }
    
    // set ret to the found user
    ret = user;
    console.log('profile.js: starting render of page for user ' + user['id']);
    if(logged_in_user_id) {
      // save some work if the user's looking at their own profile
      if(logged_in_user_id == user['id']) {
        ret['logged_in_user'] = user;
        ret['own_page'] = true;
        console.log('profile.js: user ' + logged_in_user_id + ' is looking at their own page');
        renderPage(user, user);
      } else {
        // now we'll look for the logged in user
        models.User
          .find({'id': logged_in_user_id})
          .exec(function(err, logged_in_user) {
            if(err) console.log(err); res.send(500);
            console.log('profile.js: found logged in user ' + logged_in_user_id);
            renderPage(user, logged_in_user);
          });
      }
    } else {
      console.log('profile.js: no logged in user');
      renderPage(user, null);
    }
    
    function renderPage(pageuser, loggedinuser) {
      console.log('profile.js: getting page data');
      if(loggedinuser) {
        ret['logged_in_user'] = loggedinuser;
        ret['isfollowing'] = follow.isfollowing(loggedinuser, ret);
      } else {
        console.log('profile.js: no user logged in');
      }
      
      ret['posts'] = [];
      console.log('profile.js: getting user ' + ret['id'] + '\'s posts');
      dashboard.getpostsfromids(ret['post_ids'], loggedinuser,
                                function(err, posts) {
                                
        if(err) {console.log(err);res.send(500);}
        
        ret['posts'] = posts;
        
        // get user's styles
        console.log('profile.js: getting user ' + ret['id'] + '\'s styles');
        if(!ret['style_ids']) ret['style_ids'] = [];
        dashboard.getpostsfromids(ret['style_ids'], null,
          function(err, styles) {
            if(err) {console.log(err);res.send(500);}
            ret['styles'] = styles;
            
            // get user's followers
            console.log('profile.js: getting user ' + ret['id'] + '\'s followers');
            if(!ret['followers_ids']) ret['followers_ids'] = [];
            getusersfromids(ret['followers_ids'],
              function(err, followers) {
                if(err) {console.log(err);res.send(500);}
                ret['followers'] = followers;
                
                // get user's following
                console.log('profile.js: getting user ' + ret['id'] + '\'s following');
                if(!ret['following_ids']) ret['following_ids'] = [];
                getusersfromids(ret['following_ids'],
                  function(err, following) {
                    if(err) {console.log(err);res.send(500);}
                    ret['following'] = following;
                    
                    // that's it!
                    console.log('profile.js: rendering page');
                    res.render('profile', ret);
                  });
              });
            })
      });
      
    };
    
    /*
				   if(logged_in_user) {
					 ret['logged_in_user'] = logged_in_user;
					 if(ret['id']) {
					   console.log('profile.js: ' + logged_in_user['id'] + ' is looking at ' + ret['id'] + '\'s profile');
					   ret['isfollowing'] = follow.isfollowing(logged_in_user['id'], ret['id']);
					   console.log('profile.js: ' + logged_in_user['id'] + ' is following? ' + ret['isfollowing']);
					 } else {
					   console.log('no id');
					 }
				   } else {
					 console.log('profile.js: no user logged in');
				   }
  
				   // populate posts
				   ret['posts'] = dashboard.getpostsfromids(ret['post_ids'], logged_in_user);

				   // go from item ids into posts
				   for(var i=0;i<ret['posts'].length;i++) {
					 var post = ret['posts'][i];
					 post['items'] = dashboard.getpostsfromids(post['item_ids']);
				   }

				   // go from style ids into lists of posts
				   ret['styles'] = [];
				   if(ret['style_ids']) {
					 for(var i=0;i<ret['style_ids'].length;i++) {
					   var style = data['posts'][ret['style_ids'][i]];
					   style['posts'] = dashboard.getpostsfromids(style['item_ids']);
					   ret['styles'].push(style); 
	  
					 }
				   }
  
				   ret['followers'] = [];
				   if(ret['followers_ids']) {
					 ret['followers'] = getusersfromids(ret['followers_ids']);
				   }
  
				   ret['following'] = [];
				   if(ret['following_ids']) {
					 ret['following'] = getusersfromids(ret['following_ids']);
				   }
  
				   // feed back whether the user is looking at his/her own page
				   if(logged_in_user && logged_in_user['id'] == ret['id']) {
					 ret['own_page'] = true;
				   }
  
				   res.render('profile', ret);*/
  };
};