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

function usernamevalid(username) {
  if(username) return true;
}

exports.usernametaken = function(req, res) {
  var ret = {'exists': true};
  /*
  if(data['users'][util.getuserid(req.query.username)]) {
    console.log('profile.js: username ' + req.query.username + ' (or username with same hash) found');
    ret['exists'] = true;
  }*/
  
  if(!usernamevalid(req.query.username)) {
    ret['exists'] = true;
    ret['message'] = 'The username \'' + req.query.username + '\' is invalid';
    res.json(ret);
    return;
  }
  
  models.User
    .find({'username': new RegExp('^' + req.query.username + '$', 'i')})
    .exec(function(err, result) {
      if(err) {console.log(err);res.send(500);return;}
      if(result.length > 0) {
        ret['exists'] = true;
        ret['message'] = 'Sorry, but that username\'s already been taken';
      }
      else ret['exists'] = false;
      
      res.json(200, ret);
    });
}

// takes in a list of ids and passes a list of
// the user objects that correspond to the given
// ids to the callback
function getusersfromids(ids, callback, logged_in_user) {
  if(ids) {
    models.User.find({
      'id': {$in: ids}
    })
    .exec(afterSearch);
    
    function afterSearch(err, users) {
      if(err) {
        if(callback) callback(err, null);
      }
      
      if(logged_in_user) {
        // set the isfollowing field
        for(var i=0;i<users.length;i++) {
          users[i]['isfollowing'] = follow.isfollowing(logged_in_user, users[i]);
        }
      }
      
      if(callback) callback(err, users);
    }
  } else {
    callback('no ids', []);
  }
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

function viewmessages(req, res) {
  var logged_in_user_id = getloggedinuser(req);
  var ret = {};
  
  if(!logged_in_user_id) {
    // console.log('profile.js: no logged in user');
    res.redirect('/login');
    res.end();
    return;
  }
  
  models.User
    .find({'id': logged_in_user_id})
    .exec(function(err, users) {
      if(err) {console.log(err);res.send(500);return;}
      var logged_in_user = users[0];
      if(!logged_in_user) {res.send(404);}
      
      console.log(logged_in_user['message_ids']);
      
      models.Message
        .find({'_id': {$in: logged_in_user['message_ids']}})
        .sort('-time')
        .exec(function(err, messages) {
          if(err) {console.log(err);res.send(500);return;}
          /*var user_messages = [];
          for(var i=0;i<messages.length;i++) {
            user_messages[i] = {
              'user': {
                  'img': messages[i]['fromimg'],
                  'username': messages[i]['fromusername'],
                  'id': messages[i]['fromuserid']
                },
              'message': messages[i]['message']
            };
          }
          
          ret['user_messages'] = user_messages;
          ret['logged_in_user'] = logged_in_user;
          */
          
          for(var i=0;i<messages.length;i++) {
            messages[i]['logged_in_user'] = logged_in_user;
          }
          ret['messages'] = messages;
          ret['logged_in_user'] = logged_in_user;
          
          models.User.update({'id': logged_in_user['id']}, {'new_messages': 0},
            function(err) {
              // console.log('no new message for user');
              
          });
          
          res.render('messages', ret);
        
        });
    });
  
}

exports.viewmessages = viewmessages;

exports.view = function(req, res) {
  var ret = {};
  var logged_in_user_id = getloggedinuser(req);
  
  if(!logged_in_user_id) {
    // console.log('profile.js: no logged in user');
    res.redirect('/login');
    res.end();
    return;
  }
  
  models.User
    .find({"id": req.query.id})
    .exec(renderprofile)
  
  function renderprofile(err, result) {
    var user = result[0];
    if(!user) {
      // console.log('profile.js: couldn\'t find user ' + req.query.id);
      res.send(404);
      res.end();
      return;
    }
    
    // set ret to the found user
    ret = user;
    // console.log('profile.js: starting render of page for user ' + logged_in_user_id);
    if(logged_in_user_id) {
      // save some work if the user's looking at their own profile
      if(logged_in_user_id == user['id']) {
        ret['logged_in_user'] = user;
        ret['own_page'] = true;
        // console.log('profile.js: user ' + logged_in_user_id + ' is looking at their own page');
        renderPage(user, user);
      } else {
        // now we'll look for the logged in user
        models.User
          .find({'id': logged_in_user_id})
          .exec(function(err, users) {
            if(err) {console.log(err); res.send(500);}
            // console.log('profile.js: found logged in user ' + logged_in_user_id);
            renderPage(user, users[0]);
          });
      }
    } else {
      // console.log('profile.js: no logged in user');
      renderPage(user, null);
    }
    
    function renderPage(pageuser, loggedinuser) {
      // console.log('profile.js: getting page data');
      if(loggedinuser) {
        ret['logged_in_user'] = loggedinuser;
        ret['isfollowing'] = follow.isfollowing(loggedinuser, ret);
      } else {
        // console.log('profile.js: no user logged in');
      }
      
      ret['posts'] = [];
      // console.log('profile.js: getting user ' + ret['id'] + '\'s posts');
      dashboard.getpostsfromids(ret['post_ids'].slice(0,util.numpostsonpage), loggedinuser,
                                function(err, posts) {
                                
        if(err) {console.log(err);res.send(500);return;}
        
        ret['posts'] = posts;
        
        // get user's styles
        // console.log('profile.js: getting user ' + ret['id'] + '\'s styles');
        if(!ret['style_ids']) ret['style_ids'] = [];
        dashboard.getpostsfromids(ret['style_ids'], null,
          function(err, styles) {
            if(err) {console.log(err);res.send(500);return;}
            ret['styles'] = styles;
            
            // get user's followers
            // console.log('profile.js: getting user ' + ret['id'] + '\'s followers');
            if(!ret['followers_ids']) ret['followers_ids'] = [];
            getusersfromids(ret['followers_ids'],
              function(err, followers) {
                if(err) {console.log(err);res.send(500);return;}
                ret['followers'] = followers;
                
                // get user's following
                // console.log('profile.js: getting user ' + ret['id'] + '\'s following');
                if(!ret['following_ids']) ret['following_ids'] = [];
                getusersfromids(ret['following_ids'],
                  function(err, following) {
                    if(err) {console.log(err);res.send(500);return;}
                    ret['following'] = following;
                    
                    // that's it!
                    // console.log('profile.js: rendering page ' + ret['id']);
                    res.render('profile', ret);
                  }, loggedinuser);
              }, loggedinuser);
            })
      });
    };
  };
};