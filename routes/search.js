var profile = require('./profile.js');
var models = require('../models');
var dashboard = require('../routes/dashboard.js')


//needs to search based on query needs to omit redundancies
//sort by likes, time, price, (relevance best or multiple)   +   (preference AI)    //after query 

exports.view = function(req, res) {

    //set to true to disable algorithm
    turnOffLikeAlgorithm = false;

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
        ret['searchUsers'] = req.query.searchUsers; //NEW

        ret['photo'] = req.query.photo;
        ret['link'] = req.query.link; //NEW
        if(logged_in_user_id) ret['onlyFollows'] = req.query.onlyFollows; //NEW

        ret['style'] = req.query.style;
        ret['outfit'] = req.query.outfit;
        ret['clothing'] = req.query.clothing;
        
        ret['timeMin'] = req.query.timeMin;
        ret['timeMax'] = req.query.timeMax;
        ret['likeMin'] = req.query.likeMin;
        ret['likeMax'] = req.query.likeMax;
        ret['priceMin'] = req.query.priceMin; //NEW
        ret['priceMax'] = req.query.priceMax; //NEW
        ret['hideHeader'] = req.query.hideHeader;
        
        ret['show_options'] = false;

        if(!req.query.customSearch) {
          setdefaultsearch(ret);
        } else {
          ret['customSearch'] = true;
        }


        //filters values from req
        //fields to search
        var searchTags = ret['searchTags'];
        var searchTitle = ret['searchTitle'];
        var searchRetailer = ret['searchRetailers'];
        var searchPostingProfile = req.query.searchUsers; //any people
        //number filters
        var timeMin = ret['timeMin'];
        var timeMax = ret['timeMax'];
        var likeMin = ret['likeMin'];
        var likeMax = ret['likeMax'];
        var priceMin = ret['priceMin'];
        var priceMax = ret['priceMax'];
        //boolean filters
        var link = ret['link']; //retailer link
        var photo = ret['photo'];
        var isFriend = ret['onlyFollows'];
        //type filters
        var style = ret['style'];
        var outfit = ret['outfit'];
        var clothing = ret['clothing']; 
        
        /*
        //filters values from req
        //fields to search
        var searchTags = req.query.searchTags;
        var searchTitle = req.query.searchTitle;
        var searchRetailer = req.query.searchRetailers;
        var searchPostingProfile = req.query.searchUsers; //any people
        //number filters
        var timeMin = req.query.timeMin;
        var timeMax = req.query.timeMax;
        var likeMin = req.query.likeMin;
        var likeMax = req.query.likeMax;
        var priceMin = req.query.priceMin;
        var priceMax = req.query.priceMax;
        //boolean filters
        var link = req.query.link; //retailer link
        var photo = req.query.photo;
        var isFriend = req.query.onlyFollows;
        //type filters
        var style = req.query.style;
        var outfit = req.query.outfit;
        var clothing = req.query.clothing; 
        */
        //other filters
        var priceFilter = {};

        //sort settings should be a number value, usage demonstrated below
        
        var sort = req.query.sortOptions;
        var sortMongo;

        console.log("SORT TESTING " + req.query.sortOptions);

        //ret['mostPopular'] = true;
        if(sort === "yourLikes"){
          ret['yourLikes'] = true;
          sortMongo = {time : -1};
        } else if(sort === "mostRecent") {
          ret['mostRecent'] = true;
          sortMongo = {time : -1};
        } else if(sort === "mostPopular") {
          ret['mostPopular'] = true;
          sortMongo = {likes : -1, time : -1};
        } else if(sort === "mostExpensive") {
          ret['mostExpensive'] = true;
          sortMongo = {price_num : -1, time : -1};
          priceFilter = {"price_num": {$exists: true} };
        } else if(sort === "leastRecent") {
          ret['leastRecent'] = true;
          sortMongo = {time : 1};
        } else if(sort === "leastPopular") {
          ret['leastPopular'] = true;
         sortMongo = {likes : 1, time : -1};
        } else if(sort === "leastExpensive") {
          ret['leastExpensive'] = true;
          sortMongo = {price_num : 1, time : -1};
          priceFilter = {"price_num": {$exists: true} };
        } 

        //filter values to give to mongo
        var searchTagsMongo = {"never true" : "for or statements only"};
        if(searchTags) searchTagsMongo = {'tags': query};

        var searchTitleMongo = {"never true" : "for or statements only"};
        if(searchTitle) searchTitleMongo = {'title': new RegExp(query, 'i')};

        var searchRetailerMongo = {"never true" : "for or statements only"};
        if(searchRetailer) searchRetailerMongo = {"retailer": new RegExp(query, 'i')};

        var searchPostingProfileMongo = {"never true" : "for or statements only"};
        if(searchPostingProfile) searchPostingProfileMongo = {"username": new RegExp(query, 'i')};

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

        var outfitMongo = {"type": { $ne: "outfit" } };;
        if(outfit) outfitMongo = {};

        var clothingMongo = {"type": { $ne: "item" } };
        if(clothing) clothingMongo = {};
        
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
          .where(priceFilter)
          .sort(sortMongo) 
          .exec(afterFindPosts);

 
        function afterFindPosts(err, posts) {
          if(err) {console.log(err);res.send(500);}
          
          if(isFriend && loggedInUser){
              for(var i = posts.length-1; i >= 0; i--) {
                if(loggedInUser["following_ids"].indexOf(posts[i]["userid"]) < 0) posts.splice(i,1);
              }
          }
          postIDs = [];
          for(var i = 0; i < posts.length; i++) {
            postIDs.push(posts[i]["id"]);
          }

          dashboard.getpostsfromids(postIDs, loggedInUser, afterGetPostsFromIds);

          function afterGetPostsFromIds(err, posts){
            if((!sort || sort === "yourLikes") && !turnOffLikeAlgorithm 
                  && loggedInUser && (loggedInUser["liked_post_ids"])) {
                   likesAlgorithm(loggedInUser, posts);
            } else afterFindPosts2(posts);

            function afterFindPosts2(posts) {

              if((!sort || sort === "yourLikes") && !turnOffLikeAlgorithm 
                  && loggedInUser && (loggedInUser["liked_post_ids"])) {
                posts.sort(function(a,b){return b["algorithm"] - a["algorithm"]});
                console.log("SORTING BY ALGORITHM");
              }  

              ret['posts'] = posts;
              res.render('search', ret);
              return;
            }

            //ALGORITHM  STARTS

            function likesAlgorithm(user, posts){
              for(var i = 0; i < posts.length; i++){
                posts[i]["algorithm"] = 0;
              }

              var followed = user["following_ids"];
              var followedQuery = [];
              for (var i = 0; i < followed.length; i++) {
                followedQuery.push({"id" : followed[i]});
              }

              models.User.find({$or: followedQuery}).exec(afterFollowers);

              function afterFollowers(err, result){
                var followLikesAndPosts = [];
                if(result){
                  for(var i = 0; i < result.length; i++) {
                    followLikesAndPosts = followLikesAndPosts.concat(result[i]['post_ids']);
                    followLikesAndPosts = followLikesAndPosts.concat(result[i]['liked_post_ids']);
                  }
                  var map = {};
                  for(var i = 0; i < followLikesAndPosts.length; i++){
                    if(map[followLikesAndPosts[i]]) 
                      map[followLikesAndPosts[i]] =  map[followLikesAndPosts[i]] + 1;
                    else map[followLikesAndPosts[i]] = 1;
                  }
                
                  for(var i = 0; i < posts.length; i++){
                    if(map[ posts[i]["id"] ]) {
                      posts[i]["algorithm"] = map[posts[i]["id"]] + posts[i]["algorithm"];
                    }
                  }
                }

                var liked = user["liked_post_ids"];
                var likedQuery = [];
                for (var i = 0; i < liked.length; i++){
                  likedQuery.push({"id" : liked[i]});
                }

                models.Post.find({$or: likedQuery}).exec(afterLiked);

                function afterLiked(err, result){
                  likersQuery = [];
                  if(result) {
                    var likers = [];
                    for(var i = 0; i < result.length; i++) {
                      likers = likers.concat(result[i]['likers']);
                    }
                    
                    for(var i = 0; i < likers.length; i++) {
                      likersQuery.push({"id" : likers[i]});
                    }
                  }

                  models.User.find({$or: likersQuery}).exec(afterLikers);

                  function afterLikers(err, result){
                    var likedPosts = [];
                    if(result){
                      for(var i = 0; i < result.length; i++) {
                        likedPosts = likedPosts.concat(result[i]['liked_post_ids']);
                      }
                      var map = {};
                      for(var i = 0; i < likedPosts.length; i++){
                        if(map[followLikesAndPosts[i]]) 
                          map[followLikesAndPosts[i]] =  map[followLikesAndPosts[i]] + 1;
                        else map[followLikesAndPosts[i]] = 1;
                      }
                      for(var i = 0; i < posts.length; i++){
                        if(map[ posts[i]["id"] ]) {
                          posts[i]["algorithm"] = map[posts[i]["id"]] + posts[i]["algorithm"];
                        }
                      }

                    }
                    afterFindPosts2(posts);                 
                  }
                }
              }         
            }
            //ALGORITHM  ENDS
          }
        }
    });
};



function setdefaultsearch(ret) {
  //default settings
  ret['searchTags'] = true;
  ret['searchTitle'] = true;
  ret['searchRetailers'] = true;
  ret['searchUsers'] = true;

  ret['style'] = true;
  ret['outfit'] = true;
  ret['clothing'] = true;

  ret['yourLikes'] = true;
}

exports.landingview = function(req, res) {
  var logged_in_user_id = profile.getloggedinuser(req);
  var ret = {};
  if(!req.query.customSearch) {
   setdefaultsearch(ret);
  } else {
   ret['customSearch'] = true;
  }

  models.User
    .find({'id': logged_in_user_id})
    .exec(function(err, result) {
      console.log("NOT LOGGED IN 2")
      if(err) {console.log(err); res.send(500);}
      ret['logged_in_user'] = result[0];
      if(result[0]) {
        ret['yourLikes'] = true;
        ret['mostRecent'] = false;
      } else {
        console.log("NOT LOGGED IN")
      }
      res.render('searchlanding', ret);
    });
}
