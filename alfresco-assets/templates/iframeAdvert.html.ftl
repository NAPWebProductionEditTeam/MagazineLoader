<script type="text/javascript" src="/alfresco/nap/webAssets/magazine/_framework/js/hammer/hammer.min.js?v=1.0" ></script>

<style type="text/css">
  * {margin:0;} 
  #iframeAdvert {width: 950px; height:624px}
</style>

<script type="text/javascript">
  function setupAdvertGesture() {
    var advertiFrameDeviceGesture = new Hammer(document.getElementById("iframeAdvert"), {
      // adjust defaults //
      prevent_default:false,
      swipe_min_distance:100,
      swipe_time:1000
    });
    /* Set up swipe gestures */
    advertiFrameDeviceGesture.onswipe = function(e){
      if (e.direction == "left") {
        window.parent.magazineBuilder.goToNextPage();
      };
      if (e.direction == "right") {
        window.parent.magazineBuilder.goToPreviousPage();
      };
    }
  };

  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if(results == null)
      return "";
    else
      return decodeURIComponent(results[1].replace(/\+/g, " "));
  }
</script>

<div id="iframeAdvert">
  <!--Your Advert Starts Here-->
  <script type="text/javascript">
    (function loadPromo(){

    /* Test block ID */  
    var blockID = getParameterByName("blockID");
    if (!isNaN(blockID)) {
      blockID = "block" + blockID;
    };

    var channel = getParameterByName("marketingChannel");
    var language = getParameterByName("language");

    if(typeof(cachebuster) == "undefined"){var cachebuster = Math.floor(Math.random()*10000000000)}
    if(typeof(dcopt) == "undefined"){var dcopt = "dcopt=ist;"} else {var dcopt = ""}
    if(typeof(tile) == "undefined"){var tile = 1} else {tile++}
    document.write('<scr'+'ipt src="http://ad.doubleclick.net/adj/netaporter.magazine.'+channel+'/'+blockID+';ln='+ language +';pos=1;' + dcopt + ';tile=' + tile + ';sz=950x624;ord=' + cachebuster + '?"></scr'+'ipt>');
    })();
  </script>
  <noscript>
    <a href="http://ad.doubleclick.net/jump/netaporter.magazine.opuk/block2;pos=1;sz=950x624;ord=123456789?" target="_blank" >
      <img src="http://ad.doubleclick.net/ad/netaporter.magazine.opuk/block2;pos=1;sz=950x624;ord=123456789?" border="0" alt="" />
    </a>
  </noscript>
</div>
<script type="text/javascript">
      window.onload=function() {
        if (window.parent.magazineBuilder.get_IfUsingMobileBrowser()) {
          setupAdvertGesture();
        }
      };
</script>