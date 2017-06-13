$(function(){
  $.get('playtv.m3u', function(data) {
    var channel = '';
    $.each(parseM3U(data).tracks, function(i, item) {
      var link = item.file;
      var title = item.title;
      var image = item.params['tvg-logo'];
      var category = toSlug(item.params['group-title']);

      channel += '<div class="channels__item '+category+'" data-remodal-target="modal" data-link="'+link+'">';
      channel += '<div class="channels__item-image"><img src="'+image+'" alt="'+title+'"></div>';
      channel += '<div class="channels__item-description">'+title+'</div>';
      channel += '</div>';
    });
    $('.channels__list').html(channel);
    $('.channels__list').parents('.channels').addClass('loaded')

    var $channels = $('.channels__list').isotope({
      itemSelector: '.channels__item',
      percentPosition: true
    });

    $channels.imagesLoaded().progress(function(imgLoad, image) {
      if (image.isLoaded) {
        $(image.img).parent().addClass('loaded');
      } else if (!image.isLoaded) {
        $(image.img).parent().addClass('not-loaded');
      }
      $channels.isotope('layout');
    });

    $('.header__menu-list').on('click', '.header__menu-item', function(event) {
      event.preventDefault();
      var filter = $(this).attr('data-filter');
      $(document.body).removeAttr('class');
      $(document.body).addClass(filter.substring(1));
      $('.header__menu-item').removeClass('active');
      $(this).addClass('active');
      $channels.isotope({filter: filter});
    });

    $('.channels__list').on('click', '.channels__item', function(event) {
      var link = $(this).attr('data-link');
      var image = $(this).find('img').attr('src');
      var player = new Clappr.Player({
        source: link,
        poster: image,
        width: '100%',
        height: 'auto',
        autoPlay: true,
        parentId: '#modal-content',
        disableVideoTagContextMenu: true
      });
    });

    $(document).on('closed', '.modal', function() {
      $('.modal__content').html('');
    });

    // $('.channels__item-description').each(function(i, item) {
    //   var text = $(this).text();
    //   $(this).text(truncate(text, 40));
    // });
  });
});
