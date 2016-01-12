/**
 * Magazine controller
 * @author Robert Morgan (Net-a-porter)
 * set up the magazine and it's controls'
 */

var magazineBuilder = (function() {
	// debug loaded namespace //
	magazineLoader.magazineDebugLog({"status":"loaded","namespace":"magazineBuilder"});
	
	// global variables
	var BASE_WINDOW_TITLE = " | NET-A-PORTER.COM",
	MAGAZINE_PAGE_TRANSITION = 500,
	CONTENT_PAGE_DIV = "#contents",
	ARCHIVE_PAGE_DIV = "li#archive",
	BASE_HASH_BANG_URL,
	BASE_EMAIL_URL,
	BASE_URL;
	
	// first time magazine is being built //
	set_initialLoad(true);
	
	function cleanBaseURL(locationURL) {
		var magazineBaseURL = magazineLoader.get_baseLocation(),
		CLEAN_BASE_URL;
		// we need to check if the URL already contains issue and page params before running push history //
		if (!magazineLoader.get_hashBangStatus()) {
			if (locationURL.split(magazineBaseURL).length ==1) {
				CLEAN_BASE_URL = locationURL.split(magazineBaseURL)[0] + "/" + magazineLoader.get_IssueNumber() + "/";
			} else {
				if (locationURL.split(magazineBaseURL).length >=1) {
					CLEAN_BASE_URL = locationURL.split(magazineBaseURL)[0] + magazineBaseURL +"/" + magazineLoader.get_IssueNumber() + "/";
				}
			}
		} else {
			CLEAN_BASE_URL = locationURL.split("#")[1];
		};
		return CLEAN_BASE_URL;
	};
		
	var mouseTimer,
	_currentPageIndex,
	_numberOfPages,
	_pageWidth,
	_pageHeight,
	_usingMobileBrowser,
	_ifMouseIsOverControl,
	previousPage,
	transitionAnimationBusy = false,
	gestureAvailability = true,
	pushStatusState,
	initialLoad,
	runPollTimer = false,
	initialHistory = true,
	magazineDirection;
		
	/**
	 * Create magazine
	 * @namespace magazineBuilder
	 * @class createMagazine
	 */
	function createMagazine() {
		var initialPage = magazineLoader.get_initialPage(),
			pageContent = $(magazineLoader.addPageID(initialPage) + " .magazineContent").html();
			pageSelector = magazineLoader.addPageID(initialPage),
			BASE_HASH_BANG_URL = "!/" + magazineLoader.get_IssueNumber() + "/",
			BASE_URL = cleanBaseURL(location.href),
			BASE_EMAIL_URL = getEmailURL();
		
	    // Initial setup
	    $('#magazineHolder #totalIssuePages').width(get_NumberOfPages() * get_PageWidth());
	
	    // Set the page marker
	    $('#magazineHolder #marker #last').text(get_NumberOfPages()-1);
	    updateCurrentPageMarker(get_CurrentPageNumber());
		
		// bind controls
	    bindControls();
	    
	    // hide all content
	    // content will be shown on prepare and hidden on detach to help efficiency
	    // see magazinePageAttachment for more details
	    $(".magazineContent ").css({"visibility":"hidden"});
	    //$(".magazineContent").not("li#page" + magazineLoader.get_initialPage()).css({"visibility":"hidden"});

		// page check
	    //magazinePageLoader.injectContent(pageSelector,pageContent);
	    
	    // run user page init on the first page loaded
		magazinePageAttachment.initPage(initialPage)
	    
	    // set first page
		initialPageSelector(initialPage);
		
		// content scrub it for pids //
		napProductInteractions.init(pageSelector);
		
	};

	/**
	 * bind controls
	 * @namespace magazineBuilder
	 * @class bindControls
	 */
	function bindControls() {
		bindPageControls();
		// add controls for different devices
		if (get_IfUsingMobileBrowser()) {
			// mobile controls
			bindMobileControls();
	    } else {
	    	// desktop controls
			//bindMouse();
			bindKeyControls();
		}
	}
	
	/**
	* Set up default controls
	* @namespace magazineBuilder
	* @class bindPageControls
	*/
	function bindPageControls() {
		// next previous controls
		$('#magazineHolder .next.control').bind('click', goToNextPage);
		$('#magazineHolder .prev.control').bind('click', goToPreviousPage);
		$('#magazineFooter .next.control').bind('click', goToNextPage);
		$('#magazineFooter .prev.control').bind('click', goToPreviousPage);
		$('#magazineFooter #button-content').bind('click', function() {
			loadContentsPage();
			return false;
		});
		$('#magazineFooter #button-archive').bind('click', function() {
		   jumpToPage(get_NumberOfPages());
		   return false;
		});
	};
	
	/**
	 * Set up keyboard controls
	 * @namespace magazineBuilder
	 * @class bindKeyControls
	 */
	function bindKeyControls() {
		$(document).keyup(function(e) {
			var code = (e.keyCode ? e.keyCode : e.which);
			if (code == 37) {
				goToPreviousPage();
			}
			if (code == 39) {
				goToNextPage();
			}
		});
	};
	
	/**
	 * Set up keyboard controls
	 * @namespace magazineBuilder
	 * @class bindKeyControls
	 */

	function bindMobileControls() {
		magazineLoader.magazineDebugLog({"status":"debug","namespace":"magazineBuilder", "functionName":"bindMobileControls","msg":"Bind mobile controls","lineNumber": new Error().lineNumber});
		/* Create new hammer gesture event */
		var touchDeviceGesture = new Hammer(document.getElementById("magazineHolder"), {
			// adjust defaults //
			prevent_default:false,
			swipe_min_distance:100,
			swipe_time:1000
		});
		/* Set up swipe gestures */
		touchDeviceGesture.onswipe = function(e){
				if (e.direction == "left") {
				goToNextPage();
			};
			if (e.direction == "right") {
				goToPreviousPage();
			};
		};
	};
	
	/**
	 * bind mouse movements
	 * @namespace magazineBuilder
	 * @class bindMouse
	 */
	function bindMouse() {
		$(".control").bind('mouseenter', set_MouseIsOverControl);
		$(".control").bind('mouseleave', set_MouseIsNotOverControl);
		
		// trck mouse movements hide arrows after a period of inactivity
	    $(document).bind('mousemove', updateNavControls);
	};
	
	/**
	 * update navigation controls
	 * @namespace magazineBuilder
	 * @class updateNavControls
	 */
	function updateNavControls(){
		// Fading of items after inactivity
			//clearTimeout(mouseTimer);
			if (get_IfCangoToNextPage()) {
				$('.control.next').fadeIn('fast');
			}
			if (get_IfCangoToPreviousPage() || get_IfCanShowContentsPage()) {
				$('.control.prev').fadeIn('fast');
			}
			
			/*
			if (! get_IfMouseIsOverControl()) {
				mouseTimer = setTimeout(function() {
					$('#magazineHolder > .control').fadeOut('slow');
				}, 1000);
			}
			*/
	}
	
	/**
	 * Go to next page
	 * @namespace magazineBuilder
	 * @class goToNextPage
	 */
	function goToNextPage() {
		// if next page is available
	    if (get_IfCangoToNextPage() && transitionAnimationBusy==false) {
			magazineDirection = "next";
			var currentPage = get_CurrentPageNumber();
			set_CurrentPageIndex(get_CurrentPageIndex() + 1);
			stopHiFidelityFeatures(currentPage);
			updateNavControls();
	        transitionPage();
		}
		return false;
	}
	
	/**
	 * Go to previous page
	 * @namespace magazineBuilder
	 * @class goToPreviousPage
	 */
	function goToPreviousPage() {
		// if the previous page is content page
		if ((!get_IfCangoToPreviousPage()) && get_IfCanShowContentsPage() && transitionAnimationBusy==false) {
			magazineDirection = "prev";
			loadContentsPage();
		// if previous page is available
		} else if(get_IfCangoToPreviousPage() && transitionAnimationBusy==false){
			magazineDirection = "prev";
			var previousPage = get_CurrentPageNumber();
			set_CurrentPageIndex(get_CurrentPageIndex() - 1);
			stopHiFidelityFeatures(previousPage);
			updateNavControls();
	        transitionPage();
		}
		return false;
	}
	
	/**
	 * update the control arrows url
	 * @namespace magazineBuilder
	 * @class updateNavHref
	 * @param {string} currentPage
	 *
	 */
	function updateNavHref(currentPage) {
		if (currentPage<=1) {
			var previousPage = "contents";
		} else {
			var previousPage = currentPage -1;
		}
		if (currentPage>=get_NumberOfPages()) {
			var nextPage = currentPage;
		} else {
			var nextPage = currentPage +1;
		}
		var navHrefURL = magazineLoader.get_baseLocation() + magazineLoader.get_IssueNumber() + "/";
		$('.control.next').attr("href", navHrefURL + nextPage);
		$('.control.prev').attr("href", navHrefURL + previousPage);
		
		// is there a base URL - if so update it
		if (BASE_EMAIL_URL) {
			$('#button-share').attr("href", BASE_EMAIL_URL + magazineLoader.get_IssueNumber() + "/" + currentPage);
		}
	};
	
	/**
	 * Grab the URL from the share button and drop the links at the end
	 * @namespace magazineBuilder
	 * @class getEmailURL
	 *
	 */
	function getEmailURL () {
		var url;
		if ($("#button-share").attr("href")) {
			url = $("#button-share").attr("href").split("magazine")[0] + "magazine/";
		} else {
			url = false;
		}
		return url;

	};
	
	
	/**
	 * Load find out what page the magazine should start on
	 * @namespace magazineBuilder
	 * @class initialPageSelector
	 * @param {string} desiredPage
	 *
	 */
	function initialPageSelector(desiredPage)
		{
		if ((desiredPage > get_NumberOfPages()) || (desiredPage < 0 )) {
	    	// debug error loading page //
	    	magazineLoader.magazineDebugLog({"status":"error","namespace":"magazineBuilder", "functionName":"initialPageSelector","msg":"page " + desiredPage + " doesn't exist, loading content page"});
	    	loadContentsPage();
	    } else {
    		// find out which page to jump to
    		switch(desiredPage) {
				// if hash bang says page 0 or contents goto content page
				case 0:
				case "0":
				case "contents":
				case "Contents":
					$('#magazineHolder #contents').removeClass('hidden');
					loadContentsPage(get_initialLoad());
					break;
				// if hash bang says page total pages or archive goto content page
				case get_NumberOfPages():
				case "archive":
				case "Archive":
					$('#magazineHolder #archive').removeClass('hidden');
					pageJump = get_NumberOfPages();
					jumpToPage(pageJump,get_initialLoad());
					break;
				// else try and load the user requested page - user could request page /example potential fix required here
				default:
					$('#magazineHolder #totalIssuePages .page').removeClass('hidden');
					jumpToPage(desiredPage,get_initialLoad());
			}
		}
		// now the first page has been selected set initial load to false //
		set_initialLoad(false);
	};
	
	/**
	 * Load magazine content page
	 * @namespace magazineBuilder
	 * @class loadContentsPage
	 * @param {boolean} initial
	 * if it's the intial load no need to detach
	 */
	function loadContentsPage(initial) {
		// debug set page to content page //
		magazineLoader.magazineDebugLog({"status":"debug","namespace":"magazineBuilder", "functionName":"loadContentsPage","msg":"load contents page"});
		
		var currentPage = get_CurrentPageNumber();
	   	set_CurrentPageNumber(0);

		if (!initial) {
			stopHiFidelityFeatures(currentPage);
		}
	   	
	   	// update the control urls on the content page
	   	updateNavHref(0);
        
        // Change the magazineHolder height if needed.
        var height = $('#contents').height() + 32;
            height = height < 624 ? 624 : height;
        $('#magazineHolder').height(624).animate({height: height}, 'slow');
	   	
	   	// content page transition
	    $('div#contents').fadeIn('slow');
	    $('.control.next').fadeIn('slow');
	    $('.control.prev').fadeOut('slow');
	    
	    // update page marker
	    updateCurrentPageMarker(get_CurrentPageNumber());
	    	    
	    // update title
	    updateWebPageTitle(get_CurrentPageNumber());
	    
	    // does robery
	    beginHiFidelityFeatures(get_CurrentPageNumber());
	};
	
	/**
	 * Update the browser title bar
	 * @namespace magazineBuilder
	 * @class updateWebPageTitle
	 * @param {string} pageShowing
	 */
	function updateWebPageTitle(pageShowing) {
		var pageIndex = "li#page" + (pageShowing),
		pageTitle;
		// check to see which page the user is going to
		switch(pageShowing) {
			case 0:
			case "0":
			case "contents":
			case "Contents":
				pageTitle = collectPageIDTags("window-title",CONTENT_PAGE_DIV, "contents");
				break;
			case get_NumberOfPages():
			case "archive":
			case "Archive":
				pageTitle = collectPageIDTags("window-title",ARCHIVE_PAGE_DIV, "archive");
				break;
			default:
				pageTitle = collectPageIDTags("window-title",pageIndex, "Page " + pageShowing);
		};
		window.document.title = pageTitle + BASE_WINDOW_TITLE;
	};
	
	/**
	 * Update the history, this is the prefered method but if history is not available run updateHashBang()
	 * @namespace magazineBuilder
	 * @class updateHistory
	 * @param {string} pageShowing
	 */
	function updateHistory(pageShowing) {
		if (browserHistoryAvailability()) {
			if (get_PushStatusChecker() != pageShowing) {
				switch(pageShowing) {
					case 0:
					case "0":
					case "contents":
					case "Contents":
						typeOfHistory({"id":"contents"}, "contents", BASE_URL + "contents");
						break;
					case get_NumberOfPages():
					case "archive":
					case "Archive":
						typeOfHistory({"id":magazineLoader.get_IssueNumber()}, "archive", BASE_URL + "archive");
						break;
					default:
						typeOfHistory({"id":pageShowing}, pageShowing, BASE_URL + pageShowing);
				};
			};
		} else {
			pollForHashBangChanges();
			updateHashBang(pageShowing);
		}

		// check to see if browser buttons are fired
		// load the required content from the history status
		window.onpopstate = function(e) {
        	if (browserHistoryAvailability()) {
	        	if (e.state) {
	        		if (e.state.id=="contents") {
	        			set_PushStatusChecker(e.state.id);
	        			loadContentsPage();
	        		} else {
	        			set_PushStatusChecker(e.state.id);
	        			jumpToPage(e.state.id);
	        		}
	        	}
        	};
    	};
	};

	/**
	 * Check to see if this is the first time history is called, if so replace, if not add history
	 * @namespace magazineBuilder
	 * @class typeOfHistory
	 * @param {object} historyID
	 * 					the id of the page in history
	 * @param {string} historyTitle
	 * 					The title of the page
	 * @param {string} historyURL
	 * 					The url of the page
	 */
	function typeOfHistory(historyID, historyTitle, historyURL) {
		if (initialHistory) {
			history.replaceState(historyID,historyTitle,historyURL);
			initialHistory = false;
		} else {
			history.pushState(historyID,historyTitle,historyURL);
		}
	};

	
	/**
	 * Update the browser url with hash bang, designed as a fall back for users who don't have push history or an old IOS device
	 * @namespace magazineBuilder
	 * @class updateHashBang
	 * @param {string} pageShowing
	 */
	function updateHashBang(pageShowing) {
		var pageIndex = "li#page" + (pageShowing);
		switch(pageShowing) {
			case 0:
			case "0":
			case "contents":
			case "Contents":
				pageTitle = "contents";
				window.location.hash = BASE_HASH_BANG_URL + pageTitle;
				break;
			case get_NumberOfPages():
			case "archive":
			case "Archive":
				pageTitle = "archive";
				window.location.hash = BASE_HASH_BANG_URL + pageTitle;
				break;
			default:
				window.location.hash = BASE_HASH_BANG_URL + pageShowing;
		};
	};

	/**
	 * Poll to see if the hash bang has been upadted if it has jump to required page //
	 * @namespace magazineBuilder
	 * @class pollForHashBangChanges
	 */
	function pollForHashBangChanges() {
		if (!runPollTimer) {
			runPollTimer = true;
			setInterval(function(){
				var updatePage = window.location.hash.substring(1);
				if (transitionAnimationBusy==false){
					if (updatePage) {
						if (updatePage.split('/').length >= 3) {
							desiredPage = updatePage.split('/')[2];
							// check if the current page url has the contents or archive link //
							switch(desiredPage) {
								case "contents":
								case "Contents":
									desiredPage = 0;
									break;
								case "archive":
								case "Archive":
									desiredPage = get_NumberOfPages();
									break;
							};
							if (desiredPage !=get_CurrentPageNumber()) {
								initialPageSelector(desiredPage);
							}
						}
					}
				}
			},500);
		}
	};

	/**
	 * A common condition to see if users browser is ok with push history
	 * @namespace magazineBuilder
	 * @class browserHistoryAvailability
	 */
	function browserHistoryAvailability() {
		if (history.pushState && history.replaceState && magazineBrowserDetection.requestPushHistoryAvailability()) {
			return true;
		} else {
			return false;
		}
	};
	
	
	/**
	 * Update the bpage metadata
	 * @namespace magazineBuilder
	 * @class updatePageMetadata
	 * @param {string} pageShowing
	 */
	function updatePageMetadata(pageShowing) {
		var pageIndex = "li#page" + (pageShowing),
		pageTitle;
		switch(pageShowing) {
			case 0:
			case "0":
			case "contents":
			case "Contents":
			pageTitle = collectPageIDTags("page-title",CONTENT_PAGE_DIV, "contents");
			pageFeature= collectPageIDTags("feature-title",CONTENT_PAGE_DIV, "contents page");
			break;
		case get_NumberOfPages():
		case "archive":
		case "Archive":
			pageTitle = collectPageIDTags("page-title",ARCHIVE_PAGE_DIV, "archive");
			pageFeature = collectPageIDTags("feature-title",ARCHIVE_PAGE_DIV, "archive");
			break;
		default:
			pageTitle = collectPageIDTags("page-title",pageIndex, "page " + pageShowing);
			pageFeature= collectPageIDTags("feature-title",pageIndex, "feature");
			
		};
		magazineLoader.set_PageTitle(pageTitle);
		magazineLoader.set_PageFeature(pageFeature);
	};
	
	/**
	 * Collect window title of requested page
	 * @namespace magazineBuilder
	 * @class collectPageIDTags
	 * @param {string} metadataTag
	 * Which id tag to use
	 * @param {string} pageRequested
	 * The page that needs a window title
	 * @param {string} fallback
	 * If the page is not downloaded use a fall back
	 */
	function collectPageIDTags(idTag, pageRequested, fallback) {
		if ($(pageRequested).data(idTag)) {
			return $(pageRequested).data(idTag);
		} else {
			return fallback;
		}
	};
	
	
	/**
	 * Jump to a page in the magazine
	 * @namespace magazineBuilder
	 * @class jumpToPage
	 * @param {string} pageNumber
	 * @param {boolean} initial
	 * if it's the intial load no need to detach
	 */
	function jumpToPage(pageNumber,initial) {
		// debug alert page jump //
		magazineLoader.magazineDebugLog({"status":"debug","namespace":"magazineBuilder", "functionName":"jumpToPage","msg":"jump to page " + pageNumber});
	   	var currentPage = get_CurrentPageNumber();
	   	set_CurrentPageNumber(pageNumber);
	   	if (!initial) {
			stopHiFidelityFeatures(currentPage);
		}
	    updateNavControls();
	    transitionPage();
	    // Check if the jump to page needs to be loaded
	    transitionPage();
	    magazinePageLoader.loadNewPage(pageNumber);
		return false;
	};
	
	/**
	 * fired when a page transition is complete
	 * @namespace magazineBuilder
	 * @class beginHiFidelityFeatures
	 * @param {string} pageNumber
	 */
	function beginHiFidelityFeatures(pageNumber) {
		magazinePageAttachment.pageHookDetection(pageNumber);
	}
		
	/**
	 * start a page animation
	 * @namespace magazineBuilder
	 * @class transitionPage
	 */
	function transitionPage() {
		startTransition();
	    // Animate the movement of the reel
	    var movement = 0 - (get_CurrentPageIndex() * get_PageWidth());
	    $('#magazineHolder #totalIssuePages').animate(
	        {left: movement + 'px'},
			{duration: MAGAZINE_PAGE_TRANSITION, queue: true, complete: endTransition}
	    );
        
        // Reset the magazineHolder height.
        $('#magazineHolder').animate({height: 624}, 'slow');
		
	    // Update the page marker.
	    updateCurrentPageMarker(get_CurrentPageNumber());
		
	    // Contents page allowances
	    $('#magazineHolder #contents').fadeOut('slow');
		
		// Fades out the appropriate navigation arrow on first/last page.
		if (!get_IfCangoToNextPage()) {
			$('.control.next').fadeOut('fast');
			$('.next.navButton.control').fadeOut('fast');
		}
		if (!(get_IfCangoToPreviousPage() || get_IfCanShowContentsPage())) {
			$('.control.prev').fadeOut('fast');
			$('.prev.navButton.control').fadeOut('fast');
		}
		
	};
	
	/**
	 * at the start of a transimtion animation
	 * @namespace magazineBuilder
	 * @class startTransition
	 */
	function startTransition() {
		// when you go next or previous set the previous page number //
		if (magazineDirection=="prev") {
			previousPage = get_CurrentPageNumber()+1;
		} else if (magazineDirection=="next") {
			previousPage = (get_CurrentPageNumber()-1);
		} else {
			previousPage =null;
		}
		// prepare next page for being attached
		magazinePageAttachment.preparePage(get_CurrentPageNumber());
		// set animation on transition to true
		set_transitionAnimationBusy(true);
	};
	
	/**
	 * at the end of a transimtion animation
	 * @namespace magazineBuilder
	 * @class endTransition
	 */
	function endTransition() {
		// set animation on transition to false
		set_transitionAnimationBusy(false);
		// animation is complete
		beginHiFidelityFeatures(get_CurrentPageNumber());
		// when transition ends update nav controls href
		updateNavHref(get_CurrentPageNumber());
	};
	
	/**
	 * set transition animation status
	 * @namespace magazineLoader
	 * @class set_transitionAnimationBusy
     * @param {Boolean} setStatus
	 */
	function set_transitionAnimationBusy(setStatus) {
		transitionAnimationBusy = setStatus;
	};

	
	/**
	 * fired when a page is leaving focus
	 * @namespace magazineBuilder
	 * @class stopHiFidelityFeatures
	 * @param {string} pageNumber
	 */
	function stopHiFidelityFeatures(pageNumber) {
		// page leaving
		magazinePageAttachment.pageDetachDetection(pageNumber);
	}
	
	/**
	 * update page marker
	 * @namespace magazineBuilder
	 * @class updateCurrentPageMarker
	 * @param {string} pageNumber
	 */
	function updateCurrentPageMarker(pageNumber) {
		var pageIndex = "li#page" + (pageNumber);
		switch(pageNumber) {
			// if hash bang says page 0 or contents goto content page //
			case 0:
				$('#magazineFooter #marker #first').hide();
				$('#magazineFooter #marker #divider').hide();
			    $('#magazineFooter #marker #last').hide();
				var requiredPage = collectPageIDTags("page-title",CONTENT_PAGE_DIV, "contents");
				break;
			// if hash bang says page total pages or archive goto content page //
			case get_NumberOfPages():
				$('#magazineFooter #marker #first').hide();
				$('#magazineFooter #marker #divider').hide();
			    $('#magazineFooter #marker #last').hide();
				var requiredPage = collectPageIDTags("page-title",ARCHIVE_PAGE_DIV, "archive");
				break;
			// else try and load the user requested page - user could request page /example potential fix required here //
			default:
				// grab page type
				var pageType = collectPageIDTags("feature-type",pageIndex, "editorial");
				// if type is promo then grab the resource bundle and hide the div and number
				if (pageType=="promo") {
					$('#magazineFooter #marker #first').hide();
					$('#magazineFooter #marker #divider').hide();
			   	 	$('#magazineFooter #marker #last').hide();
					var requiredPage = collectPageIDTags("feature-title",pageIndex, "advertisement");
				} else {
					$('#magazineFooter #marker #first').show();
					$('#magazineFooter #marker #divider').show();
			   		$('#magazineFooter #marker #last').show();
					var requiredPage = pageNumber;
				};

			}
			$('#magazineFooter #marker #current .number').text(requiredPage);
	};

	/**
	 * Protype functions
	 */
	String.prototype.format = function() {
	  var args = arguments;
	  return this.replace(/{(\d+)}/g, function(match, number) {
	    return typeof args[number] != 'undefined'
	      ? args[number]
	      : match
	    ;
	  });
	};
	
	String.prototype.startsWith = function(str) {
		return this.indexOf(str) == 0;
	};
	
	String.prototype.isInt = function() {
	  return ((parseFloat(this) == parseInt(this)) && !isNaN(this))
	};
	
	function isInt(value){
	  return ((parseFloat(value) == parseInt(value)) && !isNaN(value))
	};
	
	/**
	 * set current page
	 * @namespace magazineLoader
	 * @class set_CurrentPageNumber
     * @param {string} pageNumber
	 */
	function set_CurrentPageNumber(pageNumber) {
		set_CurrentPageIndex(pageNumber - 1);
	};
	
	/**
	 * set current page index
	 * @namespace magazineLoader
	 * @class set_CurrentPageNumber
     * @param {string} i
	 */
	function set_CurrentPageIndex(i) {
		_currentPageIndex = i;
	};
	
	/**
	 * set if mouse is over controls
	 * @namespace magazineLoader
	 * @class set_IfMouseIsOverControl
     * @param {Boolean} booleanValue
	 */
	function set_IfMouseIsOverControl(booleanValue) {
		_ifMouseIsOverControl = booleanValue;
	};
	
	/**
	 * Check the value of the push status
	 * @namespace magazineLoader
	 * @class set_PushStatusChecker
     * @param {object} setStatus
	 */
	function set_PushStatusChecker(setStatus) {
		if (!setStatus) {
			return pushStatusState;
		} else {
			pushStatusState = setStatus;
		}
	};

	/**
	 * Set the initial load, some features are
	 * only firsted the first time the magazine loads
	 * @namespace magazineLoader
	 * @class set_initialLoad
     * @param {object} setStatus
	 */
	function set_initialLoad(setStatus) {
		if (setStatus==null) {
			return initialLoad;
		} else {
			initialLoad = setStatus;
		}
	};
		
	/**
	 * set mouse over controls
	 * @namespace magazineLoader
	 * @class set_MouseIsOverControl
	 
	function set_MouseIsOverControl() {
		set_IfMouseIsOverControl(true);
	}
	*/
	/**
	 * set mouse not over controls
	 * @namespace magazineLoader
	 * @class set_MouseIsNotOverControl
	
	function set_MouseIsNotOverControl() {
		set_IfMouseIsOverControl(false);
	}
	 */
	/**
	 * set current page page being displayed.
	 * @namespace magazineLoader
	 * @class get_CurrentPageNumber
	 */
	function get_CurrentPageNumber(){
		return get_CurrentPageIndex() + 1;
	};

	/**
	 * zero-based index value of the currently displayed page.
	 * @namespace magazineLoader
	 * @class get_CurrentPageNumber
	 */
	function get_CurrentPageIndex() {
		if (_currentPageIndex == null) {
			_currentPageIndex = 0;
		}
		return _currentPageIndex;
	};

	/**
	 * get mouse interaction
	 * @namespace magazineLoader
	 * @class get_IfMouseIsOverControl
	 */
	function get_IfMouseIsOverControl() {
		if (_ifMouseIsOverControl == null) {
			// Default to true
			_ifMouseIsOverControl = true;
		}
		return _ifMouseIsOverControl
	};
	
	/**
	 * get number of pages in the issue
	 * @namespace magazineLoader
	 * @class get_NumberOfPages
	 */
	function get_NumberOfPages() {
		if (_numberOfPages == null) {
			_numberOfPages = $('#magazineHolder #totalIssuePages').children('.page').length;
		}
		return _numberOfPages;
	};
	
	/**
	 * get width of the magazine
	 * @namespace magazineLoader
	 * @class get_PageWidth
	 */
	function get_PageWidth() {
		if (_pageWidth == null) {
			_pageWidth = $('#magazineHolder #totalIssuePages').children('.page').first().width();
		}
		return _pageWidth;
	}
	
	/**
	 * get height of the magazine
	 * @namespace magazineLoader
	 * @class get_PageHeight
	 */
	function get_PageHeight() {
		if (_pageHeight == null) {
			_pageHeight = $('#magazineHolder #totalIssuePages').children('.page').first().height();
		}
		return _pageHeight;
	}
	
	/**
	 * get width of the magazine in pixels
	 * @namespace magazineLoader
	 * @class get_PageWidthInPixels
	 */
	function get_PageWidthInPixels() {
		return _pageWidth + 'px';
	};
	
	/**
	 * get if content page is loaded
	 * @namespace magazineLoader
	 * @class get_PageWidthInPixels
	 */
	function get_IfContentsPageIsLoaded() {
		return $('div#contents').length > 0;
	};

	/**
	 * get user is on a mobile device
	 * @namespace magazineLoader
	 * @class get_IfUsingMobileBrowser
	 */
	function get_IfUsingMobileBrowser(){
		if (_usingMobileBrowser == null) {
			_usingMobileBrowser = magazineBrowserDetection.requestMobileDeviceUseage();
		}
		return _usingMobileBrowser;
	};
	
	/**
	 * get can user goto next page
	 * @namespace magazineLoader
	 * @class get_IfCangoToNextPage
	 */
	function get_IfCangoToNextPage() {
		return get_CurrentPageNumber() < get_NumberOfPages();
	};
	/**
	 * get can user goto previous page
	 * @namespace magazineLoader
	 * @class get_IfCangoToPreviousPage
	 */
	function get_IfCangoToPreviousPage() {
		return get_CurrentPageIndex() > 0;
	};
	/**
	 * get can user goto contents page
	 * @namespace magazineLoader
	 * @class get_IfCanShowContentsPage
	 */
	function get_IfCanShowContentsPage() {
		return get_CurrentPageIndex() >= 0;
	};
	/**
	 * get the speed the page turns
	 * @namespace magazineLoader
	 * @class get_MagazinePageTransition
	 */
	function get_MagazinePageTransition() {
		return MAGAZINE_PAGE_TRANSITION;
	};
	
	/**
	 * get the value of the push status
	 * @namespace magazineLoader
	 * @class set_PushStatusChecker
	 */
	function get_PushStatusChecker() {
		var pushStatusStateCheck = set_PushStatusChecker();
		return pushStatusStateCheck;
	};
	
	/**
	 * get initial load status
	 * @namespace magazineLoader
	 * @class get_CurrentPageNumber
	 */
	function get_initialLoad(){
		return set_initialLoad();
	};
	
		
	return {
		createMagazine:createMagazine,
		goToNextPage:goToNextPage,
		goToPreviousPage:goToPreviousPage,
		jumpToPage:jumpToPage,
		get_IfCangoToNextPage: get_IfCangoToNextPage,
		get_IfCangoToPreviousPage: get_IfCangoToPreviousPage,
		updateWebPageTitle: updateWebPageTitle,
		updateHashBang:updateHashBang,
		updateHistory: updateHistory,
		get_CurrentPageNumber: get_CurrentPageNumber,
		updatePageMetadata:updatePageMetadata,
		get_NumberOfPages:get_NumberOfPages,
		get_PageWidth:get_PageWidth,
		get_PageHeight:get_PageHeight,
		get_MagazinePageTransition:get_MagazinePageTransition,
		collectPageIDTags: collectPageIDTags,
		loadContentsPage:loadContentsPage,
		get_initialLoad:get_initialLoad,
		get_IfUsingMobileBrowser: get_IfUsingMobileBrowser
	}
}());
