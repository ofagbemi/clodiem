function renderposts() {
  var winwidth = window.innerWidth;
  var portion = 0.90;
  /*
  var topbar = $('#topbar');
  if(topbar.length > 0) margintop = topbar.height();
   */
  $('.posts')
    .css('margin-left', (winwidth * (1.0 - portion)/2) + 'px');
  $('.post')
    .css('width', winwidth * portion);
}