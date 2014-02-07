var winwidth = window.innerWidth;
var portion = 0.90;



function placemarkers() {
  $('.post_stage .marker').each(function() {
    $(this)
      .css('left', $(this).attr('x') * $(this).parent().width() + 'px')
      .css('top', $(this).attr('y') * $(this).parent().height() + 'px');
    });
}

function alignposts() {
  $('.posts')
    .css('margin-left', (winwidth * (1.0 - portion)/2) + 'px');
  $('.post')
    .css('width', winwidth * portion);
}

function renderposts() {
  alignposts();
  placemarkers();
  bindpostclicklisteners();
}

// renders comments and posts
function renderpost() {
  alignposts();
  placemarkers();
  bindclicklisteners();
  var totalwidth = $('.post_comment').width();
  var paddingLeft = 4;
  $('.comment_body')
    .css('width', totalwidth - ($('.profpic').width() + paddingLeft) + 'px')
    .css('padding-left', paddingLeft + 'px');
}

// bind click listeners
function bindpostclicklisteners() {
  $('.marker').click(function() {
    alert('hi');
  });
}