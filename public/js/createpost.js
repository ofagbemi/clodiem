$(document).ready(function() {
  createpost_bindclicklisteners();
});

function createpost_bindclicklisteners() {
  $('a.img_upload')
    .unbind('click')
    .click(function() {
      $('input.img_upload').trigger('click');
      $('a.img_upload').html($('a.img_upload').html().replace('Upload a photo', 'Upload a different photo'));
    });
}