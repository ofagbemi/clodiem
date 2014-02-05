function rendertopbar(withpadding) {
  var winwidth = window.innerWidth;
  var html = '<div id="topbar" style="width: ' + winwidth + 'px"></div>';
  $('body').append(html);
  if(withpadding) {
    $('.content')
      .css('margin-top', $('#topbar').height() + 'px');
  }
}