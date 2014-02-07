var data = require('../data.json');
exports.view = function(req, res) {
  res.render('outfit', data['posts'][req.query.id]);
};