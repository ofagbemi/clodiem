var data = require('../data.json');

exports.addcomment = function(req, res) {
  var comment = {
    'username': req.body.username,
    'comment': req.body.comment,
    'time': req.body.time,
    'img': req.body.img
  };
  
  var post = data['posts'][req.body.postid];
  
  console.log('comment.js: posting to post ' + req.body.postid);
  console.log('comment.js: ' + post);
  
  if(post) {
    console.log('comment.js: Adding comment \'' + comment['comment'] + '\' to post ' + req.body.postid);
    if(post['comments']) {
      post['comments'].unshift(comment);
    } else {
      post['comments'] = [comment];
    }
    
    res.writeHead(200);
    res.end();
  }
};