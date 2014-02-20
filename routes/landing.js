var data = require('../data.json');
var profile = require('./profile.js');

exports.view = function(req, res) {
  if(profile.getloggedinuser(req)) {
    res.redirect('/aisle');
  } else {
    res.render('landing', {});
  }
};