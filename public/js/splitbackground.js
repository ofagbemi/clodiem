function splitbackground(h, bkgcolor, imgsrc) {
  $('.background.tophalf').remove();
  $('.background.middlestrip').remove();
  
  var html = '<div class="background tophalf"></div>';
  $('body').append(html);
  var winheight = window.innerHeight;
  var winwidth = window.innerWidth;
  var middlestripheight = 28;
  
  
  $('.background.tophalf')
	.css('height', (winheight * h + 'px'))
	.css('position', 'absolute')
    .css('top', '0px')
    .css('left', '0px')
    .css('width', winwidth + 'px')
	.css('z-index', -2)
	// .css('background-color', '#f5deb3'); // wheat
	// .css('background-color', 'rgb(210, 243, 253)');  // light blue
	.css('background-color', bkgcolor); // blue
	// .css('background-color', '#f7f7f7');
	
  if(imgsrc) {
    var marginconst = 8;
    var imgstyle = 'min-width: ' + (winwidth + (marginconst * 2)) + 'px;' +
                   'min-height: ' + (winheight * h + (marginconst * 2)) + 'px;' +
                   'margin-left: ' + (-marginconst) + 'px;' +
                   'margin-top: ' + (-marginconst) + 'px';
    $('.background.tophalf')
      .css('overflow', 'hidden')
      .append(
        '<img style="' + imgstyle + '" src="' + imgsrc + '">'
      );
  }
}