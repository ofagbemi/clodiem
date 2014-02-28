var util = require('./util.js');
var dashboard = require('./dashboard.js');
var models = require('../models');

exports.followuser = function(req, res) {
  // prevent user from following themselves
  if(req.body.followeruserid == req.body.follweduserid) {
    console.log('follow.js: user ' + req.body.follweruserid + ' tried to follow him/herself');
    res.writeHead(403);
    res.end();
    return;
  }
  
  models.User
    .find({'id': req.body.followeruserid})
    .exec(afterSearch);
    
    function afterSearch(err, result) {
      if(err) {console.log(err);res.send(500);}
      var follower = result[0];
      if(!follower) {
        console.log('follow.js: couldn\'t find user ' + req.body.followeruserid);
        res.send(404);
      }
      models.User
        .find({'id': req.body.followeduserid})
        .exec(function(err, users) {
          if(err) {console.log(err);res.send(500);}
          var followed = users[0];
          if(!followed) {
            console.log('follow.js: couldn\'t find user ' + req.body.followeduserid);
            res.send(404);
          }
          
          var ret = {'follow': false};
          
          if(!isfollowing(follower, followed)) {
            followed['followers_ids'].unshift(follower['id']);
			follower['following_ids'].unshift(followed['id']);
			ret['follow'] = true;
			console.log('follow.js: ' + follower['id'] + ' is following ' + followed['id']);
			console.log('follow.js: ' + follower['id'] + ' is now following ' + follower['following_ids'].length + ' users');
            
            dashboard.addaisleposts(follower, followed);
          } else {
            // if already following, unfollow
            var index = followed['followers_ids'].indexOf(req.body.followeruserid);
			if(index > -1) followed['followers_ids'].splice(index, 1);
            
            var index2 = follower['following_ids'].indexOf(req.body.followeduserid);
			if(index2 > -1) follower['following_ids'].splice(index2, 1);
			ret['follow'] = false;
			console.log('follow.js: ' + req.body.followeruserid + ' is not following ' + req.body.followeduserid);
		   
			dashboard.removeaisleposts(follower, followed);
          }
        
          // update users
          models.User
            .update(
              {'id': follower['id']},
              {'following_ids': follower['following_ids'], 'aisle_post_ids': follower['aisle_post_ids']},
              function(err) {
                if(err) {console.log(err);res.send(500);}
                models.User
                  .update(
                    {'id': followed['id']},
                    {'followers_ids': followed['followers_ids']},
                    function(err) {
                      if(err) {console.log(err);res.send(500);}
                      console.log('follow.js: set follow successfully!');
                      res.json(200, ret);
                });
            });
        });
    
    }

}

function isfollowing(follower, followed) {
  if(followed && followed['id'] && follower && follower['following_ids'])
    return util.contains(followed['id'], follower['following_ids']);
  else return false;
  /*
  models.User.
        find("id", followerid).
        exec(afterSearch);

        function afterSearch(err, result) {
          var follower = result[0];

          if(follower) {
            return util.contains(followedid, follower['following_ids']);
          } else {
            console.log('follow.js: couldn\'t find user ' + followerid);
          }
        }
        */
}

exports.isfollowing = isfollowing;

