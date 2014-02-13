var menuwidth = 0;
function buildmenu(logged_in, username) {
  var winheight = window.innerHeight;
  var winwidth = window.innerWidth;
  menuwidth = 0.8 * winwidth;
  var menu = $('<div id="menu"></div>');
  var profilelink = $('<a href="/user?username=' + username + '">My profile</a>');
  var makepostlink = $('<a href="/createpost">Make a Post</a>');
  var logoutlink = $('<a href="/">Log out</a>');
  var loginlink = $('<a href="/login">Log in</a>');
  menu
    .css('display', 'none')
    .css('position', 'fixed')
    .css('top', '0px')
    .css('left', '0px')
    .css('max-width', '300px')
    .css('width', menuwidth + 'px')
    .css('margin-left', -menuwidth + 'px')
    .css('height', winheight + 'px')
    
  if(logged_in) {
	menu
	  .append(profilelink)
	  .append(makepostlink)
	  .append(logoutlink);
  } else {
    menu
      .append(loginlink);
  }
  
  $('#menu').remove();
  $('body').append(menu);
  
  menu_bindlisteners();
}

function showmenu() {
  $('#menu').show();
  $('#menu').animate({
    marginLeft: '0px'
  });
  $('#topbar').animate({
    left: $('#menu').outerWidth() + 'px'
  });
}
function hidemenu() {
  $('#menu').animate({
    marginLeft: -menuwidth + 'px'
  }, function(){
    $('#menu').hide();
  });
  $('#topbar').animate({
    left: '0'
  });
}

function menu_bindlisteners() {
  $('html')
  .unbind('click')
  .click(function(e) {
    /*
    var clicked = $(e.target);
    var menu = $('#menu');
    if(clicked != menu &&
       menu.find(clicked).length == 0) {
      hidemenu();
    }
    */
  });
  
}