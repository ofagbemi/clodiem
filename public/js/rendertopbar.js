function rendertopbar(withpadding) {
  var winwidth = window.innerWidth;
  var html = '<div id="topbar" style="width: ' + winwidth + 'px"></div>';
  var topbar = $(html);
  
  var menubutton = '<a class="menu_button" href="#">Menu</a>';
  var homebutton = '<a class="home_button" href="/aisle">Clodiem</a>';
  var searchbutton = '<a class="search_button" href="#">Search</a>';
  var closesearchbutton = $('<a class="close_search_button" href="#">x</a>')
                            .css('display', 'none');
  
  topbar
    .append(menubutton)
    .append(homebutton)
    .append(closesearchbutton)
    .append(searchbutton);
  $('#topbar').remove();
  
  $('body')
    .append(topbar)
    .css('margin-top', $('#topbar').height() + 'px');
    
  var topbar_back = $('<div id="topbar_back"></div>')
    .css('position', 'absolute')
    .css('z-index', '-1')
    .css('width', winwidth + 'px');
    
  $('#topbar_back').remove();
  $('body').append(topbar_back);
    
  if(withpadding) {
    $('.content')
      .css('margin-top', $('#topbar').height() + 'px');
  }
  
  bindclicklisteners();
}
  
  
function bindclicklisteners() {
  // bind click listeners
  $('#topbar .search_button')
    .unbind('click')
    .click(function(e) {
    var winheight = window.innerHeight;
	e.preventDefault();
	$('#topbar .search_button').hide();
	$('#topbar .close_search_button').show();
	rendersearchbar($('#topbar').height()/winheight, $('#topbar').height() - 1, winwidth, true);
	$('.searchwrap').hide();
	$('#topbar').append($('.searchwrap'));
	$('.searchwrap')
	  .slideDown(200);
	$('body').animate({
	  'margin-top': $('.searchwrap').height() + $('#topbar').height() + 'px'
	});
  });
  
  $('#topbar .close_search_button')
    .unbind('click')
    .click(function(e) {
	e.preventDefault();
	$('#topbar .close_search_button').hide();
	$('#topbar .search_button').show();
	$('#topbar .searchwrap')
	  .slideUp(200);
	$('body').animate({
	  'margin-top': $('#topbar').height() + 'px'
	});
	
  });
  
  $('#topbar .menu_button')
    .unbind('click')
    .click(function(e) {
	e.preventDefault();
	if($('#menu').is(':visible')) hidemenu();
	else showmenu();
  });
}