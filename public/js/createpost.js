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
              .replace(/upload main photo/,
                       'Upload a different photo')
        );
      }
    }
  });
}