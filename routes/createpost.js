var data = require('../data.json');

exports.view = function(req, res) {
  var ret = {};
  ret['logged_in_user'] = data['logged_in_user'];
  res.render('createpost', ret);
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
	  'time': req.body.time,
	  'price': req.body.price,
	  'title': req.body.title
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