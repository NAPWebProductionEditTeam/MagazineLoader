/**
* Magazine JavaScript sandbox
* @author Robin Glen (Net-a-porter)
* allows custom JS to be fired from the page init, prepare, hook and detach functionality
*/
var magazineJavaScriptEngine = (function() {
    // debug loaded namespace // 
    magazineLoader.magazineDebugLog({
        "status": "loaded",
        "namespace": "magazineJavaScriptEngine"
    });

    // functions must by named page[FunctionType]_identifier EG pageAttach_1 - Case sensitive
    var initRegex = /pageinit_\w*/,
        prepareRegex = /pagePrepare_\w*/,
        attachRegex = /pageAttach_\w*/,
        detachRegex = /pageDetach_\w*/,

        // set up user browser
        userBrowser,
        userMobileDevice;

    /**
     * All the functions that are fired when a page has animated into place. 
     * @namespace magazineJavaScriptEngine
     * @class dynamicFunctionCall
     * @param {string} functionName
     * The type (prepare, attach, detach) of function they want to call
     * @param {string} requestedPage
     * The requested page number they want to fire the function on
     */
    function dynamicFunctionCall(functionName, requestedPage) {
        // if the browser has not been set up call it
        if (!userBrowser) {
            // Users browser is passed to the sandbox incase they want a different function on device
            userBrowser = magazineBrowserDetection.requestUsersBrowser();
        }
        if (!userMobileDevice) {
            // Users browser is passed to the sandbox incase they want a different function on device
            userMobileDevice = magazineBrowserDetection.requestMobileDeviceUseage();
        }
        // only fire on a page number above 0
        if (requestedPage > "0") {
            var requestPageID = "li#page" + (requestedPage) + " ";
            switch (functionName) {
            case "prepare":
                selectedRegex = prepareRegex;
                break;
            case "hook":
                selectedRegex = attachRegex;
                break;
            case "detach":
                selectedRegex = detachRegex;
                break;
            case "init":
                selectedRegex = initRegex;
                break;
            };
            // The JavaScript tag must be inside the magazineContent class
            if ($(requestPageID + " .magazineContent")
                .html()) {
                var javaScriptDiv = $(requestPageID + " .magazineContent")
                    .html();
                try {
                    // grab the name of the required function on the required page
                    var prepareFunction = javaScriptDiv.match(selectedRegex);
                    if (prepareFunction) {
                        if (typeof(window[prepareFunction]) === "function") {
                            /**
                             * Dynamic function 
                             * @namespace magazineJavaScriptEngine
                             * @class window[prepareFunction] - function name collected from page
                             * @param {string} requestPageID
                             * The selector of the page the user is on
                             * @param {string} userBrowser
                             * The requested page number they want to fire the function on
                             * @param {string} userMobileDevice
                             * Is the user device mobile
                             */
                            window[prepareFunction](requestPageID, userBrowser, userMobileDevice);
                            // debug dynamic function found and executed //
                            magazineLoader.magazineDebugLog({
                                "status": "execute",
                                "namespace": "magazineJavaScriptEngine",
                                "functionName": "dynamicFunctionCall",
                                "msg": "function " + prepareFunction + " on " + requestPageID,
                                "lineNumber": new Error()
                                    .lineNumber
                            });
                        };
                    };
                } catch (err) {
                    // debug no dynamic function found on page //
                    magazineLoader.magazineDebugLog({
                        "status": "debug",
                        "namespace": "magazineJavaScriptEngine",
                        "functionName": "dynamicFunctionCall",
                        "msg": "No " + functionName + " on " + requestPageID,
                        "lineNumber": new Error()
                            .lineNumber
                    });
                }
            }
        }
    };
    return {
        dynamicFunctionCall: dynamicFunctionCall
    };
}());