if(typeof NAP=="undefined"){var NAP={}
}NAP.overlayPanel=function(h){var i=h.confirmText||NAP.i18n.message("copy.dialog.button.confirm")||"OK",g=h.cancelText||NAP.i18n.message("copy.dialog.button.cancel")||"Cancel",k=(h.height)?"height:"+h.height+"px;":"",n=(h.width)?"width:"+h.width+"px;":"width:180px;",r=(h.theme.toLowerCase()=="light")?"#FFF":"#000",o=(navigator.appName.indexOf("Microsoft")!=-1)?21:0,f=$(document).height(),u=$(document).width(),s=h.modal||false,t=h.overlayOpacity||false,l=h.removeClose||false,c=NAP.i18n.message("jquery.nap.overlay.close"),a=(s)?"":((l)?"":'<div id="lightbox-close" title="'+c+'">'+c+"</div>"),m=['<div id="overlay-mask" style="height:',f,"px; width:",u,"px; position:fixed; top:0; left:0; background-color:",r,'; opacity:0; filter:alpha(opacity=0); z-index:999999;">&nbsp;</div>'].join(""),e=h.verticalButtons||false,q=((h.type=="confirm")&&e)?['<p><input type="button" id="overlay-confirm-button" class="secondary-button lightbox-yes" value="',i,'" /></p><p><input type="button" value="',g,'" id="overlay-cancel-button" class="secondary-button lightbox-no" /></p>'].join(""):(h.type=="confirm")?['<input type="button" id="overlay-confirm-button" class="secondary-button lightbox-yes" value="',i,'" />&nbsp;<input type="button" value="',g,'" id="overlay-cancel-button" class="secondary-button lightbox-no" />'].join(""):(h.type=="alert")?['<input type="button" id="overlay-confirm-button" class="secondary-button lightbox-ok" value="',i,'" />'].join(""):"",d=['<div id="lightbox-container" style="position:absolute;z-index:1000001;',n,k,'">','<div id="lightbox-top">',a,h.title,"</div>",'<div id="lightbox-middle">',h.message,"</div>",'<div id="lightbox-bottom">',q,"</div></div>"].join("");
function p(){$("#overlay-mask").fadeOut("fast",function(){$(this).remove()
});
$("#lightbox-container").fadeOut("fast",function(){$(this).remove()
})
}function j(){p();
var v=((t===false)?((h.theme=="light")?0.5:0.35):t);
$(m).appendTo($("body")).animate({opacity:v},"fast",function(){$(d).appendTo($("body"));
var x=(typeof h.left!="undefined")?h.left:Math.max((($(window).width())/2)-(parseInt($("#lightbox-container").width())/2)+$(document).scrollLeft(),0),w=(typeof h.top!="undefined")?h.top:Math.max((($(window).height())/2)-(parseInt($("#lightbox-container").height())/2)+$(document).scrollTop(),0);
$("#lightbox-container").css({left:x+"px",top:w+"px"}).fadeIn("fast",function(){if(h.onReady){h.onReady()
}});
if(typeof h.addClass!="undefined"){$("#lightbox-container").addClass(h.addClass)
}b()
});
if(!s){$("#overlay-mask").click(function(){if(h.callback){h.callback()
}p()
})
}}function b(){if(h.type=="confirm"){$("#overlay-confirm-button").click(function(){if(h.callback){h.callback(true)
}p()
});
$("#overlay-cancel-button").click(function(){if(h.callback){h.callback(false)
}p()
})
}else{$("#overlay-confirm-button").click(function(){if(h.callback){h.callback()
}p()
})
}$("#lightbox-close").click(function(){if(h.callback){h.callback()
}p()
})
}j()
};