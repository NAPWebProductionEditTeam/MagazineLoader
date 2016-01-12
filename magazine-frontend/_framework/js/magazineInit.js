/**
 * Magazine loader.
 * @author Robin Glen (Net-a-porter)
 * The file starts up the net a porter magazine, collection the user data and holding
 * the data in getters and setters.
 *
 */

var magazineLoader = (function() {
	// debug loaded namespace //
	magazineDebugLog({"status":"loaded","namespace":"magazineLoader"});

	var DEFAULT_FRAMEWORK_PATH = "/alfresco/webAssets/magazine/_framework/",
		BASE_LOCATION = "/magazine",
		BASE_FLASH_LOCATION = "/Content/flashMagazine#/",
		FIRST_ISSUE_NUMBER = 166,
		PDF_LOCATION = "/flash/magazine/";

	var jQueryMobileURI,
		issueDate,
		pageNumber,
		issueNumber,
		issueDevice,
		pageTitle,
		pageFeature,
		debugMode,
		channel,
		language,
		assetPath,
		cssAnimationEngine,
		jQueryAnimationEngine,
		javaScriptExtention,
		hashbangstatus,
		jsDownloadCache,
		dynamicSubSetting = false;

	/**
	 * Set up the magazine
	 * @namespace magazineLoader
	 * @class init
     * @param {Object} constructor
     * User selection criteria
	 */
	function init(constructor){
		// set defaults
		var pageNumber = (constructor.pageNumber) ? constructor.pageNumber : 0;
		var constructorDate = (constructor.issueDate) ? constructor.issueDate : new Date();
		var issueNumber = (constructor.issueNumber) ? constructor.issueNumber : 1;
		var device = (constructor.device) ? constructor.device : null;
		var title = (constructor.title) ? constructor.title : "page " + pageNumber;
		var feature = (constructor.feature) ? constructor.feature : null;
		var debug = (constructor.debug) ? constructor.debug : false;
		var channel = (constructor.channel) ? constructor.channel : "intl";
		var path = (constructor.path) ? constructor.path : DEFAULT_FRAMEWORK_PATH;
		var language = (constructor.language) ? constructor.language : "en";

		// set all the user criteria
		set_initialPage(pageNumber);
		set_IssueNumber(issueNumber);
		set_IssueDevice(device);
		set_PageTitle(title);
		set_PageFeature(feature);
		set_debugMode(debug);
		set_channel(channel);
		set_assetPath(path);
		set_IssueDate(constructorDate);
		set_language(language);

		// If the language is not EN check to see if the magazine needs to use the dynamic sub setting tool
		if (get_language() != "en") {
			// check to see if dynamic font subsetting are required in user language
			var monotypeDynamicFontEnabled = checkIfUserRequiresFontDynamicSubSetting(get_language());
			// if enabled refresh fonts and set dynamicSubSettingEnabled to true
			if (monotypeDynamicFontEnabled) {
				// check to see if monotype is available
				try {
					magazineDebugLog({"status":"debug","namespace":"magazineLoader", "functionName":"init","msg":"Dynamic subsetting loaded for " + get_language(),"lineNumber": new Error().lineNumber});
					MonoTypeWebFonts.RefreshFonts();
					dynamicSubSettingEnabled(true);
				} catch (err) {
					magazineDebugLog({"status":"error","namespace":"magazineLoader", "functionName":"init","msg":"Monotype dynamic subsetting JS is missing, fonts can't be loaded","lineNumber": new Error().lineNumber});
					dynamicSubSettingEnabled(false);
				}
			}
		}

		// check is the user can upgrade image expirence
		/* Currently turned off until CMS is cupported */
		checkUserImageExperience();
				
		// if the user is on an iPad scroll the magazine into focus //
		if (navigator.userAgent.indexOf('iPad') != -1) {
			$('html, body').animate({scrollTop: $("#magazineHolder").offset().top}, 500);
		}

		// set debug mode
		if (debug) {
			// add debug class to pages for grid and box reference
			debugContentMode();
			// use minified files on live
			set_javaScriptExtention(".js");
			// don't cache JS in debug mode //
			jsDownloadCache = false;
		} else {
			// use uncompressed files in debug mode
			set_javaScriptExtention(".min.js");
			// cache JS in non-debug mode //
			jsDownloadCache = true;
		};
							
		// Before we try to load the magazine check if the request is a hash bang
		checkForHashBangRequest();
		
		// show the loading bar
		$("#magazineLoader").css({"display":"block"});
					
		// Download brightcove player files, hopefully this will be removed by the new video js player
		// load brightcove scripts in magazineInteractiveLibrary.js to make sure they are loaded before calling brightcove function
		//magazineFileLoader("//sadmin.brightcove.com/js/BrightcoveExperiences.js",false,"magazineLoader" ,"loadBrightcode",function callback(obj) {});
		//magazineFileLoader("//sadmin.brightcove.com/js/APIModules_all.js",false,"magazineLoader" ,"loadBrightcode",function callback(obj) {});
		
		// Animation library is not called here just setting up the file names all in once place
		// css animation file
		cssAnimationEngine = "js/animationLibraries/CSS3-Engine";
		set_cssAnimationEngine(cssAnimationEngine);
		
		// jQuery animation file
		// REMOVE? - no longer supports jquery
		/*
		jQueryAnimationEngine = "js/animationLibraries/jQueryRender";
		set_jQueryAnimationEngine(jQueryAnimationEngine);
		*/
		
		magazineDebugLog({"status":"init","namespace":"magazineLoader", "functionName":"init","msg":"set up magazine","lineNumber": new Error().lineNumber,"lineNumber": new Error().lineNumber});
		// if a dependency fails this will never be loaded - giving the non-js version //
		$(document).ready(function () {
			// start magazine experience //
			magazineBuilder.createMagazine();
            // When on the contents page, change the magazineHolder height if needed.
            if ($('#contents').is(':visible')) {
                var height = $('#contents').height() + 32;
                    height = height < 624 ? 624 : height;
                
                $('#magazineHolder').height(height);
            }
			// animate the loading bar out then display none //
			$("#magazineLoader").animate({
                bottom: "-=36px"
            }, 1e3, function() {
                $("#magazineLoader").css({
                    display: "none"
                })
            })
		});
	};

	/**
	 * A matrix of different languages and what monotype project they should use - currently only supports "zh" but this could expand in the future
	 * @namespace magazineLoader
	 * @class checkIfUserRequiresFontDynamicSubSetting
	 * @param {string} language
     * The language passed to the magazine constructor
	 */
	function checkIfUserRequiresFontDynamicSubSetting (language) {
		switch(language) {
			case "zh":
				return true;
				break;
			default:
				return false;
		};
	};

  	// RETINA IMAGE REPLACEMENT
  	// checking to see if the user has retina display, if they do replace all images with @2x version sorted in a data attribute
	function checkUserImageExperience () {
	    if (hasRetinaDisplay()) {
	    	magazineDebugLog({"status":"debug","namespace":"magazineLoader", "functionName":"hasRetinaDisplay","msg":"User has retina display","lineNumber": new Error().lineNumber});
	    	if(jQuery().updateImageSource) {
	    		magazineDebugLog({"status":"debug","namespace":"magazineLoader", "functionName":"checkUserImageExperience","msg":"Replace images with @2x version","lineNumber": new Error().lineNumber});
		        $("#magazineHolder").updateImageSource({
		            ajaxEnabled: true,
		            ajaxSelector: "#magazinePages"
		        });
	    	}
	    }
	};

	// Function taken from nap mobile to check for retina display
	function hasRetinaDisplay() {
    	// by 'retina display', we mean anything with a pixel ration of greater than 1
    	return 'devicePixelRatio' in window && window.devicePixelRatio > 1;
	};
		
	/**
	 * The init should not come from a hash bang, if it does redirect the URL and start the set up again
	 * @namespace magazineLoader
	 * @class checkForHashBangRequest
	 */
	function checkForHashBangRequest() {
		// check to see if hash bang exists
	    var desiredContent = window.location.hash.substring(1),
	    pageJump,
	    desiredPage,
	    desiredIssue,
	    desiredURL;
	    // load content from hash bang
	    if (desiredContent) {
	    	if (desiredContent.split('/').length < 3) {
	    		desiredIssue = desiredContent.split('/')[1]
	    		set_IssueNumber(desiredIssue);
	    		set_hashBangStatus(true);
	    		magazineRedirect(desiredIssue);
	    	} else {
	    		desiredIssue = desiredContent.split('/')[1];
	    		desiredPage = desiredContent.split('/')[2];
	    		set_hashBangStatus(true);
	    		magazineRedirect(desiredIssue,desiredPage);
	    	}
	    // no hash bang use constructor requested page
	    } else {
	 		desiredIssue = get_IssueNumber();
	    	desiredPage = get_initialPage();
	    	set_hashBangStatus(false);
	    	// debug load content from constructor //
	    	magazineLoader.magazineDebugLog({"status":"Load","namespace":"magazineLoader", "functionName":"checkForHashBangRequest","msg":"no hash bang, load issue " + desiredIssue + " page " + desiredPage,"lineNumber": new Error().lineNumber});
		}
	};
	
	/**
	 * If a hash bang has been passed we need to redirect the users to the correct content.
	 * This currently includes a redirect to the flash magazine if the users select an issue
	 * number lower than FIRST_ISSUE_NUMBER
	 * @namespace magazineLoader
	 * @class magazineRedirect
     * @param {int} issue
     * requested issue
     * @param {int} page
     * requested page
	 */
	function magazineRedirect (issue,page) {
		var desiredPage,
	    desiredIssue,
	    desiredURL,
	    desiredFlashURL;
	    // check if a page has been passed //
		if (page) {
			desiredURL = BASE_LOCATION + "/"  + issue + "/" + page;
	    	desiredFlashURL = BASE_FLASH_LOCATION + issue + "/" + page;
		} else {
			desiredURL = BASE_LOCATION + "/" + issue;
	    	desiredFlashURL = BASE_FLASH_LOCATION + issue + "/contents";
		};
	    /** check to see if the hashbang issue is a HTML request
		 * [This should really be done inside the CMS but as a quick win I can do it here]
		 **/
		if (issue >= FIRST_ISSUE_NUMBER) {
			// goto HTML issue //
	    	magazineLoader.magazineDebugLog({"status":"warning","namespace":"magazineLoader", "functionName":"checkForHashBangRequest","msg":"connection via hash bang, redirect url to " + desiredURL,"lineNumber": new Error().lineNumber});
			window.location = desiredURL;
		} else {
			magazineLoader.magazineDebugLog({"status":"warning","namespace":"magazineLoader", "functionName":"checkForHashBangRequest","msg":"Flash issues no longer available, redirect removed","lineNumber": new Error().lineNumber});
			// The flash magazine is being deleted so there is no need for the old content redirect //
			/*
			magazineLoader.magazineDebugLog({"status":"warning","namespace":"magazineLoader", "functionName":"checkForHashBangRequest","msg":"requested flash magazine content, redirect url to " + desiredFlashURL,"lineNumber": new Error().lineNumber});
			// hack to see if ios device, can't use browser dection framework as it's not yet loaded and went this to be as quick as possible //
			if (navigator.userAgent.indexOf('iPhone') != -1 || navigator.userAgent.indexOf('iPod') != -1 || navigator.userAgent.indexOf('iPad') != -1) {
				window.location = PDF_LOCATION + get_channel() + "/" + "issue_" + issue + "/issue_" + issue + ".pdf";
			} else {
				window.location = desiredFlashURL;
			}
			*/
		};
	}
	
	
	/**
	 * Set up dependency management
	 * @namespace magazineLoader
	 * @class loadJSDependencies
     * @param {array} dependencies
     * all files in init.jsDependencies
     * @param {function} setupMagazine
     * callback fired if all files are downloaded
	 */
	 // REMOVE? - don't think this is needed any more
	function loadJSDependencies(dependencies,setupMagazine) {
		/*
		var loading = 0,
			loaded = 0,
			loadedDependencies = new Array(),
			failedDependencies = new Array(),
			totalDependencies = dependencies.length;
		// loop through all files in the array
		for (loading; loading<totalDependencies; loading++) {
			// set status to loading
			loadedDependencies[loading] ={"file":dependencies[loading].URL, "status":"loading"};
			// send file to be loaded, state where it's located and callback fired on file status as done
			magazineFileLoader(dependencies[loading].URL,dependencies[loading].interalFile,"magazineLoader","loadJSDependencies",function callback(obj) {
				if(obj.status == "done") {
  					// set status to loaded
  					loadedDependencies[loaded] = {"file":obj.script, "status":obj.status};
  					loaded++;
  					// if all files are loaded fire callback to kick off magazineBuilder.createMagazine();
  					if (loaded==totalDependencies) {
  						setupMagazine(loadedDependencies);
  					}
				} else {
					// debug file can't be downloaded //
					magazineDebugLog({"status":"critical error","namespace":"magazineLoader", "functionName":"loadJSDependencies","msg":"the following dependency has failed to load, magazine launched in non-js mode","lineNumber": new Error().lineNumber,"lineNumber": new Error().lineNumber});
					magazineDebugObj(dependencies[loading]);
					failedDependencies[loading] = {"file":obj.script, "status":obj.status};
					
				}
			});
		};
		*/
	};
	
	
	/**
	 * Load javaScript files
	 * @namespace magazineLoader
	 * @class magazineFileLoader
     * @param {string} fileURI
     * Requested file to download
     * @param {boolean} internalFile
     * is the file internal (Inside our webapp)
     * @param {string} namespace
     * The namespace where the file is being requested from (for debugging)
     * @param {string} function
     * The function that is requesting the file (for debugging)
     * @param {function} callback
     * Callback for flag when the request is complete
	 */
	function magazineFileLoader(fileURI,internalFile,namespace,functionName,callback) {
		if (internalFile) {
			if (get_assetPath()) {
				fileURI = get_assetPath() + fileURI + get_javaScriptExtention();
			}
		};
		var fileDownload = $.getScript(fileURI);
			fileDownload.done(function (script, textStatus) {
				// debug file has been successfully downloaded //
				magazineLoader.magazineDebugLog({"status":"success","namespace":namespace,"functionName":functionName, "msg":"'" + fileURI + "'" + " has been downloaded","lineNumber": new Error().lineNumber});
				var obj = {"status":"done","script":fileURI,"textStatus":textStatus};
				callback(obj);
			});
			fileDownload.fail(function (jqxhr) {
				// debug file has not been downloaded //
				magazineLoader.magazineDebugLog({"status":"critical error","namespace":namespace, "functionName":functionName,"msg":"'" + fileURI + "'" + " has failed to download","lineNumber": new Error().lineNumber});
				magazineDebugObj(jqxhr);
				var obj = {"status":"fail",	"script":fileURI,"jqxhr":jqxhr};
				callback(obj);
			});
    };
	
	
	/**
	 * Debug log
	 * @namespace magazineLoader
	 * @class magazineDebugLog
 	 * @param {object} constructor
 	 * Object of details passed through to create a debug message
	 */
    function magazineDebugLog(constructor) {
    	var status = (constructor.status) ? constructor.status : "";
    	var namespace = (constructor.namespace) ? constructor.namespace : "";
    	var functionName = (constructor.functionName) ? constructor.functionName : "";
    	var msg = (constructor.msg) ? constructor.msg : "";
    	var lineNumber = (constructor.lineNumber) ? constructor.lineNumber : "";
        if (get_debugMode()) {
        	if (!functionName =="") {
        		functionName = "." + functionName;
        	}
        	if (status) {
        		status = status.toUpperCase() + " ";
        	}
        	if (!lineNumber =="") {
        		lineNumber = ("(line " + lineNumber + ")");
        	}
        	if (!msg =="") {
        		msg = ": " + msg;
        	}
        	if(console.log) {
            	console.log(status + namespace + functionName +lineNumber + msg);
           }
        }
    };
    /**
	 * Debug log objects
	 * @namespace magazineLoader
	 * @class magazineDebugObj
 	 * @param {object} obj
 	 * To view an object in console.log you must print it alone
	 */
    function magazineDebugObj(obj) {
        if (get_debugMode()) {
        	if(console.log) {
            	console.log(obj);
           }
        }
    };
    
	 /**
	 * Debug mode
	 * @namespace magazineLoader
	 * @class debugContentMode
	 * Add debug class to the page li
	 */
   function debugContentMode() {
        $('#magazinePages li.page').each(function() {
        	$(this).toggleClass("debug");
        });
    };
	

	/**
	 * If set to true the magazine will call a function on an AJAX page request to refresh the Monotype dynamic font subsetting tool
	 * If the magazine is using a hash bang there is no need to update push status
	 * @namespace magazineLoader
	 * @class dynamicSubSettingEnabled
     * @param {boolean} setStatus
	 */
	function dynamicSubSettingEnabled(setStatus) {
		if (!setStatus) {
			return dynamicSubSetting;
		} else {
			dynamicSubSetting = setStatus;
		}
	};

	/**
	 * Converts passed values under 10 to double figures.
	 * @namespace magazineLoader
	 * @class doubleFigureDate
     * @param {Object} value
	 */
	function doubleFigureDate(value){
		 return (value < 10 ? '0' : '') + value;
	};
	
	/**
	 * removes li#page from css selector
	 * @namespace magazineLoader
	 * @class stripPageID
     * @param {string} pageSelector
     * example li#page3
     * @return {string} pageNumber
     * page number without css selector
	 */
	function stripPageID(pageSelector){
		if (pageIndex.search("li#page") > -1) {
			var pageNumber = pageIndex.split('li#page')[1];
			return pageNumber;
		}
	};
	
	/**
	 * adds li#page to page number
	 * @namespace magazineLoader
	 * @class stripPageID
     * @param {string} pageNumber
     * @return {string} pageSelector
     * page number with css selector included
	 */
	function addPageID(pageNumber){
		if (pageNumber) {
			var pageSelector = "li#page" + pageNumber;
			return pageSelector;
		}
	};
		
	/**
	 * set intial page from constructor
	 * @namespace magazineLoader
	 * @class set_initialPage
     * @param {string} setStatus
	 */
	function set_initialPage(setStatus) {
		if (!setStatus) {
			return pageNumber;
		} else {
			switch(setStatus) {
				case "contents":
					pageNumber = 0;
					break;
				case "archive":
					pageNumber = parseInt(magazineBuilder.get_NumberOfPages());
					break;
				default:
					pageNumber = setStatus;
			};
		}
	};
	

	/**
	 * set the version of jQuery mobile
	 * @namespace magazineLoader
	 * @class set_jQueryMobileVersion
     * @param {string} setStatus
	 */
	function set_jQueryMobileVersion(setStatus) {
		if (!setStatus) {
			return jQueryMobileURI;
		} else {
			jQueryMobileURI = setStatus;
		}
	};
	
	/**
	 * set issue date from constructor
	 * @namespace magazineLoader
	 * @class set_IssueDate
     * @param {string} setStatus
	 */
	function set_IssueDate(setStatus) {
		if (!setStatus) {
			return issueDate;
		} else {
			issueDate = setStatus;
		}
	};
	
	/**
	 * set issue number from constructor
	 * @namespace magazineLoader
	 * @class set_IssueNumber
     * @param {string} setStatus
	 */
	function set_IssueNumber(setStatus) {
		if (!setStatus) {
			return issueNumber;
		} else {
			issueNumber = setStatus;
		}
	};

	/**
	 * set issue device
	 * @namespace magazineLoader
	 * @class set_IssueDevice
     * @param {string} setStatus
	 */
	function set_IssueDevice(setStatus) {
		if (!setStatus) {
			return issueDevice;
		} else {
			issueDevice = setStatus;
		}
	};
	
	
	/**
	 * set page title
	 * @namespace magazineLoader
	 * @class set_PageTitle
     * @param {string} setStatus
	 */
	function set_PageTitle(setStatus) {
		if (!setStatus) {
			return pageTitle;
		} else {
			pageTitle = setStatus;
		}
	};
	
	/**
	 * set page feature
	 * @namespace magazineLoader
	 * @class set_PageFeature
     * @param {string} setStatus
	 */
	function set_PageFeature(setStatus) {
		if (!setStatus) {
			return pageFeature;
		} else {
			pageFeature = setStatus;
		}
	};
	
	/**
	 * set debug mode from constructor
	 * @namespace magazineLoader
	 * @class set_PageFeature
     * @param {string} setStatus
	 */
	function set_debugMode(setStatus) {
		if (!setStatus) {
			return debugMode;
		} else {
			debugMode = setStatus;
		}
	};

	/**
	 * set channel from constructor
	 * @namespace magazineLoader
	 * @class set_channel
     * @param {string} setStatus
	 */
	function set_channel(setStatus) {
		if (!setStatus) {
			return channel;
		} else {
			channel = setStatus.toLowerCase();
		}
	};

	/**
	 * set language from constructor
	 * @namespace magazineLoader
	 * @class set_language
     * @param {string} setStatus
	 */
	function set_language(setStatus) {
		if (!setStatus) {
			return language;
		} else {
			language = setStatus.toLowerCase();
		}
	};
	
	
	/**
	 * set asset path from constructor
	 * @namespace magazineLoader
	 * @class set_assetPath
     * @param {string} setStatus
	 */
	function set_assetPath(setStatus) {
		if (!setStatus) {
			return assetPath;
		} else {
			assetPath = setStatus;
		}
	};
	
	/**
	 * set css animation engine
	 * @namespace magazineLoader
	 * @class set_cssAnimationEngine
     * @param {string} setStatus
	 */
	function set_cssAnimationEngine(setStatus) {
		if (!setStatus) {
			return cssAnimationEngine;
		} else {
			cssAnimationEngine = setStatus;
		}
	};
		
	/**
	 * set jQuert animation engine
	 * @namespace magazineLoader
	 * @class set_jQueryAnimationEngine
     * @param {string} setStatus
	 */
	function set_jQueryAnimationEngine(setStatus) {
		if (!setStatus) {
			return jQueryAnimationEngine;
		} else {
			jQueryAnimationEngine = setStatus;
		}
	};
	
	/**
	 * set the extention for javaScript Files
	 * This is used to load minified files on live and uncompressed in debug mode
	 * @namespace magazineLoader
	 * @class set_javaScriptExtention
     * @param {string} setStatus
	 */
	function set_javaScriptExtention(setStatus) {
		if (!setStatus) {
			return javaScriptExtention;
		} else {
			javaScriptExtention = setStatus;
		}
	};

	/**
	 * set the use of hasbang
	 * If the magazine is using a hash bang there is no need to update push status
	 * @namespace magazineLoader
	 * @class set_hashBangStatus
     * @param {boolean} setStatus
	 */
	function set_hashBangStatus(setStatus) {
		if (!setStatus) {
			return hashbangstatus;
		} else {
			hashbangstatus = setStatus;
		}
	};
		
	/**
	 * Get jQuery mobile version
	 * @namespace magazineLoader
	 * @class get_jQueryMobileVersion
	 */
	function get_jQueryMobileVersion() {
		var jQueryMobile = set_jQueryMobileVersion();
		return jQueryMobile;
	};
	
	/**
	 * Get intitial page number.
	 * @namespace magazineLoader
	 * @class get_initialPage
	 */
	function get_initialPage() {
		var pageNumber = set_initialPage();
		return pageNumber;
	};
		
	/**
	 * Get issue date, convert single value dates into double and return date structure for webpage tracking.
	 * @namespace magazineLoader
	 * @class get_IssueDate
	 */
	function get_IssueDate() {
		var collectIssueDate = set_IssueDate();
		var issueYear = collectIssueDate.getFullYear();
		var issueMonth = doubleFigureDate(collectIssueDate.getMonth() +1);
		var issueDay = doubleFigureDate(collectIssueDate.getDate());
		var issueDate = issueDay + issueMonth  + issueYear;
		return issueDate;
	};
	
	/**
	 * Get issue number.
	 * @namespace magazineLoader
	 * @class get_IssueNumber
	 */
	function get_IssueNumber() {
		var issueNumber = set_IssueNumber();
		return issueNumber;
	};
		
	/**
	 * Get issue device for webpage tracking.
	 * @namespace magazineLoader
	 * @class get_IssueDevice
	 */
	function get_IssueDevice() {
		var collectIssueDevice = set_IssueDevice();
		return collectIssueDevice;
	};
			
	/**
	 * Get issue title and return for webpage tracking.
	 * @namespace magazineLoader
	 * @class get_PageTitle
	 * @param {int} pageRequested
	 */
	function get_PageTitle(pageRequested) {
		var collectIssueTitle = set_PageTitle();
		return collectIssueTitle;
	};
	
	/**
	 * Get issue feature and return for webpage tracking.
	 * @namespace magazineLoader
	 * @class get_PageFeature
	 * @param {int} pageRequested
	 */
	function get_PageFeature(pageRequested) {
		var collectPageFeature = set_PageFeature();
		return collectPageFeature;
	};
	
	/**
	 * Turn on and off debug mode
	 * @namespace magazineLoader
	 * @class get_debugMode
	 */
	function get_debugMode() {
		var debugMode = set_debugMode();
		return debugMode;
	};
	
	/**
	 * set up channel used in the ajax request
	 * @namespace magazineLoader
	 * @class get_channel
	 */
	function get_channel() {
		var channel = set_channel();
		return channel;
	};

	/**
	 * get language used to check if font dynamic subsetting is required
	 * @namespace magazineLoader
	 * @class get_language
	 */
	function get_language() {
		var language = set_language();
		return language;
	};
	
	/**
	 * set up path for assets
	 * @namespace magazineLoader
	 * @class get_assetPath
	 */
	function get_assetPath() {
		var assetPath = set_assetPath();
		return assetPath;
	};

	/**
	 * select the css animation engine to load
	 * @namespace magazineLoader
	 * @class get_cssAnimationEngine
	 */
	function get_cssAnimationEngine() {
		var cssAnimationEngine = set_cssAnimationEngine();
		return cssAnimationEngine;
	};

	/**
	 * select the jQuery animation engine to load
	 * @namespace magazineLoader
	 * @class get_jQueryAnimationEngine
	 */
	function get_jQueryAnimationEngine() {
		var jQueryAnimationEngine = set_jQueryAnimationEngine();
		return jQueryAnimationEngine;
	};
	
	/**
	 * select the javascript extention for dependency management
	 * @namespace magazineLoader
	 * @class get_javaScriptExtention
	 */
	function get_javaScriptExtention() {
		var javaScriptExtention = set_javaScriptExtention();
		return javaScriptExtention;
	};
	
	/**
	 * select the the hashbang status
	 * @namespace magazineLoader
	 * @class get_hashBangStatus
	 */
	function get_hashBangStatus() {
		var hashBangStatus = set_hashBangStatus();
		return hashBangStatus;
	};
	
	/**
	 * get base location of the magazine
	 * @namespace magazineLoader
	 * @class get_baseLocation
	 */
	function get_baseLocation() {
		return BASE_LOCATION;
	};
	
	// Return private functions
	return {
		set_PageTitle:set_PageTitle,
		set_PageFeature:set_PageFeature,
		get_initialPage:get_initialPage,
		get_IssueDate:get_IssueDate,
		get_IssueNumber:get_IssueNumber,
		get_PageTitle:get_PageTitle,
		get_PageFeature:get_PageFeature,
		get_IssueDevice:get_IssueDevice,
		get_debugMode: get_debugMode,
		get_channel:get_channel,
		get_language:get_language,
		get_jQueryMobileVersion: get_jQueryMobileVersion,
		get_cssAnimationEngine: get_cssAnimationEngine,
		get_jQueryAnimationEngine: get_jQueryAnimationEngine,
		get_baseLocation: get_baseLocation,
		get_hashBangStatus:get_hashBangStatus,
		init:init,
		magazineDebugLog:magazineDebugLog,
		magazineDebugObj: magazineDebugObj,
		loadJSDependencies: loadJSDependencies,
		magazineFileLoader: magazineFileLoader,
		stripPageID: stripPageID,
		addPageID: addPageID,
		dynamicSubSettingEnabled:dynamicSubSettingEnabled
	}
}());
