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
      
      var data = {'userid':settings_userid};
      var settings = {};
      
      settings['location'] = $('input[name="location"]').val();
      settings['description'] = $('textarea[name="description"]').val();
      settings['img'] = $('input[name="img"]').val();
      
      data['settings'] = settings;
      
      $.ajax({
		type: 'POST',
		url: '/setuser',
		data: data,
		success: settings_redirecttoprofile
	  });
    });
}
function settings_redirecttoprofile() {
  window.location.replace('/user?id=' + settings_userid);
}