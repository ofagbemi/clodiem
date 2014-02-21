var data = require("../data.json");
var profile = require('./profile.js');
var models = require('../models');

exports.view = function(req, res) {
    var ret = {};
    
    // get the current logged in user

    ret['logged_in_user'] = profile.getloggedinuser(req);
    
    var query = req.query.q
    if(!query) {
      query = '';
    }
    ret['query'] = query.toLowerCase();
    ret['posts'] = [];
    

    // models.User
    // .find({"id" : userid})
    // .exec(afterSearch)
    
    // function afterSearch(err, result) { // this is a callback
    //     if(err) {console.log(err); res.send(500); }
    //     if(!result[0]){
    //     }
    // }




    var d = data['posts'];
    var ids = Object.keys(d);
    
    for(var i=0; i < ids.length; i++) {
        if(d[ids[i]]['tags']) {
            for(var j=0; j< d[ids[i]]['tags'].length; j++){
                if(d[ids[i]]['tags'][j]['tag'].toLowerCase() == query.toLowerCase()){
                    ret['posts'].push(d[ids[i]]);
                }
            }
        }
    }
    
    res.render('search', ret);
};
exports.landingview = function(req, res) {
  var ret = {};
  res.render('searchlanding', ret);
}
