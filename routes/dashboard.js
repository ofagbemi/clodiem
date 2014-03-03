var util = require('./util.js');
var profile = require('./profile.js');
var models = require('../models');
var comment = require('./comment.js');

exports.addlike = function(req, res) {
  var postid = req.body.postid;
  var userid = req.body.userid;
  
  models.User
	.find({"id": userid})
	.exec(afterSearchUser);

  function afterSearchUser(err, result) {
	var user = result[0];
	if(user) {
	  models.Post
		.find({"id": postid})
		.exec(afterSearchPost);

	  function afterSearchPost(err, result) {
		var post = result[0];
		if(post) {
		  user['liked_post_ids'].unshift(postid);
		  post['likers'].unshift(userid);
		
		  var newlikes = post['likes'] + 1;
		
		  models.Post.update(
		    {'id':post['id']},
		    {'likers': post['likers'], 'likes': newlikes},
		    function(err) {
		      if(err) {console.log(err);res.send(500);return;};
		      // update the user
		      user
		        .update({'liked_post_ids': user['liked_post_ids']},
		        function(err) {
		          if(err) {console.log(err);res.send(500);}
		          console.log('dashboard.js: added like to post ' + postid);
		          res.json(200, {'likes': newlikes});
		          return;
		        });
		  });
		  
		} else {
		  console.log('dashboard.js: couldn\'t add like to post ' + postid);
		  res.send(404);
		  return;
		}
	  }
	}
  }
};
exports.removelike = function(req, res) {
  var postid = req.body.postid;
  var userid = req.body.userid;
  
  models.User
	.find({"id": userid})
	.exec(afterSearchUser);

  function afterSearchUser(err, result) {
	var user = result[0];
	if(user) {
	  models.Post
		.find({"id": postid})
		.exec(afterSearchPost);

	  function afterSearchPost(err, result) {
		var post = result[0];
		if(post) {
		  user['liked_post_ids'].unshift(postid);
		  
		  var newlikes = post['likes'];
		  var likerindex = post['likers'].indexOf(userid);
		  if(likerindex > -1){
		    newlikes--;
		    if(newlikes < 0) newlikes = 0;
		    post['likers'].splice(likerindex, 1);
		  }
		
		  models.Post.update(
		    {'id':post['id']},
		    {'likers': post['likers'], 'likes': newlikes},
		    function(err) {
		      if(err) {console.log(err);res.send(500);return};
		      // update the user
		      user
		        .update({'liked_post_ids': user['liked_post_ids']},
		        function(err) {
		          if(err) {console.log(err);res.send(500);}
		          console.log('dashboard.js: removed like from post ' + postid);
		          res.json(200, {'likes': newlikes});
		        });
		  });
		  
		} else {
		  console.log('dashboard.js: couldn\'t remove like from post ' + postid);
		  res.send(404);
		  return;
		}
	  }
	}
  }
};

exports.addaislepostsfromlist = function(user, post_ids) {
  console.log('dashboard.js: adding ' + post_ids + ' to aisle posts');
  user['aisle_post_ids'] = post_ids.concat(user['aisle_post_ids']);
}
exports.addaisleposts = function(follower, followed) {
  console.log('dashboard.js: adding ' + followed['post_ids'] + ' to aisle posts');
  follower['aisle_post_ids'] = followed['post_ids'].concat(follower['aisle_post_ids']);
}
exports.removeaisleposts = function(follower, followed) {
  console.log('dashboard.js: removing ' + followed['id'] + '\'s aisle posts');
  console.log(follower['aisle_post_ids']);
  follower['aisle_post_ids'] = 
    follower['aisle_post_ids'].filter(function(elem) {
      return !(util.contains(elem, followed['post_ids']));
    });
}

exports.getaisleposts = function(req, res) {
  var segment_index = req.query.index;
  var num_posts = req.query.num_posts || util.numpostsonpage;
  var userid = req.query.userid;
  var key = req.query.key;
  var ret = {};
  
  console.log('dashboard.js: userid ' + userid);
  console.log('dashboard.js: key ' + key);
  
  models.User
    .find({'id': userid})
    .exec(function(err, users) {
      var user = users[0];
      if(user) {
        var index = segment_index * num_posts;
        var post_ids = user[key];
        
        console.log('dashboard.js: looking through ' + post_ids + ' from index ' +
                    index + ' for ' + num_posts + ' posts');
        console.log('user: ' + user);
        ret['posts'] = [];
        if(post_ids && index < post_ids.length) {
          // slice will just grab the rest of the posts if index goes over
          // the number of aisle_posts
          getpostsfromids(
            post_ids.slice(index, index + num_posts),
            user,
            function(err, posts) {
              if(err) {console.log(err);return;}
              ret['posts'] = posts;
              if(index + num_posts < post_ids.length) ret['more_posts'] = true;
              
              console.log('dashboard.js: sending back ' + ret['posts']);
              res.render('partials/postlist', ret);
              return;
            });
        } else {
          console.log('dashboard.js: no posts left');
          res.send(200, {'no_more_posts': true});
          return;
        }
      } else {
        console.log('dashboard.js: couldn\'t find user ' + userid);
        res.send(404);
        return;
      }
    });
  /*
  var segment_index = req.query.index;
  var num_posts = req.query.num_posts;
  var userid = req.query.userid;
  var ret = {};

  models.User.
        find("id", userid).
        exec(afterSearchUser);

        function afterSearchUser(err, result) {
          user = result[0];
          if(user) {
              // index to start getting posts from
              var index = segment_index * num_posts;
              var aisle_post_ids = user['aisle_post_ids'];
              var aisle_posts = [];
              if(aisle_post_ids && index < aisle_post_ids.length) {
                // slice will just grab the rest of the posts if index goes over
                // the number of aisle_posts
                aisle_posts = getpostsfromids(aisle_post_ids.slice(index, index + num_posts));
              } else {
                console.log('dashboard.js: no more posts left');
              }
              ret['posts'] = aisle_posts;
              res.render('partials/postlist', ret);
              
          } else {
              console.log('dashboard.js: couldn\'t find user ' + userid);
          }
        }*/
};

exports.getpostsfromids = getpostsfromids;

/* getpostsfromids
 *
 * Takes in a user object, a list of post ids, and an empty list
 * and populates that empty list with post objects. If a user is
 * provided, the function will set the user as the post's logged
 * in user and set the liked_post attribute of each liked post
 * to true
 */
function getpostsfromids(_ids, user, callback, fromobj, key) {
  var ids = null;
  if(fromobj) {
    if(!_ids[key]) _ids[key] = [];
    ids = _ids[key];
  } else {
    ids = _ids;
  }

  if(!ids) {
    console.log('dashboard.js: no ids');
    callback('no ids', null, _ids);
    return;
  } else {
    console.log('dashboard.js: getting posts with id\'s [' + ids + ']');
    console.log('dashboard.js: DB ready state ' + models.Post.db.readyState);
    
    for(var i=0;i<ids.length;i++) {
      if(!ids[i]) ids[i] = 0;
    }
    
    models.Post.find({
      'id': {$in: ids}
    })
    .sort('-time')
    .exec(afterSearch);
  
    function afterSearch(err, posts) {
      if(err) {
        callback(err, null);
        return;
      }
      
      if(posts) {
        console.log('dashboard.js: found requested posts');
        var l = 0;
		for(var index=0;index<posts.length;index++) {
		  var i = index;  // since i is used in callback functions
		  var post = posts[i];
		  if(!post) continue;
		  if(user) {
			if(util.contains(post['id'], user['liked_post_ids'])) {
			  post['liked_post'] = true;
			}
			post['logged_in_user'] = user;
		  }
		  
		  comment.getcommentsfromids(
		    post,
		    function(err, comments, cpost) {
		    if(err) {if(callback) {callback(err, null);} return;}
		    
		    console.log(posts[i]);
		    console.log('comments: ' + comments);
		    cpost['comments'] = comments;
		    
			if(cpost['type'] == 'outfit') {
			  if(cpost['item_ids'] && cpost['item_ids'].length > 0) {
				console.log('dashboard.js: getting post items ' + cpost['item_ids'].length);
				getpostsfromids(cpost, user,
				  function(err, items, opost) {
					if(err) {
					  // quit
					  callback(err, null);
					  return;
					}
					opost['items'] = items;
					l++;
				}, true, 'item_ids');
			  } else {
				l++;
			  }
			} else if(cpost['type'] == 'style') {
			  if(cpost['item_ids'] && cpost['item_ids'].length > 0) {
			    console.log('dashboard.js: getting style items ' + cpost['item_ids'].length);
			    getpostsfromids(cpost, user, 
			      function(err, outfits, spost) {
			        if(err) {
			          callback(err, null);
			          return;
			        }
			        spost['posts'] = outfits;
			        l++;
			      }, true, 'item_ids');
			  } else {
			    l++;
			  }
			}
			else {
			  l++;
			}
		  }, true, 'comment_ids');
		}
		var check = setInterval(function() {
		  console.log(posts.length);
		  console.log(l);
		  if(l == posts.length) {
		    clearInterval(check);
		    console.log('dashboard.js: finished processing posts. Exiting soon...');
		    if(callback){
		      console.log('dashboard.js: found posts [' + posts + ']');
		      callback(err, posts, _ids);
		    }
		  }
		}, 200);
      } else {
        if(callback) callback(err, null);
      }
    }
  }
};

exports.view = function(req, res) {
  var logged_in_user_id = profile.getloggedinuser(req);
  if(!logged_in_user_id) {
    console.log('dashboard.js: no logged in user');
    res.send(404);
    res.redirect('/login');
    return;
  }
  
  models.User
    .find({'id': logged_in_user_id})
    .exec(function(err, users) {
      if(err) {console.log(err); res.send(500);}
      var logged_in_user = users[0];
      if(!logged_in_user) {
        console.log('dashboard.js: couldn\'t find user ' + logged_in_user_id);
        res.redirect('/aisle');
        return;
      }
      getpostsfromids(logged_in_user['aisle_post_ids'].slice(0,util.numpostsonpage), logged_in_user,
        function(err, posts) {
          var ret = {};
          ret['posts'] = posts;
          profile.getusersfromids(
            logged_in_user['recommended_user_ids'],
            // find users
            function(err, users) {
              if(err) {console.log(err);res.send(500);}
              logged_in_user['recommended_users'] = users;
              
              getpostsfromids(logged_in_user['style_ids'], logged_in_user,
                function(err, styles) {
                  if(err) {console.log(err);res.send(500);return;}
                  logged_in_user['styles'] = styles;
                  
				  ret['logged_in_user'] = logged_in_user;
				  console.log('logged in user' + logged_in_user);
				  res.render('dashboard', ret);
				  return;
                    
              });
            });
        });
    });
};

exports.tagsview = function(req, res) {
  var logged_in_user_id = profile.getloggedinuser(req);
  if(!logged_in_user_id) {
    console.log('dashboard.js: no logged in user');
    res.send(404);
    res.redirect('/login');
    return;
  }
  
  models.User
    .find({'id': logged_in_user_id})
    .exec(function(err, users) {
      if(err) {console.log(err); res.send(500);}
      var logged_in_user = users[0];
      if(!logged_in_user) {
        console.log('dashboard.js: couldn\'t find user ' + logged_in_user_id);
        res.redirect('/aisle');
        return;
      }
      getpostsfromids(logged_in_user['aisle_post_ids'], logged_in_user,
        function(err, posts) {
          var ret = {};
          ret['posts'] = posts;
          profile.getusersfromids(
            logged_in_user['recommended_user_ids'],
            // find users
            function(err, users) {
              if(err) {console.log(err);res.send(500);}
              logged_in_user['recommended_users'] = users;
              
              getpostsfromids(logged_in_user['style_ids'], logged_in_user,
                function(err, styles) {
                  if(err) {console.log(err);res.send(500);return;}
                  logged_in_user['styles'] = styles;
                  
                  // get popular tags
                  models.Tag
                    .find({})
                    .sort('-number')
                    .limit(8)
                    .exec(function(err, popular_tags) {
                      if(err) {console.log(err);res.send(500);return;}
                      
                      ret['popular_tags'] = popular_tags;
                      console.log('dashboard.js: sending popular tags ' + ret['popular_tags']);
                      
                      ret['logged_in_user'] = logged_in_user;
				      console.log('logged in user' + logged_in_user);
				      res.render('dashboard', ret);
				      return;
                    
                    
                    });
              });
            });
        });
    });
};






