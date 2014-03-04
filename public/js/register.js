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
      $('.registerform').submit();
    });
    
  $('.registerform')
    .submit(function(e) {
      e.preventDefault();
      if(register_checkformvalid()) {
        $('.registerform')
          .append('<input style="display:none;" name="time" value="' + (new Date()).toString() + '" type="text">');
        $('.registerform')
          .unbind('submit')
          .submit();
      } else {
        alert('Please finish filling out the form');
      }
    });
}