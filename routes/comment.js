var data = require('../data.json');

exports.addcomment = function(req, res) {
  console.log('comment.js: Adding a comment...');
  var comment = {
    'username': req.query.username,
    'comment': req.query.comment,
    'time': req.query.time,
    'img': req.query.img
  };
  
  console.log('comment.js: request');
  console.log('comment.js: ' + JSON.stringify(req));
  console.log('comment.js: response');
  console.log('comment.js: ' + JSON.stringify(res));
  
  var post = data['posts'][req.query.postid];
  
  console.log('comment.js: posting to post ' + req.query.postid);
  console.log('comment.js: ' + post);
  
  if(post) {
    console.log('comment.js: Adding comment \'' + comment['comment'] + '\' to post ' + req.query.postid);
    if(post['comments']) {
      post['comments'].unshift(comment);
    } else {
      post['comments'] = [comment];
    }
  }
};