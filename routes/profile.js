var data = require('../data.json');
var util = require('./util.js');

exports.view = function(req, res) {
  var u = data['users'][util.getuserid(req.query.username)];
  
  if(!u) {
    console.log('profile.js: The user \'' + req.query.username + '\' could not be found');
    u = {};
  }
  
  u['logged_in_username'] = data['logged_in_username'];
  u['logged_in_user_img'] = data['logged_in_user_img'];
  
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