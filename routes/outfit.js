var profile = require('./profile.js');
var dashboard = require('./dashboard.js');
var models = require('../models');

exports.view = function(req, res) {
  var ret = {};
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
};