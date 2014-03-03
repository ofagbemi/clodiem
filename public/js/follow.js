function activatefollowbuttons(logged_in, followerid) {
  follow_bindclicklisteners(logged_in, followerid);
}

function follow_not_logged_in() {
  alert('You have to log in to do that');
}

function follow_submitfollow(followerid, followedid, success) {
  var data = {
	'followeruserid': followerid,
	'followeduserid': followedid
  };

  $.ajax({
	type: 'POST',
	url: '/followuser',
	data: data,
	success: success
  });
}

function follow_bindclicklisteners(logged_in, followerid) {
  $('.follow_button').click(function(e) {
    e.preventDefault();
    if(!logged_in) {
      follow_not_logged_in();
      return;
    }
    var button = $(this);
    var followedid = $(this).attr('followedid');
    follow_submitfollow(followerid, followedid, function(response) {
      if(response['follow']) {
        // analytics
        ga('send', 'event', 'user', 'follow', 'user ' + followerid + ' followed ' + followedid);
        button
          .addClass('toggled')
          .html(button.html().replace('Follow', 'Following'));
      } else {
        // analytics
        // ga('send', 'event', 'user', 'unfollow', 'user ' + followerid + ' unfollowed ' + followedid);
        button
          .removeClass('toggled')
          .html(button.html().replace('Following', 'Follow'));
      }
      
      console.log(response);
      
      
    });
  });
}