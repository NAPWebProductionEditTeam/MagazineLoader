/**
 * Browser detection
 * @author Robin Glen (Net-a-porter)
 * The file collects the users browsers capabilites and downloads an animation engine best suited to them.
 * There is currently a little hack that turns off animation engine from being loaded on Internet explorer 7 and below
 * 
 */

var magazineBrowserDetection = (function() {
	
	magazineLoader.magazineDebugLog({"status":"loaded","namespace":"magazineBrowserDetection"});
	
	var cssPropertyAvailability,
	usersBrowserRequested,
	engineLoaded,
	pushHistoryAvailability = true;
	
	// set animation engine availability to false
	requestEngineAvailability(false);
	
		(function usersBrowserDetection() {
		
			// find browser support for CSS3 transition
			// this function is ripped from modernizer
			function usersBrowserCapabilities() {
				var CSS3Property = "transition";
				var prefixes = 'Webkit Moz O ms Khtml'.split(' '),
			    prefix,
			    div = document.createElement('div'),i=0,
			    prop = CSS3Property,
			    support = div.style[prop] != undefined;
			
				//capitilize value
				prop = prop.charAt(0).toUpperCase() + prop.slice(1)
				while( !support && (prefix=prefixes[i++]) ){
				  	support = div.style[prefix+prop] != undefined;
				  	requestPropertyAvailability(support);
				};
			};
		
			// getter setter for controls availabilty
			function requestPropertyAvailability(setStatus) {
				if (setStatus == null) {
					return cssPropertyAvailability;
				} else {
					cssPropertyAvailability = setStatus;
				}
			};
			
			// check the users browser
			function usersBrowser() {
				extendJqueryBrowser();
				var userBrowser = $.browser,
					selectedBrowser,
					isMobileDevice = false,
					animationEngineCompatible = true;
				if (userBrowser.msie) {
					selectedBrowser = "msie";
					// the animation engine is not supported by any Internet Explorer 
					if (userBrowser.version < 8) {
						animationEngineCompatible = false;
					};							
				} else {
					if (userBrowser.mozilla) {
						selectedBrowser = "mozilla";
					} else {
						if (userBrowser.webkit) {
							if (navigator.userAgent.indexOf('iPhone') != -1 || navigator.userAgent.indexOf('iPod') != -1) {
								selectedBrowser = "iPhone_iPod";
								isMobileDevice = true;
								// check if gesture is avilable on device //
								requestPushHistoryAvailability(checkIosVersion());
							} else {
								if (navigator.userAgent.indexOf('iPad') != -1) {
									selectedBrowser = "iPad";
									isMobileDevice = true;
									// check //
									requestPushHistoryAvailability(checkIosVersion());
								} else {
									if ( (navigator.userAgent.indexOf('Android') != -1)) {
										selectedBrowser = "Android";
										isMobileDevice = true;
									} else {
										selectedBrowser = "Webkit";
									}
								}
							}
						} else {
							if (userBrowser.opera) {
								selectedBrowser = "Opera"
							} else {
								if ((navigator.userAgent.indexOf('BlackBerry') != -1)  ) {
									selectedBrowser = "BlackBerry";
									// the animation engine is not supported by blackberry
									animationEngineCompatible = false;
									isMobileDevice = true;
								} else {
									selectedBrowser = "Unknown";
									// as a fail safe the animation engine is not supported by unknow browsers
									animationEngineCompatible = false;
								}
							}
						}
					}
				}
				requestUsersBrowser(selectedBrowser);
				requestMobileDeviceUseage(isMobileDevice);
				magazineLoader.magazineDebugLog({"status":"debug","namespace":"magazineBrowserDetection", "functionName":"usersBrowser","msg":"users browser " + requestUsersBrowser(),"lineNumber": new Error().lineNumber});
				magazineLoader.magazineDebugLog({"status":"debug","namespace":"magazineBrowserDetection", "functionName":"usersBrowser","msg":"user device, mobile:" + requestMobileDeviceUseage(),"lineNumber": new Error().lineNumber});
				return animationEngineCompatible;
			};

			// a hack to extend the browser checker which was removed from jquery 1.9 //
			function extendJqueryBrowser () {
				jQuery.browser = {};
				jQuery.browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase());
				jQuery.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
				jQuery.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
				jQuery.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
				jQuery.browser.blink = /blink/.test(navigator.userAgent.toLowerCase());
			};
			
			// load the animation engine depending on support for css3 transitions
			function loadAnimationLib() {
				var cssLibAvailability = requestPropertyAvailability();
				// if true the users browser can support transitions
				if (cssLibAvailability == true) {
					requestedEngine("CSS engine");
  					requestEngineAvailability(true);
				} else {
					requestEngineAvailability(true);
					requestedEngine("No engine");
				}
			};
			
			(function init() {
				// check to see if the animation engine is available for your browser
				var animationEngineCompatible = usersBrowser();
				if (animationEngineCompatible) {
					usersBrowserCapabilities();
					loadAnimationLib();
				} else {
					requestedEngine("No engine")
				}
			})();
    	
  	})();

	// gestures are unavailable for ios devices older than v5
	function checkIosVersion() {
		if(/OS [2-4]_\d(_\d)? like Mac OS X/i.test(navigator.userAgent)) {  
       		return false; 
   		} else if(/CPU like Mac OS X/i.test(navigator.userAgent)) {
        	return false;
    	} else {
       		return true;	
    	}
	};

	// getter setter for the push history avilability - publicly available
	function requestPushHistoryAvailability(setStatus) {
		if (setStatus == null) {
			return pushHistoryAvailability;
		} else {
			pushHistoryAvailability = setStatus;
		}
	};
	
	// getter setter for engine requested - publicly available
	function requestedEngine(setStatus) {
		if (setStatus == null) {
			return engineRequested;
		} else {
			engineRequested = setStatus;
		}
	};
	
	// getter setter for engine availabilty - publicly available
	function requestEngineAvailability(setStatus) {
		if (setStatus == null) {
			return engineLoaded;
		} else {
			engineLoaded = setStatus;
		}
	};
				
	// getter setter for browser availabilty - publicly available
	function requestUsersBrowser(setStatus) {
		if (setStatus == null) {
			return usersBrowserRequested;
		} else {
			usersBrowserRequested = setStatus;
		}
	};
	
	// getter setter for controls availabilty - publicly available
	function requestMobileDeviceUseage(setStatus) {
		if (setStatus == null) {
			return userAgentRequested;
		} else {
			userAgentRequested = setStatus;
		}
	};

    return {
		requestUsersBrowser: requestUsersBrowser,
		requestEngineAvailability: requestEngineAvailability,
		requestedEngine:requestedEngine,
		requestMobileDeviceUseage: requestMobileDeviceUseage,
		requestPushHistoryAvailability: requestPushHistoryAvailability
	};

}());
	

