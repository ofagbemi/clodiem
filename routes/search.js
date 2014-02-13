var data = require("../data.json");

exports.view = function(req, res) {
    
    var d = data['posts'];
    var ids = data['aisle_post_ids'];
    
    var posts = [];
    posts['query'] = req.query.q;
    posts['posts'] = [];
    
    for(var i=0; i < ids.length; i++) {
        if(d[ids[i]]['tags']) {
            for(var j=0; j< d[ids[i]]['tags'].length; j++){
                if(d[ids[i]]['tags'][j]['tag'].toLowerCase() === req.query.q.toLowerCase()){
                    posts['posts'].push(d[ids[i]]);
                }
            }
        }
    }
    
    
    
    res.render('search', posts);
};