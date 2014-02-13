var data = require('../data.json');

exports.view = function(req, res) {
  if(!data['logged_in_user']) {
    res.render('landing', {});
  } else {
    res.redirect('/aisle');
  }
};