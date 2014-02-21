var data = require('../data.json');
var util = require('./util.js');
var profile = require('./profile.js');
var fs = require('fs');

exports.view = function(req, res) {
  var logged_in_user = profile.getloggedinuser(req);
  if(logged_in_user) {
	var ret = {};
	ret['logged_in_user'] = logged_in_user;
	res.render('createpost', ret);
  } else {
    res.redirect('/login');
  }
};

exports.uploads = function(req, res) {
  var file = req.params.file;
  var img = fs.readFileSync(__dirname + '/../public/uploads/' + file);
  res.writeHead(200, {'Content-Type': 'image'});
  res.end(img, 'binary');
}

function generateimageuploadname(imgname) {
  var s = imgname.split('.');
  var ext = (s.length > 1)?('.' + s[s.length-1]):'';
  var randomstr = util.randomstr(32);
  return 'clodiem_' + util.sha1(imgname + randomstr) + ext;
}

exports.uploadimage = uploadimage;

// uploads image req.files.(image member) and passes
// the url to the callback function success
function uploadimage(image, success) {
  fs.readFile(image.path, function(err, data) {
	var name = image.name
	console.log('createpost.js: uploading file ' + name);
	if(!name) {
	  console.log('error');
	} else {
	  var upload_name = generateimageuploadname(name);
	  var newPath = __dirname + '/../public/uploads/' + upload_name;
	  fs.writeFile(newPath, data, function(err) {
	    console.log('createpost.js: file available as ' + upload_name);
	    if(success)
	      success('/uploads/' +  upload_name);
	  });
	}
  
  });
}

/*
 * only adds to post if there isn't an image for it already
 */
exports.uploadimageandaddtopost = function(req, res) {
  var post = data['posts'][req.body.postid];
  if(post && !post['img']) {
    uploadimage(
      req.files.img, 
	  function(url) {
		post['img'] = url;
		console.log('createpost.js: ' + post['img'] + ' added to post ' + post['id']);
		res.redirect('/outfit?id=' + post['id']);
	  });
  } else {
    res.writeHead(404);
    res.end();
  }
}

exports.createnewpost = function(req, res) {
  var user = data['users'][req.body.userid];
  if(user) {
	var username = user['username'];
	var img;
	if(req.files && req.files.img) {
	  img =  uploadimage(req.files.img.path);
	} else img = req.body.img;
	var post = {
	  'type': req.body.type,
	  'userid': user['id'],
	  'username': user['username'],
	  'numcomments': '0 comments',
	  'comments': [],
	  'img': img,
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
	  'item_ids': req.body.item_ids
	};
  
	post['id'] = util.getpostid(post);
	if(post['type'] == 'item') {
	  post['item_ids'].push(post['id']);
	}
	console.log('createpost.js: created post with id ' + post['id']);
	
	// add to posts
	data['posts'][post['id']] = post;
	
	// add to user
	if(post['type'] == 'style') {
	  user['style_ids'].unshift(post['id']);
	} else {
	  console.log('createpost.js: unsupported post type ' + post['type']);
	}
	
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
    var items = req.body.items;
    if(items) {
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
};
exports.addtopostitems = function(req, res) {
  var post = data['posts'][req.body.id];
  if(post) {
    if(!post['item_ids']) post['item_ids'] = [];
    if(req.body.items) {
      post['item_ids'] = post['item_ids'].concat(req.body.item_ids);
    }
    if(req.body.img) {
      post['img'] = req.body.img;
    }
    res.writeHead(200);
    res.end();
  } else {
    console.log('creaetpost.js: couldn\'t find post with id ' + req.body.id);
    res.writeHead(404);
    res.end();
  }
}