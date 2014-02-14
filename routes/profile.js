var data = require('../data.json');
var util = require('./util.js');
var follow = require('./follow.js');

exports.view = function(req, res) {
  var u = null;
  if(req.query.id) u = data['users'][req.query.id];
  else if(req.query.username) u = data['users'][util.getuserid(req.query.username)];
  
  // var u = data['users'][util.getuserid(req.query.username)];
  
  if(!u) {
    console.log('profile.js: The user \'' + req.query.username + '\' ' +
                '(id: ' + req.query.id + ') could not be found');
    u = {};
  }
  
  if(data['logged_in_user']) {
    u['logged_in_user'] = data['logged_in_user'];
    if(u['id'] && u['logged_in_user']) {
      console.log(u['id'] + ' ' + u['logged_in_user']['id']);
      u['isfollowing'] = follow.isfollowing(u['logged_in_user']['id'], u['id']);
      console.log(u['isfollowing']);
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
  res.render('profile', u);
};