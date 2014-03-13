var models = require('../models');

exports.sendmessage = function(req, res) {
  models.User
    .find({'id': req.body.touserid})
    .exec(function(err, result) {
      if(err) {console.log(err);res.send(500);}
      var user = result[0];
      if(!user) {
        res.send(404);
      }
      
      var message = new models.Message({
        'touserid': req.body.touserid,
		'fromuserid': req.body.fromuserid,
		'tousername': req.body.tousername,
		'fromusername': req.body.fromusername,
		'fromimg': req.body.fromimg,
		'time': req.body.time,
		'message': req.body.message
      });
      
      message.save(function(err) {
        if(err) {console.log(err);res.send(500);}
        console.log(message);
        
        console.log(user['message_ids']);
        user['message_ids'].unshift(message['_id']);
        
        console.log(user['message_ids']);
        models.User
          .update(
            {'id': user['id']},
            {'new_message':true, 'message_ids': user['message_ids']},
            function(err) {
              if(err) {console.log(err);res.send(500);}
              res.json(200, {'message': req.body.message});
            });
      
      });
    
    });
}

exports.addcomment = function(req, res) {
  models.Post
    .find({'id': req.body.postid})
    .exec(function(err, result) {
      if(err) {console.log(err);res.send(500);}
      var post = result[0];
      if(!post) {
        //console.log('comment.js: post ' + req.body.postid + ' not found');
        res.send(404);
      }
      
      var comment = new models.Comment({
        'userid': req.body.userid,
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
              //console.log('comment.js: saved comment successfully');
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