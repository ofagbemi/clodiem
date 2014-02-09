function splitbackground(h, bkgcolor, imgsrc) {
  $('.background.tophalf').remove();
  $('.background.middlestrip').remove();
  
  var winheight = window.innerHeight;
  var winwidth = window.innerWidth;
  
  var html = '<div class="background tophalf"></div>';
  $('body')
    .css('margin-top', h * winheight + 'px')
    .append(html);
  
  $('.background.tophalf')
	.css('height', (winheight * h + 'px'))
	.css('position', 'absolute')
    .css('top', '0px')
    .css('left', '0px')
    .css('width', winwidth + 'px')
	.css('z-index', -2)
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