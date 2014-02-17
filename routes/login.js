var data = require('../data.json');
var util = require('./util.js');
var profile = require('./profile.js');

exports.view = function(req, res) {
  res.render('login', {});
};

function setcurrentuser(req, userid) {
  console.log('login.js: setting current user to ' + userid);
  req.session.userid = userid;
  // data['logged_in_user'] = data['users'][userid];
}

function removecurrentuser(req) {
  console.log('login.js: setting current user to null');
  req.session.userid = null;
  // data['logged_in_user'] = null;
}

exports.setcurrentuser = setcurrentuser;

exports.loginuser = function(req, res) {
  // look for user -- TODO: change this later to generate user id
  var userid = util.getuserid(req.query.username);
  if(data['users'][userid]) {
    console.log('login.js: logging in user ' + userid);
    setcurrentuser(req, userid);
    res.redirect('/aisle');
  }
  console.log('login.js: login failed! User ' + userid + ' could not be found');
};

exports.logoutuser = function(req, res) {
  var logged_in_user = profile.getloggedinuser(req);
  if(logged_in_user && logged_in_user['id'] == req.query.id) {
    console.log('login.js: logging out user ' + logged_in_user['id']);
    removecurrentuser(req);
    res.redirect('/');
  }
}