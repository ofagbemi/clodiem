var util = require('./util.js');
var profile = require('./profile.js');
var passwordHash = require('password-hash');
var models = require('../models');

exports.view = function(req, res) {
  if(profile.getloggedinuser(req)) {
    res.redirect('/aisle');
  } else {
    res.render('login', {});
  }
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
  var userid = util.getuserid(req.body.username);

  models.User.
        find("id", userid).
        exec(afterSearch);

        function afterSearch(err, result) {
          user = result[0];
          if(user) {
            // check password
            if(passwordHash.verify(req.body.password, user['password'])) {
              console.log('login.js: logging in user ' + userid);
              setcurrentuser(req, userid);
              res.redirect('/aisle');
            } else {
              var ret = {'message': 'Wrong username/password',
                         'username': req.body.username};
              res.render('login', ret);
            }
          } else {
            console.log('login.js: login failed! User ' + userid + ' could not be found');
            var ret = {'message': 'The username "' + req.body.username + '" could not be found',
                       'username': req.body.username};
            res.render('login', ret);
          }
        }
};

exports.logoutuser = function(req, res) {
  var logged_in_user = profile.getloggedinuser(req);
  if(logged_in_user && logged_in_user['id'] == req.query.id) {
    console.log('login.js: logging out user ' + logged_in_user['id']);
    removecurrentuser(req);
    res.redirect('/');
  } else {
    console.log('login.js: user ' + req.query.id + ' could not be found');
    res.writeHead(404);
    res.end();
  }
}