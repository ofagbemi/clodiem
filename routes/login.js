var data = require('../data.json');
var util = require('./util.js');

exports.view = function(req, res) {
  res.render('login', {});
};

function setcurrentuser(userid) {
  console.log('login.js: setting current user to ' + userid);
  data['logged_in_user'] = data['users'][userid];
}

function removecurrentuser() {
  console.log('login.js: setting current user to null');
  data['logged_in_user'] = null;
}

exports.setcurrentuser = setcurrentuser;

exports.loginuser = function(req, res) {
  // look for user -- TODO: change this later to generate user id
  var userid = util.getuserid(req.query.username);
  if(data['users'][userid]) {
    setcurrentuser(userid);
    res.redirect('/aisle');
  }
  console.log('login.js: login failed! User ' + userid + ' could not be found');
};

exports.logoutuser = function(req, res) {
  if(data['logged_in_user'] && data['logged_in_user']['id'] == req.query.id) {
    removecurrentuser();
    res.redirect('/');
  }
}