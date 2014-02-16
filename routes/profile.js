var data = require('../data.json');
var util = require('./util.js');
var follow = require('./follow.js');
var profile = require('./profile.js');

exports.getloggedinuser = function(req) {
  return data['users'][req.session.userid];
}

exports.usernametaken = function(req, res) {
  var ret = {'exists': false};
  if(data['users'][util.getuserid(req.query.username)]) {
    console.log('profile.js: user ' + req.query.username + ' found');
    ret['exists'] = true;
  }
  res.json(ret);
}

exports.view = function(req, res) {
  var u = null;
  if(req.query.id) u = data['users'][req.query.id];
  else if(req.query.username) u = data['users'][util.getuserid(req.query.username)];
  
  if(!u) {
    console.log('profile.js: The user \'' + req.query.username + '\' ' +
                '(id: ' + req.query.id + ') could not be found');
    u = {};
  }
  
  var logged_in_user = profile.getloggedinuser(req);
  if(logged_in_user) {
    u['logged_in_user'] = logged_in_user;
    if(u['id'] && u['logged_in_user']) {
      console.log('profile.js: ' + u['logged_in_user']['id'] + ' is looking at ' + u['id'] + '\'s profile');
      u['isfollowing'] = follow.isfollowing(u['logged_in_user']['id'], u['id']);
      console.log('profile.js: ' + u['logged_in_user']['id'] + ' is following? ' + u['isfollowing']);
    } else {
      console.log('no id');
    }
  } else {
    console.log('profile.js: no user logged in');
  }
  
  u['posts'] = [];
  if(u['post_ids']) {
	for(var i=0;i<u['post_ids'].length;i++) {
	  var post = data['posts'][u['post_ids'][i]];
	  u['posts'].push(post);
	}
  }

  // convert item ids into posts
  for(var i=0;i<u['posts'].length;i++) {
	var post = u['posts'][i];
	post['items'] = [];
	if(post['item_ids']) {
	  for(var j=0;j<post['item_ids'].length;j++) {
		var item = data['posts'][post['item_ids'][j]];
		post['items'].push(item);
	  }
	}
  }

  u['styles'] = [];
  if(u['style_ids']) {
	for(var i=0;i<u['style_ids'].length;i++) {
	  var styles = data['posts'][u['style_ids'][i]];
	  styles['posts'] = [];
	  for(var j=0;j<styles['item_ids'].length;j++) {
		var style_post = data['posts'][u['post_ids'][j]];
		styles['posts'].push(style_post);
	  }
	  u['styles'].push(styles); 
	}
  }
  u['followers'] = [];
  if(u['followers_ids']) {
	for(var i=0;i<u['followers_ids'].length;i++) {
	  var follower = data['users'][u['followers_ids'][i]];
	  u['followers'].push(follower);
	}
  }
  u['following'] = [];
  if(u['following_ids']) {
	for(var i=0;i<u['following_ids'].length;i++) {
	  var following = data['users'][u['following_ids'][i]];
	  u['following'].push(following);
	}
  }
  
  if(logged_in_user['id'] == u['id']) {
    u['own_page'] = true;
  }
  
  res.render('profile', u);
};