var displays = {};
$(document).ready(function() {
  displays['styles'] = ($('.closet .items.styles'));
  displays['style_contents'] = ($('.closet .items.style_contents'));
  displays['posts'] = ($('.closet .items.posts'));
  displays['followers'] = ($('.closet .items.followers'));
  displays['following'] = ($('.closet .items.following'));
  
  
  renderprofile_closetbindclicklisteners();
  renderprofile_stylesbindclicklisteners();
  
  renderprofile_adjustheadersizes();
});

function renderprofile_adjustheadersizes() {
  $('.profile_header_body')
    .css('width', ($('.profile_header').width() - $('.profile_header .profpic').outerWidth(true)) + 'px');
  $('.profile_header_body .info')
    .css('margin-bottom', $('.profile_header_body .button_wrap').height() + 'px');
}
function renderprofile_clearcloset() {
  $('.items').hide();
  $('.display.active').removeClass('active').addClass('inactive');
}
function renderprofile_closetbindclicklisteners() {
  $('.styles_button')
    .unbind('click')
    .click(function(e) {
	  e.preventDefault();
	  renderprofile_clearcloset();
	  $(this)
		.addClass('active')
		.removeClass('inactive');
	  displays['styles'].show();
	});
  $('.posts_button')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
	  renderprofile_clearcloset();
	  $(this)
		.addClass('active')
		.removeClass('inactive');
	  displays['posts'].show();
	
	  // call this to make sure that the markers are rendered properly, since
	  // they were hidden before
	  renderposts(renderposts_userid);
	});
  $('.followers_button')
    .unbind('click')
    .click(function(e) {
	  e.preventDefault();
	  renderprofile_clearcloset();
	  $(this)
		.addClass('active')
		.removeClass('inactive');
	  displays['followers'].show();
	  follow_adjustfollowbuttonposition();
	});
  $('.following_button')
    .unbind('click')
    .click(function(e) {
	  e.preventDefault();
	  renderprofile_clearcloset();
	  $(this)
		.addClass('active')
		.removeClass('inactive');
	  displays['following'].show();
	  follow_adjustfollowbuttonposition();
	});
}
function renderprofile_stylesbindclicklisteners() {
  $('.item_wrapper_link')
    .unbind('click')
    .click(function(e) {
	  e.preventDefault();
	  renderprofile_clearcloset();
	  $('.styles_button')
		.addClass('active')
		.removeClass('inactive');
	  var title = $(this).attr('title');
	
	  $('.style_posts').hide();
	  $(".style_posts[title='" + title + "']").show();
	  displays['style_contents'].show();
	  // call this to make sure that the markers are rendered properly, since
	  // they were hidden before
	  renderposts(renderposts_userid);
	});
}