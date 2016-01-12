/**
 * Magazine page attachement.
 * @author Robin Glen (Net-a-porter)
 * Keeps track off all the page init, prepares, hook and attach functions.
 */

var magazinePageAttachment = (function() {
	// Hack to stop webkit hidden first page on load return //
	var	currentPage;
	// debug loaded namespace //	
	magazineLoader.magazineDebugLog({"status":"loaded","namespace":"magazinePageAttachment"});
	
	/**
	 * functions are fired as soon page is loaded
	 * @namespace magazinePageAttachment
	 * @class initPage
 	 * @param {string} pageloaded
 	 * Page number passed 
	 */
	function initPage(pageloaded) {		
		// run user page into on the first page loaded
		magazineJavaScriptEngine.dynamicFunctionCall("init",pageloaded);
	};
	
	
	/**
	 * functions are fired when the page is requested 
	 * @namespace magazinePageAttachment
	 * @class preparePage
 	 * @param {string} pagePreparing
 	 * Page number passed from magazineBuilder.beginHiFidelityFeatures()
	 */
	function preparePage(pagePreparing) {
		// debug prepare page //
		 magazineLoader.magazineDebugLog({"status":"prepare","namespace":"magazinePageAttachment", "functionName":"preparePage","msg":"page " + pagePreparing,"lineNumber": new Error().lineNumber});	
		// check if page content is downloaded
		if (magazinePageLoader.pageDownloadCheck(pagePreparing)){
			magazineJavaScriptEngine.dynamicFunctionCall("prepare",pagePreparing);
			magazineAnimationEngine.prepareAnimation(pagePreparing);	
				
		} else {
			// debug page was not downloaded don't run prepare functions //
			magazineLoader.magazineDebugLog({"status":"warning","namespace":"magazinePageAttachment", "functionName":"preparePage","msg":"page " + pagePreparing + " content not ready for prepare","lineNumber": new Error().lineNumber});
		};
	    // show page content //
	    var pagePrepareSelector = magazineLoader.addPageID(pagePreparing);
	    $(pagePrepareSelector + " .magazineContent").css({"visibility":"visible"});
	};
	
	/**
	 * All the functions that are fired when a page has animated into place.   
	 * @namespace magazinePageAttachment
	 * @class pageHookDetection
 	 * @param {Object} pageShowing
 	 * Passed from magazineBuilder.beginHiFidelityFeatures()
	 */
	function pageHookDetection(pageShowing) {
		// debug hook page //
		magazineLoader.magazineDebugLog({"status":"hook","namespace":"magazinePageAttachment", "functionName":"pageHookDetection","msg":"page " + pageShowing,"lineNumber": new Error().lineNumber});
		// check if page content is downloaded
		if (magazinePageLoader.pageDownloadCheck(pageShowing)){
			magazineJavaScriptEngine.dynamicFunctionCall("hook",pageShowing);
			magazineAnimationEngine.playAnimation(pageShowing);
		} else {
			// debug page was not downloaded don't run hook functions //
			magazineLoader.magazineDebugLog({"status":"warning","namespace":"magazinePageAttachment", "functionName":"pageHookDetection","msg":"page " + pageShowing + " content not ready for hook","lineNumber": new Error().lineNumber});
		}
		// these functions are run reguardless of content being downloaded
		magazinePageLoader.ajaxContentRequest(pageShowing);
		magazineBuilder.updateWebPageTitle(pageShowing);
		magazineBuilder.updatePageMetadata(pageShowing);
		magazineTracking.pageLoadTags(pageShowing);
		// IOS devices can't fire pushStatus without an acutal click, for now a hack to stop this from being fired on mobile browsers
		//if (magazineBrowserDetection.requestUsersBrowser()=="iPhone_iPod" || magazineBrowserDetection.requestUsersBrowser()=="iPad"){
			//magazineBuilder.updateHashBang(pageShowing);
		//} else {
			// Don't push history on the first load as history is added by the browser on ariving at the page //
			magazineBuilder.updateHistory(pageShowing);
		//}
	};
	
	/**
	 * All the functions that are fired when a page leaves the screen 
	 * @namespace magazinePageAttachment
	 * @class pageDetachDetection
 	 * @param {Object} pageLeaving
 	 * Passed from magazineBuilder.beginHiFidelityFeatures()
	 */
	function pageDetachDetection(pageLeaving) {
		// debug detach page //
		magazineLoader.magazineDebugLog({"status":"detach","namespace":"magazinePageAttachment", "functionName":"pageDetachDetection","msg":"page " + pageLeaving,"lineNumber": new Error().lineNumber});
		// check if page content is downloaded
		if (magazinePageLoader.pageDownloadCheck(pageLeaving)){
			magazineJavaScriptEngine.dynamicFunctionCall("detach",pageLeaving);
			magazineAnimationEngine.resetAnimation(pageLeaving);
		} else {
			// debug page was not downloaded don't run detach functions //
			magazineLoader.magazineDebugLog({"status":"warning","namespace":"magazinePageAttachment", "functionName":"pageDetachDetection","msg":"page " + pageLeaving + " content not ready for detach","lineNumber": new Error().lineNumber});
		}
		// Check to see if the page your leaving is not the page your own then hide //
	    var pageDetachSelector = magazineLoader.addPageID(pageLeaving);
	    currentPage = magazineBuilder.get_CurrentPageNumber();	   
	    if (currentPage!=pageLeaving) {
	    		// after the time it takes to turn a page hide content //
				setTimeout(function() {
				$(pageDetachSelector + " .magazineContent").css({"visibility":"hidden"});
				},magazineBuilder.get_MagazinePageTransition());
		}
	}; 

	return {
		pageHookDetection:pageHookDetection,
		preparePage:preparePage,
		pageDetachDetection:pageDetachDetection,
		initPage: initPage

	}
}());
