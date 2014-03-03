function likebuttons_not_logged_in() {
  alert('You have to log in to do that');
}

function activatelikebuttons(userid) {
  $('.like_button').click(function(e) {
    e.preventDefault();
    if(!userid) {
      likebuttons_not_logged_in();
      return;
    }
    
    var postid = $(this).attr('postid');
    if($(this).attr('status') == 'liked') {
      // analytics
      ga('send', 'event', 'post', 'unlike', 'unliked post ' + postid);
      likebuttons_removelike(userid, postid);
      $(this).attr('status', '');
    } else {
      // analytics
      ga('send', 'event', 'post', 'like', 'liked post ' + postid);
      likebuttons_addlike(userid, postid);
      $(this).attr('status', 'liked');
    }

  });
}

function likebuttons_addlike(userid, postid) {
  var data = {
    'userid': userid,
    'postid': postid
  };
  $.ajax({
    type: 'POST',
    url: '/addlike',
    data: data,
    success: function(response) {
      likebuttons_adjustpagelikes(response, postid);
    }
  });
}

function likebuttons_removelike(userid, postid) {
  var data = {
    'userid': userid,
    'postid': postid
  };
  $.ajax({
    type: 'POST',
    url: '/removelike',
    data: data,
    success: function(response) {
     likebuttons_adjustpagelikes(response, postid);
    }
  });
}

function likebuttons_adjustpagelikes(response, postid) {
  var num_likes = parseInt(response['likes']);
  $('.post[postid="' + postid + '"] .num_likes')
    .html(num_likes)
}