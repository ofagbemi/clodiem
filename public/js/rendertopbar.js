function rendertopbar(withpadding, withbackbutton) {
  var winwidth = window.innerWidth;
  var html = '<div id="topbar" style="width: ' + winwidth + 'px"></div>';
  var topbar = $(html);
  
  var menubutton = '<a class="menu_button" href="#">Menu</a>';
  var homebutton = '<a class="home_button" href="/aisle">Clodiem</a>';
  var searchbutton = '<a class="search_button" href="#">Search</a>';
  var closesearchbutton = $('<a class="close_search_button" href="#">x</a>')
                            .css('display', 'none');
  
  if(withbackbutton) {
    var link = document.referrer;
    if(! (link.indexOf('clodiem') > -1 || link.indexOf('localhost') > -1) ) {
      link = '/aisle';
    }
    
	var backbutton = $('<a class="back_button">back</a>');
	backbutton.attr('onclick', 'window.history.back()');
	topbar.append(backbutton);
  }
  
  topbar
    // .append(menubutton)
    .append(homebutton);
    //.append(closesearchbutton)
    //.append(searchbutton);
  $('#topbar').remove();
  
  $('body')
    .append(topbar)
    .css('margin-top', $('#topbar').height() + 'px');
    
  var topbar_back = $('<div id="topbar_back"></div>')
    .css('z-index', '-1')
    .css('width', winwidth + 'px');
    
  $('#topbar_back').remove();
  $('body').append(topbar_back);
  
  /*  
  if(withpadding) {
    $('.content')
      .css('margin-top', $('#topbar').height() + 'px');
  }*/
  
  bindclicklisteners();
}

function renderbottombar(withpadding, active, userid) {
  var winwidth = window.innerWidth;
  var html = '<div id="bottombar" style="width: ' + winwidth + 'px"></div>';
  var bottombar = $(html);
  
  var likesbutton = $('<a class="favorites_button" href="/favorites">favs</a>');
  var homebutton = $('<a class="home_button" href="/aisle">home</a>');
  var createpostbutton = $('<a class="create_post_button" href="/createpost">create</a>');
  var profilebutton = $('<a class="profile_button" href="/settings">me</a>');
  var searchbutton = $('<a class="search_button" href="/search">search</a>');
  
  var buttons = [likesbutton, homebutton, createpostbutton,
                 profilebutton, searchbutton];
  
  if(active != null && active < buttons.length) {
    buttons[active].addClass('active');
  }
  
  bottombar
    .append(likesbutton)
    .append(homebutton)
    .append(createpostbutton)
    .append(profilebutton)
    .append(searchbutton);

  $('#bottombar').remove();
  
  $('body')
    .append(bottombar)
    .css('margin-bottom', $('#bottombar').height() + 'px');
    
  var bottombar_back = $('<div id="bottombar_back"></div>')
    .css('z-index', '-1')
    .css('width', winwidth + 'px');
    
  $('#bottombar_back').remove();
  $('body').append(bottombar_back);
    
  if(withpadding) {
    $('.content')
      .css('margin-bottom', $('#bottombar').height() + 'px');
  }
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
  
  // if you need a link to show the searchbar in the topbar, just
  // add the class 'show_searchbar_in_topbar' to it
  $('.show_searchbar_in_topbar')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      $('#topbar .search_button')
        .trigger('click');
    });
}