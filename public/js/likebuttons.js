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
    
    if($(this).attr('status') == 'liked') {
      likebuttons_removelike(userid, $(this).attr('postid'));
      $(this).attr('status', '');
    } else {
      likebuttons_addlike(userid, $(this).attr('postid'));
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
    success: likebuttons_adjustpagelikes
  });
  console.log('here');
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
    success: likebuttons_adjustpagelikes
  });
}

function likebuttons_adjustpagelikes(response) {
  var num_likes = parseInt(response['likes']);
}