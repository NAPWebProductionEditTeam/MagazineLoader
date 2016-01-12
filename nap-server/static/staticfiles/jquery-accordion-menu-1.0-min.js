(function(a){a.fn.accordionMenu=function(i){i=a.extend({speed:350,multipleOpen:false,writeCookie:false,cookieName:"accordion_menu",cookieValid:30,cookiePath:"",afterEnd:null,beforeStart:null},i||{});
var e=[];
function g(){var k=document.cookie.indexOf(i.cookieName);
if(k==-1){return null
}var j=document.cookie.indexOf("=",k),m=document.cookie.indexOf(";",j);
if(m==-1){m=document.cookie.length
}var l=document.cookie.substring(j+1,m);
e=l.split(",");
return e
}function b(){var j=new Date(),l="",k=new Date(j.setTime(j.getTime()+(i.cookieValid*24*60*60*1000))).toGMTString();
l=e.join(",");
document.cookie=i.cookieName+"="+l+"; expires="+k+"; path="+i.cookiePath
}function d(k,l){if(k==="reset"){for(var j=0;
j<e.length;
j++){e[j]=false
}}else{e[k]=l;
if(i.writeCookie){b()
}}}var c=this,f=a(c).find("li>span"),h=f.find("~ ul");
h.css("display","none");
f.parent("li").each(function(j,k){var l=a(k);
if(l.find(":has(ul)")){if(e[j]=="true"||l.hasClass("fixed")||l.hasClass("open")){if(l.hasClass("fixed")){l.find("> ul").css("display","block")
}else{l.find("> ul").css("display","block");
l.addClass("open")
}}}});
f.click(function(n){if(i.beforeStart){i.beforeStart.call(this,this)
}var l=a(n.target).parent(),k=l.parent("li"),m=l.find("~ ul"),j=l.parent().parent().find("> li > ul");
if(!l.parent().hasClass("fixed")){n.preventDefault();
if(i.multipleOpen){if(k.hasClass("open")){m.slideUp(i.speed,function(){if(i.afterEnd){i.afterEnd.call(this,this)
}});
k.removeClass("open")
}else{m.slideDown(i.speed);
k.addClass("open",function(){if(i.afterEnd){i.afterEnd.call(this,this)
}})
}}else{if(k.hasClass("open")){m.slideUp(i.speed,function(){if(i.afterEnd){i.afterEnd.call(this,this)
}});
k.removeClass("open")
}else{j.each(function(o,p){var q=a(p);
if(!q.parent("li").hasClass("fixed")){q.slideUp(i.speed);
q.parent("li").removeClass("open")
}});
m.slideDown(i.speed,function(){if(i.afterEnd){i.afterEnd.call(this,this)
}});
m.parent("li").addClass("open")
}}}});
return c
}
})(jQuery);