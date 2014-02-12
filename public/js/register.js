$(document).ready(function() {
  register_bindclicklisteners();
});
function register_checkformvalid() {
  return true;
}
function register_bindclicklisteners() {
  $('#register_button')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      if(register_checkformvalid()) {
        $('.registerform').submit();
      }
    });
}