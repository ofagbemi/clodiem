function renderposts() {
  var winwidth = window.innerWidth;
  var portion = 0.90;
  $('.posts')
    .css('margin-left', (winwidth * (1.0 - portion)/2) + 'px');
  $('.post')
    .css('width', winwidth * portion);
  $('.post .post_stage .marker').each(function() {
    $(this)
      .css('left', $(this).attr('x') * $(this).parent().width() + 'px')
      .css('top', $(this).attr('y') * $(this).parent().height() + 'px');
    });
}