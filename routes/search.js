var profile = require('./profile.js');
var models = require('../models');


//needs to search based on query needs to omit redundancies
//sort by likes, time, price, (relevance best or multiple)   +   (preference AI)    //after query 

exports.view = function(req, res) {
    // get the current logged in user
    logged_in_user_id = profile.getloggedinuser(req);
    console.log('search.js: looking for logged in user');
    models.User
      .find({'id': logged_in_user_id})
      .exec(function(err, result) {

        var ret = {};
        ret['logged_in_user'] = result[0];

        var query = req.query.q;
        if(!query) {
          query = '';
        }
        query = query.toLowerCase();

        //filters values from req
        //fields to serach
        var searchTags = true;
        var searchTitle = true;
        var searchRetailer = true;
        var searchPostingProfile = true;
        //number filters
        var timeMin;
        var timeMax;
        var likeMin;
        var likeMax;
        var priceMin;
        var priceMax;
        //boolean filters
        var link;
        var photo;
        var style = true;
        var outfit = true;
        var clothing = true; 
        var isFriend;

        //filter values to give to mongo
        var searchTagsMongo = {"never true" : "for or statements only"};
        if(true) searchTagsMongo = {'tags': query};

        var searchTitleMongo = {"never true" : "for or statements only"};
        if(true) searchTitleMongo = {'title': new RegExp(query, 'i')};

        var searchRetailerMongo = {"never true" : "for or statements only"};
        if(true) searchRetailerMongo = {"retailer": new RegExp(query, 'i')};

        var searchPostingProfileMongo = {"never true" : "for or statements only"};
        if(true) searchPostingProfileMongo = {"username": new RegExp(query, 'i')};

        var timeMinMongo = {};
        if(timeMin) timeMinMongo = {"time" : {$gte: timeMin} };

        var timeMaxMongo = {};
        if(timeMax) timeMaxMongo = {"time" : {$lte: timeMax} };

        var likeMinMongo = {};
        if(likeMin) likeMinMongo = {"likes" : {$gte: likeMin} };

        var likeMaxMongo = {};
        if(likeMax) likeMaxMongo = {"likes" : {$lte: likeMax} };

        var priceMinMongo = {};
        if(priceMin) priceMinMongo = {"price": {$gte: priceMin} };

        var priceMaxMongo = {};
        if(priceMax) priceMaxMongo = {"price": {$lte: priceMax} };

        var linkMongo = {};
        if(link) linkMongo = {"purchase_link": {$exists: true} };

        var photoMongo = {};
        if(photo) photoMongo = {"img": {$exists: true} };

        //these four im less sure about how to construct
        //i put the next three in an or case because they are mutually exclusive
        var styleMongo = {};
        if(style) styleMongo = {"type": "style" };

        var outfitMongo = {"never true" : "for or statements only"};
        if(outfit) outfitMongo = {"type": "outfit" };

        var clothingMongo = {"never true" : "for or statements only"};
        if(clothing) clothingMongo = {"type": "clothing"};

        //maybe filter after
        var isFriendMongo = {};
        //if(isFriend) isFriendMongo = {"userid": ??? };

        
		ret['query'] = query;
		ret['posts'] = []; // tags
		console.log('search.js: looking for results for query ' + query);


        models.Post
          .find({$or:
               [
                 searchTagsMongo,
                 searchTitleMongo,  // finds posts that have the query in the title
                 searchRetailerMongo,
                 searchPostingProfileMongo
               ]
             }
          )
          .where(timeMinMongo).where(timeMaxMongo).where(likeMinMongo).where(likeMaxMongo)
          .where(priceMinMongo).where(priceMaxMongo).where(linkMongo).where(photoMongo)
          //.where({$or:[styleMongo, outfitMongo, clothingMongo]}) //this doesnt work yet, working on syntax
          .where(isFriendMongo)
          .sort("-time") //can implement a weighting funciton here
          .exec(afterFindPosts);

 
        function afterFindPosts(err, posts) {
          if(err) {console.log(err);res.send(500);}
          ret['posts'] = posts;
          res.render('search', ret);
        }



        // //POSTS
        // ret['tags'] = [];
        // ret['types'] = [];
        // ret['tagswithusernames'] = [];
        // ret['title'] = []; 
        // ret['retailer'] = [];
        // ret['comments'] = [];

        // //USERS
        // ret['users'] = []; // usernames
        // ret['locations'] = [];
        // ret['descriptions'] = [];
    
        // models.Post.
        //     find({"tags": query.toLowerCase()}).
        //     exec(afterSearchTags);

        // function afterSearchTags(err, result) {
        //     if(err) {console.log(err); res.send(500); }
        //     if(result[0]) {
        //         console.log(result.length)
        //         ret['tags'] = result;
        //     }
        //     models.Post.
        //         find({"type": { $regex : new RegExp(req.query.q.toLowerCase(), "i") } }).
        //         exec(afterSearchTypes);
        // }

        // function afterSearchTypes(err, result) {
        //     if(err) {console.log(err); res.send(500); }
        //     if(result[0]) {
        //         console.log(result.length)
        //         ret['types'] = result;
        //     }
        //     models.Post.
        //         find({"username": { $regex : new RegExp(req.query.q.toLowerCase(), "i") } }).
        //         exec(afterSearchUsername);
        // }

        // function afterSearchUsername(err, result) {
        //     if(err) {console.log(err); res.send(500); }
        //     if(result[0]) {
        //         console.log(result.length)
        //         ret['tagswithusernames'] = result;
        //     }
        //     models.Post.
        //         find().
        //         where({"title": { $regex : new RegExp(req.query.q.toLowerCase(), "i") } }).
        //         exec(afterSearchTitle);
        // }

        
        // function afterSearchTitle(err, result) {
        //     if(err) {console.log(err); res.send(500); }
        //     if(result[0]) {
        //         console.log(result.length)
        //         ret['title'] = result;
        //     }
        //     models.Post.
        //         find({"retailer": { $regex : new RegExp(req.query.q.toLowerCase(), "i") } }).
        //         exec(afterSearchRetailer);
        // }

        
        // //LAST ONE!!!
        // function afterSearchRetailer(err, result) {
        //     if(err) {console.log(err); res.send(500); }
        //     if(result[0]) {
        //         console.log(result.length)
        //         ret['retailer'] = result;
        //     }
        //     ret['posts'] = ret['posts'].concat(ret['tags'], ret['types'], ret['tagswithusernames'], 
        //                     ret['title'], ret['retailer']);
        //     res.render('search', ret);
        // }

        // USER SEARCHES
        // models.User.
        //     find({"username": { $regex : new RegExp(req.query.q.toLowerCase(), "i") } }).
        //     exec(afterSearchUsername);

        //     function afterSearchUsername(err, result) {
        //         if(err) {console.log(err); res.send(500); }
        //         if(result[0]) {
        //             console.log(result.length)
        //             for (var i = 0; i < result.length; i++) {
        //                 ret['users'].push(result[i]["id"]);
        //             }
        //         }
        //     }

        // models.User.
        //     find({"location" : { $regex : new RegExp(req.query.q.toLowerCase(), "i") } }).
        //     exec(afterSearchLocationInUser);

        //     function afterSearchLocationInUser(err, result) {
        //         if(err) {console.log(err); res.send(500); }
        //         if(result[0]) {
        //             console.log(result.length)
        //             for (var i = 0; i < result.length; i++) {
        //                 ret['locations'].push(result[i]["id"]);
        //             }
        //         }
        //     }

        // models.User.
        //     find({"description" : { $regex : new RegExp(req.query.q.toLowerCase(), "i") } }).
        //     exec(afterSearchDescriptionsInUser);

        //     function afterSearchDescriptionsInUser(err, result) {
        //         if(err) {console.log(err); res.send(500); }
        //         if(result[0]) {
        //             console.log(result.length)
        //             for (var i = 0; i < result.length; i++) {
        //                 ret['descriptions'].push(result[i]["id"]);
        //             }
        //         }
        //     }

        




        
		
        


      });
    
    

};
exports.landingview = function(req, res) {
  var ret = {};
  res.render('searchlanding', ret);
}

