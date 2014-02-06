function rendersearchbar(h, barheight) {
  $('.searchwrap').remove();
  var winwidth = window.innerWidth;
  var winheight = window.innerHeight;
  
  var height = barheight;
  if(!barheight) height = 40;
  
  $('body').append('<div class="searchwrap"><div class="search"></div></div>');
  $('.searchwrap')
    .css('top', winheight * h + 'px')
    .css('max-height', height + 'px')
    .css('width', winwidth + 'px')
    .css('overflow', 'hidden');

  var label = $('<label></label>');
  label
    .css('height', height - 8 + 'px')
    .css('width', height - 8 + 'px')
    .css('background-size', (height-8-10) + 'px ' + (height-8-10) + 'px')
    .css('background-position', '4px 6px')
    .attr('id', 'searchbox_label')
    .attr('for', 'searchbox');
    
  // <label style="height: ' + (height - 8) + 'px; width: ' + (height) + 'px;" id="searchbox_label" for="searchbox"></label>';
  
  // var input = '<input style="height: ' + (height - 8) + 'px;" id="searchbox" placeholder="Search">';
  var input = $('<input></input>');
  input
    .css('height', height - 8 + 'px')
    .attr('id', 'searchbox')
    .attr('placeholder', 'Search');
  
  $('.search')
    .css('height', height - 8 + 'px')
    .css('padding', '4px ' + winwidth * 0.1 + 'px')
    .append(label)
    .append(input)
    .append('<div class="clear"></div>');
    
  $('#searchbox')
    .css('width', ($('.search').width() - $('#searchbox_label').width()) + 'px');
}