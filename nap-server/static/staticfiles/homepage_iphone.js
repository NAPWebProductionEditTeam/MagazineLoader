$(document).ready(function() {

var mobileUAStrings = /iphone/ig;

if(!window.onload) {

            window.onload = function() {

                        if(navigator.userAgent.match(mobileUAStrings)) {

                                   $('#iphone-promo').show();

                        }

            }

} else {

            var currOnload = window.onload;

            window.onload = function() {

                        currOnload();

                        if(navigator.userAgent.match(mobileUAStrings)) {

	$('#iphone-promo').show();
	
	}

            }

}
						   });