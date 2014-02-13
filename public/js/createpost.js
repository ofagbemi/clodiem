$(document).ready(function() {
  createpost_bindclicklisteners();
});

function createpost_bindclicklisteners() {
  $('a.img_upload')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      $('input.img_upload').trigger('click');
      $('.photo_stage .stage_image').hide();
    });
  $('input.img_upload').change(function(e){
    js_input = $(this)[0];
    if(js_input.files && js_input.files[0]) {
      var filereader = new FileReader();
      filereader.readAsDataURL(js_input.files[0]);
      filereader.onload = function(e) {
        $('.photo_stage .stage_image')
          .attr('src', e.target.result)
          .show();
        $('a.img_upload').html(
          $('a.img_upload')
            .html()
              .replace(/upload main photo/i,
                       'Upload a different photo')
        );
        
        $('.marker_field .marker_field_img')
          .attr('src', e.target.result);
      }
    }
  });
  
  $('.marker_field .marker_field_img')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      var imgpos = $(this).offset();
      var clickleft = e.pageX;
      var clicktop = e.pageY;
      
      var top = (clicktop - imgpos.top)/$(this).height();
      var left = (clickleft - imgpos.left)/$(this).width();
      
      createpost_placemarker(top, left, $(this).height(), $(this).width());
    });
}

function createpost_placemarker(top, left, h, w) {
  var marker = $('<span class="marker"></span>');
  $('.marker_field .marker').remove();
  $('.marker_field')
    .append(marker.hide());
  var width = marker.width()
  marker
    .css('top', ((top * h) - width/2) + 'px')
    .css('left', ((left * w) - width/2) + 'px');
  marker.show();
}