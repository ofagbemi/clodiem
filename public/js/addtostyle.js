function addtostyle_not_logged_in() {
  alert('You have to log in to do that');
};

function addtostyle(userid) {
  addtostyle_bindclicklisteners(userid);
}

function addtostyle_bindclicklisteners(userid) {
  $('.add_to_style_button')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      if(!userid) {
        addtostyle_not_logged_in();
        return;
      }
      
      var stage = 
      $('.add_post_to_style_stage[postid="' + $(this).attr('postid') + '"]')
        .fadeIn();
      
    });
  $('.post_stage .add_post_to_style_stage .close_button')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      $(this).parent().fadeOut();
    });
  $('.option.add_to_new_style')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      $('form.add_to_new_style_form')
        .slideDown();
      $('form.add_to_existing_style')
        .slideUp();
    });
  $('form.add_to_new_style_form .submit')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      var postid = $(this).attr('postid');
      var input = $(this)
        .parent()
        .parent()
        .find('input[name="style_name"]')
        
      var name = input.val();
      
      if(name.length < 1) {
        alert('You have to give the style a name to create it!');
        return;
      }
      
      var img = $(this).parents('.post_stage').find('.post_img').attr('src');
      
      var close = $(this).parents('.add_post_to_style_stage').find('.close_button');
      
      var data = {
		'userid': userid,
		'type': 'style',
		'item_ids': [postid],
		'title': name,
		'time': (new Date()).toString(),
		'img': img
      };
  
	  $.ajax({
		type: 'POST',
		url: '/createnewpost',
		data: data,
		success: function(response) {
		  addtostyle_createdfromnewstyle(response);
		  input.val('');
		  close.trigger('click');
		}
	  });
      
    });
    
  $('form.add_to_new_style_form .cancel')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      $('form.add_to_new_style_form').slideUp();
      $('form.add_to_existing_style')
        .slideDown();
  });
};

function addtostyle_createdfromnewstyle(response) {
  alert('Created new style successfully');
}