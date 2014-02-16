$(document).ready(function() {
  login_bindclicklisteners();
});
function login_checkformvalid() {
  return $('input[name="username"]').val() != '' && $('input[name="password"]').val() != '';
}
function login_bindclicklisteners() {
  $('#login_button')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      if(login_checkformvalid()) {
        $('.loginform').submit();
      } else {
        alert('Don\'t forget to fill everything in!');
      }
    });
}