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
        
        if(loggedinuser) {
          dashboard.getpostsfromids(
            loggedinuser['style_ids'],
            loggedinuser,
            function(err, styles) {
              loggedinuser['styles'] = styles;
              sendoutfit();
            }
          );
        } else {
          sendoutfit();
        }
        function sendoutfit() {
		  var post = posts[0];
		  if(!post){
			// console.log('outfit.js: couldn\'t find any posts with id ' + req.query.id);
			res.send(404);
		  }
		
		  // console.log('outfit.js: got outfit ' + post['id']);
		  ret['posts'] = [post];
		  if(loggedinuser) ret['logged_in_user'] = loggedinuser;
		  res.render('outfit', ret);
        }
      }
    );
  }
};