$(document).ready(function() {
  var winwidth = window.innerWidth;
  var winheight = window.innerHeight;
  var logoconst = 4;  // to show edges on hanger logo
  $('.button_wrap')
    .css('position', 'absolute')
    .css('top', winheight * 0.64 + 'px')
	.css('left', (winwidth - $('.button_wrap').width())/2 + 'px');
  $('.big_logo')
	.css('width', winwidth * 0.8 + logoconst + 'px')
	.css('height', winwidth * 0.8 + 'px')
	.css('left', winwidth * 0.1 + - logoconst/2 +'px')
	.css('top', '0px');
  $('.button.explore')
    .css('width', winwidth + 'px')
    .css('top', winheight * 0.78 + 'px');
});