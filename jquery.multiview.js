(function ($) {
  var options;
  var nav;
  var stage;
  var active;
  var widthTotal = 0;
  var rate = 0,
    x = 0,
    y = 0;

  var methods = {
    init: function (settings) {
      //Handle Options
      var defaults = {
        slideClass: 'slide',
        navClass: 'navigation',
        thumbnailClass: 'thumb',
        navBackground: '#fff',
        navPadding: 2,
        navHeight: 100,
        maxSpeed: 10
      };

      options = $.extend(defaults, settings);

      var $this = this;

      //Gallery Styling
      this.find('> img.' + options.thumbnailClass).height(options.navHeight);

      nav = this.find('> .' + options.navClass);

      //Hide All Divs but First
      this.find('> .' + options.slideClass + ':gt(0)').toggle();

      //Mark Visible Div as Active
      active = this.find('> .' + options.slideClass + ':eq(0)');

      $('.' + options.slideClass).height($this.height() - options.navHeight);
      nav.width($this.width());
      nav.height(options.navHeight);
      nav.css('overflow', 'hidden');


      nav.append('<ul class="stage" style="white-space:nowrap;"></ul>');

      var slides = $('.' + options.slideClass);
      stage = nav.find('> .stage');
      stage.css('list-style-type', 'none');
      this.find('> img.' + options.thumbnailClass).each(

      function (index, value) {
        stage.append('<li class="thumbContent" thumbIndex="' + index + '" style="display:inline;"></li>');
        slides.eq(index).attr('slideIndex', index);
        var $content = stage.find('> li.thumbContent[thumbIndex="' + index + '"]');
        $content.append(value);
        $(value).css('background', options.navBackground);
        $(value).css('padding', options.navPadding);
        $(value).css('-moz-box-shadow', '1px 1px 3px #222');
        $(value).css('-webkit-box-shadow', '1px 1px 3px #222');
        $(value).css('box-shadow', '1px 1px 3px #222'); /* For IE 8 */
        $(value).css('-ms-filter', "progid:DXImageTransform.Microsoft.Shadow(Strength=3, Direction=135, Color='#222')"); /* For IE 5.5 - 7 */
        $(value).css('filter', "progid:DXImageTransform.Microsoft.Shadow(Strength = 3, Direction = 135, Color = '#222')");
        widthTotal += $content.width();
      });


      //Navigation Scrolling
      if (nav.width() < widthTotal) {
        nav.mousemove(function (e) {
          var navWidth = nav.width();
          if (e.pageX < navWidth / 2) {
            rate = (navWidth - e.pageX - ($(this).offset().left + navWidth / 2) + 1) / navWidth;
          } else if (e.pageX > navWidth / 2) {
            rate = -(navWidth - (navWidth - e.pageX) - ($(this).offset().left + navWidth / 2) + 1) / navWidth;
          }
        });

        nav.hover(

        function () {
          var scroller = setInterval(moveBackdrop, 30);
          $(this).data('scroller', scroller);
        },

        function () {
          var scroller = $(this).data('scroller');
          clearInterval(scroller);
        });
      }
      //Thumbnail Click Event
      stage.on('click', 'li', function () {
        var toShow = $this.find('.' + options.slideClass + '[slideIndex="' + $(this).attr('thumbIndex') + '"]');
        if (toShow[0] != active[0]) {
          active.fadeOut('slow', function () {
            toShow.fadeIn()
          });
          active = toShow;
        }
      });


      //Gallery Resize
      $(window).on('resize', function () {
        $('.' + options.slideClass).height($this.height() - options.navHeight);
        nav.width($this.width());
      });
    }
  };

  $.fn.multiview = function (method) {

    // Method calling logic
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.multiview');
    }

  };

  function moveBackdrop() {
    var newLeft;
    x += options.maxSpeed * rate;
    if (x <= 0 && x > -widthTotal + nav.width()) {
      newLeft = x + 'px';
    } else {
      x -= options.maxSpeed * rate;
      if (x > 0) newLeft = 0 + 'px';
      else if (x <= -widthTotal + nav.width()) newLeft = -widthTotal + nav.width() + 'px';
    }
    stage.css('margin-left', newLeft);
  }

})(jQuery);
