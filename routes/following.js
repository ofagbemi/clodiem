exports.view = function(req, res) {
  res.render('listusers', {
      'title':'Following',
      'message': req.query.username + ' is following 0 users'
    }
  );
};