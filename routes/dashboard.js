var data = require('../data.json');
var util = require('./util.js');


exports.addlike = function(req, res) {
  var postid = req.body.postid;
  var userid = req.body.userid;
  
  var user = data['users'][userid];
  var post = data['posts'][postid];
  if(user && post) {
    console.log('dashboard.js: adding like to post ' + postid);
    if(!post['likers']) post['likers'] = [];
    post['likers'].unshift(userid);
    if(!post['likes']) post['likes'] = [];
    post['likes']++;
    
    if(!user['liked_post_ids']) user['liked_post_ids'] = [];
    user['liked_post_ids'].unshift(postid);
    
    res.json({'likes': post['likes']});
  }
};
exports.removelike = function(req, res) {
  var postid = req.body.postid;
  var userid = req.body.userid;
  
  var user = data['users'][userid];
  var post = data['posts'][postid];
  if(user && post) {
    console.log('dashboard.js: removing like from post ' + postid);
    var uindex = post['likers'].indexOf(userid);
    post['likers'].splice(uindex, 1);
    post['likes']--;
    
    var pindex = user['liked_post_ids'].indexOf(postid);
    user['liked_post_ids'].splice(pindex, 1);
    
    res.json({'likes': post['likes']});
  }
};
exports.addaislepostsfromlist = function(user, post_ids) {
  user['aisle_post_ids'] = post_ids + user['aisle_post_ids'];
}
exports.addaisleposts = function(follower, followed) {
  follower['aisle_post_ids'] = followed['post_ids'] + follower['aisle_post_ids'];
}
exports.removeaisleposts = function(follower, followed) {
  follower['aisle_post_ids'] = 
    follower['aisle_post_ids'].filter(function(elem) {
      return !(util.contains(elem, followed['post_ids']));
    });
}

exports.view = function(req, res) {
  if(data['logged_in_user']) {
	var ret = {};
	ret['logged_in_user'] = data['logged_in_user'];
	var logged_in_user = ret['logged_in_user'];
	ret['posts'] = [];
	if(logged_in_user && logged_in_user['aisle_post_ids']) {
	  for(var i=0;i<logged_in_user['aisle_post_ids'].length;i++) {
		var post = data['posts'][logged_in_user['aisle_post_ids'][i]];
		if(util.contains(post['id'], logged_in_user['liked_post_ids'])) {
		  post['liked_post'] = true;
		}
		ret['posts'].push(post);
	  }
	} else {
	  ret['logged_in_user']['aisle_post_ids'] = [];
	}
  
	for(var i=0;i<ret['posts'].length;i++) {
	  var post = ret['posts'][i];
	  post['items'] = [];
	  if(post['item_ids']) {
		// turn items (item/post ids) into their actual posts
		for(var j=0;j<post['item_ids'].length;j++) {
		  var item = data['posts'][post['item_ids'][j]];
		  post['items'].push(item);
		}
	  }
	}
	
	// get recommended users
	ret['logged_in_user']['recommended_users'] = [];
	for(var i=0;i<ret['logged_in_user']['recommended_user_ids'].length;i++) {
	  var r_user = data['users'][ret['logged_in_user']['recommended_user_ids'][i]];
	  ret['logged_in_user']['recommended_users'].push(r_user);
	}
	
	res.render('dashboard', ret);
  } else {
    // if no one's logged in, redirect to log in page
    res.redirect('/login');
  }
};