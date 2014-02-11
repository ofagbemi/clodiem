var data = require('../data.json');
exports.view = function(req, res) {
  var ret = {};
  ret['posts'] = [data['posts'][req.query.id]];
  ret['username'] = data['username'];
  ret['user_img'] = data['user_img'];
  res.render('outfit', ret);
};