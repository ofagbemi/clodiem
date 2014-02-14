var data = require('../data.json');
var util = require('./util.js');
var dashboard = require('./dashboard.js');

exports.followuser = function(req, res) {
  var ret = {'follow': false};
  var follower = data['users'][req.body.followeruserid];
  var followed = data['users'][req.body.followeduserid];
  
  if(!isfollowing(req.body.followeruserid, req.body.followeduserid)) {
    followed['followers_ids'].unshift(follower['id']);
    follower['following_ids'].unshift(followed['id']);
    ret['follow'] = true;
    console.log('follow.js: ' + req.body.followeruserid + ' is following ' + req.body.followeduserid);
    
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
  
  //res.writeHead(200);
  //res.end();
  res.json(ret);
}

function isfollowing(followerid, followedid) {
  var follower = data['users'][followerid];
  if(follower) {
    return util.contains(followedid, follower['following_ids']);
  } else {
    console.log('follow.js: couldn\'t find user ' + followerid);
  }
}

function isloggedinfollowing(userid) {
  var logged_in_user = data['logged_in_user'];
  if(logged_in_user) {
    return util.contains(userid, logged_in_user['following_ids']);
  }
}

exports.isloggedinfollowing = isloggedinfollowing;
exports.isfollowing = isfollowing;