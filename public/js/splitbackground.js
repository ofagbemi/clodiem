function splitbackground(h, stripcolor, imgsrc) {
  $('.background.tophalf').remove();
  $('.background.middlestrip').remove();
  
  var html = '<div class="background tophalf"></div><div class="background middlestrip"></div>';
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
	.css('background-color', '#afd2dd'); // blue
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
  
  /*
  $('.background.middlestrip')
	.css('z-index', -1)
	.css('height', middlestripheight + 'px')
	.css('background-color', stripcolor)
	.css('position', 'absolute')
	.css('top', $('.background.tophalf').height() + 'px')
	.css('left', '0')
	.css('width', winwidth + 'px')
	.css('border-top', 'solid 1px #ccc')
	.css('border-bottom', 'solid 1px #ccc')
	// .css('box-shadow', '0px 2px 2px rgba(0,0,0,0.24)');
   */
}