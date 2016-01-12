/**
 * Setup animtion engine for the magazine
 * @author Robin Glen (Net-a-porter)
 * Look after the animation functions, when functions are called and if they are ready to be called
 */


var magazineAnimationEngine = (function() {
	// debug loaded namespace //	
	magazineLoader.magazineDebugLog({"status":"loaded","namespace":"magazineAnimationEngine"});
	
	var magazineControllerVis,
    magazineControllerInterface,
	magazinePage;
	
	
	/**
	 * Prepare animation engine
	 * @namespace magazineAnimationEngine
	 * @class prepareAnimation
 	 * @param {string} pageRequested
 	 * The page that needs to be prepared for animation
	 */
	function prepareAnimation(pageRequested) {
		// check if the magazine engine is available
		if (magazineBrowserDetection.requestEngineAvailability()) {
			magazineAnimationRender.prepareAnimationController(pageRequested);
		} else {
			// debug the animation engine has not been loaded don't call prepare controller //	
			magazineLoader.magazineDebugLog({"status":"warning","namespace":"magazineAnimationEngine", "functionName":"prepareAnimation","msg":(magazineBrowserDetection.requestedEngine()) +" not downloaded, can't prepare animation","lineNumber": new Error().lineNumber});
		};	
	};
	
	/**
	 * play animation engine
	 * @namespace magazineAnimationEngine
	 * @class playAnimation
 	 * @param {string} pageRequested
 	 * The page that needs to play animation
	 */
	function playAnimation(pageRequested) {
		// check if the magazine engine is available
		if (magazineBrowserDetection.requestEngineAvailability()) {
			// check to see if the the animation has been prepared
			if(magazineAnimationRender.prepareAnimationControllerStatus()){
				magazineAnimationRender.applyAnimationController(pageRequested);
			} else {
				// debug the prepare function was never called so play function can't be called this time' //	
				magazineLoader.magazineDebugLog({"status":"warning","namespace":"magazineAnimationEngine", "functionName":"playAnimation","msg":"prepareAnimation() was never called on page" + pageRequested  + ", playAnimation() can't be called'","lineNumber": new Error().lineNumber});
			}
		} else {
			// debug the animation engine has not been loaded don't call play controller //	
			magazineLoader.magazineDebugLog({"status":"warning","namespace":"magazineAnimationEngine", "functionName":"playAnimation","msg":(magazineBrowserDetection.requestedEngine()) +" not downloaded, can't play animation","lineNumber": new Error().lineNumber});
		}	
	};
	
	/**
	 * reset animation engine
	 * @namespace magazineAnimationEngine
	 * @class resetAnimation
 	 * @param {string} pageRequested
 	 * The page that needs to play animation
	 */
	function resetAnimation(pageRequested) {;
		// check if the magazine engine is available
		if (magazineBrowserDetection.requestEngineAvailability()) {
			// check to see if the the animation has been prepared
			if(magazineAnimationRender.prepareAnimationControllerStatus()){
				magazineAnimationRender.removeAnimationController(pageRequested);
			} else {
				// debug the prepare function was never called so reset function can't be called this time' //	
				magazineLoader.magazineDebugLog({"status":"warning","namespace":"magazineAnimationEngine", "functionName":"resetAnimation","msg":"prepareAnimation() was never called on page" + pageRequested  + ", resetAnimation() can't be called'","lineNumber": new Error().lineNumber});
			}
		} else {
			// debug the animation engine has not been loaded don't call reset controller //	
			magazineLoader.magazineDebugLog({"status":"warning","namespace":"magazineAnimationEngine", "functionName":"resetAnimation","msg":(magazineBrowserDetection.requestedEngine()) +" not downloaded, can't reset animation","lineNumber": new Error().lineNumber});
		}
	}; 

	return {
		prepareAnimation: prepareAnimation,
		playAnimation: playAnimation,
		resetAnimation: resetAnimation
	}
}());