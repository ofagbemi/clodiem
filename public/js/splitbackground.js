$(document).ready(function() {
  var html = '<div class="background tophalf"></div><div class="background middlestrip"></div>';
  $('body').append(html);
  var winheight = window.innerHeight;
  var winwidth = window.innerWidth;
  var middlestripheight = 28;
  
  $('.background.tophalf')
	.css('height', (winheight - $('.background.middlestrip').height())/2 + 'px')
	.css('z-index', -2)
	// .css('background-color', '#f5deb3'); // wheat
	.css('background-color', '#afd2dd'); // blue
  
  $('.background.middlestrip')
	.css('z-index', -1)
	.css('height', middlestripheight + 'px')
	.css('background-color', 'white');
  });