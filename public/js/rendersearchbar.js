function rendersearchbar(h, barheight) {
  $('.searchwrap').remove();
  var winwidth = window.innerWidth;
  var winheight = window.innerHeight;
  
  var height = barheight;
  if(!barheight) height = 30;
  
  $('body').append('<div class="searchwrap"><div class="search"></div></div>');
  $('.searchwrap')
    .css('top', winheight * h + 'px')
    //.css('height', height + 'px')
    .css('width', winwidth + 'px')
    .css('overflow', 'hidden');

  var label = '<label style="height: ' + (height - 8) + 'px; width: ' + (height) + 'px;" id="searchbox_label" for="searchbox"></label>';
  var input = '<input style="height: ' + (height - 8) + 'px;" id="searchbox" placeholder="Search">';
  $('.search')
    .css('padding', '4px ' + winwidth * 0.1 + 'px')
    .append(label)
    .append(input)
    .append('<div class="clear"></div>');
    
  $('#searchbox')
    .css('width', ($('.search').width() - $('#searchbox_label').width()) + 'px');
}