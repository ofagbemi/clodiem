var data = require('../data.json');
exports.view = function(req, res) {
  var ret = {};
  ret['posts'] = [data['posts'][req.query.id]];
  ret['username'] = data['username'];
  ret['user_img'] = data['user_img'];
  
  
  for(var i=0;i<ret['posts'].length;i++) {
    var post = ret['posts'][i];
    post['items'] = [];
    if(post['item_ids']) {
      for(var j=0;j<post['item_ids'].length;j++) {
        var item = data['posts'][post['item_ids'][j]];
        post['items'].push(item);
      }
    }
  }
  
  res.render('outfit', ret);
};