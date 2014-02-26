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
              res.json(200, {'comments': post['comment_ids'].length});
            })
      });
    });
};

exports.getcommentsfromids = function(_ids, callback, fromobj) {
  var ids = null;
  if(fromobj) {
    if(!_ids['comment_ids']) _ids['comment_ids'] = [];
    ids = _ids['comment_ids'];
  } else {
    ids = _ids;
  }

  if(!ids) {
    if(callback) {
      callback('comment.js: no ids', []);
    }
    return;
  }
  
  models.Comment
    .find({'_id': {$in : ids}})
    .sort('-time')
    .exec(function(err, comments) {
      callback(err, comments, _ids);
    });
}