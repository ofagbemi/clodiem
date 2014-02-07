exports.view = function(req, res) {
  res.render('listusers', {
      'title':'Followers',
      'message': req.query.username + ' has 0 followers'
    }
  );
};