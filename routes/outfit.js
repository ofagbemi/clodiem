var data = require('../data.json');
exports.view = function(req, res) {
  var ret = {};
  // enclose in a list to do {{#each posts}}
  ret['posts'] = [data['posts'][req.query.id]];
  ret['logged_in_user'] = data['logged_in_user'];
  
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