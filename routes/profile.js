var data = require("../data.json");

exports.view = function(req, res) {
  var u = data['users'][req.query.username];
  u['posts'] = [];
  for(var i=0;i<u['post_ids'].length;i++) {
    u['posts'].push(data['posts'][u['post_ids'][i]]);
  }
  
  res.render('profile', u);
};