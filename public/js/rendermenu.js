var menuwidth = 0;
function buildmenu(username) {
  var winheight = window.innerHeight;
  var winwidth = window.innerWidth;
  menuwidth = 0.8 * winwidth;
  var menu = $('<div id="menu"></div>');
  var closemenubutton = $('<a href="#" class="close_menu_button">x</a>');
  var profilelink = $('<a href="/user?username=' + username + '">My profile</a>');
  var makepostlink = $('<a href="/createpost">Make a Post</a>');
  var logoutlink = $('<a href="/">Log out</a>');
  menu
    .css('display', 'none')
    .css('position', 'fixed')
    .css('top', '0px')
    .css('left', '0px')
    .css('max-width', '300px')
    .css('width', menuwidth + 'px')
    .css('margin-left', -menuwidth + 'px')
    .css('height', winheight + 'px')
    .append(closemenubutton)
    .append(profilelink)
    .append(makepostlink)
    .append(logoutlink);
    
  $('#menu').remove();
  $('body').append(menu);
  
  bindlisteners();
}

function showmenu() {
  $('#menu').show();
  $('#menu').animate({
    marginLeft: '0px'
  });
}
function hidemenu() {
  $('#menu').animate({
    marginLeft: -menuwidth + 'px'
  }, function(){
    $('#menu').hide();
  });
}

function bindlisteners() {
  // bind click listeners
  $('.close_menu_button').click(function(e) {
    e.preventDefault();
    hidemenu();
  });
  
}