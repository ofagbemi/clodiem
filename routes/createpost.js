var data = require('../data.json');
var util = require('./util.js');
var profile = require('./profile.js');

exports.view = function(req, res) {
  var logged_in_user = profile.getloggedinuser(req);
  if(logged_in_user) {
	var ret = {};
	ret['logged_in_user'] = data['logged_in_user'];
	res.render('createpost', ret);
  } else {
    res.redirect('/login');
  }
};

exports.createnewpost = function(req, res) {
  if(data['users'][req.body.userid]) {
	var username = data['users'][req.body.userid]['username'];
	var post = {
	  'type': req.body.type,
	  'userid': req.body.userid,
	  'username': username,
	  'numcomments': '0 comments',
	  'comments': [],
	  'img': req.body.img,
	  'likes': 0,
	  'likers': [],
	  'time': req.body.time,
	  'price': req.body.price,
	  'title': req.body.title,
	  'x': req.body.x,
	  'y': req.body.y,
	  'retailer': req.body.retailer,
	  'purchase_link': req.body.purchase_link,
	  'tags': req.body.tags,
	  'item_ids': req.body.items
	};
  
	post['id'] = util.getpostid(post);
	if(post['type'] == 'item') {
	  post['item_ids'].push(post['id']);
	}
	console.log('createpost.js: created post with id ' + post['id']);
	
	// return with id of item added
	var ret = {'postid': post['id']};
	res.json(ret);
  } else {
    console.log('createpost.js: couldn\'t find user with id ' + req.body.userid);
    res.writeHead(404);
    res.end();
  }
}

exports.createnewpostfromitems = function(req, res) {
  if(data['users'][req.body.userid]) {
    var username = data['users'][req.body.userid]['username'];
    var post = req.body.post;
    post['username'] = username;
	post['numcomments'] = '0 comments';
	post['comments'] = [];
	post['likes'] = 0;
	post['likers'] = [];
	post['item_ids'] = [];
  
    var item_ids = [];
	for(var i=0;i<req.body.items.length;i++) {
	  var item = req.body.items[i];
	  
	  item['comments'] = [];
	  item['likes'] = 0;
	  item['likers'] = [];
	  item['id'] = util.getpostid(item);
	  if(item['type'] == 'item') {
		if(!item['item_ids']) item['item_ids'] = [];
		post['item_ids'].push(item['id']);
	  }
	  // add the item
	  item_ids.push(item['id']);
	  data['posts'][item['id']] = item;
	  console.log('createpost.js: created item with id ' + item['id']);
	}
	
	post['item_ids'] = item_ids;
	post['id'] = util.getpostid(post)
	
	// add the post to posts and add the post id to the posting user's
	// list of post ids
	data['posts'][post['id']] = post;
	data['users'][req.body.userid]['post_ids'].unshift(post['id']);
	
	console.log('createpost.js: created post with id ' + post['id']);
	console.log('createpost.js: post ' + post['id'] + ' has ' + post['item_ids'].length + ' items');
	
	// return with id of item added
	var ret = {'postid': post['id']};
	res.json(ret);
  } else {
    console.log('createpost.js: couldn\'t find user with id ' + req.body.userid);
    res.writeHead(404);
    res.end();
  }
}