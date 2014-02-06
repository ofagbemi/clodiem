function renderlanding(paddingtop) {
  var winwidth = window.innerWidth;
  var winheight = window.innerHeight;
  var logoconst = 4;  // to show edges on hanger logo
  $('.button_wrap')
    .css('position', 'absolute')
    .css('top', winheight * 0.5 + 'px')
	.css('left', (winwidth - $('.button_wrap').width())/2 + 'px');
  /*
  $('.big_logo')
	.css('width', winwidth * 0.8 + logoconst + 'px')
	.css('height', winwidth * 0.8 + 'px')
	.css('left', winwidth * 0.1 + - logoconst/2 +'px')
	.css('top', '0px');
   */
  $('.button.explore')
    .css('width', $('.button_wrap').width() + 'px')
    .css('top', winheight * 0.5 + 8 + $('.button_wrap').height() + 'px')
    .css('left', (winwidth - $('.button.explore').width())/2 + 'px');
    
  var middlestripheight = 28;
  //var contentTop = winheight * paddingtop - $('.content_wrap').height()/2 - middlestripheight/2;
  var contentTop = winheight * paddingtop - $('.content_wrap').height() - 1;//- $('.content_wrap').height();
  // - 1 for border
  $('.content_wrap')
    .css('width', $('.button_wrap').width() + 'px')
    //.css('min-height', winheight - 2*contentTop + 'px')
    .css('top', contentTop + 'px')
    .css('left', (winwidth - $('.content_wrap').width())/2 + 'px');
    /* .css('border-bottom', 'solid 1px #ccc'); */
};