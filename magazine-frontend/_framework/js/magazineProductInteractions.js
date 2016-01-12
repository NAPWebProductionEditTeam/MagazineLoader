/**
 * Magazine Product interactions
 * @author Robin Glen (Net-a-porter)
 * This file scrubs the magazine for PIDs, gets product 
 */

var napProductInteractions = (function() {
	// debug loaded namespace //
	magazineLoader.magazineDebugLog({"status":"loaded","namespace":"napProductInteractions"});

	// constants // 
    var FADE_SPEED = 200,
    DIALOG_SELECTOR = ".popupContent",
    CAPTIONS_API = "/webapi/feed/magazinecaption/",
    EXCLUDE_CALL = "?exclude=true",
    STATUS_API,
    REGISTER_INTEREST_URL;

	// varaibles //
    var pids = {},
    mousePosX,
    mousePosY,
    pageWidth,
    pageHeight,

    dialogWidth,
    dialogHeight,
    dialogX,
    dialogY,
    xPos,
    yPos;
	
	// bool to state whether any of the image maps are currently being rolled over
    var rollOverImageMap,
    // the current proect status
    productStatus,

    // bool to state whether fade dialog animation is taking place
    animating;
	
    // set up default translated content
    // if translation is not found this will still work
    var txtGetTheLook = "GET THE LOOK",
    txtShopNow = "SHOP NOW",
    txtComingSoon = "Coming soon",
    txtRegisterInterest = "Register now",
    txtPreposition = "by";
    txtRegisterInterestTitle = "Item Update";
    txtRegisterInterestDesc = "This product is not yet in stock";
	
    // try to throw these functions
	try {
		// grab translated content if available
	    if (NAP.i18n.message("NAP.magazine.productDialog.txtGetTheLook")) {
	    	txtGetTheLook = NAP.i18n.message("NAP.magazine.productDialog.txtGetTheLook");
	    };
		if (NAP.i18n.message("NAP.magazine.productDialog.txtShopNow")) {
	    	txtShopNow = NAP.i18n.message("NAP.magazine.productDialog.txtShopNow");
	    };
		if (NAP.i18n.message("NAP.magazine.productDialog.txtComingSoon")) {
			txtComingSoon = NAP.i18n.message("NAP.magazine.productDialog.txtComingSoon");
		};
		if (NAP.i18n.message("NAP.magazine.productDialog.txtRegisterInterest")) {
			txtRegisterInterest = NAP.i18n.message("NAP.magazine.productDialog.txtRegisterInterest");
		};
		if (NAP.i18n.message("NAP.magazine.productDialog.txtRegisterInterestTitle")) {
			txtRegisterInterestTitle = NAP.i18n.message("NAP.magazine.productDialog.txtRegisterInterestTitle");
		};
		if (NAP.i18n.message("NAP.magazine.productDialog.txtRegisterInterestDesc")) {
			txtRegisterInterestDesc = NAP.i18n.message("NAP.magazine.productDialog.txtRegisterInterestDesc");
		};			
	} catch(err) {
		magazineLoader.magazineDebugLog({"status":"Error","namespace":"napProductInteractions", "functionName":"init","msg":"translation of JavaScript resource bundles failed, used defaults","lineNumber": new Error().lineNumber});
	}

    /**
     * @param {String}  selector
     *                  The HTML id or class selector that will be used to search
     *                  for PID information, this will be the li element of the
     *                  magazine page that needs to be looked up
     *
     * @param {Object}  options
     *                  options you may wish to pass to the function
     *
     *                  {Boolean} debug
     *                  Set to true to display browser console logs associated
     *                  with this script.  The default value is false
     */

    function init(selector, options)   {
        var STATUS_API = "/" + magazineLoader.get_channel() + "/api/feed/searchableproduct/status/",
        REGISTER_INTEREST_URL = "/"+magazineLoader.get_channel()+"/productUpdatesRegistration.nap?productId=";

        // grab page height and width of selects page
        pageWidth = $(selector).width();
        pageHeight = $(selector).height();

		// update mouse movement
		$(document).mousemove(function(e){
	        mousePosX = e.pageX;
	    	mousePosY = e.pageY;
		});
        magazineLoader.magazineDebugLog({"status":"debug","namespace":"napProductInteractions", "functionName":"init","msg":"collect PIDs in image maps","lineNumber": new Error().lineNumber});
        // cycle through each anchor tag to find a href that contains a pid
        $(selector + " [href]").each(function(){
            var This = $(this);
            var href = $(This).attr("href");
            // check if image map contains a link with /product/
            if (href.search("/product/") > -1)
            {
                // store pid//
                var pid = href.split("/product/")[1].split("/")[0].split("?")[0];
                if (pid) {
                     magazineLoader.magazineDebugLog({"status":"request","namespace":"napProductInteractions", "functionName":"init","msg":"Request data for " + pid,"lineNumber": new Error().lineNumber});
                   	 // go and get the magazine caption //
                   	 getProductData(pid, CAPTIONS_API, {
                        onComplete: function(data, textStatus, jqXHR) {
                            var jsonData = $.parseJSON(textStatus.responseText),
                            	modelRollOver;
                            // check for the existance of product information//
                            if (jsonData.magazineCaption) {
                            	magazineLoader.magazineDebugLog({"status":"success","namespace":"napProductInteractions", "functionName":"init","msg":"PID [" + pid + "]: " + jsonData.magazineCaption.caption + " by " + jsonData.magazineCaption.designerName,"lineNumber": new Error().lineNumber});
    						    // inject product and designer into overlay and translate the joining word
    						    // this is done in resource bundle instead of in JS so each language can have it's own order of product and designer
    						    try {
    							    if (NAP.i18n.message("NAP.magazine.productDialog.txtProductBy")) {
    							    	var txtProductBy = NAP.i18n.message("NAP.magazine.productDialog.txtProductBy",[jsonData.magazineCaption.caption,jsonData.magazineCaption.designerName]);
    							    };
    							} catch(err) {
    								var txtProductBy = jsonData.magazineCaption.caption + " " + txtPreposition +  " " + jsonData.magazineCaption.designerName;
    								magazineLoader.magazineDebugLog({"status":"Error","namespace":"napProductInteractions", "functionName":"init","msg":"translation of JavaScript product data resource bundle failed, used defaults","lineNumber": new Error().lineNumber});
    							}

    							 // check to see if the PID is available //
                             	 productAvailability(pid,This, function(productStatus) {
                             	 	// create html for overlay
                             	 	modelRollOver =
                                	'<div id="a" class="popupContent">' +
                                	'<h3>' + txtGetTheLook + '</h3>' +
                                	'<p>' + txtProductBy + '</p>' +
                                	'<h4>' + productStatus + '</h4>' +
                                	'</div>';
                                	initProductCaptions(This,modelRollOver);
                             	 });
                            } else {
                                // Pid not found in magazine captions //
                                magazineLoader.magazineDebugLog({"status":"error","namespace":"napProductInteractions", "functionName":"init","msg":pid + " doesn't exist","lineNumber": new Error().lineNumber});
                                // Current hack, looking up all products even though they are not available to register for //
                                productAvailability(pid,This, function(productStatus) {
    	                             // create html for overlay
    	                            modelRollOver =
    	                            '<div id="a" class="popupContent">' +
    	                            '<h3 class="comingSoon">' + txtRegisterInterest + '</h3>' +
    	                            '</div>'
    	                            initProductCaptions(This,modelRollOver);
                                });
                            }
                           
                        },
                        // magazine caption API has failed //
                        onError: function(jqXHR) {
                        	magazineLoader.magazineDebugLog({"status":"critical error","namespace":"napProductInteractions", "functionName":"init","msg":"Magazine caption request failed on pid:" + pid,"lineNumber": new Error().lineNumber});
      						magazineLoader.magazineDebugObj(jqxhr);
                            (This).css('cursor', 'auto');
                            (This).click(function(){
                                return false;
                            });
                        }
                    });
                } else {
                    (This).css('cursor', 'auto');
                    (This).click(function(){
                        return false;
                    });
                }
            }
        });
		     
		/**
		 * Set up the product caption markup and hover interaction
		 * @namespace napProductInteractions
		 * @class initProductCaptions 
		 * @param {object} 	This
		 * 					The DOM element the pid is on
		 * @param {string} 	modelRollOver
		 * 					The rollover html markup
		 */                
		function initProductCaptions(This,modelRollOver) {
			if (!magazineBrowserDetection.requestMobileDeviceUseage()) {
				productHover(This,modelRollOver);
			};
		}
        
		/**
		 * Check to see if the product is available, if not open register interest
		 * @namespace napProductInteractions
		 * @class productAvailability 
		 * @param {int} pid
		 * The pid that we are going to check the availability on
		 * @param {string} imageMap
		 * The image map the pid is on
		 */       
        function productAvailability(pid,imageMap, setupCaption) {
        	var productStatus =txtShopNow;
        	// go and check the pid availability //
            getProductData(pid, STATUS_API ,{
            	onComplete: function(data, textStatus, jqXHR) {
            			var jsonProductData = $.parseJSON(textStatus.responseText);
            			// check to see if product returns available //
            			if (jsonProductData.productAvailability.status == "AVAILABLE") {
            				magazineLoader.magazineDebugLog({"status":"success","namespace":"napProductInteractions", "functionName":"productAvailability","msg":"PID [" + pid + "]: Product Status AVAILABLE" ,"lineNumber": new Error().lineNumber});
            				// set status for overlay //
            				productStatus = txtShopNow;
            			} else {
            				// set status for overlay //
            				productStatus = txtRegisterInterest;
            				magazineLoader.magazineDebugLog({"status":"error","namespace":"napProductInteractions", "functionName":"productAvailability","msg":"PID [" + pid + "]: Product Status " +  jsonProductData.productAvailability.status,"lineNumber": new Error().lineNumber});
            				var registerInterestPidURL = REGISTER_INTEREST_URL+pid;
            				// check to see if overlayPanel is available //
            				if (typeof NAP.overlayPanel == 'function') {
            					registerInterestPidURL = registerInterestPidURL + "&overlay=true";
            					// create overlay and load on click //
            					$(imageMap).click(function(){
                					NAP.overlayPanel ({
						                title: txtRegisterInterestTitle + ' - <span class="overlay-title-lc">' + txtRegisterInterestDesc + '</span>',
						                message: "<iframe src='"+registerInterestPidURL+"' frameborder='0' id='registration-form' name='registrationFrame' height='500' width='850'></iframe>",
						                type: "info",
						                theme: "light",
						                addClass: 'print-dialog',
						                width: 888,
						                height: 554
						            });
						            return false;
						        });
            				} else {
            					// if overlay function not available send user to page //
	        					$(imageMap).click(function(){
	        						window.location = registerInterestPidURL;
	        					});
            				}
            			}
            			setupCaption(productStatus);
            		},
            	 // pid status API has failed //	
            	onError: function(jqXHR) {
    					magazineLoader.magazineDebugLog({"status":"critical error","namespace":"napProductInteractions", "functionName":"productAvailability","msg":"Product availability request failed on pid:" + pid,"lineNumber": new Error().lineNumber});
						magazineLoader.magazineDebugObj(jqxhr);
						setupCaption("");
   					 }		
            });
           
        }

    
	/**
	 * Set up the hover interaction for products
	 * This is currently not called on mobile devices
	 * @namespace napProductInteractions
	 * @class productHover 
     * @param {string} imageMaps
     * the map the hover should be attached to
     * @param {string} modelRollOver
     * the content roll
	 */
	function productHover(imageMaps,modelRollOver) {
		// roll over event for displaying the data
        $(imageMaps).hover(function() {
            rollOverImageMap = true;
            // stop any existing animation and remove the element
            $(DIALOG_SELECTOR).stop();
            $(DIALOG_SELECTOR).remove();

            // add to the DOM
            $(selector).append(modelRollOver);

            // set the initial position to where the mouse is
            updateProductPopup();

            // fade the dialog in
            animating = true;
            $(DIALOG_SELECTOR).fadeIn(FADE_SPEED, function(){
                animating = false;
            });

            // setup a rollover event for the dialog
            $(DIALOG_SELECTOR).hover(function() {
                // prevent the dialog from fading out
                $(DIALOG_SELECTOR).stop();
            }, function(){
                // conditions before the dialog can be removed
                if (!rollOverImageMap && !animating) {
                    removePopupDialog();
                }
            })
        }, function(){
            rollOverImageMap = false;
            // mouse out
            removePopupDialog()
        })
        // mouse move event
        $(imageMaps).mousemove(function(e){
            //if(debug) console.log("e.pageX " + e.pageX + " e.pageY " + e.pageY);
            updateProductPopup();

        })
	};
	

    /**
     * gets PID data from the NAP API
     */
    function getProductData(pid, apiURL, options) {
        var url;
        url = apiURL + pid + ".json" + EXCLUDE_CALL// real url
        // make the request to the NAP api for the content information
        $.ajax({
            url: url,
            dataType: 'json',
            success: function(data, textStatus, jqXHR) {
                if(options) {
                    (options.onComplete || function(){} ).call(data, textStatus, jqXHR);
                }
            },
            error : function(jqXHR, textStatus, errorThrown) {
                if (options) {
                    (options.onError || function(){} ).call(jqXHR, textStatus, errorThrown);
                }
            }
        });
    }
    /**
     * updates the popup dialog's position based on the latest mouse position within the boundaries of the magazine page
     */
    function updateProductPopup() {
        dialogWidth = $(DIALOG_SELECTOR).width();
        dialogHeight = $(DIALOG_SELECTOR).height();
		xPos = mousePosX +20 - $("#magazineHolder").offset().left;
		yPos = mousePosY +20 - $("#magazineHolder").offset().top;
        // the comparison is to ensure the dialog doesn't breach the boundaries of the magazine page
        dialogX= Math.min(xPos, pageWidth - dialogWidth -20);
        dialogY= Math.min(yPos, pageHeight - dialogHeight -20);
        $(DIALOG_SELECTOR).css({
            left: dialogX,
            top: dialogY
        })
    }
    /**
     * removes the dialog
     */
    function removePopupDialog() {
        $(DIALOG_SELECTOR).fadeOut(FADE_SPEED, function(){
            $(DIALOG_SELECTOR).remove();
        });
    };
    	
    };    
    return {
        init : init,
        pids : pids
    }
}());
