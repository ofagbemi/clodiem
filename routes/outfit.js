var profile = require('./profile.js');
var dashboard = require('./dashboard.js');
var models = require('../models');

exports.view = function(req, res) {
  var ret = {};
  
  models.User
    .find({'id': profile.getloggedinuser(req)})
    .exec(afterUserSearch);
    
  function afterUserSearch(err, users) {
    var loggedinuser = users[0];
    // whether the user's logged in or not, they should be
    // allowed to see outfits
    dashboard.getpostsfromids(
      [req.query.id], loggedinuser, function(err, posts) {
        if(err){console.log(err); res.send(500);}
        
        var post = posts[0];
        if(!post){
          console.log('outfit.js: couldn\'t find any posts with id ' + req.query.id);
          res.send(404);
        }
        
        console.log('outfit.js: got outfit ' + post['id']);
        ret['posts'] = [post];
        if(loggedinuser) ret['logged_in_user'] = loggedinuser;
        res.render('outfit', ret);
      }
    );
  }
  
  
  
  
  /*
  // enclose in a list to do {{#each posts}}

  console.log(req.query.id);
  models.Post.
    find({"id": req.query.id}).exec(afterSearch);

        function afterSearch(err, result) {
            if(result[0]){
               ret['posts'] = [result[0]];
                ret['logged_in_user'] = profile.getloggedinuser(req);
                for(var i=0;i<ret['posts'].length;i++) {
                    var post = ret['posts'][i];
                    post['items'] = [];
                    if(post['item_ids']) {
                        post['items'] = dashboard.getpostsfromids(post['item_ids']);
                    }
                }
                res.render('outfit', ret);
            } else {
                res.writeHead(404);
                res.end();
            }
        }
        */
};