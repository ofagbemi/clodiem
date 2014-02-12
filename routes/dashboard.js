var data = require("../data.json");

exports.view = function(req, res) {
  var ret = {};
  ret['posts'] = [];
  for(var i=0;i<data['aisle_post_ids'].length;i++) {
    var post = data['posts'][data['aisle_post_ids'][i]];
    ret['posts'].push(post);
  }
  
  for(var i=0;i<ret['posts'].length;i++) {
	var post = ret['posts'][i];
	post['items'] = [];
	if(post['item_ids']) {
	  // turn items (item/post ids) into their actual posts
	  for(var j=0;j<post['item_ids'].length;j++) {
	    var item = data['posts'][post['item_ids'][j]];
	    post['items'].push(item);
	  }
	}
  }
  res.render('dashboard', ret);
};