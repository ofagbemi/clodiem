var winwidth = window.innerWidth;
var renderposts_aislepostindex = 0;
var renderposts_userid;

function placemarkers() {
  $('.post_stage .marker').each(function() {
    $(this)
      .css('left', $(this).attr('x') * $(this).parent().width() + 'px')
      .css('top', $(this).attr('y') * $(this).parent().height() + 'px');
    });
}
function alignposts() {

}
function renderposts(userid) {
  renderposts_userid = userid;
  alignposts();
  placemarkers();
  renderposts_bindclicklisteners();
}
// renders comments and posts
function renderpost() {
  alignposts();
  placemarkers();
  renderposts_bindclicklisteners();
  var totalwidth = $('.post_comment').width();
  var marginRight = 4;
  $('.comment_body')
    .css('max-width', totalwidth - ($('.profpic').width() + marginRight) + 'px');
}
// bind click listeners
function renderposts_bindclicklisteners() {
  $('.marker')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      var title = $(this).attr('title');
      var item_stage = $(this).parent().find(".item_stage[title='" + title + "']");
      item_stage.fadeIn(200);
      // remember to look inside the parent of this marker
    });
  $('.post_stage .item_stage .close_button')
    .unbind('click')
    .click(function() {
      $(this).parent().fadeOut();
    });
}

function renderposts_loadaisleposts(userid) {
  renderposts_aislepostindex++;
  var data = {
    'num_posts': 4,
    'index': renderposts_aislepostindex,
    'userid': userid
  };
  
  $.ajax({
    type: 'GET',
    url: '/getaisleposts',
    data: data,
    success: renderposts_rendernewaisleposts
  });
}

function renderposts_rendernewaisleposts(response) {

}