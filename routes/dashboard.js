var data = require("../data.json");

exports.view = function(req, res) {
  var ret = {};
  ret['posts'] = [];
  for(var i=0;i<data['aisle_post_ids'].length;i++) {
    ret['posts'].push(data['posts'][data['aisle_post_ids'][i]]);
  }
  res.render('dashboard', ret);
};