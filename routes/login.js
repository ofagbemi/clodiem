
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
        //{"id": userid}
    models.User
    .find({"id" : userid})
    .exec(afterSearch)
    
    function afterSearch(err, result) { // this is a callback
        if(err) {console.log(err); res.send(500); }
        if(result[0]){
            console.log(result[0]["username"]);
            var user = result[0];
            
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
       
        //var user = data['users'][userid];
        
//        if(user) {
//            // check password
//            if(passwordHash.verify(req.body.password, user['password'])) {
//                //      if(true){
//                console.log('login.js: logging in user ' + userid);
//                setcurrentuser(req, userid);
//                res.redirect('/aisle');
//            } else {
//                var ret = {'message': 'Wrong username/password',
//                    'username': req.body.username};
//                res.render('login', ret);
//            }
//        } else {
//            console.log('login.js: login failed! User ' + userid + ' could not be found');
//            var ret = {'message': 'The username "' + req.body.username + '" could not be found',
//                'username': req.body.username};
//            res.render('login', ret);
//        }
    }
};

exports.logoutuser = function(req, res) {
  var user_id = profile.getloggedinuser(req);
  if(user_id) {
    models.User
      .find({'id': user_id})
      .exec(function(err, result) {
        if(err) {console.log(err);res.send(500);}
        if(result[0]) {
          removecurrentuser(req);
          res.redirect('/');
        } else {
          console.log('login.js: couldn\'t find user with id ' + user_id);
          res.send(404);
        }
      });
  } else {
    console.log('login.js: no logged in user');
    res.redirect('/');
  }
  /*
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
  */
}