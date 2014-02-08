function rendertopbar(withpadding) {
  var winwidth = window.innerWidth;
  var html = '<div id="topbar" style="width: ' + winwidth + 'px"></div>';
  var topbar = $(html);
  
  var menubutton = '<a class="menu_button" href="#">Menu</a>';
  var homebutton = '<a class="home_button" href="/aisle">Home</a>';
  var searchbutton = '<a class="search_button" href="#">Search</a>';
  var closesearchbutton = $('<a class="close_search_button" href="#">x</a>')
                            .css('display', 'none');
  
  
  topbar
    .append(menubutton)
    .append(homebutton)
    .append(closesearchbutton)
    .append(searchbutton);
  $('#topbar').remove();
  $('body').append(topbar);
  if(withpadding) {
    $('.content')
      .css('margin-top', $('#topbar').height() + 'px');
  }
  
  bindclicklisteners();
}
  
  
function bindclicklisteners() {
  // bind click listeners
  $('#topbar .search_button').click(function(e) {
	e.preventDefault();
	$('#topbar .search_button').hide();
	$('#topbar .close_search_button').show();
	rendersearchbar(0, $('#topbar').height() - 1, winwidth * 0.6);
	$('#topbar').append($('.searchwrap'));
	$('.searchwrap')
	  // .css('width', winwidth * 0.6 + 'px')
	  .css('right', '8px')
	  .css('border', 'none')
	  .css('width', '0px')
	  .animate({
	    width: winwidth * 0.6 + 'px'
	  }, 200);
  });
  
  $('#topbar .close_search_button').click(function(e) {
	e.preventDefault();
	$('#topbar .close_search_button').hide();
	$('#topbar .search_button').show();
	$('#topbar .searchwrap')
	  .animate({
	    width: '0px'
	  }, 200, function(){
	      $(this)
	        .hide()
	        .remove();
	  });
  });
  
  $('#topbar .menu_button').click(function(e) {
	e.preventDefault();
	showmenu();
  });
}