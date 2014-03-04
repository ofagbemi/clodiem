var data = require('../data.json');
var util = require('./util.js');
var profile = require('./profile.js');
var fs = require('fs');
var models = require('../models');

exports.view = function(req, res) {
  var logged_in_id = profile.getloggedinuser(req);
  models.User.find({"id" : logged_in_id}).exec(afterSearch);
  function afterSearch(err, result){
  	  if(err) {console.log(err); res.send(500); }
  	  if(result[0]) {
  	  	//RESET LOGGED IN USER
  	  	var logged_in_user = result[0];
		var ret = {};
		ret['logged_in_user'] = logged_in_user;
		res.render('createpost', ret);
	  } else {
	    res.redirect('/login');
	  }
  }
};

exports.uploads = function(req, res) {
  var file = req.params.file;
  
  models.Image
    .find({'name': file})
    .exec(function(err, images) {
      // console.log(images);
      var image = images[0];
      if(image) {
		res.writeHead(200, {'Content-Type': image.image.contentType});
		res.end(image.image.data, 'binary');
      } else {
        res.send(404);
        return;
      }
    });
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
  // console.log('createpost.js: starting image upload');
  fs.readFile(image.path, function(err, data) {
	var name = image.name
	// console.log('createpost.js: uploading file ' + name);
	if(!name) {
	  // console.log('error');
	} else {
	  var upload_name = generateimageuploadname(name);

	  var dbimg = new models.Image;
	  dbimg.image.data = data;
	  dbimg.image.contentType = 'image';
	  dbimg.name = upload_name;
	  
	  dbimg.save(function(err, dbimg) {
	    if(err) {console.log(err);return;}
	    // console.log('createpost.js: file available as ' + upload_name);
	    if(success)
	      success('/uploads/' + upload_name);
	  });
	}
  });
}

/*
 * only adds to post if there isn't an image for it already
 */
exports.uploadimageandaddtopost = function(req, res) {
  models.Post
	.find({"id": req.body.postid}).exec(afterSearch1);

  // console.log("test id image " + req.body.postid);
  function afterSearch1(err, result) {
	var post = result[0];
	// console.log("test upload " + post);
	if(post) {
	  uploadimage(
		req.files.img, 
		function(url) {
		  if(post['type'] == 'outfit') {
		    // console.log('createpost.js: changing image for item [' + post['item_ids'] + ']');
		    models.Post
		      .update(
		        {'id': {$in: post['item_ids']}},
		        {'img': url}
		      )
		      .exec(function(err) {
		        updatePost();
		      });
		  } else {
		    updatePost();
		  }
		  
		  function updatePost() {
			models.Post.update({'id' : post['id']}, {'img': url}, afterUpdating);
			  function afterUpdating(err) {
				if (err) {console.log(err); res.send(500);}
				
				// update the tags
				// console.log('createpost.js: updating post tag image with ' + url);
		        savetags(post['tags'].slice(), post['id'], post['time'], new String(url));
				
				res.redirect('/outfit?id=' + post['id']);
			}
		  }
		});
	  } else {
		  res.writeHead(404);
		  res.end();
	  }
  }
}

function savetag(tag, postid, posttime, image) {
  var upload_image = image;
  if(!upload_image) {
    upload_image = '';
  }
  
  // console.log('createpost.js: tag upload image is ' + upload_image);


  models.Tag
    .find({'tag': tag})
    .exec(function(err, tags) {
      var foundtag = tags[0];
      if(foundtag) {
        // update this tag
        models.Tag
          .update(
            {'_id': foundtag['_id']},
            {'number': foundtag['number'] + 1,
             'last_post_time': posttime,
             'last_post_id': postid,
             'last_post_image': (upload_image == '') ? foundtag['last_post_image'] : upload_image
            },
            function(err) {
              if(err) {
                // console.log(err);
                // console.log('couldn\'t update tag ' + tag);
                return;
              }
              // console.log('createpost.js: updated tag ' + tag);
              return;
            });
      } else {
        // save a new tag
        var newtag = new models.Tag({
          'tag': tag,
          'number': 1,
          'last_post_time': posttime,
          'last_post_id': postid,
          'last_post_image': upload_image
        });
        newtag.save(function(err) {
          if(err){
            // console.log(err);
            // console.log('createpost.js: couldn\'t save tag ' + tag);
            return;
          }
          // console.log('createpost.js: saved tag ' + tag);
          return;
        });
      }
    
    });
};

function savetags(tags, postid, posttime, postimage) {
  if(tags) {
    for(var i=0;i<tags.length;i++) {
      savetag(tags[i], postid, posttime, postimage);
    }
  }
};

exports.createnewpost = function(req, res) {
	models.User.
        find({"id" : req.body.userid}).
        exec(afterSearch1);

        function afterSearch1(err, result) {
          var user = result[0];
          if(user) {
			var username = user['username'];
			var img;
			if(req.files && req.files.img) {
			  img =  uploadimage(req.files.img.path);
			} else img = req.body.img;

			var post = new models.Post({
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
			  'price_num': req.body.price_num,
			  'title': req.body.title,
			  'x': req.body.x,
			  'y': req.body.y,
			  'retailer': req.body.retailer,
			  'purchase_link': req.body.purchase_link,
			  'item_ids': req.body.item_ids,
			  'img' : req.body.img
			});

            var tags = req.body.tags;
            if(!tags) tags = [];
            for(var i=0;i<tags.length;i++) {
              tags[i] = tags[i].toLowerCase();
            }
            post['tags'] = tags;
            
			post['id'] = util.getpostid(post);
			
			
			// save tags elsewhere, don't need them for return
            savetags(tags.slice(), post['id'], post['time']);

			if(post['type'] == 'item') {
			  post['item_ids'].push(post['id']);
			}
			
			// console.log(post);			
			// console.log('createpost.js: created post with id ' + post['id']);

			post.save(afterSaving);
			function afterSaving(err) {
			    if(err) {
			      console.log(err);
			      res.send(500);
			      res.end();
			    }
			    // add to user
				if(post['type'] == 'style') {
				  user['style_ids'].unshift(post['id']);
				} else {
				  // console.log('createpost.js: unsupported post type ' + post['type']);
				}
				
				  models.User
					.update({'id': user['id']},
					  {'style_ids': user['style_ids'],
					   'post_ids': user['post_ids']},
					  function(err) {
						if(err) {console.log(err);res.send(500);}
						// console.log('createpost.js: updated user ' + user['id']);
						// return with id of item added
						var ret = {'postid': post['id']};
						res.json(ret);
					  });
			}
		} else {
		  // console.log('createpost.js: couldn\'t find user with id ' + req.body.userid);
		  res.writeHead(404);
		  res.end();
		}
  	}
}

exports.createnewpostfromitems = function(req, res) {
    // console.log(req.body.userid);
    models.User.find({"id" : req.body.userid}).exec(afterSearch);
    function afterSearch(err, result) {
    	if(err) {console.log(err); res.send(500); }
    	// console.log("create new post: " + req.body.userid);
    	if(result[0]) {
    		var user = result[0];
    		var username = result[0]["username"];
    		//var body = req.body.post;
    		var post = new models.Post(req.body.post);
	    	
		    post['username'] = username;
			post['numcomments'] = '0 comments';
			post['comments'] = [];
			post['likes'] = 0;
			post['likers'] = [];
			post['item_ids'] = [];
			post['img'] = "";
		  
		    var item_ids = [];
		    var items = req.body.items;
		    if(items) {
			  for(var i=0;i<req.body.items.length;i++) {

				var item = new models.Post(req.body.items[i]);
			  
				item['comments'] = [];
				item['likes'] = 0;
				item['likers'] = [];
				item['id'] = util.getpostid(item);
				item['username'] = username;
				if(item['type'] == 'item') {
				  if(!item['item_ids']) item['item_ids'] = [];
				  post['item_ids'].push(item['id']);
				}
				
				savetags(item['tags'].slice(), item['id'], item['time']);
				
				
				// add the item
				item_ids.push(item['id']);

				// data['posts'][item['id']] = item;

				item.save(afterItemSave);

				function afterItemSave(err){
					if(err) {console.log(err); res.send(500); }
		        	// console.log("item saved");
				}

				// console.log('createpost.js: created item with id ' + item['id']);
			  }
			}
			
			post['item_ids'] = item_ids;
			post['id'] = util.getpostid(post)
			
			savetags(post['tags'].slice(), post['id'], post['time']);
			
			// add the post to posts and add the post id to the posting user's
			// list of post ids

			//data['posts'][post['id']] = post;

			//saving
			
			post.save(afterPostSave);
			function afterPostSave(err){
				if(err) {console.log(err); res.send(500); }
		        // console.log("post saved");
		        user['post_ids'].unshift(post['id']);
		        
		        models.User.update({'id': user['id']}, {'post_ids': user['post_ids']},
		          function(err) {
		            if(err) {console.log(err);res.send(500);}
		            // console.log("post number 2" + post);

					// console.log('createpost.js: created post with id ' + post['id']);
					// console.log('createpost.js: post ' + post['id'] + ' has ' + post['item_ids'].length + ' items');
				
					// return with id of item added
					res.json(200, {'postid': post['id']});
		          });
			}

		} else {
		  // console.log('createpost.js: couldn\'t find user with id 2' + req.body.userid);
		  res.writeHead(404);
		  res.end();
		}
    }
}


exports.addtopostitems = function(req, res) {
  models.Post
    .find({'id': req.body.id})
    .exec(function(err, posts) {
      if(err) {console.log(err);res.send(500);return;}
      var post = posts[0];
      if(post) {
        if(!post['item_ids']) post['item_ids'] = [];
		if(req.body.item_ids) {
		  // console.log('createpost.js: adding ' + req.body.item_ids + ' to ' +
		    // post['id']
		  // );
		  post['item_ids'] = req.body.item_ids.concat(post['item_ids']);
		}
		if(req.body.img) {
		  post['img'] = req.body.img;
		}
		
		models.Post
		  .update(
		    {'id': post['id']},
		    {'item_ids': post['item_ids'], 'img': post['img']},
		      function(err) {
		        if(err) {console.log(err);res.send(500);return;}
		          // console.log('createpost.js: item_ids is now [' + post['item_ids'] + ']');
		          res.send(200);
		          return;
		        });
      
      } else {
        // console.log('createpost.js: couldn\'t find post with id ' + req.body.id);
        res.send(404);
        return;
      }
    });
    
  
/*
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
    console.log('createpost.js: couldn\'t find post with id ' + req.body.id);
    res.writeHead(404);
    res.end();
  }*/
}