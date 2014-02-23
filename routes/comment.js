var models = require('../models');

exports.addcomment = function(req, res) {
  models.Post
    .find({'id': req.body.postid})
    .exec(function(err, result) {
      if(err) {console.log(err);res.send(500);}
      var post = result[0];
      if(!post) {
        console.log('comment.js: post ' + req.body.postid + ' not found');
        res.send(404);
      }
      
      var comment = new models.Comment({
        'postid': req.body.postid,
		'username': req.body.username,
		'comment': req.body.comment,
		'time': req.body.time,
		'img': req.body.img
      });
      
      comment.save(function(err) {
        if(err) {console.log(err);res.send(500);}
        if(!post['comment_ids']) post['comment_ids'] = [];
        post['comment_ids'].unshift(comment['_id']);
        
        models.Post
          .update({'id': post['id']}, {'comment_ids': post['comment_ids']},
            function(err) {
              if(err) {console.log(err); res.send(500);}
              console.log('comment.js: saved comment successfully');
              res.send(200);
            })
      });
    });
  
  /*
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
        }*/
};

exports.getcommentsfromids = function(ids, callback) {
  if(!ids) {
    if(callback) {
      callback('comment.js: no ids', []);
    }
    return;
  }
  
  models.Comment
    .find({'_id': {$in : ids}})
    .exec(callback);
}