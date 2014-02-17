var data = require('../data.json');
var util = require('./util.js');
var follow = require('./follow.js');
var dashboard = require('./dashboard.js');

/* getloggedinuser
 *
 * returns the user object of the currently logged in
 * user
 */
function getloggedinuser(req) {
  return data['users'][req.session.userid];
}

exports.getloggedinuser = getloggedinuser;

exports.usernametaken = function(req, res) {
  var ret = {'exists': false};
  if(data['users'][util.getuserid(req.query.username)]) {
    console.log('profile.js: user ' + req.query.username + ' found');
    ret['exists'] = true;
  }
  res.json(ret);
}

function getusersfromids(ids) {
  var ret = [];
  if(ids) {
    for(var i=0;i<ids.length;i++) {
      var user = data['users'][ids[i]];
      ret.push(user);
    }
  }
  return ret;
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
  if(req.query.id) ret = data['users'][req.query.id];
  else if(req.query.username) ret = data['users'][util.getuserid(req.query.username)];
  
  if(!ret) {
    console.log('profile.js: The user \'' + req.query.id + '\' ' +
                '(username: ' + req.query.username + ') could not be found');
    res.writeHead(404);
    res.end();
  }
  
  var logged_in_user = getloggedinuser(req);
  
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
  if(logged_in_user['id'] == ret['id']) {
    ret['own_page'] = true;
  }
  
  res.render('profile', ret);
};