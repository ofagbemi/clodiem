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
        var loggedInUser = result[0];
        ret['logged_in_user'] = loggedInUser;

        var query = req.query.q;
        if(!query) {
          query = '';
        }
        query = query.toLowerCase();

        ret['searchTags'] = req.query.searchTags;
        ret['searchTitle'] = req.query.searchTitle;
        ret['searchRetailers'] = req.query.searchRetailers;
        ret['photo'] = req.query.photo;
        ret['style'] = req.query.style;
        ret['outfit'] = req.query.outfit;
        ret['clothing'] = req.query.clothing;
        
        ret['timeMin'] = req.query.timeMin;
        ret['timeMax'] = req.query.timeMax;
        ret['likeMin'] = req.query.likeMin;
        ret['likeMax'] = req.query.likeMax;
        
        ret['show_options'] = (
          ret['searchTags'] || ret['searchTitle'] || ret['searchRetailers'] ||
          ret['photo'] || ret['style'] || ret['outfit'] || ret['clothing'] ||
          ret['timeMin'] || ret['timeMax'] || ret['likeMin'] || ret['likeMax']
        );

        //filters values from req
        //fields to serach
        var searchTags = req.query.searchTags;
        var searchTitle = req.query.searchTitle;
        var searchRetailer = req.query.searchRetailers;
        var searchPostingProfile = true; //any people
        //number filters
        var timeMin = req.query.timeMin;
        var timeMax = req.query.timeMax;
        var likeMin = req.query.likeMin;
        var likeMax = req.query.likeMax;
        var priceMin;
        var priceMax;
        //boolean filters
        var link; //retailer link
        var photo = req.query.photo;
        var style = req.query.style;
        var outfit = req.query.outfit;
        var clothing = req.query.clothing; 
        var isFriend; //people i follow

        //sort settings should be a number value, usage demonstrated belwo
        var sort; //some value

        console.log(likeMin + " " + likeMax);

        //sort usage demonstrated here
        var sortMongo;
        if(sort == 1) sortMongo = "-like";
        else sortMongo = "-time";

        //filter values to give to mongo
        var searchTagsMongo = {"never true" : "for or statements only"};
        if(searchTags) searchTagsMongo = {'tags': query};

        var searchTitleMongo = {"never true" : "for or statements only"};
        if(searchTitle) searchTitleMongo = {'title': new RegExp(query, 'i')};

        var searchRetailerMongo = {"never true" : "for or statements only"};
        if(searchRetailer) searchRetailerMongo = {"retailer": new RegExp(query, 'i')};

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
        if(priceMin) priceMinMongo = {"price_num": {$gte: priceMin} };

        var priceMaxMongo = {};
        if(priceMax) priceMaxMongo = {"price_num": {$lte: priceMax} };

        var linkMongo = {};
        if(link) linkMongo = {"purchase_link": {$exists: true} };

        var photoMongo = {};
        if(photo) photoMongo = {"img": {$exists: true} };

        //these four im less sure about how to construct
        //i put the next three in an or case because they are mutually exclusive
        //weird syntax, low priority change: figure out cleaner code
        var styleMongo = {"type": { $ne: "style" } };
        if(style) styleMongo = {};
        else console.log("NO STYLE");

        var outfitMongo = {"type": { $ne: "outfit" } };;
        if(outfit) outfitMongo = {};
        else console.log("NO OUTFIT");

        var clothingMongo = {"type": { $ne: "item" } };
        if(clothing) clothingMongo = {};
        else console.log("NO ITEMS");
        
		ret['query'] = query;
		ret['queryAsTyped'] = req.query.q;
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
          .where(timeMinMongo).where(timeMaxMongo)
          .where(likeMaxMongo).where(likeMinMongo)
          .where(priceMinMongo).where(priceMaxMongo)
          .where(linkMongo)
          .where(photoMongo)
          .where({$and: [styleMongo, outfitMongo, clothingMongo]})
          .sort(sortMongo) //can implement a weighting funciton here
          .exec(afterFindPosts);

 
        function afterFindPosts(err, posts) {
          if(err) {console.log(err);res.send(500);}
          if(isFriend && loggedInUser){
              for(var i = posts.length-1; i >= 0; i--) {
                console.log(posts[i]["type"]);
                //console.log(loggedInUser["following_ids"]);
                if(loggedInUser["following_ids"].indexOf(posts[i]["userid"]) < 0) posts.splice(i,1);
              }
          }
          ret['posts'] = posts;
          res.render('search', ret);
        }

      });

};
exports.landingview = function(req, res) {
  var logged_in_user_id = profile.getloggedinuser(req);
  var ret = {};
  models.User
    .find({'id': logged_in_user_id})
    .exec(function(err, result) {
      if(err) {console.log(err); res.send(500);}
      ret['logged_in_user'] = result[0];
      res.render('searchlanding', ret);
    });
}

