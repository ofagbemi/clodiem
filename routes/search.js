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

    console.log(query);
    
    ret['query'] = query;
    ret['posts'] = []; // tags
    ret['types'] = [];
    ret['tagswithusernames'] = [];
    ret['comments'] = [];
    ret['title'] = [];
    ret['retailer'] = [];


    // USERS
    ret['users'] = []; // usernames
    ret['locations'] = [];
    ret['descriptions'] = [];

    models.Post.
        find({"tags": query.toLowerCase()}).
        exec(afterSearchTags);

        function afterSearchTags(err, result) {
            if(err) {console.log(err); res.send(500); }
            if(result[0]) {
                console.log(result.length)
                for (var i = 0; i < result.length; i++) {
                    ret['posts'].push(result[i]["id"]);
                }
            }
        }

    models.Post.
        find({"type": { $regex : new RegExp(req.query.q.toLowerCase(), "i") } }).
        exec(afterSearchTypes);

        function afterSearchTypes(err, result) {
            if(err) {console.log(err); res.send(500); }
            if(result[0]) {
                console.log(result.length)
                for (var i = 0; i < result.length; i++) {
                    ret['types'].push(result[i]["id"]);
                }
            }
        }
        
    models.Post.
        find({"username": { $regex : new RegExp(req.query.q.toLowerCase(), "i") } }).
        exec(afterSearchTypes);

        function afterSearchTypes(err, result) {
            if(err) {console.log(err); res.send(500); }
            if(result[0]) {
                console.log(result.length)
                for (var i = 0; i < result.length; i++) {
                    ret['tagswithusernames'].push(result[i]["id"]);
                }
            }
        }

    models.Post.
        find({"comments": { $regex : new RegExp(req.query.q.toLowerCase(), "i") } }).
        exec(afterSearchTypes);

        function afterSearchTypes(err, result) {
            if(err) {console.log(err); res.send(500); }
            if(result[0]) {
                console.log(result.length)
                for (var i = 0; i < result.length; i++) {
                    ret['comments'].push(result[i]["id"]);
                }
            }
        }

    models.Post.
        find({"title": { $regex : new RegExp(req.query.q.toLowerCase(), "i") } } ).
        exec(afterSearchTypes);

        function afterSearchTypes(err, result) {
            if(err) {console.log(err); res.send(500); }
            if(result[0]) {
                console.log(result.length)
                for (var i = 0; i < result.length; i++) {
                    ret['title'].push(result[i]["id"]);
                }
            }
        }

    models.Post.
        find({"retailer": { $regex : new RegExp(req.query.q.toLowerCase(), "i") } }).
        exec(afterSearchTypes);

        function afterSearchTypes(err, result) {
            if(err) {console.log(err); res.send(500); }
            if(result[0]) {
                console.log(result.length)
                for (var i = 0; i < result.length; i++) {
                    ret['retailer'].push(result[i]["id"]);
                }
            }
        }

    // USER SEARCHES
    models.User.
        find({"username": { $regex : new RegExp(req.query.q.toLowerCase(), "i") } }).
        exec(afterSearchUsername);

        function afterSearchUsername(err, result) {
            if(err) {console.log(err); res.send(500); }
            if(result[0]) {
                console.log(result.length)
                for (var i = 0; i < result.length; i++) {
                    ret['users'].push(result[i]["id"]);
                }
            }
        }

    models.User.
        find({"location" : { $regex : new RegExp(req.query.q.toLowerCase(), "i") } }).
        exec(afterSearchLocationInUser);

        function afterSearchLocationInUser(err, result) {
            if(err) {console.log(err); res.send(500); }
            if(result[0]) {
                console.log(result.length)
                for (var i = 0; i < result.length; i++) {
                    ret['locations'].push(result[i]["id"]);
                }
            }
        }

    models.User.
        find({"description" : { $regex : new RegExp(req.query.q.toLowerCase(), "i") } }).
        exec(afterSearchDescriptionsInUser);

        function afterSearchDescriptionsInUser(err, result) {
            if(err) {console.log(err); res.send(500); }
            if(result[0]) {
                console.log(result.length)
                for (var i = 0; i < result.length; i++) {
                    ret['descriptions'].push(result[i]["id"]);
                }
            }
        }

    res.render('search', ret);

};
exports.landingview = function(req, res) {
  var ret = {};
  res.render('searchlanding', ret);
}

