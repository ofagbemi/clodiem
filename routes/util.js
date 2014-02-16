var sha1 = require('sha1');
var querystring = require('querystring');

exports.unescape = function(str) {
  return querystring.unescape(str);
}
exports.getuserid = function(username) {
  return sha1(querystring.unescape(username)).toString();
}
exports.contains = function(item, list) {
  for(var i=0;i<list.length;list++) {
    if(item == list[i]) {
      console.log('util.js: found ' + list[i] + ' in ' + list);
      return true;
    }
  }
  return false;
}
exports.getpostid = function(post) {
  var str = post['type'].toString() + post['img'].toString() +
            post['time'].toString() + post['title'].toString();
  return sha1(str).toString();
  
  /*
  'type': req.body.type,
    'userid': req.body.userid,
    'numcomments': '0 comments',
    'comments': [],
    'img': req.body.img,
    'likes': 0,
    'time': req.body.time,
    'price': req.body.price,
    'title': req.body.title
    'x': req.body.x,
    'y': req.body.y,
    'retailer': req.body.retailer,
    'purchase_link': req.body.purchase_link,
    'tags': req.body.tags,
    'item_ids': req.body.items
  */
}