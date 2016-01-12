//init jquery scroll plugin
(function($) {
    $(function() { //on DOM ready
        $("#activities").simplyScroll({
            autoMode: 'loop',
            pauseOnHover:false,
            startOnLoad:true,
            frameRate:30
        });
    });
})(jQuery);

/*get session count*/
$.getJSON("http://www.net-a-porter.com/webapi/feed/sessioncount/NAP.json", function(data){
        $("#session").append('<span class="live">L I V E</span> <img src="/nap/content/2011/images/naplive_ticker/globe.gif" alt="" />' + data.sessioncount + ' <span class="on-site-now">on-site now</span> <span class="divider">|</span> ');
});

/*get activities*/
$.getJSON("http://www.net-a-porter.com/webapi/feed/productactivity.json?channel=NAP_INTL&size=10", function(_data){
    jQuery.each(_data.productactivity, function (i, activity) {
                if(activity['city'] != null){city = activity['city']}else{city = ''};    
                if(activity['country'] != null){country = activity['country']}else{country = ''};
                                             
               $("#activities").append('<li><img src="/nap/content/2011/images/naplive_ticker/' + activity['activityType'] + '.gif" alt="" /><span class="designer-name">' + activity['designer'] + '</span> ' + activity['title'] + ', ' + city + ' ' + country + '<span class="divider">|</span></li>');    
    });
});

/*display/hide 'popup' png*/
$("#nap-live-container").hover(
  function () {
    $('#ticker-popup').show();
  }, 
  function () {
    $('#ticker-popup').hide();
  }
);
$("#ticker-popup").hover(
  function () {
    $('#ticker-popup').show();
  }, 
  function () {
    $('#ticker-popup').hide();
  }
);