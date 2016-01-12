
<!--
/*
 * cmdatatagutils.js
 *
 * $Id: cmdatatagutils_5377-6100701-90120679-073008.txt 94315 2008-07-31 19:00:08Z wbird $
 * $Revision: 94315 $
 *
 * Coremetrics Tag v4.0, 4/18/2004
 * COPYRIGHT 1999-2002 COREMETRICS, INC. 
 * ALL RIGHTS RESERVED. U.S.PATENT PENDING
 *
 * The following functions aid in the creation of Coremetrics data tags.
 * 08/14/2012 R.JONES	Added cmSetClientID function
 * 7/22/2008  W.BIRD    Added Conversion and Element Tagging - 5377-6055850
 * 7/30/2008  W.BIRD    Added Explore Attribute tagging - 5377-6100701 

 */

// TAG GENERATING FUNCTIONS ---------------------------------------------------

/*
 * Calling this function points tags to the production database
 */
function cmSetProduction(){
    cmSetClientID("90068619",false,"weathertop.net-a-porter.com","net-a-porter.com");
}

function cmCreateConversionEventTag(eventID, actionType, categoryID, points, convAttr) {
    var cm = new _cm("tid", "14", "vn2", "e4.0");
    cm.cid = eventID;
    cm.cat = actionType;
    cm.ccid = categoryID;
    cm.cpt = points;
    if (convAttr){
        var Attr=convAttr.split("-_-");
        for (i=0;i<Attr.length;i++){
            Attval="c_a"+(i+1);
            cm[Attval]=Attr[i];
        }
    }
    cm.writeImg();
}

function cmCreatePageElementTag(elementID, elementCategory,convAttr) {
    var cm=new _cm("tid", "15", "vn2", "e4.0");

    cm.eid=elementID;
    cm.ecat=elementCategory;
    cm.pflg=0;

    if (convAttr){
        var Attr=convAttr.split("-_-");
        for (i=0;i<Attr.length;i++){
            Attval="e_a"+(i+1);
            cm[Attval]=Attr[i];
        }
    }
    cm.writeImg();

}

function cmCreateManualImpressionTag(pageID, trackSP, trackRE) {
    var cm = new _cm("tid","9","vn2","e4.0");
    cm.pi = pageID;
    cm.cm_sp = trackSP;
    cm.cm_re = trackRE;
    cm.st = cm_ClientTS;
    cm.writeImg();
}

function cmCreateManualLinkClickTag(href,name,pageID) {
    if (cmCreateLinkTag == null && cM != null) {
        var cmCreateLinkTag = cM;
    }
    if (cmCreateLinkTag != null) {
        var dt = new Date();
        cmLnkT3 = dt.getTime();
        cmCreateLinkTag(cm_ClientTS, cmLnkT3, name, href, false, pageID);
    }
}

/* manual PageviewTag for off site page tagging.  Allows client to supply URL and Referring URL
 */
function cmCreateManualPageviewTag(pageID, categoryID,DestinationURL,ReferringURL,searchTerm) {
    var cm = new _cm("tid","1","vn2","e4.0");
    cm.pi = pageID;
    cm.cg = categoryID;
    cm.ul = DestinationURL;
    cm.rf = ReferringURL;
    if (searchTerm) {
        cm.se=searchTerm;
    }
    cm.writeImg();
}


/*
 * Creates a Tech Props tag.
 * pageID		: required. Page ID to set on this Pageview tag
 */
function cmCreateTechPropsTag(pageID, categoryID, convAttr) {

    if(pageID == null) {
        pageID = cmGetDefaultPageID();
    }

    var cm=new _cm("tid", "6", "vn2", "e4.0");
    cm.pc="Y";
    cm.pi = pageID;
    cm.cg = categoryID;

    // if available, override the referrer with the frameset referrer
    if (parent.cm_ref != null) {
        cm.rf = parent.cm_ref;
        parent.cm_ref = document.URL;
    }

    // if parent had mmc variables and this is the first pageview, add mmc to this url
    if(parent.cm_set_mmc) {
        cm.ul = document.location.href +
            ((document.location.href.indexOf("?") < 0) ? "?" : "&") +
            parent.cm_mmc_params;
        parent.cm_ref = cm.ul;
        parent.cm_set_mmc = false;
    }

    if (convAttr){
        var Attr=convAttr.split("-_-");
        for (i=0;i<Attr.length;i++){
            Attval="pv_a"+(i+1);
            cm[Attval]=Attr[i];
        }
    }

    cm.addTP();
    cm.writeImg();

}
/*
 * Creates a Pageview tag with the given Page ID
 *
 * pageID	: required. Page ID to set on this Pageview tag
 * categoryID	: optional. Category ID to set on this Pageview tag
 * searchString	: optional. Internal search string enterred by user to reach
 *				  this page.
 *
 * returns nothing, causes a document.write of an image request for this tag.
 */
function cmCreatePageviewTag(pageID, categoryID, searchString, searchResults, convAttr) {
    if (pageID == null) {
        pageID = cmGetDefaultPageID();
    }

    var cm = new _cm("tid", "1", "vn2", "e4.0");
    cm.pi = pageID;
    if (searchString) {
        cm.se = searchString;
    }
    cm.sr = searchResults;
    if (categoryID) {
        cm.cg = categoryID;
    }

    // if available, override the referrer with the frameset referrer
    if (parent.cm_ref != null) {
        cm.rf = parent.cm_ref;
        parent.cm_ref = document.URL;
    }

    // if parent had mmc variables and this is the first pageview, add mmc to this url
    if(parent.cm_set_mmc) {
        cm.ul = document.location.href +
            ((document.location.href.indexOf("?") < 0) ? "?" : "&") +
            parent.cm_mmc_params;
        parent.cm_ref = cm.ul;
        parent.cm_set_mmc = false;
    }
    if (convAttr){
        var Attr=convAttr.split("-_-");
        for (i=0;i<Attr.length;i++){
            Attval="pv_a"+(i+1);
            cm[Attval]=Attr[i];
        }
    }


    cm.writeImg();
}

/*
 * Creates a Pageview tag with the default value for Page ID.
 * Format of Page ID is "x/y/z/MyPage.asp"
 *
 * returns nothing, causes a document.write of an image request for this tag.
 */
function cmCreateDefaultPageviewTag(categoryID) {
    cmCreatePageviewTag(cmGetDefaultPageID(), categoryID, null);
}

/*
 * Creates a Productview Tag
 * Also creates a Pageview Tag by setting pc="Y"
 * Format of Page ID is "PRODUCT: <Product Name> (<Product ID>)"
 *
 * productID	: required. Product ID to set on this Productview tag
 * productName	: required. Product Name to set on this Productview tag
 * categoryID	: optional. Category ID to set on this Productview tag
 *
 * returns nothing, causes a document.write of an image request for this tag.
 */
function cmCreateProductviewTag(productID, productName, categoryID,convAttr) {
    var cm = new _cm("tid", "5", "vn2", "e4.0");

    if (productName == null) {
        productName = "";
    }

    // if available, override the referrer with the frameset referrer
    if (parent.cm_ref != null) {
        cm.rf = parent.cm_ref;
        parent.cm_ref = document.URL;
    }

    // if parent had mmc variables and this is the first pageview, add mmc to this url
    if(parent.cm_set_mmc) {
        cm.ul = document.location.href +
            ((document.location.href.indexOf("?") < 0) ? "?" : "&") +
            parent.cm_mmc_params;
        parent.cm_ref = cm.ul;
        parent.cm_set_mmc = false;
    }

    cm.pr = productID;
    cm.pm = productName;
    cm.cg = categoryID;

    cm.pc = "Y";
    cm.pi = "PRODUCT: " + productName + " (" + productID + ")";
    if (convAttr){
        var Attr=convAttr.split("-_-");
        var Attval;
        for (i=0;i<Attr.length;i++){
            Attval="pr_a"+(i+1);
            cm[Attval]=Attr[i];
        }
    }


    cm.writeImg();
}

/*
 * Variables and Arrays to support Lineitem Aggregation
 */

var cmShopProducts = new Array();
var cmShopIds = new Array();
var cmShopCats = new Array();
var cmShopQtys = new Array();
var cmShopPrices = new Array();
var cmShopCounter = 0;
var cmShopOrderIds = new Array();
var cmShopCustomerIds = new Array();
var cmShopOrderPrices = new Array();
var cmAttributes=new Array();
var cmShopSKUs = "";

/* Internal, to support aggregation */
function cmGetProductIndex(id,convAttr){
    if (convAttr){
        var Attr=convAttr.split("-_-").toString();
    }
    var cmAttr;
    var i =0;
    for (i=0; i<cmShopCounter; i++)
    {
        if (cmAttributes[i]){cmAttr=cmAttributes[i].toString();}
        if (id==cmShopIds[i] && Attr==cmAttr)
        {
            return i;
        }
    }
    return -1;
}

/*
 * Creates a Shop tag with Action 5 (Shopping Cart)
 *
 * productID	: required. Product ID to set on this Shop tag
 * quantity	: required. Quantity to set on this Shop tag
 * productPrice	: required. Price of one unit of this product
 * categoryID	: optional. Category to set on this Shop tag
 *
 * returns nothing, causes a document.write of an image request for this tag.
 */
function cmCreateShopAction5Tag(productID, productName, productQuantity, productPrice, categoryID, convAttr) {

    productID = productID.toUpperCase();

    var index = cmGetProductIndex(productID,convAttr);
    if(index!=-1){
        var oldPrice = cmShopPrices[index];
        var oldQty = cmShopQtys[index];
        var newQty = oldQty + parseInt(productQuantity);
        var newPrice = (oldPrice*oldQty + parseInt(productQuantity)*parseFloat(productPrice))/(newQty);

        cmShopPrices[index] = newPrice;
        cmShopQtys[index] = newQty;
    } else {
        if (!categoryID) {
            categoryID = "";
        }

        cmShopProducts[cmShopCounter] = productName;
        cmShopIds[cmShopCounter] = productID;
        cmShopCats[cmShopCounter] = categoryID;
        cmShopQtys[cmShopCounter] = parseInt(productQuantity);
        cmShopPrices[cmShopCounter] = parseFloat(productPrice);
        if (convAttr){
            var Attr=convAttr.split("-_-");
            cmAttributes[cmShopCounter]=Attr;
        }
        cmShopCounter++;

    }

    cmShopSKUs = cmGetOSK();

}

/* render the aggregated cart lineitems with Shop 5 tags*/
function cmDisplayShop5s(){
    var i;
    for(i=0; i<cmShopCounter;i++){
        var cm = new _cm("tid", "4", "vn2", "e4.0");
        cm.at = "5";
        cm.pr = cmShopIds[i];
        cm.pm = cmShopProducts[i];
        cm.cg = cmShopCats[i];
        cm.qt = cmShopQtys[i] ;
        cm.bp = cmShopPrices[i];
        if (cmAttributes[i]){
            for (k=0;k<cmAttributes[i].length;k++){
                Attval="s_a"+(k+1);
                cm[Attval]=cmAttributes[i][k];
            }
        }
        cm.sn=(i+1).toString();

        cm.pc = "N";
        cm.writeImg();
    }
    cmShopSKUs = cmGetOSK();

    cmShopCounter=0;
}

/*
 * Creates a Shop tag with Action 9 (Order Receipt / Confirmed)
 *
 * productID	: required. Product ID to set on this Shop tag
 * productName	: required. Product Name to set on this Shop tag
 * quantity	: required. Quantity to set on this Shop tag
 * productPrice	: required. Price of one unit of this product
 * customerID	: required. ID of customer making the purchase
 * orderID	: required. ID of order this lineitem belongs to
 * orderTotal	: required. Total price of order this lineitem belongs to
 * categoryID	: optional. Category to set on this Shop tag
 *
 * returns nothing, causes a document.write of an image request for this tag.
 */
function cmCreateShopAction9Tag(productID, productName, productQuantity,
                                productPrice, customerID, orderID,
                                orderTotal, categoryID, convAttr) {

    productID = productID.toUpperCase();

    var index = cmGetProductIndex(productID);
    if(index!=-1){
        var oldPrice = cmShopPrices[index];
        var oldQty = cmShopQtys[index];
        var newQty = oldQty + parseInt(productQuantity);
        var newPrice = (oldPrice*oldQty + parseInt(productQuantity)*parseFloat(productPrice))/(newQty);

        cmShopPrices[index] = newPrice;
        cmShopQtys[index] = newQty;
    } else {
        if (!categoryID) {
            categoryID = "";
        }
        cmShopProducts[cmShopCounter] = productName;
        cmShopIds[cmShopCounter] = productID;
        cmShopOrderIds[cmShopCounter] = orderID;
        cmShopOrderPrices[cmShopCounter] = orderTotal;
        cmShopCustomerIds[cmShopCounter] = customerID;
        cmShopCats[cmShopCounter] = categoryID;
        cmShopQtys[cmShopCounter] = parseInt(productQuantity);
        cmShopPrices[cmShopCounter] = parseFloat(productPrice);
        cmShopQtys[index] = newQty;
        if (convAttr){
            var Attr=convAttr.split("-_-");
            cmAttributes[cmShopCounter]=Attr;
        }

        cmShopCounter++;
    }
    cmShopSKUs = cmGetOSK();

}


/* render the aggregated order lineitems with Shop 9 tags*/
function cmDisplayShop9s(){
    var i;
    for(i=0; i<cmShopCounter;i++){
        var cm = new _cm("tid", "4", "vn2", "e4.0");
        cm.at = "9";
        cm.pr = cmShopIds[i];
        cm.pm = cmShopProducts[i];
        cm.cg = cmShopCats[i];
        cm.qt = cmShopQtys[i] ;
        cm.bp = cmShopPrices[i];
        cm.cd = cmShopCustomerIds[i];
        cm.on = cmShopOrderIds[i];
        cm.tr = cmShopOrderPrices[i];

        if (cmAttributes[i]){
            for (k=0;k<cmAttributes[i].length;k++){
                Attval="s_a"+(k+1);
                cm[Attval]=cmAttributes[i][k];
            }
        }
        cm.sn=(i+1).toString();

        cm.pc = "N";
        cm.writeImg();

    }
    cmShopSKUs = cmGetOSK();

    cmShopCounter=0;
}

/*
 * Creates an Order tag
 *
 * orderID			: required. Order ID of this order
 * orderTotal		: required. Total of this order (minus tax and shipping)
 * orderShipping	: required. Shipping charge for this order
 * customerID		: required. Customer ID that placed this order
 * customerCity		: optional. City of Customer that placed this order
 * customerState	: optional. State of Customer that placed this order
 * customerZIP		: optional. Zipcode of Customer that placed this order
 * country		: optional. Country of Customer that placed this order
 *
 * returns nothing, causes a document.write of an image request for this tag.
 */
function cmCreateOrderTag(orderID, orderTotal, orderShipping, customerID,
                          customerCity, customerState, customerZIP, country, convAttr) {


    var cm = new _cm("tid", "3", "vn2", "e4.0");
    cm.on = orderID;
    cm.tr = orderTotal;
    cm.osk = cmShopSKUs;
    cm.sg = orderShipping;
    cm.cd = customerID;
    cm.sa = customerState;
    cm.ct = customerCity;
    cm.zp = customerZIP;
    cm.cy = country;
    if (convAttr){
        var Attr=convAttr.split("-_-");
        var Attval;
        for (i=0;i<Attr.length;i++){
            Attval="o_a"+(i+1);
            cm[Attval]=Attr[i];
        }
    }

    cm.writeImg();

}

function cmGetOSK() {
    var i =0;
    var result = "";
    for (i=0; i<cmShopCounter; i++)
    {
        result += "|" + cmShopIds[i] + "|" + cmShopPrices[i] + "|" + cmShopQtys[i] + "|";
    }
    return result;
}

/*
 * Creates a Registration tag and/or a Newsletter tag
 *
 * customerID		: required for Registration. ID of Customer to register.
 * customerEmail	: required for Newsletters. Optional for Registration.
 * customerCity		: optional. City of Customer that placed this order
 * customerState	: optional. State of Customer that placed this order
 * customerZIP		: optional. Zipcode of Customer that placed this order
 * newsletterName	: required for Newsletters. The name of the Newsletter.
 * subscribe		: required for Newsletters. Either "Y" or "N"
 * gender		: optional. Gender of Customer
 * country		: optional. Country of Customer
 * currency		: optional. Country of Customer
 *
 * returns nothing, causes a document.write of an image request for this tag.
 */
function cmCreateRegistrationTag(customerID, customerEmail, customerCity,
                                 customerState, customerZIP, newsletterName,
                                 subscribe, gender, country, currency) {
    var cm = new _cm("tid", "2", "vn2", "e4.0");
    cm.cd = customerID;
    cm.em = customerEmail;
    cm.sa = customerState;
    cm.ct = customerCity;
    cm.zp = customerZIP;
    cm.gd = gender;
    cm.cy = country;
    cm.rg11 = currency;

    if (newsletterName && subscribe) {
        cm.nl = newsletterName;
        cm.sd = subscribe;
    }

    cm.writeImg();
}

/* Creates an Error Tag
 *
 * returns nothing, causes a document.write of an image request for this tag.
 */
function cmCreateErrorTag(pageID, categoryID) {
    var cm=new _cm("tid", "404", "vn2", "e4.0");  //DO NOT CHANGE THESE PARAMETERS

    // get the referrer from the frameset
    if (parent.cm_ref != null) {
        cm.rf = parent.cm_ref;
        parent.cm_ref = document.URL;
    }

    // if parent had mmc variables and this is the first pageview, add mmc to this url
    if(parent.cm_set_mmc) {
        cm.ul = document.location.href +
            ((document.location.href.indexOf("?") < 0) ? "?" : "&") +
            parent.cm_mmc_params;
        parent.cm_ref = cm.ul;
        parent.cm_set_mmc = false;
    }

    cm.pc = "Y";
    if(pageID == null) {
        cm.pi = cmGetDefaultPageID();
    } else {
        cm.pi = pageID;
    }
    cm.cg = categoryID;
    cm.writeImg();
}

// HELPER FUNCTIONS -----------------------------------------------------------
/* These functions are used by the tag-generating functions and/or may be used
 * in in general as convenience functions
 */

/*
 * Creates an acceptable default Page ID value to use for Pageview tags.
 * The default Page ID is based on the URL, and consists of the path and
 * filename (without the protocol, domain and query string).
 *
 * example:
 * returns "x/y/MyPage.asp" for the URL http://www.mysite.com/x/y/MyPage.asp
 */
function cmGetDefaultPageID() {
    var pageName = window.location.pathname;

    // eliminates everything after "?" (for Opera browswers)
    var tempIndex1 = pageName.indexOf("?");
    if (tempIndex1 != -1) {
        pageName = pageName.substr(0, tempIndex1);
    }
    // eliminates everything after "#" (for Opera browswers)
    var tempIndex2 = pageName.indexOf("#");
    if (tempIndex2 != -1) {
        pageName = pageName.substr(0, tempIndex2);
    }
    // eliminates everything after ";"
    var tempIndex3 = pageName.indexOf(";");
    if (tempIndex3 != -1) {
        pageName = pageName.substr(0, tempIndex3);
    }

    var slashPos = pageName.lastIndexOf("/");
    if (slashPos == pageName.length - 1) {
        pageName = pageName + "default.asp"; /****************** SET TO DEFAULT DOC NAME */
    }

    while (pageName.indexOf("/") == 0) {
        pageName = pageName.substr(1,pageName.length);
    }

    return(pageName);
}

if (defaultNormalize == null) { var defaultNormalize = null; }

function myNormalizeURL(url, isHref) {
    var newURL = url;
    if (isHref) {

        var param1startIndex = newURL.indexOf("/cgi-bin/NETAPORTER.filereader?");
        var param2startIndex = newURL.indexOf("/cgi-bin/NETAPORTER.storefront/");

        if (param1startIndex != -1) {

            var tempParam1string = newURL.substring(param1startIndex,newURL.length);
            var beginParam1string = newURL.substring(0,param1startIndex+1);

            var tempParam1array = tempParam1string.split("/");
            var keep1params = new Array();
            for (var s=3; s<tempParam1array.length; s++)	{
                keep1params[keep1params.length] = tempParam1array[s];
            }

            var endParam1string = keep1params.join("/");

            newURL = beginParam1string + endParam1string;

        }


        if (param2startIndex != -1) {

            var tempParam2string = newURL.substring(param2startIndex,newURL.length);
            var beginParam2string = newURL.substring(0,param2startIndex+1);

            var tempParam2array = tempParam2string.split("/");
            var keep2params = new Array();
            for (var s=4; s<tempParam2array.length; s++)	{
                keep2params[keep2params.length] = tempParam2array[s];
            }

            var endParam2string = keep2params.join("/");

            newURL = beginParam2string + endParam2string;

        }

        if (defaultNormalize != null) {
            newURL = defaultNormalize(newURL, isHref);
        }
    }
    return newURL;
}

// install normalization
if (document.cmTagCtl != null) {
    var func = "" + document.cmTagCtl.normalizeURL;
    if (func.indexOf('myNormalizeURL') == -1) {
        defaultNormalize = document.cmTagCtl.normalizeURL;
        document.cmTagCtl.normalizeURL = myNormalizeURL;
    }
}


//-->
