
/**
   * image source replacement
   *
   * Using data tags build a url to replace the original image source
   *
   * @author      Robin Glen <robin.glen@net-a-porter.com>
   * @version     1                
   * @class updateImageSource
   * @memberOf jQuery.fn
   * @param {jQuery object} options - the element to retrieve the user options from. 
   *                        {string}  imageDataSource - the data tag the replacement url comes from (default: img-src@2x)
   *                        {boolean} ajaxEnabled - binds selector to DOMNodeInserted for injected image updates (default: false)
   *                        {string} ajaxEnabled - the selector DOMNodeInserted is bound to (default: this)
   */
(function($) {
    $.fn.updateImageSource = function(options) {
        var settings = $.extend( {
            'imageDataSource'  : 'img-src@2x', 
            'ajaxEnabled'  : false,
            'ajaxSelector' : this
        }, options);
        /* bind selector to DOMNodeInserted */
        function watchForContentUpdate() {
            $(settings.ajaxSelector).bind('DOMNodeInserted', function (event) {
                if (event.type == 'DOMNodeInserted') {
                    init($(settings.ajaxSelector));
                }
            });
        }
        function init (selector) {
            selector.each(function() {
                $("img ", selector).each(function () {
                    var $this = $(this),
                        requestedDataSource = $this.data(settings.imageDataSource);
                    if (requestedDataSource) {
                        if (!$this.data("img-replace")) {
                            $this.attr("src", requestedDataSource);
                            $this.attr('data-img-replace', 'true');
                        }
                    }
                });    
                if (settings.ajaxEnabled) {
                    if (!watchForContentUpdate.init) {
                        watchForContentUpdate();
                        watchForContentUpdate.init = true;
                    }
                }
            });
        }
        init(this);
    };
})(jQuery);