function buildmenu(username) {
  var winheight = window.innerHeight;
  var winwidth = window.innerWidth;
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
    .css('width', 0.8 * winwidth + 'px')
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
}
function hidemenu() {
  $('#menu').hide();
}

function bindlisteners() {
  // bind click listeners
  $('.close_menu_button').click(function(e) {
    e.preventDefault();
    hidemenu();
  });
}