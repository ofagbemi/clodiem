var models = require('../models');

exports.addcomment = function(req, res) {
  var comment = {
    'username': req.body.username,
    'comment': req.body.comment,
    'time': req.body.time,
    'img': req.body.img
  };
  
  models.Post
        .find({"id": req.body.postid})
        .exec(afterSearchPost);

        function afterSearchPost(err, result) {
            if(err) {console.log(err); res.send(500); }
            if(result[0]) {
                console.log('comment.js: posting to post ' + req.body.postid);
                console.log('comment.js: ' + post);
                console.log('comment.js: Adding comment \'' + comment['comment'] + '\' to post ' + req.body.postid);
                if(post['comments']) {
                  post['comments'].unshift(comment);
                } else {
                post['comments'] = [comment];
                }
    
                res.writeHead(200);
                res.end();
            }
        }
};
