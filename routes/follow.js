var util = require('./util.js');
var dashboard = require('./dashboard.js');
var models = require('../models');

exports.followuser = function(req, res) {
  var ret = {'follow': false};
  
  // prevent user from following themselves
  if(req.body.followeruserid == req.body.follweduserid) {
    console.log('follow.js: user ' + req.body.follweruserid + ' tried to follow him/herself');
    res.writeHead(403);
    res.end();
    return;
  }
  
  models.User.
        find("id", req.body.followeruserid).
        exec(afterSearch);

        function afterSearch(err, result) {
          var follower = result[0];
           models.User.
            find("id", req.body.followeduserid).
            exec(afterSearch1);

            function afterSearch1(err, result) {
              var followed = result[0];
              if(!isfollowing(follower['id'], followed['id'])) {
                followed['followers_ids'].unshift(follower['id']);
                follower['following_ids'].unshift(followed['id']);
                ret['follow'] = true;
                console.log('follow.js: ' + follower['id'] + ' is following ' + followed['id']);
                console.log('follow.js: ' + follower['id'] + ' is now following ' + follower['following_ids'].length + ' users');
                
                dashboard.addaisleposts(follower, followed);
              } else {
                // if already following, unfollows
                var index = followed['followers_ids'].indexOf(req.body.followeruserid);
                if(index > -1) followed['followers_ids'].splice(index, 1);
              
                var index2 = follower['following_ids'].indexOf(req.body.followeduserid);
                if(index2 > -1) follower['following_ids'].splice(index2, 1);
                ret['follow'] = false;
                console.log('follow.js: ' + req.body.followeruserid + ' is not following ' + req.body.followeduserid);
                
                dashboard.removeaisleposts(follower, followed);
              }
              
            }
        }
  
  
  res.json(ret);
}

function isfollowing(followerid, followedid) {

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
}

exports.isfollowing = isfollowing;

