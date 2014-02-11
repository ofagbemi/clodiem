var winwidth = window.innerWidth;

function placemarkers() {
  $('.post_stage .marker').each(function() {
    $(this)
      .css('left', $(this).attr('x') * $(this).parent().width() + 'px')
      .css('top', $(this).attr('y') * $(this).parent().height() + 'px');
    });
}
function alignposts() {

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
  var marginRight = 4;
  $('.comment_body')
    .css('max-width', totalwidth - ($('.profpic').width() + marginRight) + 'px');
}
// bind click listeners
function bindpostclicklisteners() {
  $('.marker')
    .unbind('click')
    .click(function() {
      alert('You clicked on an item!');
    });
}