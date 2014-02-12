$(document).ready(function() {
  register_bindclicklisteners();
});
function register_checkformvalid() {
  return true;
}
function register_bindclicklisteners() {
  $('#login_button')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      if(register_checkformvalid()) {
        $('.loginform').submit();
      }
    });
}