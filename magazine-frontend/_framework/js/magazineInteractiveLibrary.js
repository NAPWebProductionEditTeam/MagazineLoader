/**
 * Magazine interaction library
 * @author Chris Kekeke (Net-a-porter)
 * The file serts up all the interactivity libs
 */

var magazineInteractiveComponents = (function() {
	
// debug loaded namespace //	
magazineLoader.magazineDebugLog({"status":"loaded","namespace":"magazineInteractiveComponents"});

	/**
	 * looks at the selector for a list and displays each content item
	 * one at a time
	 *
	 * @param {String} 	selector
	 * 			The element you wish to pass to class
	 *
	 * @param {Object}	options
	 *			Optional parameters you can pass to the function
	 *
	 *			{Number} delay
	 *			The number of milliseconds the content will be
	 *			held for before the fading out to display the
	 *			next piece of content.  The default value is
	 *			3000
	 *
	 *			{Number} animationSpeed
	 *			The number of milliseconds it takes for the
	 *			content item to animate in and out. Can be
	 *			overridden by animationIn and animationOut
	 *			The default value is 700
	 *
	 *			{Number} animationIn
	 *			The number of milliseconds it takes for the
	 *			content to animate in.  The default value is 700
	 *
	 *			{Number} animationOut
	 *			The number of milliseconds it takes for the
	 *			content to animate out.  The default value is
	 *			700
	 *
	 *			{Boolean} crossFade
	 *			Set to true if you want the current and next
	 *			content item to swap simultaneously. If set to
	 *			true, then animationSpeed is used regardless if
	 *			a animationIn or animationOut has been specified
	 *			The default value is false
	 *
	 *			{Bool} reverse
	 *			Set to true if you want the items to be swapped
	 *			in reverse order.  The default value is false
	 *
	 * @function		stopPageContentRotators
	 * 			Stops all rotators stored in the instance
	 *
	 * 			*note* must create an instance of the
	 *			contentRotator to use this function
	 *
	 *			e.g
	 *			var listA = magazineInteractiveComponents.contentRotator("div#listA");
	 *			listA.stopPageContentRotators();
	 *
	 * @function		startPageContentRotators
	 * 			Starts all rotators stored in the instance
	 * 			
	 *			*note* must create an instance of the
	 *			contentRotator to use this function
	 *
	 *			e.g
	 *			var listA = magazineInteractiveComponents.contentRotator("div#listA");
	 *			listA.startPageContentRotators();
	 */
	function contentRotator(selector, options) {
		
		
		// CONSTANTS
		var DELAY_SPEED = 3000;
		var ANIMATION_SPEED = 700;
		
		var classID = 0;
		//var delay = DELAY_SPEED;
		
		// array of objects for each item found in the passed selector
		var collection;
		
		
		collection = new Array($(selector).length);
		
		// cycle through each possible list
		$(selector).each(function(){
			
			var id = classID;
			
			var animationSpeed = ANIMATION_SPEED;
			var animationIn = animationSpeed;
			var animationOut = animationSpeed;
			var blend = false;
			var delay = DELAY_SPEED;
			//var debug = false;
			var reverse = false;
			var crossFade = false;
			
			// target all lists within the selector and not just the direct child
			var scopeAll = false;
			
			if (options)
			{
				
				/*if (options.debug)
				{
					debug = options.debug;
					if (debug) console.log(selector + " init rotator")
				}*/
				if (options.animationSpeed)
				{
					if (!isNaN(options.animationSpeed))
					{
						animationSpeed = options.animationSpeed;
						animationIn = animationSpeed;
						animationOut = animationSpeed;
					}
				}
				if (options.animationIn)
				{
					if (!isNaN(options.animationIn))
					{
						animationIn = options.animationIn;
					}
				}
				if (options.animationOut)
				{
					if (!isNaN(options.animationOut))
					{
						animationOut = options.animationOut;
					}
				}
				if (options.delay)
				{
					if (!isNaN(options.delay))
					{
						delay = options.delay;
					}
				}
				if (options.blend)
				{
					blend = true;
				}
				if (options.reverse)
				{
					reverse = true;
				}
				if (options.crossFade)
				{
					crossFade = true;
				}
				if (options.spacing)
				{
					spacing = options.spacing;
				}
				if (options.speed)
				{
					if ( !isNaN(options.speed) )
					{
						speed = options.speed;
					}
				}
				if (options.scopeAll)
				{
					scopeAll = true;
				}
			}
			
			// create an empty object
			collection[id] = [];
			// set the debug mode
			//collection[id].debug = debug;
			// add the selector to the object
			collection[id].This = $(this);
			// the HTML list(s)
			collection[id].list = $("> ul, > ol ", this);
			// the direction of the content being rotated
			collection[id].reverse = reverse;
			// the delay for before the content is animated
			collection[id].delay = delay;
			// the speed of the content being rotated
			collection[id].animationSpeed = animationSpeed;
			// the speed of the content fading in
			collection[id].animationIn = animationIn;
			// the speed of the content fading out
			collection[id].animationOut = animationOut;
			// the list scope of the content being rotated
			collection[id].scopeAll = scopeAll;
			// the setTimeout variable
			collection[id].timeout;
			// simultaneous swap
			collection[id].crossFade = crossFade;
			collection[id].playing = false;
			// store the original selector

			collection[id].selector = selector;
			// cycle through in the reverse order
			collection[id].reverse = reverse;
			
			// debug start content rotator //	
			//magazineLoader.magazineDebugLog({"status":"init","namespace":"magazineInteractiveComponents", "functionName":"contentRotator","msg":"content rotator constructor:","lineNumber": new Error().lineNumber});
			//magazineLoader.magazineDebugObj(collection[id]);
			
			if (collection[id].crossFade)
			{
				collection[id].animationIn = collection[id].animationSpeed;
				collection[id].animationOut = collection[id].animationSpeed;
			}
			
			// add a class to associate it with the relevant css
			$(collection[id].This).addClass("contentRotator");
			
			// make the first item on the list visible
			$("li:eq(0) ", collection[id].list).addClass("active");
			
			classID++;
			
		});
		
		// add this new collection information to a jQuery data collection
		$(selector).data( "collection", collection );
		
		function pause (rotator)
		{
			// debug pause content rotator //	
			//magazineLoader.magazineDebugLog({"status":"pause","namespace":"magazineInteractiveComponents", "functionName":"contentRotator","msg":collection[id].This + " paused","lineNumber": new Error().lineNumber});
			
			rotator.playing = false;
			
			clearTimeout(rotator.timeout);
		}
		function start (rotator)
		{
			// debug restart content rotator //	
			//magazineLoader.magazineDebugLog({"status":"start","namespace":"magazineInteractiveComponents", "functionName":"contentRotator","msg":collection[id].This + " started","lineNumber": new Error().lineNumber});
			
			rotator.playing = true;
			
			rotator.timeout = setTimeout(function(){
				
				
				var nextItem;
				
				if (rotator.reverse)
				{
					
					// grab the last
					if ($("> li.active ", rotator.list).prev().length ==  0)
					{
						nextItem = $("> li ", rotator.list).last();
					}
					else
					{
						nextItem = $("> li.active ", rotator.list).prev();
					}					
				}
				else
				{
					
					if ($("> li.active ", rotator.list).next().length > 0 )
					{
						nextItem = $("> li.active ", rotator.list).next();
					}
					else
					{
						nextItem = $("> li:eq(0) ", rotator.list);
					}					
				}

				
				if (rotator.crossFade)
				{
					var longestDelay = Math.max(rotator.animationIn, rotator.animationOut);
					var useFadeIn = true ? rotator.animationIn > rotator.animationOut : rotator.animationIn < rotator.animationOut;
					
					// fade out current content at the same time as bringing in the new content
					$("> li.active ", rotator.list).fadeOut(rotator.animationOut, function(){
						// callback
						$(this).removeClass("active");
						start(rotator);
						
					})
					nextItem.fadeIn(rotator.animationIn, function(){
						// callback
						$(this).addClass("active");
					})
					
					// re-order the list so the last item fades nicely into the first item
					$("> li.active ", rotator.list).after( nextItem );
					
				}
				else
				{
					// fade the current
					$("> li.active ", rotator.list).fadeOut(rotator.animationOut, function(){
						$(this).removeClass("active");
						
						// bring in the new content
						nextItem.fadeIn(rotator.animationIn, function(){
							$(this).addClass("active");
							
							if (rotator.playing) start(rotator);
						})
					})					
				}
			}, rotator.delay);
		}
		function stopPageContentRotators()
		{
			for (var item in collection)
			{
				// debug stop content rotator //	
				//magazineLoader.magazineDebugLog({"status":"stop","namespace":"magazineInteractiveComponents", "functionName":"contentRotator","msg":collection[id].This + " stop page content","lineNumber": new Error().lineNumber});
				
				pause(collection[item]);
			}
		}
		function startPageContentRotators()
		{
			
			for (var item in collection)
			{
				// debug start content rotator //	
				//magazineLoader.magazineDebugLog({"status":"start","namespace":"magazineInteractiveComponents", "functionName":"contentRotator","msg":collection[id].This + " start page content","lineNumber": new Error().lineNumber});
				
				start(collection[item]);
			}
		}
		
		return {
			stopPageContentRotators : stopPageContentRotators,
			startPageContentRotators : startPageContentRotators
		}
	};
	
	
		/**
	 * provides a callback when all images within the selector has loaded
	 *
	 * @param {Function}	callback
	 * 			The callback function called after all images
	 * 			have been loaded
	 *
	 * @param {Object}	options
	 * 			Optional settings passed to the function
	 *
	 * 			{Boolean} debug
	 * 			Set to true if you want the plugin to output
	 * 			browser console logs.  The default value is false
	 */
	(function( $ ) {
		$.fn.allImagesLoaded = function( callback, options ) {
			
			/*
			var settings = $.extend( {
				'debug' : false
			}, options) */
			
			var This = this;
			
			// total number of images is captured as it will be used for comparison
			var size = $("img ", This).length;
			
			// loaded will store the number of images that have been loaded for this selector
			jQuery.data(This, "loaded")
			
			return this.each(function (){
			
				$("img ", this).each(function(){
					
					// create a new image
					var image = new Image();
					
					// setup the load event
					image.onload = function()
					{	
						// check if loaded has a value, if not set it to 1 image loaded
						if (jQuery.data(This, "loaded") == undefined)
						{
							jQuery.data(This, "loaded", 1);
						}
						// increment the number of images loaded and update the data
						else
						{
							var i = jQuery.data(This, "loaded");
							i++;
							jQuery.data(This, "loaded", i);
						}
						
						
						// has the number of images been loaded reached it's scope?
						if (jQuery.data(This, "loaded") == size)
						{
							
							// call the function if so!
							(callback || function(){} ).call();
						}
						
					}
					// set the image source by grabbing the source from the jQuery selector
					var source = $(this).attr("src");
					image.src = source;
				});			
			})
		};
	})( jQuery );
	
	
	/**
	 * Creates an animated carousel with the given selector
	 *
	 * @param {String} 	selector
	 *			The element you wish to pass to productCarousel
	 *		
	 * @param {Object} 	options
	 *			{Boolean} debug
	 *			Enable console logging for the carousel
	 *			Default value is false
	 *
	 *			{String} mode
	 *			'desktop' runs an automatic carousel
	 *			'touch' allows the carousel to be controlled
	 *			with touch gestures
	 *			The default is 'desktop'
	 *
	 * 			{String} orientation
	 * 			'horizontal' - a horizontal carousel
	 * 			'vertical' - a vertical carousel
	 * 			Default is 'horizontal'
	 *
	 * 			{Number} length
	 * 			the length of the container
	 * 			Default is 400px
	 *
	 * 			{Boolean} reverse
	 * 			runs the carousel in reverse direction
	 * 			Default is false
	 *
	 * 			{String} spacing
	 * 			specify the css value for spacing per product
	 * 			the number represents the number of pixels
	 * 			Default is 30 top and bottom for vertical
	 * 			and 30 left and right for horizontal
	 *
	 * 			{Number} speed
	 * 			lowering the number shortens the time it takes
	 * 			to complete a cycle
	 * 			Default 10
	 *
	 * @function		stopPageCarousels
	 *			Stops the carousel(s) in the given selector
	 *			*note* must create an instance of the
	 *			productCarousel to use this function
	 *
	 *			// setup
	 *			var carouselA;
	 *			carouselA = magazineInteractiveComponents.productCarousel(".carouselA")
	 *			// use
	 *			carouselA.stopPageCarousels();
	 *
	 * @function		startPageCarousels
	 * 			Starts the carousel(s) in the given selector
	 *			*note* must create an instance of the
	 *			productCarousel to use this function
	 *
	 *			// setup
	 *			var carouselB;
	 *			carouselB = magazineInteractiveComponents.productCarousel(".carouselB")
	 *			// use
	 *			carouselB.startPageCarousels();
	 */
	
	function productCarousel(selector, options) {

		// each carousel will have a unique selector
		var carouselID = 0;
		
		// array of carousel objects found with the passed selector
		var collection;
		
		// counts how many images within the selector have been loaded
		var loadedImages = 0;
		var imagesReady = false;
		var startWhenLoaded = false;
		
		// CONSTANTS
		var MODE_DESKTOP = "desktop";
		var MODE_TOUCH = "touch";
		var VERTICAL = "vertical";
		var HORIZONTAL = "horizontal";
		var INTERVAL_PACE = 10;
		
		
		// initiate the array with a set size
		collection = new Array($(selector).length);
		
		imagesReady = true;
		
		$(selector).each(function(){
			
			// unique id to the carosel instance
			var id = carouselID;
			
			// set default values, they may be overridden by options
			//var debug = false;
			//var debugElement;
			var length = 400;
			var orientation = HORIZONTAL;
			var mode = MODE_DESKTOP;
			var reverse = false;
			var spacing = "30";
			var speed = INTERVAL_PACE;
			
			if (options)
			{
				if (options.length)
				{
					if ( !isNaN(options.length) )
					{
						length = options.length;
					}
				}
				if (options.orientation == VERTICAL)
				{
					orientation = VERTICAL;
				}
				else if (options.orientation == HORIZONTAL)
				{
					orientation = HORIZONTAL;
				}
				if (options.mode)
				{
					if (options.mode == true)
					{
						// currently there is no difference for the touch mode
						mode = MODE_DESKTOP;
					}
					else if (options.mode == false)
					{
						mode = MODE_DESKTOP
					}
				}
				if (options.reverse)
				{
					reverse = true;
				}
				if (options.spacing)
				{
					if ( !isNaN(options.spacing) )
					{
						spacing = options.spacing;
					}
				}
				
				if (options.speed)
				{
					if ( !isNaN(options.speed) )
					{
						speed = options.speed;
					}
				}
			}
			
			// ****************************************************
			// PRODUCT CAROUSEL OBJECT
			// ****************************************************
			/**
			 * convieniently stores data for each productCarousel
			 */
			// create an empty object
			collection[id] = [];
			
			collection[id].selector = selector;
			// add the carousel to the object
			collection[id].This = $(this);
			// add the carousel list to the object
			collection[id].list = $("> ul", this);
			// the orientation
			collection[id].orientation = orientation;
			// the size number of the content animated
			collection[id].contentSize = 0;
			// set the carousel length
			collection[id].containerSize = length;
			// start time marks when the animation begun
			collection[id].startTime;
			// duration for how long the carousel should animate for, dependent on the contentSize
			collection[id].animationInterval = 0;
			// stores the timeout variable for reseting the carousel
			collection[id].resetCountdown;
			// reset countdown stores the numeric value for a setTimeout event that will reset the carousel
			collection[id].resetCountdownNumber = 0;
			// runs the carousel in reverse order if true
			collection[id].reverse = reverse
			// + or - value to drive jQuery's animate method
			collection[id].direction = reverse ? "-" : "+";
			// spacing between each item
			collection[id].spacing = spacing;
			// speed at which the carousel should run at
			collection[id].speed = speed;
			// the mode in which the carousel will operate
			collection[id].mode = mode;
			// bool flagging whether the carousel is being animated
			collection[id].animating;
			
			// add css class for default styling
			$(collection[id].This).addClass("productCarousel");
			// debug init product carousel //	
			//magazineLoader.magazineDebugLog({"status":"init","namespace":"magazineInteractiveComponents", "functionName":"productCarousel","msg":"constructor properties","lineNumber": new Error().lineNumber});
			//magazineLoader.magazineDebugObj(collection[id]);
			
			
			
			// clone the list - this is used to cheat the effect of an infinite carousel
			$("> ul li", collection[id].This).clone().appendTo($("> ul", collection[id].This));
			
			// define the orientation
			collection[id].list.addClass(collection[id].orientation);
			
			$(selector).allImagesLoaded(function(){
				if (collection[id].orientation == VERTICAL )
				{
					
					var IE7_max_width = 0;
					
					// set spacing
					$("> ul li a", collection[id].This).each( function(){
						$(this).css("padding-top", collection[id].spacing + "px");
						$(this).css("padding-bottom", collection[id].spacing + "px");
					});
					
					// calculate the content size
					$("> ul img", collection[id].This).each( function(){
						collection[id].contentSize += $(this).height() + (collection[id].spacing * 2);
						
						// IE7 hacks
						if ($.browser.msie)
						{
							if ($.browser.version == "7.0")
							{
								collection[id].contentSize += 4;
								// update the height of the list item as IE7 doesn't know what it is
								$(this).closest("li").height( $(this).height() + (collection[id].spacing * 2) + 4 );
								
								// IE7 struggles with getting a list item width, so we'll grab the widest image width and set the list item width to this
								if ($(this).width() > IE7_max_width)
								{
									IE7_max_width = $(this).width();
									collection[id].This.width(IE7_max_width)
								}
							}
						}
						
					})
					
					// set container length
					// check the contentSize is larger than the required container size
					if (collection[id].contentSize <= collection[id].containerSize * 2)
					{
						collection[id].containerSize = collection[id].contentSize / 2;
						collection[id].This.height(collection[id].containerSize);
					}
					else
					{
						collection[id].This.height(collection[id].containerSize);
					}
					
					
					// set content size
					$("ul", collection[id].This).height(collection[id].contentSize);
					
				}
				// horizontal
				else
				{
					// set spacing
					$("> ul li a", collection[id].This).each( function(){
						
						$(this).css("padding-left", collection[id].spacing + "px");
						$(this).css("padding-right", collection[id].spacing + "px");						
					});

					// calculate the content size
					$("> ul img", collection[id].This).each( function(){
						collection[id].contentSize += $(this).width() + (collection[id].spacing * 2);
						
						// IE7 hacks
						if ($.browser.msie)
						{
							if ($.browser.version == "7.0")
							{
								// update the content size
								collection[id].contentSize += 4;
								// update the width of the list item as IE7 doesn't know what it is
								$(this).closest("li").width( $(this).width() + (collection[id].spacing * 2) + 4 );
								
							}
						}
					})
					
					
					// set container length
					// check the contentSize is larger than the required container size
					if (collection[id].contentSize <= collection[id].containerSize * 2)
					{
						collection[id].containerSize = collection[id].contentSize / 2;
						collection[id].This.width(collection[id].containerSize);						
					}
					else
					{
						collection[id].This.width(collection[id].containerSize);
					}
					
					// set the content size
					$("ul", collection[id].This).width(collection[id].contentSize);
					
				}
			
			
				// set the animation speed, relative to the content size.
				// This potentially keeps any content length moving at the same speed using the same speed value
				collection[id].animationInterval = collection[id].contentSize * speed;
			
			
				
				// ****************************************************
				// EVENTS
				// ****************************************************
				$("> ul li img", collection[id].This).hover(function(){				
					
					if (collection[id].animating)
					{
						pauseCarousel(collection[id]);
					}
					else
					{
						
					}
				},
				function(){
					// resume animation
					animateCarousel(collection[id]);	
				})
				
				// initiate animation 
				if (collection[id].mode == MODE_DESKTOP)
				{
					// debug desktop mode on product carousel //	
					//magazineLoader.magazineDebugLog({"status":"debug","namespace":"magazineInteractiveComponents", "functionName":"productCarousel","msg":"desktop mode","lineNumber": new Error().lineNumber});
					carouselStartPoint(collection[id]);
				}
				else if (collection[id].mode == MODE_TOUCH)
				{
					// debug mobile mode on product carousel //	
					//magazineLoader.magazineDebugLog({"status":"debug","namespace":"magazineInteractiveComponents", "functionName":"productCarousel","msg":"mobile mode","lineNumber": new Error().lineNumber});
				}
			},{
				// passing the same debug option as the carousel
				debug : collection[id].debug
			});
			
			// images have been loaded, the carousel is ready 
			if (startWhenLoaded)
			{
				// debug start product carousel //	
				//magazineLoader.magazineDebugLog({"status":"start","namespace":"magazineInteractiveComponents", "functionName":"productCarousel","msg":collection[id].This +" start","lineNumber": new Error().lineNumber});
				animateCarousel(collection[id]);
			}
			
			carouselID++;

		})
		
		/**
		 * animateCarousel uses a combination of jQuery's animate method
		 * and a custom setTimeout function to allow the carousel to
		 * animate infinitely regardless of the dimensions of each
		 * carousel item
		 *
		 * @param {Object}	carousel
		 * 			The carousel to be animated
		 */
		function animateCarousel(carousel)
		{
			// debug animate product carousel //	
			//magazineLoader.magazineDebugLog({"status":"animate","namespace":"magazineInteractiveComponents", "functionName":"animateCarousel","msg":collection[id].This + " animation started","lineNumber": new Error().lineNumber});	
			if (imagesReady) {
				
				// flag the time this animation started as it will be used to compare when the animation was paused
				carousel.startTime = new Date();
				
				// resetCountdownNumber is used with the setTimeout value so the animation gets repeated
				if (carousel.resetCountdownNumber <= 0)
				{
					carousel.resetCountdownNumber = carousel.animationInterval;
				}
				
				// console.log("carousel.resetCountdownNumber " + carousel.resetCountdownNumber);
				
				// store the setTimeout in a variable
				carousel.resetCountdown = setTimeout(function(){
					startResetCountdown(carousel);
				}, carousel.resetCountdownNumber)
				
				/*
				 now animate
				 the animation is based on the direction set and
				 the size of the content halved, since the content and
				 it's size was doubled on initialisation
				*/
				if ( carousel.orientation == VERTICAL )
				{
					$(carousel.list).animate({
						top: carousel.direction + "=" + (carousel.contentSize / 2 ) + "px"
					}, {
						duration: carousel.animationInterval,
						easing: "linear"
					})							
				}
				else
				{
					$(carousel.list).animate({
						left: carousel.direction + "=" + (carousel.contentSize / 2 ) + "px"
					}, {
						duration: carousel.animationInterval,
						easing: "linear"
					})							
				}
				carousel.animating = true;				
			}
			else {
				// set the force start property so that when the window.load has finished initialising the class, it will run the animation

				//carousel.forceStart = true;
				startWhenLoaded = true;
			}


		}
		/**
		 * pauseCarousel stops the animation and tracks the time
		 * difference between the start time and stop time
		 * This time difference will be used to resume the animation
		 * so that it resets at the right time
		 */
		function pauseCarousel(carousel)
		{
			// debug pause product carousel //	
			//magazineLoader.magazineDebugLog({"status":"pause","namespace":"magazineInteractiveComponents", "functionName":"pauseCarousel","msg":collection[id].This + " animation paused","lineNumber": new Error().lineNumber});
			carousel.animating = false;
			
			// stop the actual animation
			carousel.list.stop();
			//carousel.list.componentStop();
			
			
			// clear the timeout function that restarts the carousel
			clearTimeout(carousel.resetCountdown);
			
			// work out how much time is left before the next timeout function
			// grab the time the animation started
			var s = carousel.startTime;
			// grab the current time
			var c = new Date();
			
			var startUTC = Date.UTC(s.getFullYear(), s.getMonth(), s.getDay(), s.getHours(), s.getMinutes(), s.getSeconds(), s.getMilliseconds());
			var nowUTC = Date.UTC(c.getFullYear(), c.getMonth(), c.getDay(), c.getHours(), c.getMinutes(), c.getSeconds(), c.getMilliseconds());
			
			var timeDifference = nowUTC - startUTC;
			
			// using the difference, subtract it from the interval reset time
			carousel.resetCountdownNumber -= timeDifference;
			
			
		}
		
		function startResetCountdown(carousel)
		{
			
			// stop the animation
			carousel.list.stop();
			
			// reset animation properties
			carousel.resetCountdownNumber = carousel.animationInterval;
			
			// manipulate the dom / re-align objects
			carouselStartPoint(carousel);
			
			// start animation again
			animateCarousel(carousel);
		}
		
		/**
		 * adjust the starting point in css pixels based on
		 * orientation and direction of the carousel animation
		 */
		function carouselStartPoint (carousel)
		{
			
			if ( carousel.orientation == VERTICAL )
			{
				if (carousel.reverse)
				{
					$(carousel.list).css("top", "0px");
				}
				else
				{
					$(carousel.list).css("top", "-" + (carousel.contentSize / 2 ) + "px");
				}
			}
			else
			{
				if (carousel.reverse)
				{
					$(carousel.list).css("left", "0px");
				}
				else
				{
					$(carousel.list).css("left", "-" + (carousel.contentSize / 2 ) + "px");
				}
			}
		}
		
		// stops a collection of carousels when in desktop mode
		function stopPageCarousels ()
		{
			for (var carousel in collection)
			{
				
				if (collection[carousel].mode == MODE_DESKTOP)
				{
					pauseCarousel(collection[carousel]);
				}
			}
		}
		// starts a collection of carousels when in desktop mode
		function startPageCarousels ()
		{
			for (var carousel in collection)
			{
				
				if (!collection[carousel].animating && collection[carousel].mode == MODE_DESKTOP)
				{
					animateCarousel(collection[carousel]);
				}
				else
				{
					
				}
			}
		}
		
		return {
			stopPageCarousels : stopPageCarousels,
			startPageCarousels : startPageCarousels
		}
		
	}
	
	/**
	 * Creates a clickable element that will display additional content from
	 * it's related overlay element
	 *
	 * The overlay element can be closed either by clicking on the overlay
	 * or clicking on the close button if it exists
	 *
	 * In order to create a productOverlay you need to create a HTML element
	 * and give it a unique id or a class attribute
	 * The overlay element needs to have a rel attribute reference the id or
	 * class that was supplied
	 *
	 * i.e
	 * <a id="demo1">Click me to show my content</a>
	 * 
	 * <div rel="#demo1" class="overlay">
	 *	<p>My content in the popup overlay</p>
	 * </div>
	 *
	 * @param {String}	selector
	 * 			jQuery selector to retrieve to setup functionality
	 *
	 * @param {Object}	options
	 * 			Options that can be passed to the function
	 *
	 *			{Boolean} closeAll
	 *			Closes all active overlays when the selected
	 *			overlay is chosen
	 *			The default value is false
	 *
	 *			{Boolean} clickSelfToClose
	 *			Clicking on the element whilst the overlay is
	 *			open will make the overlay close
	 *			The default value is false
	 *
	 *			{Boolean} openDialogAtStart
	 *			When the plugin is run the elements overlay is
	 *			open.
	 *			The default value is false
	 *
	 *			{Number} fadeSpeed
	 *			The speed in milliseconds at which the overlay
	 *			opens and closes
	 *			The default value is 500
	 *
	 *			{String} closeButtonSelector
	 *			
	 * 			{Boolean} debug
	 * 			Option to display console logs associated with
	 * 			the plugin. The default value is false
	 */
	function productOverlay (selector, options)
	{	
		var elementID = 0;
		//var debug = false;
		var closeAll = false;
		var clickSelfToClose = true;
		var fadeSpeed = 500;
		var openDialogAtStart = false;
		var pidExists = false;
		
		// default name the close button / selector
		var closeButtonName = "closeButton"
		var closeButtonSelector = "." + closeButtonName;
		// used only when a close button doesn't exist and the overlay is required to have one
		var closeButtonMarkup = '<span class="' + closeButtonName + '">[close]</span>';
		
		var collection = new Array( $(selector).length);
		
		if (options)
		{
			if (options.closeAll)
			{
				if (options.closeAll == true ) {
					closeAll = true;
				}
			}
			if (options.clickSelfToClose)
			{
				if (options.clickSelfToClose == true ) {
					clickSelfToClose = true;
				}
			}
			if (options.fadeSpeed || options.fadeSpeed ==0)
			{
				fadeSpeed = options.fadeSpeed;
			}
			if (options.openDialogAtStart)
			{
				if (options.openDialogAtStart == true ) {
					openDialogAtStart = true;
				}
			}
		}
		
		$(selector).each(function(){
			var id = elementID;
			
			collection[id] = {};
			collection[id].selector = selector;
			collection[id].This = $(this);
			collection[id].overlay = $("[rel=" + selector + "]");
			collection[id].closeSelector;
			collection[id].closeAll = closeAll;
			collection[id].clickSelfToClose = clickSelfToClose;
			collection[id].isDialogOpen;
			collection[id].fadeSpeed = fadeSpeed;
			collection[id].openDialogAtStart = openDialogAtStart;
			collection[id].closeButtonSelector = closeButtonSelector;
			
			// ****************************************
			// SETUP OVERLAY CONTENT
			// ****************************************
			// add the css cursor property so it appears
			// clickable if the selector is not a anchor
			collection[id].This.css("cursor", "pointer");
			
			// display the dialog on load if the parameter was passed
			if (collection[id].openDialogAtStart)
			{
				showOverlay(collection[id], 0);
			}
			else
			{
				hideOverlay(collection[id], 0);
			}
			
			// if a close button was specified, check it exists
			if (options)
			{
				if (options.closeButtonSelector)
				{
					if ( $(options.closeButtonSelector, collection[id].overlay).length > 0 )
					{
						collection[id].closeButtonSelector = options.closeButtonSelector;
					}
				}
			}
			
			// check for the existance of any pid url's
			$("a, map area", collection[id].overlay).each( function () {
				
				// grab the href
				var href = $(this).attr("href");
				
				if (href)
				{
					if (href.search("/product/") > -1)
					{
						var pid = href.slice(9);
						if ( !isNaN(pid) )
						{
							pidExists = true;
						}
					}					
				}

			})
			
			// ****************************************
			// SETTING THE CLOSE SELECTOR
			// ****************************************
			// if a close button and pid exists within the overlay set the close button as the close selector
			if ( $(".closeButton ", collection[id].overlay).length > 0 && pidExists)
			{
				collection[id].closeSelector = $(collection[id].closeButtonSelector, collection[id].overlay);				
			}
			// if a close button exists within the overlay set that as the close selector
			else if ( $(collection[id].closeButtonSelector, collection[id].overlay).length > 0)
			{
				collection[id].closeSelector = $(collection[id].closeButtonSelector, collection[id].overlay);
			}
			// if no selector exists but a pid id present, create a custom close button
			else if (pidExists)
			{
				// inject it in the DOM using pre-defined markup
				collection[id].overlay.append(closeButtonMarkup);
				collection[id].closeSelector = $(collection[id].closeButtonSelector,  collection[id].overlay);
				
			}
			// else the close button will be the overlay itself
			else
			{
				collection[id].closeSelector = collection[id].overlay;
			}
			
			collection[id].closeSelector.css("cursor", "pointer")
			
			// ****************************************
			// EVENTS
			// ****************************************
			collection[id].This.click(function (){
				
				// close the overlay it's set to do so and if the dialog is open
				if ( collection[id].clickSelfToClose && collection[id].isDialogOpen)
				{
					hideOverlay(collection[id]);
				}
				// if closeAll is true, all the overlays that are
				// currently been displayed need to hide
				else if (collection[id].closeAll == true)
				{
					// debug init product overlay //	
					//magazineLoader.magazineDebugLog({"status":"init","namespace":"magazineInteractiveComponents", "functionName":"productOverlay","msg":"constructor properties","lineNumber": new Error().lineNumber});
					//magazineLoader.magazineDebugObj(collection[id]);
					
					// grab all overlays across the magazine
					var magazineOverlayCollection = $("body").data("magazineOverlayCollection");
					
					for (var theCollection in magazineOverlayCollection)
					{
						// go into each specific object for the element
						for (var element in magazineOverlayCollection[theCollection])
						{
							// condition to bring the selected element
							if (magazineOverlayCollection[theCollection][element] == collection[id])
							{
								showOverlay(collection[id]);
							}
							// hide the rest
							else
							{
								hideOverlay(magazineOverlayCollection[theCollection][element]);
							}
						}
					}
				}
				else
				{
					showOverlay(collection[id]);
				}
				
				return false;
			})
			
			collection[id].closeSelector.click(function (){
				
				hideOverlay(collection[id]);
				
				return false;
			})
			
			
			// ****************************************
			// STORING DATA
			// ****************************************
			// add collection to jQuery data so it can be accessed later
			if ( $("body").data("magazineOverlayCollection") == undefined )
			{
				var magazineOverlayCollection = [];
				magazineOverlayCollection[selector] = collection;
				$("body").data("magazineOverlayCollection", magazineOverlayCollection);
			}
			else
			{
				var magazineOverlayCollection = $("body").data("magazineOverlayCollection");
				magazineOverlayCollection[selector] = collection;
				$("body").data("magazineOverlayCollection", magazineOverlayCollection);
			}
			
			
			elementID++;
		});
		
		function showOverlay (elementObject, fadeSpeed)
		{

			var speed;
			if (fadeSpeed == undefined)
			{
				speed = elementObject.fadeSpeed;
			}
			else
			{
				speed = fadeSpeed;
			}
			elementObject.overlay.fadeIn(speed, function(){
				elementObject.isDialogOpen = true;
			});
		}
		function hideOverlay (elementObject, fadeSpeed)
		{
			var speed;
			if (fadeSpeed == undefined)
			{
				speed = elementObject.fadeSpeed;
			}
			else
			{
				speed = fadeSpeed;
			}
			elementObject.overlay.fadeOut(speed, function(){
				elementObject.isDialogOpen = false;
			});
		}
	};
		
	/**
	 * Creates a video player with each element found
	 * This also means this should be used sparringly
	 *
	 * @param {String}	selector
	 *
	 * @param {Object}	options
	 * 			Options that can be passed to the function
	 * 			Some are required
	 *
	 * 			{Number} videoID (required)
	 * 			The brightcove video id
	 *
	 * 			{Number} width (required)
	 * 			The video width
	 *
	 * 			{Number} height (required)
	 * 			The video height
	 *
	 * 			{Boolean} debug
	 * 			Option to display console logs associated with
	 * 			the plugin. The default value is false
	 *
	 * @function		pauseVideo
	 * 			Pause all videos associated to the selectors
	 * 			instance
	 *
	 * 			e.g
	 *			var video = magazineInteractiveComponents.videoPlayer("#video");
	 *			video.pauseVideo();
	 *
	 * @param {Array}	videoPlayerCollection
	 * notes		retrieved as:
	 * 			$("body").data("videoPlayerCollection");
	 *
	 *			Holds the video collection data that's being
	 *			collected, each key being the jQuery selector.
	 *			Each selector then holds an array of objects
	 *			for the elements found in that selector,
	 *			with each object holding video properties from
	 *			brightcove as well as information from the class
	 *			
	 */
	var videoPlayer = function (selector, options)
	{
		
		var selectorID = 0;
		//var debug = false;
		var height = 240;
		var width = 320;
		var videoID = 0;
		var userPlayerID = "111993198001";
		var userPlayerKey = "AQ~~,AAAAFLXwOAk~,L3ZpIEnPIc14r8SCKtcnekPSXaxbO0dZ";
		var autoPlay = "false";
		var sel = selector;
		
		
		// collection is an array if objects, with each object being
		// created each item in the jQuery array
		// this variable is only used to create the collection
		// the collection is then passed to jQuery data
		// $("body").data("videoPlayerCollection")
		var collection = new Array($(selector).length);
		
		if (options)
		{
			/*if (options.debug)
			{
				if (options.debug == true ) {
					debug = true;
				}
			}*/
			if (options.height)
			{
				if (!isNaN(options.height) )
				{
					height = options.height;
				}
				else
				{
					// debug video player set up //	
					//magazineLoader.magazineDebugLog({"status":"error","namespace":"magazineInteractiveComponents", "functionName":"videoPlayer","msg":selector + " invalid height","lineNumber": new Error().lineNumber});
				}
			}
			else
			{
				// debug video player set up //	
				//magazineLoader.magazineDebugLog({"status":"warning","namespace":"magazineInteractiveComponents", "functionName":"videoPlayer","msg":selector + "no height specified","lineNumber": new Error().lineNumber});
			}
			if (options.width)
			{
				if (!isNaN(options.width) )
				{
					width = options.width;
				}
				else
				{
					// debug video player set up //	
					//magazineLoader.magazineDebugLog({"status":"error","namespace":"magazineInteractiveComponents", "functionName":"videoPlayer","msg":selector + "invalid width","lineNumber": new Error().lineNumber});
				}
			}
			else
			{
				//magazineLoader.magazineDebugLog({"status":"warning","namespace":"magazineInteractiveComponents", "functionName":"videoPlayer","msg":selector + "no width specified","lineNumber": new Error().lineNumber});
			}
			if (options.videoID)
			{
				if ( !isNaN(options.videoID) )
				{
					videoID = options.videoID;
				}
				else
				{
					// debug video player set up //	
					//magazineLoader.magazineDebugLog({"status":"critical error","namespace":"magazineInteractiveComponents", "functionName":"videoPlayer","msg":selector + " invalid videoID","lineNumber": new Error().lineNumber});
				}
			}
			else
			{
				// debug video player set up //	
				//magazineLoader.magazineDebugLog({"status":"critical error","namespace":"magazineInteractiveComponents", "functionName":"videoPlayer","msg":selector + " no videoID specified","lineNumber": new Error().lineNumber});
			}
			if (options.userPlayerID)
			{
				if ( !isNaN(options.userPlayerID) )
				{
					userPlayerID = options.userPlayerID;
				}
				else
				{
					// debug video player set up //	
					//magazineLoader.magazineDebugLog({"status":"critical error","namespace":"magazineInteractiveComponents", "functionName":"videoPlayer","msg":selector + " playerID invalid","lineNumber": new Error().lineNumber});
				}
			}
			else
			{
				// debug video player set up //	
				//magazineLoader.magazineDebugLog({"status":"warning","namespace":"magazineInteractiveComponents", "functionName":"videoPlayer","msg":selector + "no playerID specified, default loaded","lineNumber": new Error().lineNumber});
			}
			
			if (options.userPlayerKey)
			{
				// debug video player set up //	
				userPlayerKey = options.userPlayerKey;
			} 
			else
			{
				// debug video player set up //	
				//magazineLoader.magazineDebugLog({"status":"critical error","namespace":"magazineInteractiveComponents", "functionName":"videoPlayer","msg":selector + " no player key specified","lineNumber": new Error().lineNumber});
			}
			if (options.autoStart) {
				autoStart = true;
			} else {
				autoStart = false;
			}
		}
		
		$(selector).each(function(){
			
			
			// variables
			var id = selectorID;
			
			// selectorFormatted will be the given id for the <object> element
			var selectorFormatted = selector;
			selectorFormatted = selectorFormatted.replace(".","");
			selectorFormatted = selectorFormatted.replace("#","")
			selectorFormatted = selectorFormatted + "_" + id;
			// options
			
			// create an empty object
			collection[id] = [];
			//collection[id].debug = debug;
			collection[id].selector = selector;
			collection[id].selectorFormatted = selectorFormatted;
			collection[id].videoPlayer = {};
			// net-a-porter video player data
			collection[id].playerData = {
				playerID : userPlayerID,
				playerKey : userPlayerKey,
				width : width,
				height : height,
				autoStart: autoStart,
				videoID : videoID
			};
			
			
			// debug init video player //	
			//magazineLoader.magazineDebugLog({"status":"init","namespace":"magazineInteractiveComponents", "functionName":"videoPlayer","msg":"constructor properties","lineNumber": new Error().lineNumber});
			//magazineLoader.magazineDebugObj(collection[id]);
			
			
			// flag to keep track of whether there is a player
			collection[id].isPlayerAdded = false;
			// template for the player object - will populate it with data using markup()
			collection[id].playerTemplate = '<div style=\"display:none\"></div><object id=\"' + selectorFormatted + '"\" class=\"BrightcoveExperience\"><param name=\"bgcolor\" value=\"#000\" /><param name=\"width\" value=\"'+ collection[id].playerData.width + '" /><param name=\"height\" value=\"'+ collection[id].playerData.height + '" /><param name=\"playerID\" value=\"'+ collection[id].playerData.playerID + '" /><param name=\"playerKey\" value=\"'+ collection[id].playerData.playerKey + '" /><param name=\"isVid\" value=\"true\" /><param name=\"isUI\" value=\"true\" /><param name=\"dynamicStreaming\" value=\"true\" /><param name=\"@videoPlayer\" value=\"'+ collection[id].playerData.videoID + '" /><param name=\"templateLoadHandler\" value=\"magazineInteractiveComponents.onTemplateLoaded\" /><param name=\"autoStart\" value=\"'+ collection[id].playerData.autoStart + '" /><param name=\"wmode\" value=\"transparent\"><param name=\"secureConnections\" value=\"true\" /><param name=\"secureHTMLConnections\" value=\"true\" />  </object>';
			collection[id].addPlayer = function () {
				// if we don't already have a player
				if (collection[id].isPlayerAdded == false) {
					collection[id].isPlayerAdded = true;
					var playerHTML = "";
					// smoved into object setter
					//collection[id].playerData.videoID = videoID;
					// populate the player object template
					//playerHTML = collection[id].markup(collection[id].playerTemplate, collection[id].playerData);
					// inject the player code into the DOM
					$(selector).html(collection[id].playerTemplate);
					
					//make sure brightcove scripts are loaded before instatiating the player
					$.when($.getScript("https://sadmin.brightcove.com/js/BrightcoveExperiences.js"), $.getScript("https://sadmin.brightcove.com/js/APIModules_all.js"), $.Deferred(function(deferred) {
                        $(deferred.resolve);
                    })).done(function() {
                    	// instantiate the player
                        brightcove.createExperiences();
                        // Interaction tracking - autoplay
                        if (collection[id].playerData.autoStart) {
                            playVideoTracking(collection[id].playerData.videoID);
                            // debug auto play video  //	
							//magazineLoader.magazineDebugLog({"status":"autoplay","namespace":"magazineInteractiveComponents", "functionName":"videoPlayer","msg":collection[id].selector + " videoID - " +collection[id].playerData.videoID,"lineNumber": new Error().lineNumber});
                        }
                    });
				}
				// user must have requested a different video for player already loaded
				else {
					
					//console.log(collection[id].videoSelect.selectedIndex);
					//collection[id].videoPlayer.loadVideo(collection[id].videoData[collection[id].videoSelect.selectedIndex].videoID);
				}
			};
			// returns the HTML markup to be used for the video player
			// replaces tokens with double squiggly brackets
			collection[id].markup = function (html, data) {
				var m;
				var i = 0;
				var match = html.match(data instanceof Array ? /{{\d+}}/g : /{{\w+}}/g) || [];
				
				while (m = match[i++]) {
					html = html.replace(m, data[m.substr(2, m.length-4)]);
				}
				return html;
			};
			
			// function to remove the player, currently not called
			collection[id].removePlayer = function () {
				// do this only if we have a player
				if(collection[id].isPlayerAdded == true) {
					collection[id].isPlayerAdded = false;
					// unload the player
					collection[id].experienceModule.unload();
					// remove the player code
					$(selector).html("");
				}
			};
			
			
			/*
			 * I don't think this is required anymore, more tests needed'
			// function to generate the video select control, called on page load
			window.onload = function () {
								console.log("playerHTML" + playerHTML);
				console.log("selectorHTML" + selectorHTML);
				var selectorHTML = "";
				//document.getElementById("placeHolder").innerHTML += selectorHTML;
				var oldmarkup = $(selector).html();
				$(selector).html(playerHTML + selectorHTML);

				// save a reference to the select control
				collection[id].videoSelect = selector; // was document.getElementbyId
			} */
			
			// call the addPlayer function to mount the player into the dom
			collection[id].addPlayer();			
			
			
			// add collection to jQuery data so it can be accessed later
			if ( $("body").data("videoPlayerCollection") == undefined )
			{
				var videoPlayerCollection = [];
				videoPlayerCollection[selector] = collection;
				$("body").data("videoPlayerCollection", videoPlayerCollection);
			}
			else
			{
				var videoPlayerCollection = $("body").data("videoPlayerCollection");
				videoPlayerCollection[selector] = collection;
				$("body").data("videoPlayerCollection", videoPlayerCollection);
			}
			
			// increment the id
			selectorID++;
		});
		
		function pauseVideo ()
		{
			var videoCollection = $("body").data("videoPlayerCollection");
			
			var collection = videoCollection[sel];
			for (obj in collection)
			{
				collection[obj].videoPlayer.pause();
				// debug pause video player //	
				//magazineLoader.magazineDebugLog({"status":"pause","namespace":"magazineInteractiveComponents", "functionName":"videoPlayer","msg":collection[id].selector + " videoID - " +collection[id].playerData.videoID,"lineNumber": new Error().lineNumber});
			}
		}

		function playVideo ()
		{
			var videoCollection = $("body").data("videoPlayerCollection");
			var collection = videoCollection[sel];
			for (obj in collection)
			{
				collection[obj].videoPlayer.play();
				// Interaction tracking
				playVideoTracking(collection[obj].playerData.videoID);
				// debug play video player //	
				//magazineLoader.magazineDebugLog({"status":"play","namespace":"magazineInteractiveComponents", "functionName":"videoPlayer","msg":collection[id].selector + " videoID - " +collection[id].playerData.videoID,"lineNumber": new Error().lineNumber});
			}
		}
		// Interaction tracking
		function playVideoTracking (brightcoveID) {
			
		};

		return {
			pauseVideo : pauseVideo,
			playVideo: playVideo
		}


	}
	/**
	 * This is called on brightcoves templateLoadHandler callback
	 * It will retrieve the video, experience module and video player for
	 * the video used in the <object /> markup
	 *
	 * The videoPlayerCollection is then called to update an existing entry
	 * with the brightcove information
	 *
	 * This does not have to be called by the developer
	 */
	function onTemplateLoaded (ID) {
		
		// get a reference to the player
		var player = brightcove.getExperience(ID);
		// get references to the experience and video player modules
		var experienceModule = player.getModule(APIModules.EXPERIENCE);
		var videoPlayer = player.getModule(APIModules.VIDEO_PLAYER);
		var collection = $("body").data("videoPlayerCollection");
		
		for (var obj in collection)
		{
			var selectorCollection = collection[obj];
			for (var selector in selectorCollection)
			{
				if (selectorCollection[selector].selectorFormatted == ID)
				{
					//console.log("found " + ID)
					var matchedCollection = selectorCollection[selector];
					matchedCollection.player = player;
					matchedCollection.experienceModule = experienceModule
					matchedCollection.videoPlayer = videoPlayer
					
				}
			}
		}
	};
	
	return {
		contentRotator : contentRotator,
		productCarousel: productCarousel,
		productOverlay: productOverlay,
		videoPlayer : videoPlayer,
		onTemplateLoaded : onTemplateLoaded
			
	}
}());