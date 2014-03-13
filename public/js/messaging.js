var messaging_touserid;
var messaging_fromuserid;
var messaging_tousername;
var messaging_fromusername;
var messaging_fromuserimg;


function messaging(touserid, fromuserid, tousername, fromusername, fromuserimg) {
  messaging_touserid = touserid;
  messaging_fromuserid = fromuserid;
  messaging_tousername = tousername;
  messaging_fromusername = fromusername;
  messaging_fromuserimg = fromuserimg;
  
  messaging_bindclicklisteners();
}

function messaging_aftersendmessage() {

}

function messaging_bindclicklisteners() {
  $('.messaging_stage .send_message')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      
      var message = $(this).closest('.messaging_button').find('.messaging_stage textarea').val();
      
      if(message == '') {
        alert('Type something into the text box before you send your message')
        return;
      }
      
      // escape message
      message = $('<div></div>').text(message).html();
      
      data = {
        'message': message,
        'touserid': $(this).attr('touserid'),
        'fromuserid': $(this).attr('fromuserid'),
        'tousername': $(this).attr('tousername'),
        'fromusername': $(this).attr('fromusername'),
        'fromuserimg': $(this).attr('fromuserimg'),
        'time': (new Date()).toString()
      };
      
      $.ajax({
		type: 'POST',
		url: '/sendmessage',
		data: data,
		success: messaging_aftersendmessage
	  });
      
      $(this).closest('.messaging_stage').find('.close_button').trigger('click');
      
    });
  $('.messaging_stage .close_button')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      $(this).parent().find('textarea').val('');
      $(this).parent().fadeOut(100);
      $('#cover').fadeOut(100);
    });
  $('.messaging_button')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      var winheight = window.innerHeight;
      var winwidth = window.innerWidth;
      $('#cover').css(
        {
		  'z-index':200,
		  'position': 'fixed',
		  'top':'0',
		  'left':'0',
		  'width': winwidth,
		  'height': winheight + 'px'
        }).show();
      
      $(this).find('.messaging_stage').css({
        'width': winwidth * 0.8 + 'px',
        'position':'fixed',
        'left': winwidth * 0.1 + 'px',
        'top': winheight * 0.2 + 'px',
        'z-index': 201,
        'background-color': 'white'
      }).show();
    
    });
}