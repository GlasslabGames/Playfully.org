/*
 * Popup module that is used for 'lightbox' events due to compatibility issues with fancybox and lightbox
 */
var popup = function() {

var module = {};

var containerId = "popupModal";

var overlayId   = "popupModalOverlay";
var hiddenClass = "hidden";

var $overlay;
var $container;

/////////////////////////////////////////////////
// Will initialize the module by added the needed html to the body
/////////////////////////////////////////////////
module.init = function() {
    var containerMarkup = "<div id='"+overlayId+"' class='lightboxOverlay'></div>"+
                          "<div id='"+containerId+"' class='lightbox'></div>";
    $('body').append(containerMarkup);

    $container = $("#"+containerId);
    $overlay   = $("#"+overlayId);

    $container.addClass(hiddenClass);
    $overlay.addClass(hiddenClass);
}

/////////////////////////////////////////////////
// Will create and show the popup with the given content
// content: The html markup that will be added to the container
// preventClick: A flag if the click event will be added to the
//               overlay to hide on click
/////////////////////////////////////////////////
module.create = function(content, preventClick) {
    $container.html(content);

    if (!preventClick) {
        // Add click event for the overlay to remove the popup
        $overlay.on('click', function(e) {
            module.remove();
        });
    }
    else {
        // unbind the click event
        $overlay.unbind('click');
    }

    // Show the popup
    $overlay.removeClass(hiddenClass);
    $container.removeClass(hiddenClass);

    var width = document.width - $container.width();
    var height = document.height - $container.height();

    $container.css("margin", height/2+"px "+width/2+"px "+height/2+"px "+width/2+"px");
}

/////////////////////////////////////////////////
// Will empty and hide the overlay and container
/////////////////////////////////////////////////
module.remove = function() {
    $container.empty().addClass(hiddenClass);
    $overlay.addClass(hiddenClass);
}

/////////////////////////////////////////////////
// Will add an additional click event to the overlay
// eventFunction: The function that will fire on the click event
/////////////////////////////////////////////////
module.addClickEvent = function(eventFunction) {
    $overlay.click(eventFunction);
}

/////////////////////////////////////////////////
// Will add or edit css attributes given
// style: The attribute that will be edited
// value: The css value for the given attribute
/////////////////////////////////////////////////
module.css = function(style, value) {
    $container.css(style, value);
}
module.init();
return module;
}