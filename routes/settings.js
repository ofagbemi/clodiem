var profile = require('./profile.js');
var models = require('../models');

exports.view = function(req, res) {
  var ret = {};
  var logged_in_user = profile.getloggedinuser(req);
  if(logged_in_user) {
    ret['logged_in_user'] = logged_in_user;
    res.render('settings', ret);
  } else {
    res.redirect('/login');
  }
}

exports.setuser = function(req, res) {

  models.User
    .find({"id" : req.body.userid})
    .exec(afterSearch)

  function afterSearch(err, result) { // this is a callback
      if(err) {console.log(err); res.send(500); }
      if(result[0]){
        var user = result[0];
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
  }

  
  // var user = data['users'][req.body.userid];
  // if(user) {
  //   for(var key in req.body.settings) {
  //     user[key] = req.body.settings[key];
  //   }
  //   res.writeHead(200);
  //   res.end();
  // } else {
  //   console.log('setuser.js: the user with id ' + req.body.userid + ' could not be found');
  //   res.writeHead(404);
  //   res.end();
  // }

};