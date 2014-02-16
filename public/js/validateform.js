var validateform_usernametaken = true;

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
    var elemheight = $(this).outerHeight(true);
    var elemwidth = $(this).outerWidth(true);
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
  var name = $(this).attr('name');
  validateform_clearvalid(name);
  
  var value1 = $(this).val();
  var value2;
  if(name == 'password' || name == 'verify_password') {
    value1 = $('form.validate input[name="password"]').val();
    value2 = $('form.validate input[name="verify_password"]').val();
  }
  
  var invalid_message = $('form.validate .message.invalid[name="' + name + '"]');
  
  var valid = checkvalid(name, value1, value2);
  if(valid) {
    validateform_showvalid(name);
    invalid_message.slideUp();
    if(name == 'password') {
      $('form.validate input[name="verify_password"]').trigger('keyup');
    }
  } else {
    if(name != 'username') invalid_message.slideDown();
    if(name == 'password') {
      $('form.validate input[name="verify_password"]').parent().find('.validatemarker').remove();
    }
  }
});

function validateform_clearvalid(name) {
  var input = $('form.validate input[name="' + name + '"]');
  input.parent().find('.validatemarker').remove();
  input.removeAttr('v');
}

function validateform_showvalid(name) {
  var input = $('form.validate input[name="' + name + '"]');
  var invalid_message = $('form.validate .message.invalid[name="' + $(this).attr('name') + '"]');
  var validatemarker = $('<span style="background-size:contain;"class="validatemarker"></span>');
  validatemarker
	.css('background-image', 'url("/images/icons/checkmark/checkmark.svg")');
  var checksize = input.outerHeight() - 2;
  input.css('z-index', '0');
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
  
  input.parent().append(validatemarker);
  invalid_message.slideUp();
  input.attr('v', 'y');  // hacky?
}

function validateform_good2go() {
  var valid = true;
  $('form.validate input').each(function() {
    if($(this).attr('v') != 'y') {
      valid = false;
    }
  });
  return valid;
}

function validateform_showusernamevalid(response) {
  var invalid_message = $('form.validate .message.invalid[name="username"]');
  if(!response['exists']) {
    validateform_showvalid('username');
    invalid_message.slideUp();
  } else {
    invalid_message.slideDown();
  }
}

function checkvalid(name, value1, value2) {
  if(name == 'username') {
    if(!(value1.length > 0)) return false;
    var data = {
      'username': value1
	};
	$.ajax({
	  type: 'GET',
	  url: '/usernametaken',
	  data: data,
	  success: validateform_showusernamevalid
	});
	return false;
  }
  else if(name == 'email') {
    return (/^.+@.+\..+$/.exec(value1) == value1);
  }
  else if(name == 'password') {
    return value1.length >= 6 && (/[0-9]/).test(value1);
  }
  else if(name == 'verify_password') {
    return value1 == value2 && value1.length > 0;
  }
  
  return false;
}