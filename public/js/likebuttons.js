function activatelikebuttons() {
  $('.like_button').click(function(e) {
    e.preventDefault();
    var num_likes_div = $(this).parent().parent().find('.num_likes');
    var num_likes = parseInt(num_likes_div.html());
    if($(this).attr('status') == 'liked') {
      num_likes--;
      $(this).attr('status', '');
      $(this).css('background-image', "url('../images/icons/black_heart/black_heart.svg')");
    } else {
      num_likes++;
      $(this).attr('status', 'liked');
      $(this).css('background-image', "url('../images/icons/black_heart/red_heart.svg')");
    }
    num_likes_div.html(num_likes);
  });
}