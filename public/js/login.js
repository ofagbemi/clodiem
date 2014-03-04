$(document).ready(function() {
  login_bindclicklisteners();
  $('.login_message.error')
    .hide()
    .slideDown();
});
function login_checkformvalid() {
  return $('input[name="username"]').val() != '' && $('input[name="password"]').val() != '';
}
function login_bindclicklisteners() {
  $('#login_button')
    .unbind('click')
    .click(function(e) {
      $('.loginform').submit();
    });
  $('.loginform')
    .submit(function(e) {
      e.preventDefault();
      if(login_checkformvalid()) {
        $('.loginform')
        .unbind('submit')
        .submit();
      } else {
        alert('Don\'t forget to fill everything in!');
      }
    });
}