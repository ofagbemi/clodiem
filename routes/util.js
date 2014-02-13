exports.getuserid = function(username) {
  return username;
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