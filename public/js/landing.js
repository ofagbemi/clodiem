function renderlanding(paddingtop) {
  var winwidth = window.innerWidth;
  var winheight = window.innerHeight;
  var logoconst = 4;  // to show edges on hanger logo
  $('.button_wrap')
    .css('position', 'absolute')
    .css('top', winheight * 0.5 + 'px')
	.css('left', (winwidth - $('.button_wrap').width())/2 + 'px');
  $('.button.explore')
    .css('width', $('.button_wrap').width() + 'px')
    .css('position', 'absolute')
    .css('top', winheight * 0.5 + 8 + $('.button_wrap').height() + 'px')
    .css('left', (winwidth - $('.button.explore').width())/2 + 'px');
    
  var middlestripheight = 28;
  //var contentTop = winheight * paddingtop - $('.content_wrap').height()/2 - middlestripheight/2;
  var contentTop = winheight * paddingtop - $('.content_wrap').height() - 1;//- $('.content_wrap').height();
  // - 1 for border
  $('.content_wrap')
    .css('width', 0.7 * winwidth + 'px')
    .css('max-width', '400px')
    .css('top', contentTop + 'px')
    .css('left', (winwidth - $('.content_wrap').width())/2 + 'px');
    /* .css('border-bottom', 'solid 1px #ccc'); */

  landing_bindclicklisteners();
};

function landing_bindclicklisteners() {
  $('.button.explore')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      showabout();
    });
    
  $('#about .close_button')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      hideabout();
    });
}
function hideabout() {
  var about = $('#about');
  about.animate({
    'bottom': -window.innerHeight + 'px'
  }, function() {
      about.hide();
       $('#cover').hide();
  })
}
function showabout() {
  winheight = window.innerHeight;
  winwidth = window.innerWidth;
  var cover = $('#cover');
  var about = $('#about');
  about
    .css('position', 'fixed')
    .css('width', '100%')
    .css('height', winheight + 'px')
    .css('bottom', -winheight + 'px')
    .css('left', '0')
    .css('z-index', '100');
  cover
    .css('width', winwidth)
    .css('height', winheight)
    .css('z-index', '99')
    .css('position', 'fixed')
    .css('top', '0px')
    .css('left', '0px');
  cover.show();
  about
  .show()
  .animate({
    'bottom': '0px'
  });
  
}