var data = require('../data.json');
var profile = require('./profile.js');

exports.view = function(req, res) {
  var user = profile.getloggedinuser(req);
  if(user) {
    res.render('favorites', {'logged_in_user': user});
  } else {
    console.log('favorites.js: no user logged in');
    res.writeHead(404);
    res.end();
  }
};