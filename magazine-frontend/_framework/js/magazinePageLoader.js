/**
 * Magazine page loader
 * @author Robin Glen (Net-a-porter)
 * used to find Alfresco Node ID, request the content and load it into required LI
 */

var magazinePageLoader = (function() {
	// debug loaded namespace //
	magazineLoader.magazineDebugLog({"status":"loaded","namespace":"magazinePageLoader"});
	
	var pageNumber;
	
	
	/**
	 * Check to see if the page has been loaded  
	 * @namespace magazinePageLoader
	 * @class pageHookDetection
 	 * @param {int} pageRequested
 	 * @return {Boolean} 
 	 * Has the page been loaded
	 */	
	function pageDownloadCheck(pageRequested) {

		if (pageRequested == 0) {
			return true
		} else {
			if (pageRequested == magazineBuilder.get_NumberOfPages() || pageRequested == "archive") {
				return true
			} else {
				var pageIndex = "li#page" + (pageRequested);
				if ($(pageIndex).data("status")=="loaded") {

					return true
				} else {
					return false;
				}
			}
		}
	};
	
	/**
	 * Call previous and next pages when available on page hook
	 * @namespace magazinePageLoader
	 * @class ajaxContentRequest
 	 * @param {int} pageRequested
 	 * Passed from magazineBuilder.magazinePageAttachment() the number of the page we need to load
	 */
	function ajaxContentRequest(pageRequested) {
		var nextPage = pageRequested +1;
		var prevPage = pageRequested -1;
		if (magazineBuilder.get_IfCangoToNextPage()) {
			loadNewPage(nextPage);
		};
		if (magazineBuilder.get_IfCangoToPreviousPage()) {
			loadNewPage(prevPage);
		};
	};

	/**
	 * Request a new page to be loaded
	 * @namespace magazinePageLoader
	 * @class loadNewPage
 	 * @param {int} pageRequested
 	 * Padded from ajaxContentRequest()
	 */
	function loadNewPage(pageRequested) {

		var pageIndex = "li#page" + (pageRequested);
		// check to see if a status exists
		if (!$(pageIndex).data("status")) {
			var issueNode = collectIssueNode();
			var pageNode = collectPageNode(pageIndex);
			if (issueNode && pageNode) {
				collectPageContent(pageIndex, pageNode, issueNode);

			} else {
				// debug no node refs on li //
				magazineLoader.magazineDebugLog({"status":"error","namespace":"magazinePageLoader", "functionName":"loadNewPage","msg":pageIndex + " does not contain the required node refs","lineNumber": new Error().lineNumber});
			}
		} else {
			// debug no need to load page //
			magazineLoader.magazineDebugLog({"status":"debug","namespace":"magazinePageLoader", "functionName":"loadNewPage","msg":pageIndex + " has already been loaded","lineNumber": new Error().lineNumber});
		}
		
	};
	
	/**
	 * Grab the node ref for the issue the data-id attribute
	 * @namespace magazinePageLoader
	 * @class collectIssueNode
 	 * @return {string} issueNode
 	 * Alfresco issue version node ref
	 */
	function collectIssueNode() {
		var issueNode = $("#magazineHolder").data("id");
		return 	issueNode;
	};
	
	/**
	 * Grab the node ref for the page from the data-id attribute
	 * @namespace magazinePageLoader
	 * @class collectPageNode
 	 * @param {string} pageIndex
 	 * Passed from pageRequested() the selector of the required page
 	 * @return {string} pageNode
 	 * Alfresco page node
	 */
	function collectPageNode(pageIndex) {
		var pageNode = $(pageIndex).data("id");
		return 	pageNode;
	};
	
	/**
	 * AJAX request to collect the markup from the Alfresco controller
	 * @namespace magazinePageLoader
	 * @class collectPageContent
 	 * @param {string} pageIndex
 	 * Passed from pageRequested() the selector of the required page
 	 * @param {string} pageNode
 	 * Passed from collectPageNode() the page node ref to search for in Alfresco
  	 * @param {string} issueMode
 	 * Passed from collectIssueNode() the issue node ref to search for in Alfresco
	 */
	function collectPageContent(pageIndex, pageNode, issueNode) {
		var EXCLUDE_CALL = "&exclude=true";

		// debug page has been requested //
		magazineLoader.magazineDebugLog({"status":"request","namespace":"magazinePageLoader", "functionName":"collectPageContent","msg":pageIndex + " has been requested","lineNumber": new Error().lineNumber});
		// Currently commented out until ajax request is ready
		
		// set the status to loading
		$(pageIndex).attr('data-status','loading');

		
		// Pass the node to the Alfresco controller
		var pageRequested = $.ajax({
	         url: "/" + magazineLoader.get_channel()  + "/magazineContent.nap?pageID=" + pageNode + "&issueID=" + issueNode + EXCLUDE_CALL,
	         type: "GET",
	         dataType: "html"
         }); 
         
         // On done send the data to be injected
         pageRequested.done(function(pageContent) {
         	// debug page has been found //
         	magazineLoader.magazineDebugLog({"status":"success","namespace":"magazinePageLoader", "functionName":"collectPageContent","msg":pageIndex + " has been downloaded","lineNumber": new Error().lineNumber});
         	magazineLoader.magazineDebugLog({"status":"success","namespace":"magazinePageLoader", "functionName":"collectPageContent","msg":"Alfresco node - "+pageNode,"lineNumber": new Error().lineNumber});
  			setupPageContent(pageIndex,pageContent);
		 });
		
		// For some reason there is a fail store error messages
		pageRequested.fail(function(jqxhr) {
			// debug page can't be found //
			magazineLoader.magazineDebugLog({"status":"critical error","namespace":"magazinePageLoader", "functionName":"collectPageContent","msg":"Request failed on node ref:" + pageNode,"lineNumber": new Error().lineNumber});
  			magazineLoader.magazineDebugObj(jqxhr);
  			setupPageContent(pageIndex,"Page failed to load, please try again later");

		});
       
	};
	
	/**
	 * Setup page content
	 * @namespace magazinePageLoader
	 * @class setupPageContent
 	 * @param {string} pageIndex
 	 * Passed from collectPageContent() the selector of the required page
 	 * @param {string} pageContent
 	 * Passed from collectPageContent() the returned content form Alfresco
	 */
	function setupPageContent(pageIndex, pageContent) {

		// debug content is being injected into the page <li> //
		magazineLoader.magazineDebugLog({"status":"modify","namespace":"magazinePageLoader", "functionName":"collectPageContent","msg":"Page content injected into " + pageIndex,"lineNumber": new Error().lineNumber});
		// set attribute to loaded
		$(pageIndex).attr('data-status','loaded');

		// start injection of content
		injectContent(pageIndex,pageContent);

		// content scrub it for pids // 
		napProductInteractions.init(pageIndex);

		// currently monotype only accepts ids, so I need to split the reference for now
		var pageID = pageIndex.split('li#')[1];
		// if the dynamic subsetting tool is enabled render the fonts for the requested page
		if (magazineLoader.dynamicSubSettingEnabled()) {
			MonoTypeWebFonts.renderPartial(pageID);
		};

	};


	/**
	 * Inject content into selected LI
	 * Also check if there is javascript inside the code, if there is inject it differently
	 * @namespace magazinePageLoader
	 * @class setupPageContent
 	 * @param {string} pageIndex
 	 * Passed from collectPageContent() the selector of the required page
 	 * @param {string} pageContent
 	 * Passed from collectPageContent() the returned content form Alfresco
	 */
	function injectContent(pageIndex, pageContent) {		
		// collect the page type
		var pageType = magazineBuilder.collectPageIDTags("feature-type",pageIndex, "editorial");
		switch(pageType) {	
			// Check to see if the type of content is editorial - only editorial uses the javascript engine 
			case "editorial":
				var scriptTag = '<' + '/script>';
				var contentStart = pageContent.split('<script type="text/javascript">');
				// check to see if there is javascript in the returned content
				if (contentStart[1]) {
					var javaScriptStart = contentStart[1].split(scriptTag),
						contentEnd = javaScriptStart[1],
						 // content before js
					 	contentBlock = contentStart[0],
					 	// js functions
					 	javaScriptBlock = javaScriptStart[0],
					 	// content after html
					 	contentBlockClose = contentEnd;
					
					// inject standard content without javascript
					$(pageIndex + " .magazineContent").html(contentBlock + contentBlockClose);
					
					 // Create Javascript element
					var newScript   = document.createElement("script");
					newScript.type  = "text/javascript";
					newScript.text  =  javaScriptBlock;
					var pageSetUp = $(pageIndex +" .magazineContent").get(0);
					pageSetUp.appendChild(newScript);
		
					// run init function on new javascript
					pageNumber = pageIndex.split('li#page')[1];
					magazinePageAttachment.initPage(pageNumber);
				} else {
					// no javascript so just inject content
					$(pageIndex + " .magazineContent").html(pageContent);
				};
			break;
			// by default just copy the code in directly
			default:
				$(pageIndex + " .magazineContent").html(pageContent);
			break;
		};
		
	};
		
	return {
		ajaxContentRequest: ajaxContentRequest,
		pageDownloadCheck: pageDownloadCheck,
		loadNewPage:loadNewPage,
		injectContent:injectContent
	
	}
}());