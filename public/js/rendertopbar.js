function rendertopbar(withpadding, withbackbutton, nohelp, title) {
  var winwidth = window.innerWidth;
  var html = '<div id="topbar" style="width: ' + winwidth + 'px"></div>';
  var topbar = $(html);
  
  var homebutton = $('' +
    '<div style="text-overflow:ellipsis;overflow: hidden;white-space:nowrap;max-width:' + (winwidth * 0.75) + 'px;display:inline-block;">' +
    '<a class="home_button" href="#">Clodiem</a>' +
    '</div>'
  );
  
  var searchbutton = '<a class="search_button" href="#">Search</a>';
  var closesearchbutton = $('<a class="close_search_button" href="#">x</a>')
                            .css('display', 'none');
  var tutorialbutton = '<a class="tutorial_button" href="#">tutorial</a>'
  
  if(withbackbutton) {
    var link = document.referrer;
    if(! (link.indexOf('clodiem') > -1 || link.indexOf('localhost') > -1) ) {
      link = '/aisle';
    }
    
	var backbutton = $('<a class="back_button">back</a>');
	backbutton.attr('onclick', 'window.history.back()');
	topbar.append(backbutton);
  }
  
  if(title) {
    homebutton.find('a').html(title);
  }
  
  topbar
    .append(homebutton);
    
  if(!nohelp) {
    topbar
      .append(tutorialbutton);
  }
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

function renderbottombar(withpadding, active, userid, messages) {
  var winwidth = window.innerWidth;
  var winheight = window.innerHeight;
  
  var ratio = winwidth/winheight;
  
  if(ratio > 0.75 && ratio < 1.5) return;
  
  var html = '<div id="bottombar" style="width: ' + winwidth + 'px"></div>';
  var bottombar = $(html);
  
  var likesbutton = $('<a class="favorites_button" href="/favorites"><div class="icon"></div><div>favs</div></a>');
  var homebutton = $('<a class="home_button" href="/aisle"><div class="icon"></div><div>feed</div></a>');
  var createpostbutton = $('<a class="create_post_button" href="/createpost"><div class="icon"></div><div>create</div></a>');
  var profilebutton = $('<a style="position:relative;" class="profile_button" href="/user?id=' + userid + '"><div class="icon"></div><div>me</div></a>');
  var searchbutton = $('<a class="search_button" href="/search"><div class="icon"></div><div>search</div></a>');
  
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

  $('#bottombar')
    .css('position', 'fixed')
    .css('top', (winheight - $('#bottombar').height()) + 'px');
    
  var bottombar_back = $('<div id="bottombar_back"></div>')
    .css('z-index', '-1')
    .css('width', winwidth + 'px');
    
  $('#bottombar_back').remove();
  $('body').append(bottombar_back);
  
  $('#bottombar_back')
    .css('position', 'fixed')
    .css('top', (winheight - $('#bottombar_back').height()) + 'px');
    
  if(withpadding) {
    $('.content')
      .css('margin-bottom', $('#bottombar').height() + 'px');
  }
  
  var num_messages = parseInt(messages);
  
  if(num_messages && num_messages > 0) {
    var notification = $('<div class="notification">' + num_messages + '</div>');
    notification.css({'position':'absolute','top': '1px', 'right': '18%'});
    profilebutton.append(notification);
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