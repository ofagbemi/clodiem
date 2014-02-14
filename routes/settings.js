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

exports.setuser = function(req, res) {
  var user = data['users'][req.body.userid];
  if(user) {
    for(var key in req.body.settings) {
      user[key] = req.body.settings[key];
    }
    res.writeHead(200);
    res.end();
  } else {
    console.log('setuser.js: the user with id ' + req.body.userid + ' could not be found');
    res.writeHead(404);
    res.end();
  }
};