if(typeof NAP==="undefined"){NAP={}
}NAP.multiProductOverlay=function(w){var u=(function(){function J(K){throw new Error(K)
}function i(K){$("#mpo-error-container").html(K)
}return{noItemsSelected:function(){i("Please select some items")
},wishListNotSignedIn:function(){i("You must be signed in to add items to your Wish List")
},productArrayEmpty:function(){J("multiProductOverlay error: Product array is empty")
},noOptionsPassed:function(){J("multiProductOverlay error: configuration object is missing")
},noProductsPassed:function(){J("multiProductOverlay error: product array is missing")
},productsNotInArray:function(){J("multiProductOverlay error: products should be of type Array")
},clearUserAlerts:function(){$("#mpo-error-container").html("")
}}
}());
var a={getSelectedItems:function(){return $(".mpo-select-checkbox:checked")
},getPidFromSku:function(i){return i.split("-")[0]
},getPidFromItemNode:function(i){return i.id.split("_")[1]
},getParentNodeFromPid:function(i){return $("#mpo-item_"+i)
},getParentNodeFromSku:function(i){return $("#mpo-item_"+a.getPidFromSku(i))
},getSkuStockStatus:function(K,J){var i=a.getPidFromItemNode(K);
return $("#mpo-item_"+i).find(".mpo-size-select option[value="+J+"]").attr("class")
},getSelectedSku:function(i){return $("#mpo-item_"+i).find(".mpo-size-select").val()
}};
if(!w){u.noOptionsPassed();
return
}if(!w.products){u.noProductsPassed();
return
}if(typeof w.products!=="object"&&!w.products.length){u.productsNotInArray();
return
}if(w.products.length===0){u.productArrayEmpty();
return
}var A=w.width||604;
var v=(w.addClass)?"mpo-overlay "+w.addClass:"mpo-overlay";
var s=w.imageSize||"s";
var G=w.theme||"dark";
var I=w.title||"";
var o=w.callback||null;
var d=function(){k();
D();
if(w.onReady&&typeof w.onReady==="function"){w.onReady.call()
}};
var e=w.imageCarousel||false;
var l=(channel&&typeof channel!=="undefined")?channel:"intl";
var g=w.products;
var j=[];
var m=0;
var q;
var b="/"+l+"/api/feed/searchableproduct/";
var H="/"+s+".json";
var E="Unfortunately this item has sold out. Add it to your wish list to see if more stock becomes available.";
var f="Unfortunately, this product is no longer available.";
var p="This size has sold out";
var h="Please select a size";
function r(i){if(!q){q=(i.substring(0,1)==="&")?i.substring(0,7):i[0]
}}function n(){var M;
var K;
var J=0;
var N=a.getSelectedItems();
m=0;
if(N.length>0){for(var L=0;
L<N.length;
L++){M=a.getParentNodeFromPid(a.getPidFromItemNode(N[L]));
K=M.find(".mpo-current-price").html();
J=parseFloat(K.substring(1,K.length).replace(/[\.,]/g,""));
m+=J
}}}function c(){var O=a.getSelectedItems();
var N=[];
var J;
var M;
var L;
u.clearUserAlerts();
if(O.length===0){u.noItemsSelected()
}else{$(".mpo-inline-error").remove();
$(".mpo-inline-message").remove();
for(var K=0;
K<O.length;
K++){M=O[K];
L=a.getPidFromItemNode(M);
J=a.getSelectedSku(L);
if(a.getSkuStockStatus(O[K],J)&&a.getSkuStockStatus(M,J)!=="OUT_OF_STOCK"){N.push(J)
}else{if(a.getSkuStockStatus(M,J)&&a.getSkuStockStatus(M,J)==="OUT_OF_STOCK"){$('<div class="mpo-size-sold-out-error mpo-inline-error">'+p+"</div>").insertAfter(a.getParentNodeFromSku(J).find(".mpo-size-select"))
}else{if(!a.getSkuStockStatus(M,J)){$('<div class="mpo-size-not-selected-error mpo-inline-error">'+h+"</div>").insertAfter(a.getParentNodeFromPid(L).find(".mpo-size-select"))
}}}}if(N.length===O.length&&N.length>0){$(".mpo-inline-message").remove();
for(var i=0;
i<N.length;
i++){NAP.basketDelegate.addSkuToBasket(N[i],"API",{async:false,callback:function(P){$('<div class="mpo-added-basket mpo-inline-message">'+P.message+"</div>").insertAfter(a.getParentNodeFromSku(P.sku).find(".mpo-size-select"))
}})
}}}}function z(){var O=a.getSelectedItems();
var N=[];
var J;
var M;
var L;
u.clearUserAlerts();
if(O.length===0){u.noItemsSelected()
}else{$(".mpo-inline-error").remove();
$(".mpo-inline-message").remove();
for(var K=0;
K<O.length;
K++){M=O[K];
L=a.getPidFromItemNode(M);
J=a.getSelectedSku(L);
if(a.getSkuStockStatus(O[K],J)){N.push(J)
}else{if(!a.getSkuStockStatus(M,J)){$('<span class="mpo-size-not-selected-error mpo-inline-error">'+h+"</span>").insertAfter(a.getParentNodeFromPid(L).find(".mpo-size-select"))
}}}if(N.length===O.length&&N.length>0){$(".mpo-inline-message").remove();
for(var i=0;
i<N.length;
i++){$.getJSON("/"+l+"/api/wishlist/addsku/"+N[i]+".json",function(P){if(P.result==="USER_NOT_SIGNED_IN"){u.wishListNotSignedIn()
}else{$('<span class="mpo-added-wishlist mpo-inline-message">'+P.message+"</span>").insertAfter(a.getParentNodeFromSku(P.sku).find(".mpo-size-select"))
}})
}}}}function t(K,M){var i=K.searchableProductInfo;
var O;
function P(){if(K.response==="AVAILABLE"||K.response==="OUT_OF_STOCK"||K.response==="INVISIBLE"){var U=i.sizes;
var R;
var V="";
var T=0;
var Q=['<select class="mpo-size-select">'];
if(U.length>1){Q.push('<option value="">Choose your size</option>')
}for(var S=0;
S<U.length;
S++){R=U[S];
V=(R.stockLevel==="IN_STOCK")?"":(R.stockLevel==="LOW_STOCK")?" - Low stock":" - Out of stock";
if(R.stockLevel==="OUT_OF_STOCK"){T++
}Q.push('<option class="'+R.stockLevel+'" value="'+R.sku+'">'+R.displaySize+V+"</option>")
}Q.push("</select>");
if(K.response==="OUT_OF_STOCK"||T===U.length){Q.push('<div class="mpo-sold-out-message">'+E+"</div>")
}return Q.join("")
}else{return'<span class="mpo-unavailable-message">'+f+"</span>"
}}function N(){switch(K.response){case"AVAILABLE":return'checked="true"';
case"UNAVAILABLE":return'disabled="true"';
case"INVISIBLE":case"OUT_OF_STOCK":default:return""
}}function J(){var R=i.price;
var Q=i.originalPrice;
r(R);
if(i.discounted){return'<span class="mpo-original-price">Was '+Q+'</span>&nbsp;<span class="mpo-sale-price">Now <span class="mpo-current-price">'+R+"</span></span>"
}else{return'<span class="mpo-current-price">'+R+"</span>"
}}function L(){var R=[];
if(e){R.push('<div class="mpo-image-carousel-control mpo-image-carousel-prev" id="mpo-image-carousel-prev_',i.productId,'"><img src="/nap/build/2013.04.04/images/buttons/carousel_prev_on_small.gif" alt="previous" /></div>');
R.push('<div class="mpo-image-carousel-container" id="mpo-image-carousel_',i.productId,'"><ul>');
for(var Q=0;
Q<i.imageUrls.length;
Q++){R.push('<li><img class="mpo-image" src="',i.imageUrls[Q],'" alt="',i.designer," ",i.title,'" /></li>')
}R.push("</ul></div>");
R.push('<div class="mpo-image-carousel-control mpo-image-carousel-next" id="mpo-image-carousel-next_',i.productId,'"><img src="/nap/build/2013.04.04/images/buttons/carousel_next_on_small.gif" alt="next" /></div>')
}else{R=['<img class="mpo-image" src="',i.imageUrls[0],'" alt="',i.designer," ",i.title,'" />']
}return R.join("")
}O=['<div class="mpo-image-container">',L(),"</div>",'<div class="mpo-details-container">','<div class="mpo-select-container">',"<input ",N(),' type="checkbox" class="mpo-select-checkbox" id="mpo-select_',i.productId,'" />&nbsp;','<label class="mpo-select-label mpo-alt-font" for="mpo-select_',i.productId,'">Select Item</label>',"</div>",'<div class="mpo-designer">',i.designer,"</div>",'<div class="mpo-title">',i.title,"</div>",'<div class="mpo-price">',J(),"</div>",'<div class="mpo-view-details"><a class="mpo-alt-font" target="_blank" href="/product/',i.productId,'">View full details</a></div>','<div class="mpo-size">',P(),"</div>","</div>"];
$("#"+M).html(O.join(""));
if(e){$("#mpo-image-carousel_"+i.productId).napCarousel({visible:1,btnPrev:$("#mpo-image-carousel-prev_"+i.productId),btnNext:$("#mpo-image-carousel-next_"+i.productId),circular:true})
}B(false)
}function y(J){var i=b+J+H;
$.getJSON(i,function(K){t(K,"mpo-item_"+J)
})
}function F(i){var J=['<div class="mpo-item-container" id="mpo-item_',i,'">','<div class="mpo-loader-container">','<img class="mpo-loader-image" src="/nap/build/2013.04.04/images/wishlist/ajax-loader-small.gif" />','<div class="mpo-loader-message">Loading product information</div>',"</div>","</div>"];
return J.join("")
}function k(){for(var J=0;
J<g.length;
J++){y(g[J])
}}function B(i){var J=$("#mpo-total-price");
n();
if(i){J.fadeOut(function(){J.html(q+m).fadeIn()
})
}else{J.html(q+m)
}}function D(){$("#mpo-add-bag").bind("click",c);
$("#mpo-add-wishlist").bind("click",z);
$(".mpo-select-checkbox").live("click",function(){B(true)
})
}function x(){NAP.overlayPanel({type:"info",width:A,message:j.join(""),theme:G,addClass:v,title:I,callback:o,onReady:d})
}j.push('<div class="mpo-overlay-contents">');
for(var C=0;
C<g.length;
C++){j.push(F(g[C]))
}j.push('<div id="mpo-error-container"></div>');
j.push(['<div class="mpo-button-container">','<input type="image" border="0" alt="Add to shopping bag" id="mpo-add-bag" class="shoppingbag mpo-button" src="/nap/build/2013.04.04/images/buttons/addtoshoppingbag_long.gif" name="shoppingBag">','<input type="image" border="0" alt="Add to my wish list" id="mpo-add-wishlist" class="wishlist mpo-button" src="/nap/build/2011.12.00/images/buttons/addtowishlist_long.gif" name="wishlist">',"</div>"].join(""));
j.push('<div class="mpo-total-price-container">Total <span id="mpo-total-price"></span></div>');
j.push("</div>");
x();
return{getTotalPrice:function(){return m
}}
};