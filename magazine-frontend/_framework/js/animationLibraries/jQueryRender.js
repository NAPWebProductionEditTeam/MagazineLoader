/**
 * Magazine jQuery engine
 * @author Robin Glen (Net-a-porter)
 */

var magazineAnimationRender = (function() {
		
	// debug loaded namespace //	
	magazineLoader.magazineDebugLog({"status":"loaded","namespace":"magazineAnimationRender[jQuery]"});
	
	// slide in animations
	var divWidth,
	divHeight,
	
	// target page
	preparePage,
	animatePage, 
	resetPage, 
	
	
	// animtion storage
	endPositionArray=new Array(),
	elementIDArray=new Array(),
	arrayPointer,
	magazineWidth,
	magazineHeight,
	magazinePageTransition,
	
	// run prepare been run
	prepareStatus;
	
	/**
	 * Keep track if prepare has been run  
	 * @namespace magazineAnimationRender
	 * @class prepareAnimationControllerStatus  
	 * @param {string} setStatus    
	 */
	function prepareAnimationControllerStatus(setStatus) {
		if (setStatus) {
			prepareStatus = setStatus;
		} else {
			return prepareStatus;
		}	
	};
	
	/**
	 * Store the div ID and position of all the items to be animateds 
	 * @namespace magazineAnimationRender
	 * @class storePrepareAnimationData  
	 * @param {object} This  
	 * Pass the div object
	 * @param {string} position  
	 * Where the div is to be positioned to
	 */
	function storePrepareAnimationData($this,position) {
		// check to see if any animation objects have beeing added
		if (endPositionArray.length == 0) {
			// add object
			endPositionArray.push (
				{
					"ID" : $this.attr("id"),
					"Position" : $this.css(position)       
				}
			);
			// add the object to the array of object names
			elementIDArray.push ($this.attr("id"));
		} else {
			// check to see if the item already exists in the array of object names
			if (jQuery.inArray($this.attr("id"), elementIDArray) == -1) {
				// add object
				endPositionArray.push (
					{
						"ID" : $this.attr("id"),
						"Position" : $this.css(position)       
					}
				)
				// add the object to the array of object names
				elementIDArray.push ($this.attr("id"));	
			}	
		};	
	};
	
	/**
	 * Split the passed class name to collect animation details for standard transition
	 * @namespace magazineAnimationRender
	 * @class splitStandardTransition  
	 * @param {object} This  
	 * Pass the div object
	 * @return {object} animTimer  
	 * how long animation should take
	 * @return {object} animPause  
	 * how long before animation should start
	 * @return {object} animEasing  [default linear]
	 * easing on animation e.g. linear, EaseIn, EaseOut
	 */
	function splitStandardTransition($this,animationType) {
		// speed of transition
		i = $this.attr("class").split("anim-"+ animationType +"-Time-");
		animTimer = i[1].split("-Pause-");
		// easing style
		j = $this.attr("class").split("-Pause-")
		animEasing = j[1].split("-")[1].split(" ")[0];
		// JQUERY EASE DECTIONS
		// 	Currently jQuery only supports linear and swing ease types, we could add
		//  a libray to add additional but as this is a fall back we currently give the 
		//  developer these two options at the moment
		if (animEasing) {
			
			if (animEasing != "linear" ) {
				animEasing = "swing"
			} else {
				animEasing = "linear"
			}
		} else {
			animEasing = "linear"
		}
		// pause time
		k = $this.attr("class").split("anim-"+ animationType +"-Time-")
		k2 = k[1].split("-Pause-");
		animPause = k2[1].split("-");
		return {
			animTimer: animTimer[0],
			animEasing: animEasing,
			animPause: animPause[0]
		}
	};	
	
	
	/**
	 * Prepare page for animation
	 * @namespace magazineAnimationRender
	 * @class prepareAnimationController  
	 * @param {string} requestedPage    
	 */	
	function prepareAnimationController(requestedPage) {
		preparePage = "li#page" + (requestedPage) + " ",
		magazineWidth = magazineBuilder.get_PageWidth(),
		magazineHeight = magazineBuilder.get_PageHeight();
		
		// prepare has now effectively been run
		prepareAnimationControllerStatus(true);
		
		// reset the arrays for the new page
		if (elementIDArray.length == 0) {
			arrayPointer = 0;
		};
		
		// FADE IN ANIMATION
		// =================
		// self invoking anonymous function
		// look for any class on $(preparePage) with the class name anim-FadeIn
		(function prepareAnimationFadeIn() {
			$(preparePage + '[class^=anim-FadeIn]').each(function() {
				var $this = $(this);
				$this.css({"display":"none"});
				// debug prepare fade in //
				magazineLoader.magazineDebugLog({"status":"prepare animation","namespace":"magazineAnimationRender", "functionName":"prepareAnimationFadeIn","msg":"prepare fade in on " + preparePage + " "+ $this.attr("id"),"lineNumber": new Error().lineNumber});
			});
		})(); 
		
		// FADE OUT ANIMATION
		// =================
		// self invoking anonymous function
		// look for any class on $(preparePage) with the class name anim-FadeOut		
		(function prepareAnimationFadeOut() {
			$(preparePage + '[class^=anim-FadeOut]').each(function() {
				var $this = $(this);
				$this.css({"display":"block"});
				// debug prepare fade out //
				magazineLoader.magazineDebugLog({"status":"prepare animation","namespace":"magazineAnimationRender", "functionName":"prepareAnimationFadeOut","msg":"prepare fade out on " + preparePage + " "+ $this.attr("id"),"lineNumber": new Error().lineNumber});
			});
		})(); 
		
		// TRANSITION LEFT ANIMATION
		// =========================
		// self invoking anonymous function
		// look for any class on $(preparePage) with the class name anim-FromLeft
		(function prepareAnimationFromLeft() {
			
			// grab all fromLeft animations
			$(preparePage + '[class^=anim-FromLeft]').each(function() {
				var $this = $(this);
				// get the div width for offsetting
				var divWidth = parseInt($this.width());
				// store animation data
				storePrepareAnimationData($this,"left");
				// set off screen
				$this.css({"left" : "-" + divWidth + "px"});
				// debug prepare from left //
				magazineLoader.magazineDebugLog({"status":"prepare animation","namespace":"magazineAnimationRender", "functionName":"prepareAnimationFromLeft","msg":"prepare from left on " + preparePage + " "+ $this.attr("id"),"lineNumber": new Error().lineNumber});
			});
		})(); 
		
				
		// TRANSITION RIGHT ANIMATION 
		// ==========================
		// self invoking anonymous function
		// look for any class on $(preparePage) with the class name anim-FromRight
		(function prepareAnimationFromRight() {			
			// grab all fromRight animations
			$(preparePage + '[class^=anim-FromRight]').each(function() {
				var $this = $(this);
				// store animation data
				storePrepareAnimationData($this,"left");
				// set off screen
				$this.css({"left" : magazineWidth+ "px"});
				// debug prepare from right //
				magazineLoader.magazineDebugLog({"status":"prepare animation","namespace":"magazineAnimationRender", "functionName":"prepareAnimationFromRight","msg":"prepare from right on " + preparePage + " "+ $this.attr("id"),"lineNumber": new Error().lineNumber});
			});
		})(); 
		
		// TRANSITION TOP ANIMATION
		// ========================
		// self invoking anonymous function
		// look for any class on $(preparePage) with the class name anim-FromTop
		(function prepareAnimationFromTop() {
			
			// grab all fromLeft animations
			$(preparePage + '[class^=anim-FromTop]').each(function() {
				var $this = $(this);
				// get the div width for offsetting
				divHeight = parseInt($this.height());
				// store animation data
				storePrepareAnimationData($this,"top");			
				// set off screen
				$this.css({"top" : "-" + divHeight + "px"});
				// debug prepare from top //
				magazineLoader.magazineDebugLog({"status":"prepare animation","namespace":"magazineAnimationRender", "functionName":"prepareAnimationFromTop","msg":"prepare from top on " + preparePage + " "+ $this.attr("id"),"lineNumber": new Error().lineNumber});
			});
		})();
		
		// TRANSITION BOTTOM ANIMATION 
		// ===========================
		// self invoking anonymous function
		// look for any class on $(preparePage) with the class name anim-FromBottom
		(function prepareAnimationFromBottom() {
			// grab all fromLeft animations
			$(preparePage + '[class^=anim-FromBottom]').each(function() {
				var $this = $(this);
				// store animation data
				storePrepareAnimationData($this,"top");	
				// set off screen
				$this.css({"top" : magazineHeight + "px"});
				// debug prepare from bottom //
				magazineLoader.magazineDebugLog({"status":"prepare animation","namespace":"magazineAnimationRender", "functionName":"prepareAnimationFromBottom","msg":"prepare from bottom on " + preparePage + " "+ $this.attr("id"),"lineNumber": new Error().lineNumber});
			});
		})();
		
	}
	
	/**
	 * apply animation on requested page
	 * @namespace magazineAnimationRender
	 * @class applyAnimationController  
	 * @param {string} requestedPage    
	 */	
	function applyAnimationController(requestedPage) {
		animatePage = "li#page" + (requestedPage) + " ";
	
		// FADE IN ANIMATION
		// =================
		// self invoking anonymous function
		// look for any class on $(requestedPage) with the class name anim-FadeIn
		(function animationFadeIn() {
			// search for all fade in animation types
			$(animatePage + '[class^=anim-FadeIn]').each(function() {
				var $this = $(this);
				// split class name and collect object
				var animationObj = splitStandardTransition($this,"FadeIn");
				// add the class animate
				$this.toggleClass("animate");
				// delay animation by pause timer
				$($this, ".animate").delay(animPause).fadeToggle(animTimer,animEasing[1]);
				// debug apply fade in //
				magazineLoader.magazineDebugLog({"status":"play animation","namespace":"magazineAnimationRender", "functionName":"animationFadeIn","msg":"fade in " + animatePage + " "+ $this.attr("id"),"lineNumber": new Error().lineNumber});
				
			});
		})();
	
		// FADE OUT ANIMATION - needs cleaning
		// =================
		// self invoking anonymous function
		// look for any class on $(requestedPage) with the class name anim-FadeOut
		(function animationFadeOut() {
			// search for all fade Out animation types
			$(animatePage + '[class^=anim-FadeOut]').each(function() {
				var $this = $(this);
				// split class name and collect object
				var animationObj = splitStandardTransition($this,"FadeOut");	
				// add the class animate
				$this.toggleClass("animate");
				// delay animation by pause timer
				$($this, ".animate").delay(animPause).fadeToggle(animTimer,animEasing[1]);
				// debug apply fade out //
				magazineLoader.magazineDebugLog({"status":"play animation","namespace":"magazineAnimationRender", "functionName":"animationFadeOut","msg":"fade out " + animatePage + " "+ $this.attr("id"),"lineNumber": new Error().lineNumber});
			});
		})();
	
		// TRANSITION LEFT ANIMATION
		// =========================
		// self invoking anonymous function
		// look for any class on $(requestedPage) with the class name anim-FromLeft
		(function animationFromLeft() {	
			// search for all FromLeft animation types
			$(animatePage + '[class^=anim-FromLeft]').each(function() {
				var $this = $(this);
				// find array pointer
				arrayPointer = jQuery.inArray($this.attr("id"), elementIDArray);
				// split class name and collect object
				var animationObj = splitStandardTransition($this,"FromLeft");	
				// add the class animate
				$this.toggleClass("animate");
				// add animation to class
				$($this, ".animate").delay(animationObj.animPause).animate({left:endPositionArray[arrayPointer].Position},animationObj.animTimer,animationObj.animEasing);
				// debug apply from left //
				magazineLoader.magazineDebugLog({"status":"play animation","namespace":"magazineAnimationRender", "functionName":"animationFromLeft","msg":"from left to " + endPositionArray[arrayPointer].Position +"px on "+ animatePage + " "+ $this.attr("id"),"lineNumber": new Error().lineNumber});
			});
		})();
	
		// TRANSITION RIGHT ANIMATION
		// ==========================
		// self invoking anonymous function
		// look for any class on $(requestedPage) with the class name anim-FromRight
		(function animationFromRight() {
			// search for all fade Out animation types
			$(animatePage + '[class^=anim-FromRight]').each(function() {
				var $this = $(this);
				// find array pointer
				arrayPointer = jQuery.inArray($this.attr("id"), elementIDArray);
				// split class name and collect object
				var animationObj = splitStandardTransition($this,"FromRight");	
				// add the class animate
				$this.toggleClass("animate");
				// add animation to class
				$($this, ".animate").delay(animationObj.animPause).animate({left:endPositionArray[arrayPointer].Position},animationObj.animTimer,animationObj.animEasing);
				// debug apply from right //
				magazineLoader.magazineDebugLog({"status":"play animation","namespace":"magazineAnimationRender", "functionName":"animationFromRight","msg":"from right to " + endPositionArray[arrayPointer].Position +"px on "+ animatePage + " "+ $this.attr("id"),"lineNumber": new Error().lineNumber});
			});
		})();
		
			// TRANSITION TOP ANIMATION 
			// ========================
			// self invoking anonymous function
			// look for any class on $(requestedPage) with the class name anim-FromTop
			(function animationFromTop() {	
			// search for all fade Out animation types
			$(animatePage + '[class^=anim-FromTop]').each(function() {
				var $this = $(this);
				// find array pointer
				arrayPointer = jQuery.inArray($this.attr("id"), elementIDArray);
				// split class name and collect object
				var animationObj = splitStandardTransition($this,"FromTop");
				// add the class animate
				$this.toggleClass("animate");
				// add animation to class
				$($this, ".animate").delay(animationObj.animPause).animate({top:endPositionArray[arrayPointer].Position},animationObj.animTimer,animationObj.animEasing);
				// debug apply from top //
				magazineLoader.magazineDebugLog({"status":"play animation","namespace":"magazineAnimationRender", "functionName":"animationFromTop","msg":"from top to " + endPositionArray[arrayPointer].Position +"px on "+ animatePage + " "+ $this.attr("id"),"lineNumber": new Error().lineNumber});
			});
		})();
		
			// TRANSITION BOTTOM ANIMATION - needs cleaning up
			// ========================
			// self invoking anonymous function
			// look for any class on $(requestedPage) with the class name anim-FromBottom
			(function animationFromBottom() {
			// search for all fade Out animation types
			$(animatePage + '[class^=anim-FromBottom]').each(function() {
				var $this = $(this);
				// find array pointer
				arrayPointer = jQuery.inArray($this.attr("id"), elementIDArray);
				// split class name and collect object
				var animationObj = splitStandardTransition($this,"FromBottom");
				// add the class animate
				$this.toggleClass("animate");
				// add animation to class
				$($this, ".animate").delay(animationObj.animPause).animate({top:endPositionArray[arrayPointer].Position},animationObj.animTimer,animationObj.animEasing);
				// debug apply from bottom //
				magazineLoader.magazineDebugLog({"status":"play animation","namespace":"magazineAnimationRender", "functionName":"animationFromBottom","msg":"from bottom to " + endPositionArray[arrayPointer].Position +"px on "+ animatePage + " "+ $this.attr("id"),"lineNumber": new Error().lineNumber});
			});
		})();
	};
	
	/**
	 * reset animation on page
	 * @namespace magazineAnimationRender
	 * @class removeAnimationController  
	 * @param {string} requestedPage    
	 */	
	function removeAnimationController(requestedPage) {
		resetPage = "li#page" + requestedPage + " ",
		magazinePageTransition = magazineBuilder.get_MagazinePageTransition();
		
		// FADE IN ANIMATION
		// =================
		// self invoking anonymous function
		// look for any class on $(requestedPage) with the class name anim-FadeIn
		(function removeAnimationFadeIn() {	
			// search for all fade in animation types
			$(resetPage + '[class^=anim-FadeIn]').each(function() {
				var $this = $(this);
				// reset
				$this.delay(magazinePageTransition).toggleClass("animate");
				// debug remove fade in //
				magazineLoader.magazineDebugLog({"status":"reset animation","namespace":"magazineAnimationRender", "functionName":"removeAnimationFadeIn","msg":"reset " + preparePage + " "+ $this.attr("id"),"lineNumber": new Error().lineNumber});
			});
		})();
		
		// FADE OUT ANIMATION
		// =================
		// self invoking anonymous function
		// look for any class on $(requestedPage) with the class name anim-FadeOut
		(function removeAnimationFadeOut() {	
			// search for all fade in animation types
			$(resetPage + '[class^=anim-FadeOut]').each(function() {
				var $this = $(this);
				// reset
				$this.delay(magazinePageTransition).toggleClass("animate");
				// debug remove fade out //
				magazineLoader.magazineDebugLog({"status":"reset animation","namespace":"magazineAnimationRender", "functionName":"removeAnimationFadeOut","msg":"reset " + preparePage + " "+ $this.attr("id"),"lineNumber": new Error().lineNumber});
			});
		})();
		
		// TRANSITION LEFT ANIMATION
		// =========================
		// self invoking anonymous function
		// look for any class on $(requestedPage) with the class name anim-FromLeft
		(function removeAnimationFromLeft() {	
			// search for all fade Out animation types
			$(resetPage + '[class^=anim-FromLeft]').each(function() {
				var $this = $(this);
				returnWidth = $this.width()
				// reset		
				$this.delay(magazinePageTransition).toggleClass("animate");
				// debug remove from left //
				magazineLoader.magazineDebugLog({"status":"reset animation","namespace":"magazineAnimationRender", "functionName":"removeAnimationFadeOut","msg":"reset " + preparePage + " "+ $this.attr("id"),"lineNumber": new Error().lineNumber});
			});
		})();
		
		// TRANSITION RIGHT ANIMATION
		// ==========================
		// self invoking anonymous function
		// look for any class on $(requestedPage) with the class name anim-FromRight
		(function removeAnimationFromRight() {	
			// search for all fade Out animation types
			$(resetPage + '[class^=anim-FromRight]').each(function() {
				var $this = $(this);
				// reset		
				$this.delay(magazinePageTransition).toggleClass("animate");
				// debug remove from right //
				magazineLoader.magazineDebugLog({"status":"reset animation","namespace":"magazineAnimationRender", "functionName":"removeAnimationFromRight","msg":"reset " + preparePage + " "+ $this.attr("id"),"lineNumber": new Error().lineNumber});
			});
		})();
		
		// TRANSITION TOP ANIMATION
		// ========================
		// self invoking anonymous function
		// look for any class on $(requestedPage) with the class name anim-FromTop
		(function removeAnimationFromTop() {	
			// search for all fade Out animation types
			$(resetPage + '[class^=anim-FromTop]').each(function() {
				var $this = $(this);
				// reset
				$this.delay(magazinePageTransition).toggleClass("animate");
				// debug remove from top //
				magazineLoader.magazineDebugLog({"status":"reset animation","namespace":"magazineAnimationRender", "functionName":"removeAnimationFromTop","msg":"reset " + preparePage + " "+ $this.attr("id"),"lineNumber": new Error().lineNumber});
			});
		})();
		
		// TRANSITION BOTTOM ANIMATION
		// ========================
		// self invoking anonymous function
		// look for any class on $(requestedPage) with the class name anim-FromBottom
		(function removeAnimationFromBottom() {	
			// search for all fade Out animation types
			$(resetPage + '[class^=anim-FromBottom]').each(function() {
				var $this = $(this);
				// reset		
				$this.delay(magazinePageTransition).toggleClass("animate");
				// debug remove from bottom //
				magazineLoader.magazineDebugLog({"status":"reset animation","namespace":"magazineAnimationRender", "functionName":"removeAnimationFadeIn","msg":"reset " + preparePage + " "+ $this.attr("id"),"lineNumber": new Error().lineNumber});
			});
		})();
		
	}
		
	return {
		prepareAnimationController: prepareAnimationController,
		applyAnimationController: applyAnimationController,
		removeAnimationController: removeAnimationController,
		prepareAnimationControllerStatus: prepareAnimationControllerStatus
	};
}());