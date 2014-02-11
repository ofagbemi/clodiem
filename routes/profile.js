var data = require("../data.json");

exports.view = function(req, res) {
  var u = data['users'][req.query.username];
  u['posts'] = [];
  if(u['post_ids']) {
    for(var i=0;i<u['post_ids'].length;i++) {
      var post = data['posts'][u['post_ids'][i]];
      u['posts'].push(post);
    }
  }
  u['styles'] = [];
  if(u['style_ids']) {
	for(var i=0;i<u['style_ids'].length;i++) {
	  var styles = data['posts'][u['style_ids'][i]];
	  styles['posts'] = [];
	  for(var j=0;j<styles['items'].length;j++) {
		var style_post = data['posts'][u['post_ids'][j]];
		styles['posts'].push(style_post);
	  }
	  u['styles'].push(styles); 
	}
  }
  u['followers'] = [];
  if(u['followers_ids']) {
	for(var i=0;i<u['followers_ids'].length;i++) {
	  var follower = data['users'][u['followers_ids'][i]];
	  u['followers'].push(follower);
	}
  }
  u['following'] = [];
  if(u['following_ids']) {
	for(var i=0;i<u['following_ids'].length;i++) {
	  var following = data['users'][u['following_ids'][i]];
	  u['following'].push(following);
	}
  }
  res.render('profile', u);
};