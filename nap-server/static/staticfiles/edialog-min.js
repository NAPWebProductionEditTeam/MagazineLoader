function getCookie(a){if(document.cookie.length>0){c_start=document.cookie.indexOf(a+"=");
if(c_start!=-1){c_start=c_start+a.length+1;
c_end=document.cookie.indexOf(";",c_start);
if(c_end==-1){c_end=document.cookie.length
}return unescape(document.cookie.substring(c_start,c_end))
}}return""
}var locale_channel=getCookie("channel"),overlay="&amp;overlay=true";
function designerEmailUpdate(a,b){b=b||{};
b.url=b.url||"/"+locale_channel+"/designerUpdatesRegistration.nap?designerKey="+a+overlay;
NAP.overlayPanel({title:NAP.i18n.message("copy.register.designerUpdatesHeader"),message:"<iframe src='"+b.url+"' frameborder='0' id='registration-form' name='registrationFrame' width='850'></iframe>",type:"info",theme:"light",addClass:"print-dialog",width:888,height:654})
}function registerAndMoveFromBasketToWishlist(a,b){b=b||{};
b.url=b.url||"/"+locale_channel+"/registerbaskettowishlist.nap?productid="+a+overlay;
NAP.overlayPanel({title:NAP.i18n.message("shopping.basket.overlay.title"),message:"<iframe src='"+b.url+"' frameborder='0' id='registration-form' name='registrationFrame' height='480' width='850'></iframe>",type:"info",theme:"light",addClass:"print-dialog",width:888,height:554})
}function itemEmailUpdate(b,d){d=d||{};
d.url=d.url||"/"+locale_channel+"/productUpdatesRegistration.nap?productId="+b+overlay;
d.status=d.status||"";
d.overlay=d.overlay||"yes";
var c="_"+b,a=(product.length==0||typeof product=="undefined")?d.status:product[c].status;
if(a==0||a=="UNAVAILABLE"){if(d.overlay=="yes"){NAP.overlayPanel({title:NAP.i18n.message("NAP.popup.itemUpdate")+" - <span class='overlay-title-lc'>"+NAP.i18n.message("NAP.popup.itemStock")+"</span>",message:"<iframe src='"+d.url+"' frameborder='0' id='registration-form' name='registrationFrame' height='480' width='850'></iframe>",type:"info",theme:"light",addClass:"print-dialog",width:888,height:554})
}else{window.open(d.url,"_blank")
}}else{window.location.href="/"+locale_channel+"/product/"+b
}};