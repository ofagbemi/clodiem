function buildmenu() {
  var winheight = window.innerHeight;
  var winwidth = window.innerWidth;
  var menu = $('<div id="menu"></div>');
  var closemenubutton = $('<a href="#" class="close_menu_button">x</a>');
  menu
    .css('display', 'none')
    .css('position', 'fixed')
    .css('top', '0px')
    .css('left', '0px')
    .css('max-width', '300px')
    .css('width', 0.8 * winwidth + 'px')
    .css('height', winheight + 'px')
    .append(closemenubutton);
    
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