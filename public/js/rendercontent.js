function rendercontent(paddingtop) {
  var winwidth = window.innerWidth;
  var winheight = window.innerHeight;
  var middlestripheight = 28;
  var contentSide = 20;
  var contentTop = (winheight - $('.content_wrap').height()) * paddingtop + middlestripheight/2;
  $('.content_wrap')
    .css('width', winwidth - 2*contentSide + 'px')
    //.css('min-height', winheight - 2*contentTop + 'px')
    .css('top', contentTop + 'px')
    .css('left', contentSide + 'px');
}