/**
 * Magazine Tracking is used to sending traffic data.
 * @author Robin Glen (Net-a-porter)
 * Load all tracking tags, currently sending messages to coremetrics
 */

var magazineTracking = (function() {
	// debug loaded namespace //	
	magazineLoader.magazineDebugLog({"status":"loaded","namespace":"magazineTracking"});
	
	/**
	 * Create Core metric tag from issue date, page number, title and feature. 
	 * @namespace magazineTracking
	 * @class pageLoadTags
 	 * @param {string} pageShowing
 	 * Passed from magazinePageAttachment.pageHookDetection()
	 */
	function pageLoadTags(pageShowing) {
		var issueDate = magazineLoader.get_IssueDate(),
		pageTitleMetaData = magazineLoader.get_PageTitle(),
		pageFeatureMetaData = magazineLoader.get_PageFeature(),
		pageMetaData = pageTitleMetaData + "[" + pageFeatureMetaData + "]"
		// Don't run coremetric tags in debug mode
		if (!magazineLoader.get_debugMode()) {
			try {
				cmCreatePageviewTag("Issue "+issueDate +" - Page " + pageShowing + " - " + pageMetaData, "Magazine");
				/* Need to add nap analytics params */
				//NAP.analytics.trackPageview("Issue "+issueDate +" - Page " + pageShowing + " - " + pageMetaData, "Magazine")
			} catch (err) {
				magazineLoader.magazineDebugLog({"status": "Critical error","namespace": "magazineTracking","functionName": "pageLoadTags","msg":"Tracking tags could not be loaded","lineNumber": new Error().lineNumber});
			}
		}
		magazineLoader.magazineDebugLog({"status":"Tracking","namespace":"magazineTracking", "functionName":"pageLoadTags","msg":"Issue "+issueDate +" - Page " + pageShowing + " - " + pageMetaData + ", Magazine","lineNumber": new Error().lineNumber});
	};
	
	
	/**
	 * Create Core metric tag for interactive elements  
	 * @namespace magazineTracking
	 * @class pageElementInteraction
 	 * @param {string} elementType
 	 * The type of interactive element passed from the interaction lib
  	 * @param {string} identifier
 	 * A unique identifer passed from the interaction lib
	 */
	function pageElementInteraction(elementType, identifier) {
		var pageShowing = magazineBuilder.get_CurrentPageNumber()
		// Don't run coremetric tags in debug mode
		if (!magazineLoader.get_debugMode()) {
			try {
				cmCreatePageElementTag("Page " + pageShowing + " - " + elementType +" - [" + identifier +"]","Magazine");
				/* Need to add nap analytics params */
				//NAP.analytics.trackElement("Page " + pageShowing + " - " + elementType +" - [" + identifier +"]","Magazine")
			} catch (err) {
				magazineLoader.magazineDebugLog({"status": "Critical error","namespace": "magazineTracking","functionName": "pageLoadTags","msg":"Tracking tags could not be loaded","lineNumber": new Error().lineNumber});
			}
		}
		magazineLoader.magazineDebugLog({"status":"Tracking","namespace":"magazineTracking", "functionName":"pageElementInteraction","msg":"Page " + pageShowing + " - " + elementType +" - [" + identifier +"]" +", Magazine","lineNumber": new Error().lineNumber});
	};
	return {
		pageLoadTags: pageLoadTags,
		pageElementInteraction: pageElementInteraction
	}
}());