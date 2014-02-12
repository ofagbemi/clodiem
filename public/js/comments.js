function rendercomments(username, img) {
  comments_bindclicklistener(username, img);
}

var comment_partial = '<div class="post_comment">\
  <a href="/user?username={{username}}">\
	<img class="profpic" src="{{img}}">\
  </a>\
  <div class="comment_body">\
	<a class="user_attribution" href="/user?username={{username}}">{{username}}</a>\
	<span class="time">{{time}}</span>\
	<p class="comment">{{comment}}</p>\
  </div>\
  <div class="clear"></div>\
</div>'

function comments_buildcomment(username, img, comment) {
  return $(
    comment_partial
      .replace(/{{username}}/g, username)
      .replace(/{{img}}/g, img)
      .replace(/{{time}}/g, 'now')
      .replace(/{{comment}}/g, comment)
    );
}
function comments_bindclicklistener(username, img) {
  $('.comment_button')
    .unbind('click')
    .click(function(e) {
      $(this).unbind('click');
      e.preventDefault();
      var comment_val = $('.comment_box').val();
      if(comment_val) {
        var post_id = $(this).attr('postid');
        comments_submitcomment(post_id, username, img, comment_val, function() {
          $('.comment_box').val('');
		  var comment_body = comments_buildcomment(username, img, comment_val);
		  comment_body.hide();
		  $('.comments').prepend(comment_body);
		  comment_body.slideDown();
		  // to make sure img is right width
		  renderpost();
        });
      }
    
    });
  $('.comment_button a')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      $(this).parent().trigger('click');
    });
}
function comments_submitcomment(post_id, username, img, comment_val, success) {
  var data = {
    'postid': post_id,
    'username': username,
    'comment': comment_val,
    'time': (new Date()).toString(),
    'img': img
  };
  
  $.ajax({
    type: 'POST',
    url: '/addcomment',
    data: data,
    success: success
  });
}