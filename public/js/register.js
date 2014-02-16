$(document).ready(function() {
  register_bindclicklisteners();
});
function register_checkformvalid() {
  return validateform_good2go();
}
function register_bindclicklisteners() {
  $('#register_button')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      if(register_checkformvalid()) {
        $('.registerform').submit();
      } else {
        alert('Please finish filling out the form');
      }
    });
}