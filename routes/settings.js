var data = require('../data.json');

exports.view = function(req, res) {
  var ret = {};
  if(data['logged_in_user']) {
    ret['logged_in_user'] = data['logged_in_user'];
    res.render('settings', ret);
  } else {
    res.redirect('/login');
  }
}