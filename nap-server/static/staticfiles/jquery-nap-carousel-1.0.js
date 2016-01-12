/**
 * napCarousel - jQuery plugin to create scrollable carousels.
 * @requires jQuery v1.3 or above
 * @requires jquery.event.drag-1.4.js for scrollbar control
 * @author Lee Daffen ()
 * @version 1.0.1 (23/4/2009)
 *
 * Uses elements from jCarouselLite v1.0.1
 * Copyright (c) 2008 Ganeshji Marwaha (gmarwaha.com)
 *
 */

/**
 * 16/11/09
 * Documentation moved to http://confluence.net-a-porter.com/display/WCT/jQuery+Carousel
 */

(function($) {

$.fn.napCarousel = function(o, callback) {
    o = $.extend({
        btnPrev: null,
        btnNext: null,
        top_Navbar_btnPrev: null,
        top_Navbar_btnNext: null,
        btnGo: null,
        mouseWheel: false,
        auto: null,

        speed: 200,
        easing: null,

        vertical: false,
        circular: true,
        visible: 3,
        start: 0,
        scroll: 1,
        animate: true,

        beforeStart: null,
        afterEnd: null,

        scrollbar: {},

        //extenstion for multi carousel
        top_navbar : null,
        multi_carousel : false,

        // extention to target ul li directly for sub uls - robin start
        ulClass: null,
        liClass: null,

        reset: false
    }, o || {});

    // reset carousel control event bindings to allow 'on the fly' rebuilding of the carousel
    if(o.reset) {
        if(o.btnPrev) $(o.btnPrev).unbind("click");
        if(o.btnNext) $(o.btnNext).unbind("click");
    }


	return this.each(function() {


        var running = false, animCss=o.vertical?"top":"left", sizeCss=o.vertical?"height":"width";
        var div = $(this), ul = $("ul", div), tLi = $("li", ul), tl = tLi.size(), v = o.visible;
        var button_next = false;
        var button_prev = false;
        var $that = this; // keep this for deeper iteration

        // target specific ul and class
        if (o.ulClass && o.liClass) {
            var ul = $("ul." + o.ulClass, div),
                tLi = $("li." + o.liClass, ul);
        } else {
            var ul = $("ul", div),
                tLi = $("li", ul);
        }
        var tl = tLi.size(),
            v = o.visible;

        if(o.circular && o.multi_carousel == false) {

            ul.prepend(tLi.slice(tl-v-1+1).clone())
              .append(tLi.slice(0,v).clone());
            o.start += v;

            // can't have a scrollbar on a circular carousel so hide the div if it's there
            if(o.scrollbar.bar) $(o.scrollbar.bar).css("visibility","hidden");
            o.scrollbar = {};
        }

        var showScrollbar = (o.scrollbar && o.scrollbar.bar && o.scrollbar.handle) ? true : false ;

        var li = $("li", ul), itemLength = li.size(), curr = o.start;


        div.css("visibility", "visible");

        li.css({overflow: "hidden", "float": o.vertical ? "none" : "left"});
        ul.css({margin: "0", padding: "0", position: "relative", "list-style-type": "none", "z-index": "1"});
        div.css({overflow: "hidden", position: "relative", "z-index": "2", left: "0px"});

        var liSize = o.vertical ? height(li) : width(li);   // Full li size(incl margin)-Used for animation
        var ulSize = liSize * itemLength;                   // size of full ul(total length, not just for the visible items)
        var divSize = liSize * v;                           // size of entire div(total length for just the visible items)

        li.css({width: li.width(), height: li.height()});
        ul.css(sizeCss, ulSize+"px").css(animCss, -(curr*liSize));
        div.css(sizeCss, divSize+"px");                     // Width of the DIV. length of visible images

        if(o.multi_carousel == true) {
            set_images_real_height($($that),div,v);
        }

		//hide scroll bar if items in the carousel are less than the items visible
		if(o.scrollbar.autohide) {
			if (itemLength <= v) {
				$(o.scrollbar.bar).css("display", "none");
			} else {
				$(o.scrollbar.bar).css("display", "block");
			}
		}

        // hide left and right carousel controls
		if(!o.circular) {

			//$(o.btnPrev + "," + o.btnNext).removeClass("disabled");
			$(o.btnPrev).removeClass("disabled-prev");
			$(o.btnPrev).addClass("previous-button");
			$(o.btnNext).removeClass("disabled-next");
			$(o.btnNext).addClass("next-button");
			$(curr-o.scroll<0 && o.btnPrev).addClass("disabled-prev");
			$(curr-o.scroll<0 && o.btnPrev).removeClass("previous-button");
			$(curr+o.scroll > itemLength-v && o.btnNext).addClass("disabled-next");
			$(curr+o.scroll > itemLength-v && o.btnNext).removeClass("next-button");
		}

        if(o.multi_carousel == true){

            if(ul.hasClass('full_res')){

                $.each(ul.find('li'), function(i,data){

                    var li_class = "i"+i;
                    if(li_class != "i"+curr ){

                        $(this).appendTo(ul);

                    }else{
                        return false;
                    }

                });
                ul.css('left',0);

                ul.find('li.i'+(curr+1)).addClass('current');
                o.top_navbar.find('li.i'+(curr+1)).addClass('current');

            }

        }
        // scrollbar extension
        if(showScrollbar) {
            var isMouseOver = false,
                scrollbarEl = $(o.scrollbar.bar),           // jQuery element object reference for the scroll bar
                scrollhandleEl = $(o.scrollbar.handle),     // jQuery element object reference for the scroll handle
                scrollbarWidth = scrollbarEl.width();       // interior width of the scroll bar

            // set the proportionate width of the scroll handle
            scrollhandleEl.css("width",(divSize/ulSize)*scrollbarWidth);

            if(o.reset) {
                // reset some event bindings to allow 'on the fly' rebuilding of the carousel
                scrollbarEl.unbind("click");
                scrollhandleEl.unbind("dragstart").unbind("drag").unbind("dragend");
                // reset the position of the scroll handle
                scrollhandleEl.css("left",0);
            }

            var minX = scrollbarEl.offset().left,                           // left-most edge of the scroll bar
                maxX = minX + scrollbarWidth,                               // right-most edge of the scroll bar
                scrollhandleWidth = scrollhandleEl.width(),                 // interior width of the scroll handle
                maxScrollX = (minX + scrollbarWidth) - scrollhandleWidth,   // max right posision of the scroll handle
                scrollProportion = ul.width() / scrollbarWidth,             // ratio of pixels in carousel list to pixels in scroll bar
                minLeft = (isNaN(parseInt(scrollhandleEl.css("left")))) ? scrollhandleEl.offset().left - minX : parseInt(scrollhandleEl.css("left")),
                maxLeft = scrollbarWidth - scrollhandleWidth + minLeft,
                handleLeftPos;

            scrollhandleEl.hover(
                function() {
                    isMouseOver = true;
                },
                function() {
                    isMouseOver = false;
            });

            // add paginated scrolling when the user clicks on the scrollbar
            scrollbarEl.bind("click", function(e) {
                var availLeft = curr,
                    availRight = itemLength - o.visible - curr;

                handleLeftPos = (isNaN(parseInt(scrollhandleEl.css("left")))) ? minLeft : parseInt(scrollhandleEl.css("left"));

                if(!isMouseOver && e.pageX >= minX && e.pageX <= maxX) {
                    if(e.pageX > handleLeftPos + minX) {
                        var rightAmount = (availRight < o.visible) ? availRight : o.visible ;
                        return go(Math.floor(curr)+Math.ceil(rightAmount), false, o.animate);
                    } else if(e.pageX < handleLeftPos + minX) {
                        var leftAmount = (availLeft < o.visible) ? availLeft : o.visible ;
                        return go(Math.ceil(curr)-Math.ceil(leftAmount), false, o.animate);
                    } else {
                        return false;
                    }
                }
            });

            // make the scroll handle draggable
            scrollhandleEl.bind("dragstart", function(e) {
                handleLeftPos = (isNaN(parseInt(scrollhandleEl.css("left")))) ? minLeft : parseInt(scrollhandleEl.css("left"));
                eventOffset = e.pageX - handleLeftPos;
            })
            .bind("drag", function(e) {
                if(e.pageX - eventOffset > minLeft && e.pageX - eventOffset < maxLeft) {
                    scrollhandleEl.css("left",e.pageX - eventOffset);
                    ul.css("left", (e.pageX - eventOffset - minLeft) * -1 * scrollProportion);
                }
            })
            .bind("dragend", function(e) {
                var currentIndex = (e.pageX - eventOffset - minLeft) * scrollProportion;
                //return go(Math.round(currentIndex/liSize),true);
                curr = currentIndex/liSize;
                currInt = Math.round(curr);
                // park the scroll handle to the left or right if the user has dragged it to either end
                if(o.scrollbar.autopark === true && (currInt == 0 || currInt == itemLength-o.visible)) {
                    return go(currInt, false, o.animate);
                } else {
                    return go(curr, false, o.animate);
                }
            });
        }

        if(o.btnPrev)
            $(o.btnPrev).bind("click", function(e) {
                e.stopPropagation();
                button_prev = true;
                button_next = false;
                return go(Math.ceil(curr)-o.scroll, false, o.animate);
            });

        if(o.btnNext)
            $(o.btnNext).bind("click", function(e) {
                e.stopPropagation();
                button_next = true;
                button_prev = false;
                return go(Math.floor(curr)+o.scroll, false, o.animate);
            });

        /* previous and next buttons for top navigation - explicitely declated for multicarousel */

        if(o.top_Navbar_btnPrev){

            $(o.top_Navbar_btnPrev).bind("click", function(){
                move_top_Navbar('first');
            });
        }

        if(o.top_Navbar_btnNext){

            $(o.top_Navbar_btnNext).bind("click", function(){
                 move_top_Navbar('last');
            });
        }

        if(o.btnGo)
            $.each(o.btnGo, function(i, val) {
                $(val).click(function() {
                    if(o.top_navbar != null){
                        return go(o.circular ? o.visible+i : i, false, o.animate,"true");
                    }else{
                        return go(o.circular ? o.visible+i : i, false, o.animate);

                    }
                });
            });

        if(o.mouseWheel && div.mousewheel)
            div.mousewheel(function(e, d) {
                return d>0 ? go(curr-o.scroll) : go(curr+o.scroll, false, o.animate);
            });

        if(o.auto)
            setInterval(function() {
                go(curr+o.scroll, false, o.animate);
            }, o.auto+o.speed);

        function vis() {
			return li.slice(curr).slice(0,v);
        }

        function moveNext(anim) {
            return go(Math.ceil(curr)+o.scroll, false, anim);
        }

        function movePrev(anim) {
            return go(Math.floor(curr)-o.scroll, false, anim);
        }

        function move_top_Navbar(direction){
            multi_carousel_go(o.top_navbar,curr,direction);
        }

        function go(to, dragging, anim,jump) {
            var draggingBool = (typeof dragging !== 'undefined') ? dragging : false;
            var animBool = (typeof anim !== 'undefined') ? anim : true;


            if(o.multi_carousel == true){

                var current,
                    current_top,
                    class_id,
                    $full_img_items = ul.find('li'),
                    outer_right_li,outer_right_wrapper, left_offset, left_offset_wrapper,
                    li_class,
                    current_item_id,
                    $that_nav,
                    top_nav_item_size = o.top_navbar.children().eq(0).width;

               //if jump is set to true, jump to a specific image

               if(jump){

                  // loop through the images, start appending and when you reach the one selected break the loop
                  // Then animate ul to left 0


                   $.each($full_img_items, function(i,data){

                       li_class = "i"+to;
                       $that_nav = $(this);
                       current_item_id = $that_nav.attr('class').split(' ')[0];

                       if(li_class != current_item_id ){

                           $that_nav.appendTo(ul);

                       }else{

                           o.top_navbar.find('li img').removeClass('selected_img');
                           o.top_navbar.find('li.'+current_item_id+' img').addClass('selected_img');

                           return false;
                       }

                   });


                   //if image is hidden animate the top navigation bar

                   if( o.top_navbar.find('li.current').offset().left < o.top_navbar.parent('div').offset().left ){

                       o.top_navbar.css('left',-top_nav_item_size);

                   }else{

                       o.top_navbar.css('left',0);
                   }


                //if any of the buttons were clicked :

               }else{


                   if( button_next == true ){

                       var $first = ul.children().eq(0);
                       $first.appendTo(ul);
                       ul.find('li').removeClass('current');
                       ul.children().eq(0).addClass('current');
                       current = ul.find('li.current');
                       ul.animate('left',liSize);


                   }else if ( button_prev == true )  {

                       var $last = ul.find('li').last();
                       $last.prependTo(ul);
                       ul.find('li').removeClass('current');
                       ul.children().eq(0).addClass('current');
                       current = ul.find('li.current');
                       ul.animate('right',liSize);

                   }

                   class_id = ul.find('li.current').attr('class').split(' ')[0];

                   //set and remove the previous and and current classes
                   o.top_navbar.find('li').removeClass('previous');
                   o.top_navbar.find('li.current').addClass('previous');
                   o.top_navbar.find('li').removeClass('current');
                   o.top_navbar.find('li img').removeClass('selected_img');

                   current_top = o.top_navbar.find('li.'+class_id).addClass('current');
                   current_top.find('img').addClass('selected_img').parent('li');

                   // get teh offset coords to determine if the current element is hidden
                   outer_right_li = current_top.offset().left+current_top.outerWidth();
                   outer_right_wrapper =  o.top_navbar.parent('div').offset().left + o.top_navbar.parent('div').outerWidth();

                   left_offset = current_top.offset().left;
                   left_offset_wrapper =  o.top_navbar.parent('div').offset().left;



                   //if the items are out of view

                   if( outer_right_li > outer_right_wrapper  || left_offset < left_offset_wrapper) {


                       if(button_next == true){

                           multi_carousel_go(o.top_navbar,current,"first");

                       }else{

                           multi_carousel_go(o.top_navbar,current,"last");

                       }

                   }



               } // end of else not jump to image by click


            }else{


                if(!running) {
                    if(o.beforeStart)
                        o.beforeStart.call(this, vis());

                    if(o.circular) {            // If circular we are in first or last, then goto the other end
                        if(to<=o.start-v-1) {           // If first, then goto last
                            ul.css(animCss, -((itemLength-(v*2))*liSize)+"px");
                            // If "scroll" > 1, then the "to" might not be equal to the condition; it can be lesser depending on the number of elements.
                            curr = to==o.start-v-1 ? itemLength-(v*2)-1 : itemLength-(v*2)-o.scroll;

                        } else if(to>=itemLength-v+1) { // If last, then goto first
                            ul.css(animCss, -( (v) * liSize ) + "px" );
                            // If "scroll" > 1, then the "to" might not be equal to the condition; it can be greater depending on the number of elements.
                            curr = to==itemLength-v+1 ? v+1 : v+o.scroll;
                        } else {
                            curr = to;
                        }
                    } else {                    // If non-circular and to points to first or last, we just return.
                        if(to<0 || to>itemLength-v) return;
                        else curr = to;
                    }                           // If neither overrides it, the curr will still be "to" and we can proceed.

                    running = true;

                    if(animBool) {
                        ul.animate(
                            animCss == "left" ? { left: -(curr*liSize) } : { top: -(curr*liSize) } , o.speed, o.easing,
                            function() {
                                if(o.afterEnd) o.afterEnd.call(this, vis());
                                running = false;
                            }
                        );
                    } else {
                        var styles = animCss == "left" ? { left: -(curr*liSize) } : { top: -(curr*liSize) };

                        ul.css(styles);
                        if(o.afterEnd) o.afterEnd.call(this, vis());
                        running = false;
                    }

                    if(showScrollbar && !draggingBool) {
                        scrollhandleEl.animate({
                            left: (curr*liSize)/scrollProportion+minLeft
                        }, o.speed, o.easing);
                    }

                    // Disable buttons when the carousel reaches the last/first, and enable when not
                    if(!o.circular) {
                        $(o.btnPrev).removeClass("disabled-prev");
                        $(o.btnPrev).addClass("previous-button");
                        $(o.btnNext).removeClass("disabled-next");
                        $(o.btnNext).addClass("next-button");
                        $(curr-o.scroll<0 && o.btnPrev).addClass("disabled-prev");
                        $(curr-o.scroll<0 && o.btnPrev).removeClass("previous-button");
                        $(curr+o.scroll > itemLength-v && o.btnNext).addClass("disabled-next");
                        $(curr+o.scroll > itemLength-v && o.btnNext).removeClass("next-button");
                    }
                }
            }

        }

		// expose the private methods to the return scope of the constructor
		this.vis = vis;
		this.go = go;
        this.movePrev = movePrev;
        this.moveNext = moveNext;

		// expose these methods to the public scope via a callback
		if(callback) callback.call(this, this);
	});
};

function css(el, prop) {
    return parseInt($.css(el[0], prop)) || 0;
}
function width(el) {
    return  el[0].offsetWidth + css(el, 'marginLeft') + css(el, 'marginRight');
}
function height(el) {
    return el[0].offsetHeight + css(el, 'marginTop') + css(el, 'marginBottom');
}

/*
remove and add the list items for the multi carousel
 */
function multi_carousel_go($wrapper,current,position){


    var $first = $wrapper.children().eq(0);

    if(position == 'first'){

        $first.appendTo($wrapper).removeClass('current');
        $wrapper.children().eq(0).addClass('current');
        current = $wrapper.find('li.current');
        $wrapper.css('left',-liSize);


    }else if(position == "last"){

        var $last = $wrapper.find('li').last();
        $last.insertBefore($first);
        current = $wrapper.find('li.current');
        $wrapper.css('left',liSize);

    }


    return current;

}

function set_images_real_height($wrapper_list,$div,visible){

    var $wrapper = $wrapper_list.find('ul');
    var images = $wrapper.find('li img').hide();


    // set the width the and height of the container li to the size of the images
    $(images).each( function(i) {

       $(this).bind('load',function(){

           var this_width =  $(this).outerWidth(true);

           $(this).parent('li').css('width',this_width).find('img').show();
           $(this).parent('li').css('height','auto');


       });

    });

    // set he container width and height -- fix for chrome for preloaded images
    $(images[0]).bind('load',function(){

        var this_width =  $(this).outerWidth(true);

        $wrapper.css('width',this_width * $wrapper.find('li').size());
        $div.css('width',this_width * visible);             // Width of the DIV. length of visible images

        if(  !$wrapper.hasClass('full_res')  && $wrapper.find('li').size() <= 6  ){
            $('#top_carousel_holder').css('width',this_width * visible);
        }else if (!$wrapper.hasClass('full_res') ) {
            $('#top_carousel_holder').css('width','424px');
        }

    });
}




})(jQuery);
