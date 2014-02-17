var data = require('../data.json');
var profile = require('./profile.js');
var dashboard = require('./dashboard.js');

exports.view = function(req, res) {
  var ret = {};
  // enclose in a list to do {{#each posts}}
  ret['posts'] = [data['posts'][req.query.id]];
  
  ret['logged_in_user'] = profile.getloggedinuser(req);
  
  for(var i=0;i<ret['posts'].length;i++) {
    var post = ret['posts'][i];
    post['items'] = [];
    if(post['item_ids']) {
      post['items'] = dashboard.getpostsfromids(post['item_ids']);
    }
  }
  
  res.render('outfit', ret);
};