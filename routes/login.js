var data = require('../data.json');
var util = require('./util.js');

exports.view = function(req, res) {
  res.render('login', {});
};

exports.setcurrentuser = function(userid) {
  console.log('login.js: setting current user to ' + userid);
  data['logged_in_user'] = data['users'][userid];
}

exports.loginuser = function(req, res) {
  // look for user -- TODO: change this later to generate user id
  var userid = util.getuserid(req.query.username);
  setcurrentuser(userid);
  res.redirect('/aisle');
};