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

$('form.validate input').keypress(function() {
  $(this).parent().find('.validatemarker').remove();
  var validatemarker = $('<span style="background-size:contain;"class="validatemarker"></span>');
  var valid =  true;  // make request here
  if(valid) {
    validatemarker
      .css('background-image', 'url("/images/icons/checkmark/checkmark.svg")');
  }
  
  validatemarker
    .css('height', $(this).height() - 2 + 'px')
    .css('width', $(this).height() - 2 + 'px')
    .css('top', '1px')
    .css('right', '1px')
    .css('z-index', '1')
    .css('display', 'inline-block');
  $(this).parent().append(validatemarker);
});