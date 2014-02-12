var data = require('../data.json');

exports.addcomment = function(req, res) {
  var comment = {
    'username': req.query.username,
    'comment': req.query.comment,
    'time': req.query.time,
    'img': req.query.img
  };
  
  var post = data['posts'][req.query.postid];
  
  if(post) {
    console.log('Adding comment \'' + comment['comment'] + '\' to post ' + req.query.postid);
    if(post['comments']) {
      post['comments'].unshift(comment);
    } else {
      post['comments'] = [comment];
    }
  }
};