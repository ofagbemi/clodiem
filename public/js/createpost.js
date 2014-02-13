var userid = null;

function createpost_start(id) {
  userid = id;
  createpost_bindclicklisteners();
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
      $(this).slideUp();
    });
  $('.uploaditem.button')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      var title = $(".getiteminfo input[name='title']").val();
      if(title == '') {
        alert('You have to give this item a title');
        return;
      }
      
      var retailer = $(".getiteminfo input[name='retailer']").val();
      var purchase_link = $(".getiteminfo input[name='purchase_link']").val();
      var price = $(".getiteminfo input[name='price']").val();
      if(price != '') {
        var floatprice = parseFloat(price);
        if(isNaN(floatprice)) {
          alert('Sorry, is that the right price?');
          return;
        }
        var denom = $('.getiteminfo select').find(':selected').attr('name');
        price = denom + floatprice;
      }
    
      var time = (new Date()).toString();
      
      var img = '/images/icons/pants2/pants2.svg'; // TODO change this
      var x = $('.marker').attr('x');
      var y = $('.marker').attr('y');
      
      alert($(this).parent().find('.tagbox').val());
      var tags = createpost_parsetags($(this).parent().find('.tagbox').val());
      
      var type = "item";
      var item_ids = [];
      
      createpost_submitpost(type, userid, img, time, price,
                            title, x, y, retailer, purchase_link,
                            tags, item_ids, function(result) {
        // callback
        $('.createpost_additem').parent().prepend('<div>Hello</div>');
        createpost_hide(4);
        createpost_show(3);
        createpost_cleanupmarkitem();
      });
    
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
      
      if(!$('.marker_field .marker').is(':visible')) {
        $('.placed.button').slideDown();
      }
      // create the post marker after we check if the last
      // one was visible (if the user's already clicked before)
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
    .css('left', ((left * w) - width/2) + 'px')
    .attr('x', left)
    .attr('y', top);
  marker.show();
}

function createpost_submitpost(type, userid, img, time, price, title, x, y,
                               retailer, purchase_link, tags, item_ids, success) {
  var data = {
    'type': type,
    'userid': userid,
    'img': img,
    'time': (new Date()).toString(),
    'price': price,
    'title': title,
    'x': x,
    'y': y,
    'retailer': retailer,
    'purchase_link': purchase_link,
    'tags': tags,
    'item_ids': item_ids
  };
  
  $.ajax({
    type: 'POST',
    url: '/createnewpost',
    data: data,
    success: success
  });
}

function createpost_parsetags(tagstr) {
  var tags = tagstr.split(',');
  for(var i=0;i<tags.length;i++) {
    tags[i] = {'tag': $.trim(tags[i])};
  }
  return tags;
}

function createpost_cleanupmarkitem() {

}