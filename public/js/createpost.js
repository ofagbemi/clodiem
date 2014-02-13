$(document).ready(function() {
  createpost_bindclicklisteners();
  
  createpost_start();
});

function createpost_start() {
  $('.createpost_stepwrap.1')
    .css('margin-top', window.innerHeight/2 - $('.1').outerHeight())
    .fadeIn(600)
    .animate({
      marginTop: '0px'
    }, 600,
      function() {
        createpost_show(2);
      });
}

function createpost_show(num) {
  $('.createpost_stepwrap.' + num)
    .fadeIn(600, function() {
      createpost_scrollto(num);
    });
}
function createpost_hide(num) {
  $('.createpost_stepwrap.' + num).fadeOut(600);
}
function createpost_scrollto(num) {
  $('html, body').animate({
    scrollTop: $('.createpost_stepwrap.' + num)
                 .offset().top
  }, 1000);
}
function createpost_bindclicklisteners() {
  $('.placed.button')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      // $('.marker_field .marker_field_img').unbind('click');
      $(this).parent().find('.getiteminfo').slideDown(400);
    });
  $('a.createpost_additem')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      createpost_hide(3);
      createpost_show(4);
    });
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
          .attr('src', e.target.result)
          .load(function() {
            $('.marker_field')
              .css('height', $('.photo_stage .stage_image').height() + 'px');
              // slightly hack, get height from image loaded above
          });
        
        createpost_show(3);
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
      $('.placed.button').slideDown();
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
    .css('left', ((left * w) - width/2) + 'px')
    .attr('x', left)
    .attr('y', top);
  marker.show();
}