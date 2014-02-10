var displays = {};
$(document).ready(function() {
  displays['styles'] = ($('.closet .items.styles'));
  displays['posts'] = ($('.closet .items.posts'));
  displays['followers'] = ($('.closet .items.followers'));
  displays['following'] = ($('.closet .items.following'));
  
  renderprofile_closetbindclicklisteners();
});
function renderprofile_clearcloset() {
  $('.items').hide();
  $('.button.active').removeClass('active').addClass('inactive');
}
function renderprofile_closetbindclicklisteners() {
  $('.styles_button').click(function(e) {
    e.preventDefault();
    renderprofile_clearcloset();
    $(this).parent()
      .addClass('active')
      .removeClass('inactive');
    displays['styles'].show();
  });
  $('.posts_button').click(function(e) {
    e.preventDefault();
    renderprofile_clearcloset();
    $(this).parent()
      .addClass('active')
      .removeClass('inactive');
    displays['posts'].show();
    
    // call this to make sure that the markers are rendered properly, since
    // they were hidden before
    renderposts();
  });
}