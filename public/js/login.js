$(document).ready(function() {
  login_bindclicklisteners();
});
function login_checkformvalid() {
  return true;
}
function login_bindclicklisteners() {
  $('#login_button')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      if(register_checkformvalid()) {
        $('.loginform').submit();
      }
    });
}