var data = require('../data.json');

exports.view = function(req, res) {
  var ret = {};
  ret['logged_in_user'] = data['logged_in_user'];
  res.render('createpost', ret);
};