var util = require('./util.js');
var profile = require('./profile.js');
var models = require('../models');

exports.addlike = function(req, res) {
  var postid = req.body.postid;
  var userid = req.body.userid;
  
  models.User.
        find("id", userid).
        exec(afterSearchUser);

        function afterSearchUser(err, result) {
          var user = result[0];
        
          if (user) {
          models.Post.
            find("id", postid).
            exec(afterSearchPost);

            function afterSearchPost(err, result) {
              var post = result[0];
              if (post) {
                console.log('dashboard.js: adding like to post ' + postid);
                if(!post['likers']) post['likers'] = [];
                post['likers'].unshift(userid);
                if(!post['likes']) post['likes'] = [];
                post['likes']++;
                
                if(!user['liked_post_ids']) user['liked_post_ids'] = [];
                user['liked_post_ids'].unshift(postid);
                
                res.json({'likes': post['likes']});
              }
            }
          }
    
      }
};

exports.removelike = function(req, res) {
  var postid = req.body.postid;
  var userid = req.body.userid;
  
  models.User.
        find("id", userid).
        exec(afterSearchUser);

        function afterSearchUser(err, result) {
          var user = result[0];
          if (user) {
            models.Post.
            find("id", postid).
            exec(afterSearchPost);

            function afterSearchPost(err, result) {
              post = result[0];
              if (post) {
                console.log('dashboard.js: removing like from post ' + postid);
                var uindex = post['likers'].indexOf(userid);
                post['likers'].splice(uindex, 1);
                post['likes']--;
                
                var pindex = user['liked_post_ids'].indexOf(postid);
                user['liked_post_ids'].splice(pindex, 1);
                
                res.json({'likes': post['likes']});
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
        }
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
function getpostsfromids(ids, user, callback) {
  if(ids) {
    models.Post.find({
      'id': {$in: ids}
    })
    .sort('-date')
    .exec(afterSearch);
  
    function afterSearch(err, posts) {
      if(err) {
        callback(err, null);
        return;
      }
      
      if(posts) {
        console.log('dashboard.js: found requested posts');
        var l = 0;
		for(var i=0;i<posts.length;i++) {
		  var post = posts[i];
		  if(user) {
			if(util.contains(post['id'], user['liked_post_ids'])) {
			  post['liked_post'] = true;
			}
			post['logged_in_user'] = user;
		  }
		  
		  if(post['type'] == 'outfit') {
		    if(post['item_ids'] && post['item_ids'].length > 0) {
		      console.log('dashboard.js: getting post items ' + post['item_ids'].length);
			  getpostsfromids(post['item_ids'], null,
				function(err, items) {
				  if(err) {
					// quit
					callback(err, null);
					return;
				  }
				  post['items'] = items;
				  l++;
			  });
			} else {
			  l++;
			}
		  } else {
		    l++;
		  }
		}
		
		while(l < posts.length) {
		  /* loop until all posts have been processed */
		}
		console.log('dashboard.js: finished processing posts. Exiting soon...');
		if(callback) callback(err, posts);
      } else {
        if(callback) callback(err, null);
      }
    }
  }
};

exports.view = function(req, res) {
  var logged_in_user = profile.getloggedinuser(req);
  if(logged_in_user) {
    var ret = {};
    ret['posts'] = [];
    
    // populate ret['posts'] with all of the logged in user's aisle posts
    if(logged_in_user && logged_in_user['aisle_post_ids']) {
      ret['posts'] = getpostsfromids(logged_in_user['aisle_post_ids'],
                                     logged_in_user);
    } else {
      logged_in_user['aisle_post_ids'] = [];
    }
    
      // populate each post with the item posts for each of the items
      // belonging to that post
    for(var i=0;i<ret['posts'].length;i++) {
      var post = ret['posts'][i];
      post['items'] = [];
      if(post['item_ids']) {
        post['items'] = getpostsfromids(post['item_ids']);
      }
    }
    
    // get recommended users
    //console.log(logged_in_user);

    models.User.find({"id" : logged_in_user}).exec(afterSearch);

    function afterSearch(err, result){
      //CONVERTED LOGGED_IN_USER
      var logged_in_user = result[0];
      logged_in_user['recommended_users'] = [];
      if(!logged_in_user['recommended_user_ids']) logged_in_user['recommended_user_ids'] = [];
      for(var i=0;i<logged_in_user['recommended_user_ids'].length;i++) {
          models.User.
            find("id", logged_in_user['recommended_user_ids'][i]).
            exec(afterSearchUser);

            function afterSearchUser(err, result) {
              var r_user = result[0];
              logged_in_user['recommended_users'].push(r_user);
            }
      }
      
      ret['logged_in_user'] = logged_in_user;
      
      res.render('dashboard', ret);
    }
  } else {
    // if no one's logged in, redirect to log in page
    res.redirect('/login');
  }
};







