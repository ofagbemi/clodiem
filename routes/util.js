var sha1 = require('sha1');
var querystring = require('querystring');

exports.numpostsonpage = 4;

exports.sha1 = function(str) {
  return sha1(str);
};
exports.unescape = function(str) {
  return querystring.unescape(str);
};
exports.getuserid = function(username) {
  return sha1(querystring.unescape(username)).toString();
};
exports.contains = function(item, list) {
  for(var i=0;i<list.length;i++) {
    if(item == list[i]) {
      // console.log('util.js: found ' + list[i] + ' in ' + list);
      return true;
    }
  }
  return false;
};
exports.randomstr = function(length) {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var ret = '';
  for(var i=0;i<length;i++) {
    ret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ret;
}
exports.getpostid = function(post) {
  // three things that probably won't change
  var str = post['type'].toString() + post['userid'] +
            post['time'].toString();
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