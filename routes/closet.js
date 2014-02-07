exports.view = function(req, res) {
  res.render('listitems', {
      'title':req.query.username + '\'s Closet',
      'message': req.query.username + '\'s closet has 0 styles and 0 items in it'
    }
  );
};