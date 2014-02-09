$(document).ready(function() {
  stagevalidator();
});

function stagevalidator() {
  $('form.validate .validatewrap')
    .css('display', 'block')
    .css('border', 'none')
    .css('margin', '0')
    .css('position', 'relative');

  $('form.validate .validatewrap .validatemarker')
    .hide();
    
    
  $('form.validate .validatewrap').children().each(function() {
    var elemheight = $(this).outerHeight(true);// + $(this).marginTop() //+ $(this).marginBottom();
    var elemwidth = $(this).outerWidth(true); //+ $(this).marginLeft()// + $(this).marginRight();
    $(this)
      .css('position', 'absolute')
      .css('top', '0px')
      .css('left', '0px');
    $(this).parent()
      .css('height', elemheight + 'px')
      .css('width', elemwidth + 'px');
  });
}

$('form.validate input').keyup(function() {
  $(this).parent().find('.validatemarker').remove();
  var validatemarker = $('<span style="background-size:contain;"class="validatemarker"></span>');
  var valid = ($(this).val() != '');  // make request here
  if(valid) {
    validatemarker
      .css('background-image', 'url("/images/icons/checkmark/checkmark.svg")');
  }
  
  var checksize = $(this).outerHeight() - 2;
  $(this).css('z-index', '0');
  validatemarker
    .css('height', checksize + 'px')
    .css('width', checksize - 2 + 'px')
    .css('position', 'absolute')
    .css('top', '2px')
    .css('right', '4px')
    .css('z-index', '1')
    .css('display', 'inline-block')
    .css('background-size', (checksize - 2) + 'px ' + (checksize - 2) + 'px')
    .css('background-position', 'center')
    .css('background-repeat', 'no-repeat');
  $(this).parent().append(validatemarker);
});