/**
 * Magazine Tracking is used to sending traffic data.
 * @author Robin Glen (Net-a-porter)
 * Load all tracking tags, currently sending messages to coremetrics
 */

var magazineTracking = (function() {
	var globalPageTitle = null;
	// debug loaded namespace //	
	magazineLoader.magazineDebugLog({"status":"loaded","namespace":"magazineTracking"});
	
	function setReportingVariables(pageNumber){
		var napAnalytics = NAP.analytics,

			currentPage = typeof pageNumber != undefined ? pageNumber : magazineBuilder.get_CurrentPageNumber(),
			issueDate = magazineLoader.get_IssueDate(),
			featureTitle = magazineLoader.get_PageTitle(),
			featureType = magazineLoader.get_PageFeature();		
			title = 'ISSUE ' + issueDate + ' - PAGE ' + currentPage + ' - ' + featureTitle + ' - ' + featureType;		

		napAnalytics.setPageName(title);
		napAnalytics.setPageVar('category', 'MAGAZINE');
		napAnalytics.setPageVar('department', issueDate);
		napAnalytics.setPageVar('subsection1', featureType);
		napAnalytics.setPageVar('subsection2', featureTitle + ' - ' + currentPage);
		return title;
	}

	/**
	 * Create Core metric tag from issue date, page number, title and feature. 
	 * @namespace magazineTracking
	 * @class pageLoadTags
 	 * @param {string} pageShowing
 	 * Passed from magazinePageAttachment.pageHookDetection()
	 */
	function pageLoadTags(pageShowing) {
		var fire = true;
		var title = setReportingVariables(pageShowing);
		if(globalPageTitle!=title) { 
			// Don't run coremetric tags in debug mode
			if (!magazineLoader.get_debugMode()) {
				try {
					if (fire) {
						NAP.analytics.trackPageview();
						//cmCreatePageviewTag("Issue "+issueDate +" - Page " + pageShowing + " - " + pageMetaData, "Magazine");
						globalPageTitle = title;
						fire = false
					}
				} catch (err) {
					magazineLoader.magazineDebugLog({"status": "Critical error","namespace": "magazineTracking","functionName": "pageLoadTags","msg":"Tracking tags could not be loaded","lineNumber": new Error().lineNumber});
				}
			}
			magazineLoader.magazineDebugLog({"status":"Tracking",
											 "namespace":"magazineTracking", 
											 "functionName":"pageLoadTags",
											 "msg":title,
											 "lineNumber": new Error().lineNumber});
		}
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
		var pageShowing = magazineBuilder.get_CurrentPageNumber();

		setReportingVariables(pageShowing);

		// Don't run coremetric tags in debug mode
		if (!magazineLoader.get_debugMode()) {
			try {
				NAP.analytics.trackElement("Page " + pageShowing + " - " + elementType +" - " + identifier);
			} catch (err) {
				magazineLoader.magazineDebugLog({"status": "Critical error","namespace": "magazineTracking","functionName": "pageLoadTags","msg":"Tracking tags could not be loaded","lineNumber": new Error().lineNumber});
			}
		}
		magazineLoader.magazineDebugLog({"status":"Tracking",
										 "namespace":"magazineTracking", 
										 "functionName":"pageElementInteraction",
										 "msg":title,
										 "lineNumber": new Error().lineNumber});
	};
	return {
		pageLoadTags: pageLoadTags,
		pageElementInteraction: pageElementInteraction
	}
}());