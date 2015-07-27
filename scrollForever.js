/*
 *  Project: jQuery plugin infinitie scroll
 *  Author: Pongsawat Pasom
 *  License: MIT license
 *  Copyright 2014 v.1.0
 */

/**
 * the semi-colon before the function invocation is a safety
 * net against concatenated scripts and/or other plugins
 * that are not closed properly.
 */
;(function ( $, window ) {
  // Create the defaults once
  var pluginName = "scrollForever",
      dataKey = "plugin_" + pluginName,
      defaults = {
        offest: 0,
        delay: 500,
        appendElement: undefined,
        selectContent: undefined,
        navSelector: ".scroll-forever-pagination",
        navNextSelector: ".scroll-forever-pagination a:last",
        elemLoad: ".scroll-forever-message",
        round: {
          active: false,
          count: 0,
          message: "load more",
        },
        loading: {
          message: "loading...",
        },
        ending: {
          isShow: true,
          message: "data is null...",
        }
      };

  /**
   * The actual plugin constructor
   * @param {[type]}   element  [description]
   * @param {json}   options  [description]
   * @param {Function} callback [description]
   */
  function Plugin( element, options, callback ) {
    this.options   = $.extend( {}, defaults, options) ;
    this.el        = element;
    this.$el       = $(element);
    this._defaults = defaults;
    this._name     = pluginName;
    this.callback  = callback;
    this.roundCount= 0;
    this.init();
  }


  Plugin.prototype = {
    init: function() {
      this.offset          = this.$el.offset();
      this.scrollTop       = 0;
      this.loadStart       = 1;
      $(window).scroll($.proxy(this.onScroll, this));

      var $this = this;
      this.$el.on('click','.loadmore',function(){
        $this.loadMore(this);
        return false;
      });
    },

    checkElements: function() {
      if( (this.$el.find(this.options.navNextSelector).attr('href').length == 0) ||
          this.$el.find(this.options.appendElement).length == 0
        )
        return false;

      return true;
    },

    loadContent: function() {
      var $this = this;

      $.ajax({
        url: this.$el.find(this.options.navNextSelector).attr('href'),
        dataType: 'html',
        type: 'GET',
        beforeSend: function() {
          if($($this.options.elemLoad).length > 0)
            $this.$el.find($this.options.elemLoad).hide().html($this.options.loading.message).fadeIn();
        },
        success: function(response) {
          if(response.length > 0)
          {
            setTimeout(function(){
              var cloneElement = $(response).find($this.options.selectContent).clone();

              $this._setNextProgress(response);
              // append content
              $(cloneElement).css('opacity',0);
              $this.$el.find($this.options.appendElement).append(cloneElement);
              $this.callback({status:true},cloneElement);

            },$this.options.delay);
          }
        },
        error: function(xhr, txtStatus, errThrown) {
          $this._setNextProgress();
          $this.callback({status:false,xhr:xhr,txtStatus:txtStatus,errThrown:errThrown},null);
        }
      })
    },

    loadMore: function(obj) {
      this.loadStart = 1;
      this.roundCount= 0;

      if(this.checkElements()){
          this.loadStart = 0;
          this.roundCount++;
          this.loadContent();
      }
    },

    _setNextProgress: function(element) { console.log($(element).find(this.options.navNextSelector).attr('href'));
      // if have next url
      if($(element).length > 0 && $(element).find(this.options.navNextSelector).attr('href') != undefined){

        this.$el.find(this.options.navNextSelector).attr('href', $(element).find(this.options.navNextSelector).attr('href'));

        // check round active
        if(this.options.round.active)
        {
          if(this.options.round.count == this.roundCount){
            this.$el.find(this.options.elemLoad).html(this._initLoadMore());
          }else{
            this.$el.find(this.options.elemLoad).fadeOut('normal',function(){$(this).empty();});
            this.loadStart = 1;
          }
        }
        else
        {
          this.$el.find(this.options.elemLoad).fadeOut('normal',function(){$(this).empty();});
          this.loadStart = 1;
        }
      }
      else
      {
        this.$el.find(this.options.navNextSelector).attr('href','');

        if(this.options.ending.isShow)
          this.$el.find(this.options.elemLoad).html(this.options.ending.message);
        else
          this.$el.find(this.options.elemLoad).html('');
      }
    },

    _initLoadMore: function() {
      var loadMore  = '<a href="javascript:void(0);" class="loadmore"></a>',
          html      = '';

      if(this.options.round.html == undefined)
        html = $(loadMore).text(this.options.round.message);
      else
        html = $(this.options.round.html).html($(loadMore).text(this.options.round.message));

      return $(html)[0].outerHTML;
    },

    onScroll: function() {
      var windowHeight    = $(window).height(),
          windowScrollTop = $(window).scrollTop();

      var destinationOffset= (this.$el.height() + this.offset.top) - (this.options.offset + windowHeight);
      if(windowScrollTop > destinationOffset && this.loadStart > 0)
      {
        if(this.checkElements()){
          this.loadStart = 0;
          this.roundCount++;
          this.loadContent();
        }
      }
    },
  };


  $.fn[pluginName] = function ( options, callback ) {
    this.each(function () {
      if (!$.data(this, dataKey)) {
        $.data(this, dataKey, new Plugin( this, options, callback ));
      }
    });

    return this;
  };
})( jQuery, window );
