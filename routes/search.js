var profile = require('./profile.js');
var models = require('../models');

exports.view = function(req, res) {
    var ret = {};
    
    // get the current logged in user
    logged_in_user_id = profile.getloggedinuser(req);
    console.log('search.js: looking for logged in user');
    models.User
      .find({'id': logged_in_user_id})
      .exec(function(err, result) {
        ret['logged_in_user'] = result[0];
		var query = req.query.q;
		if(!query) {
		  query = '';
		}
 
		query = query.toLowerCase();
 
		ret['query'] = query;
		ret['posts'] = []; // tags
	 
		console.log('search.js: looking for results for query ' + query);
		models.Post
		  .find({$or:
				  [
					{'tags': query},
					{'title': new RegExp(query, 'i')}  // finds posts that have the query in the title
				  ]
				}
		  )
		  .exec(afterFindPosts);
 
		function afterFindPosts(err, posts) {
		  if(err) {console.log(err);res.send(500);}
		  ret['posts'] = posts;
		  res.render('search', ret);
		}
      });
    
    // ret['types'] = [];
    // ret['tagswithusernames'] = [];
    // ret['comments'] = [];
    // ret['title'] = [];
    // ret['retailer'] = [];


    // USERS
    // ret['users'] = []; // usernames
    // ret['locations'] = [];
    // ret['descriptions'] = [];
    
    
    
    
    /*
    models.Post.
        find("tags", query.toLowerCase()).
        exec(afterSearchTags);

        function afterSearchTags(err, result) {
            if(err) {console.log(err); res.send(500); }
            if(result[0]) {
                for (var i = 0; i < result.length; i++) {
                    ret['posts'].push(result[i]["id"]);
                }
            }
        }

    models.Post.
        find("type", req.query.q.toLowerCase()).
        exec(afterSearchTypes);

        function afterSearchTypes(err, result) {
            if(err) {console.log(err); res.send(500); }
            if(result[0]) {
                for (var i = 0; i < result.length; i++) {
                    ret['types'].push(result[i]["id"]);
                }
            }
        }
        
    models.Post.
        find("username", req.query.q.toLowerCase()).
        exec(afterSearchTypes);

        function afterSearchTypes(err, result) {
            if(err) {console.log(err); res.send(500); }
            if(result[0]) {
                for (var i = 0; i < result.length; i++) {
                    ret['tagswithusernames'].push(result[i]["id"]);
                }
            }
        }

    models.Post.
        find("comments", req.query.q.toLowerCase()).
        exec(afterSearchTypes);

        function afterSearchTypes(err, result) {
            if(err) {console.log(err); res.send(500); }
            if(result[0]) {
                for (var i = 0; i < result.length; i++) {
                    ret['comments'].push(result[i]["id"]);
                }
            }
        }

    models.Post.
        find("title", req.query.q.toLowerCase()).
        exec(afterSearchTypes);

        function afterSearchTypes(err, result) {
            if(err) {console.log(err); res.send(500); }
            if(result[0]) {
                for (var i = 0; i < result.length; i++) {
                    ret['title'].push(result[i]["id"]);
                }
            }
        }

    models.Post.
        find("retailer", req.query.q.toLowerCase()).
        exec(afterSearchTypes);

        function afterSearchTypes(err, result) {
            if(err) {console.log(err); res.send(500); }
            if(result[0]) {
                for (var i = 0; i < result.length; i++) {
                    ret['retailer'].push(result[i]["id"]);
                }
            }
        }

    // USER SEARCHES
    models.User.
        find("username", req.query.q.toLowerCase()).
        exec(afterSearchUsername);

        function afterSearchUsername(err, result) {
            if(err) {console.log(err); res.send(500); }
            if(result[0]) {
                for (var i = 0; i < result.length; i++) {
                    ret['users'].push(result[i]["id"]);
                }
            }
        }

    models.User.
        find("location", req.query.q.toLowerCase()).
        exec(afterSearchLocationInUser);

        function afterSearchLocationInUser(err, result) {
            if(err) {console.log(err); res.send(500); }
            if(result[0]) {
                for (var i = 0; i < result.length; i++) {
                    ret['locations'].push(result[i]["id"]);
                }
            }
        }

    models.User.
        find("description", req.query.q.toLowerCase()).
        exec(afterSearchDescriptionsInUser);

        function afterSearchDescriptionsInUser(err, result) {
            if(err) {console.log(err); res.send(500); }
            if(result[0]) {
                for (var i = 0; i < result.length; i++) {
                    ret['descriptions'].push(result[i]["id"]);
                }
            }
        }

    */
    // res.render('search', ret);

};
exports.landingview = function(req, res) {
  var ret = {};
  res.render('searchlanding', ret);
}

