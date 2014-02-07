exports.view = function(req, res) {
  res.render('profile', {'username': req.query.username});
};