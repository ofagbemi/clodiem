function tutorial_setup() {
  tutorial_bindclicklisteners();
}

function tutorial_bindclicklisteners() {
  $('.tutorial_button')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      showtutorial();
    });

  $('#tutorial .close_button')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      hidetutorial();
    });

  $('a.tutorial')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      var div = $('div.' + $(this).attr('class').replace(' ', '.'));
      if(!div.is(':visible')) {
        $('div.tutorial').slideUp();
        div.slideDown();
      } else div.slideUp();
    });
}

function hidetutorial() {
  var tutorial = $('#tutorial');
  tutorial.animate({
    'top': -window.innerHeight + 'px'
  }, function() {
      tutorial.hide();
      $('#cover').hide();
  });
}
function showtutorial() {
  winheight = window.innerHeight;
  winwidth = window.innerWidth;
  var cover = $('#cover');
  var tutorial = $('#tutorial');
  tutorial
    .css('position', 'fixed')
    .css('width', '100%')
    .css('height', winheight + 'px')
    .css('top', -winheight + 'px')
    .css('left', '0')
    .css('z-index', '100');
  cover
    .css('width', winwidth)
    .css('height', winheight)
    .css('z-index', '99')
    .css('position', 'fixed')
    .css('top', '0px')
    .css('left', '0px');
  cover.show();
  tutorial
  .show()
  .animate({
    'top': '0px'
  });
}