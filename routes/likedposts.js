var data = require('../data.json');
var util = require('./util.js');
var profile = require('./profile.js');
var dashboard = require('./dashboard.js');

exports.view = function(req, res) {
  var logged_in_user = profile.getloggedinuser(req);
  if(logged_in_user) {
	var ret = {};
	ret['posts'] = [];
	
	// populate ret['posts'] with all of the logged in user's aisle posts
	if(logged_in_user && logged_in_user['liked_post_ids']) {
	  ret['posts'] = dashboard.getpostsfromids(
	                   logged_in_user['liked_post_ids'],
	                   logged_in_user);
	} else {
	  logged_in_user['liked_post_ids'] = [];
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
    res.redirect('/login');
  }
};