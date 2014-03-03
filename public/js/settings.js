var settings_userid;
function settings_setup(userid) {
  settings_userid = userid;
  settings_bindclicklisteners();
}

function settings_bindclicklisteners() {
  $('.change_settings.button')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      
      $('.settings_form').submit();
      /*
      var data = {};
      
      data['settings'] = new FormData($('.settings_form')[0]);
      
      data['userid'] = settings_userid;
      
      $.ajax({
		type: 'POST',
		url: '/setuser',
		data: data,
		success: settings_redirecttoprofile,
		contentType: false,
		processData: false
	  });
	  */
    });
    
  $('a.img_upload')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      $('input.img_upload').trigger('click');
    });
    
  $('input.img_upload').change(function(e){
    js_input = $(this)[0];
    if(js_input.files && js_input.files[0]) {
      var filereader = new FileReader();
      filereader.readAsDataURL(js_input.files[0]);
      filereader.onload = function(e) {
        $('.profpic img')
          .attr('src', e.target.result)
      } 
    }
  })
}
function settings_redirecttoprofile() {
  window.location.replace('/user?id=' + settings_userid);
}