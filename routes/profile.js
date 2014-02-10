var data = require("../data.json");

exports.view = function(req, res) {
  var u = data['users'][req.query.username];
  u['posts'] = [];
  for(var i=0;i<u['post_ids'].length;i++) {
    u['posts'].push(data['posts'][u['post_ids'][i]]);
  }
  u['styles'] = [];
  for(var i=0;i<u['style_ids'].length;i++) {
    var styles = data['posts'][u['style_ids'][i]];
    styles['posts'] = [];
    for(var j=0;j<styles['items'].length;j++) {
      styles['posts'].push(data['posts'][u['post_ids'][j]]);
    }
    
    u['styles'].push(styles);
    
  }
  
  res.render('profile', u);
};