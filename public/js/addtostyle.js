var addtostyle_style_html = '\
  <div \
  style="background-color: #eee;color: #aaa;"\
  class="separate_header">\
	<h3>{{title}}</h3>\
	<p>0 posts</p>\
  </div>'

function addtostyle_not_logged_in() {
  alert('You have to log in to do that');
};

function addtostyle(userid) {
  addtostyle_bindclicklisteners(userid);
}

function addtostyle_clear_style_stage() {
  
}

function addtostyle_createstyle(userid, item_ids, title, time, img, callback) {
  var data = {
	'userid': userid,
	'type': 'style',
	'item_ids': item_ids,
	'title': title,
	'time': (new Date()).toString(),
	'img': img
  };

  $.ajax({
	type: 'POST',
	url: '/createnewpost',
	data: data,
	success: function(response) {
	  callback(response);
	}
  });
}

function addtostyle_bindclicklisteners(userid) {
  $('.create_empty_style_button')
    .unbind('click')
    .click(function(e) {
      $('.create_empty_style_stage')
        .slideDown();
    });

  $('.create_empty_style_stage .close_button')
    .unbind('click')
    .click(function(e) {
      $(this).find('input[type="text"]').val('');
      $(this).parent().slideUp();
    });
    
  $('.create_empty_style_stage .submit')
    .unbind('click')
    .click(function(e) {
      var title = $('input[name="style_name"]').val();
      if(title.length < 1) {
        alert('You have to give the collection a name to create it');
        return;
      }
      var close = $('.create_empty_style_stage .close_button');
      addtostyle_createstyle(userid, [], title, (new Date()).toString(), null,
        function(response) {
          close.trigger('click');
          var style_div = $(addtostyle_style_html.replace('{{title}}', response['title']));
          style_div.hide();
          $('.create_empty_style_stage').after(style_div);
          style_div.slideDown();
        });
    });

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
  $('.add_post_to_style_stage .close_button')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      var cancel = $(this).parents('.add_post_to_style_stage').find('.cancel');
      cancel.trigger('click');
      $(this).parent().fadeOut();
    });
  $('.option.add_to_new_style')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      $('form.add_to_new_style_form')
        .slideDown();
      $('.option.add_to_existing_style')
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
        alert('You have to give the collection a name to create it');
        return;
      }
      
      // analytics
      ga('send', 'event', 'post', 'add to new style', 'postid ' + postid);
      
      var img = $(this).parents('.post_stage').find('.post_img').attr('src');
      
      var close = $(this).parents('.add_post_to_style_stage').find('.close_button');
      var cancel = $(this).parents('.add_post_to_style_stage').find('.cancel');
      
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
		  cancel.trigger('click');
		  close.trigger('click');
		}
	  });
      
    });
    
  $('form.add_to_new_style_form .cancel')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      $(this).parents('.add_post_to_style_stage').find('input[type="text"]').val('');
      $('form.add_to_new_style_form').slideUp();
      $('.option.add_to_existing_style')
        .slideDown();
  });
  
  $('.option.add_to_existing_style')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      $('form.add_to_existing_style_form')
        .slideDown();
      $('.option.add_to_new_style')
        .slideUp();
    });
    
  $('form.add_to_existing_style_form .cancel')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      $(this).parents('.add_post_to_style_stage').find('input[type="checkbox"]').removeAttr('checked');
      $('form.add_to_existing_style_form').slideUp();
      $('.option.add_to_new_style')
        .slideDown();
    });
    
  $('form.add_to_existing_style_form .submit')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      var postid = $(this).attr('postid');
      
      var inputs = $(this)
        .parent()
        .parent()
        .find('input[type="checkbox"]')
    
      var ids = [];
      for(var i=0;i<inputs.length;i++) {
        if(inputs[i].checked) {
          ids.push($(inputs[i]).attr('name'));
          inputs[i].checked = false;
        }
      }
      
      if(ids.length < 1) {
        alert('You have to choose a collection');
        return;
      }
      
      // analytics
      ga('send', 'event', 'post', 'add to existing style', 'postid ' + postid);
      
      var img = $(this).parents('.post_stage').find('.post_img').attr('src');
      
      var close = $(this).parents('.add_post_to_style_stage').find('.close_button');
      
      for(var i=0;i<ids.length;i++) {
        // send request for each style id
		var data = {
		  'id': ids[i],
		  'item_ids': [postid],
		  'img': img
		};
  
		$.ajax({
		  type: 'POST',
		  url: '/addtopostitems',
		  data: data,
		  success: function(response) {
			addtostyle_addedtoexistingstyle(response);
			cancel.trigger('click');
			close.trigger('click');
		  }
		});
	  
	  }
      
    });
};

function addtostyle_createdfromnewstyle(response) {
  // alert('Created new collection successfully');
  var div = '<div><input style="float:left;" type="checkbox" name="{{id}}"> <h4>{{title}}</h4></div>'
  div = $(div.replace('{{id}}', response['postid']).replace('{{title}}', response['title']));
  
  $('.styles_list').append(div);
}
function addtostyle_addedtoexistingstyle(response) {
  //
}