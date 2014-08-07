////////////////////////////////////////////////////////////////
// Class for the objects in the game space.  These will have an id
// associated with them and the text currently display.
////////////////////////////////////////////////////////////////
var toolObject = function(elaTool) {
var object = {};

object.isEmpty = true;
object.id = "";
object.text = "";
object.metadata = -1;
var connections = [];

var tool = elaTool;

var $id;

var hovering = false;
var connecting = false;

var animator = {
    interval : null,
    animation: {
        imageSize: {
            x: 210,
            y: 101
        },
        frameCount: 24
    },
    currentPosition: {
        x: 0,
        y: 0
    }
};

////////////////////////////////////////////////////////////////
// Will initialize the object given a position, x & y, and text
////////////////////////////////////////////////////////////////
object.init = function(id, x, y, text, metadata) {
    text = text || "";

    var objectCounter;
    var $gameId = $("#diagram_gameSpace");

    if (id == null){
        for (i = 0; i <= $gameId.find('span').length; i++) {
            if ($("#ela_"+i).length == 0 ) {
                objectCounter = i;
            }
        }

        object.id = "ela_"+objectCounter;
    }
    else {
        object.id = id;
    }

    object.metadata = metadata || -1;


    var markup = "<span id='"+object.id+"' class='empty_node'><p><textarea rows=3>"+
                 text+"</textarea><button class='hidden'>x</button>"+
                 "<a class='mainIcon hidden'></a><b class='mainIcon hidden'></b></span>";

    $gameId.append(markup);

    $id = $("#"+object.id);
    $id.css('left', x || 0);
    $id.css('top', y || 0);

    jsPlumb.draggable(jsPlumb.getSelector("#"+object.id));

    // Allow the object to be dragged, but make sure it stays within the boundaries of the game board
    $id.on('drag', function(event) {
        if (!tool.editMode || $(event.toElement).hasClass('mobileIcon')) {
            event.preventDefault();
            return false;
        }

        var fail = false;
        var top = $id.position().top;
        var left = $id.position().left;
        var width = $id.width();
        var height = $id.height();

        if (top < 0){
            top = 0;
            fail = true;
        }
        if (top+height > $id.parent().height() - 20){
            top = $id.parent().height() - height-20;
            fail = true;
        }
        if (left < 0) {
            left = 0;
            fail = true;
        }
        if (left+width > $id.parent().width()) {
            left = $id.parent().width() - width;
            fail = true;
        }
        if (fail) {
            $id.css('top', top+"px");
            $id.css('left', left+"px");

            event.preventDefault();
            return false;
        }

        // Fix any connections
        $.each(connections, function(index, value) {
            var line = $("line."+object.id+"_"+value.id);

            value.linePosition.x1 = value.iconPosition.x + left+15;
            value.linePosition.y1 = value.iconPosition.y + top+15;

            line.attr('x1', value.linePosition.x1);
            line.attr('y1', value.linePosition.y1);
        });

        $.each(tool.objectArray, function(index, value) {
            if (value.id != object.id) {
               value.repositionConnection(object.id, { x: left, y: top });
            }
        });
    });

    // If we are constructed with text, then set it
    if (text != "") {
        object.setText(text);
        setupConnection();
    }

    $id.on("mouseenter", function(event) {
        if (tool.editMode) {
            $id.find('button').removeClass('hidden');
        }

        if (!tool.isMouseDown){
            $id.find(".mainIcon").removeClass('hidden');
        }
    });

    $id.on("mouseleave", function(event) {
        if(tool.editMode) {
            $id.find('button').addClass('hidden');
        }

        $id.find(".mainIcon").addClass('hidden');
    });

    $id.on('mousedown', '.mainIcon', function(event) {
        var target = $(event.target);
        var isAnchor = target.is("a");

        if (isAnchor) {
            $id.append("<a class='mobileIcon'></a>");
        }
        else {
            $id.append("<b class='mobileIcon'></b>");
        }

        tool.isMouseDown = true;
        connecting = true;
        $(".mainIcon").addClass('hidden');

        var offset = $(".mobileIcon").offset();
        offset.left = offset.left - $("#diagram_gameSpace").offset().left;
        offset.top = offset.top - $("#diagram_gameSpace").offset().top;

        var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
        newLine.setAttribute('id','line2');
        newLine.setAttribute('x1',offset.left+15);
        newLine.setAttribute('y1',offset.top+15);
        newLine.setAttribute('x2',offset.left+15);
        newLine.setAttribute('y2',offset.top+15);

        $("#dynamicCanvas").html(newLine);
    });

    $("html").on('mouseup', function(event){
        if (tool.isMouseDown && connecting){
            tool.isMouseDown = false;
            connecting = false;
            var position = {
                x1: $("#dynamicCanvas line").attr('x1'),
                y1: $("#dynamicCanvas line").attr('y1'),
                x2: $("#dynamicCanvas line").attr('x2'),
                y2: $("#dynamicCanvas line").attr('y2')
            };

            $("#dynamicCanvas line").remove();

            // Check to see if the line is currently hovering over any node, if so, create a connection
            $.each(tool.objectArray, function(index, value) {
                if (value.checkHover({x:position.x2, y:position.y2})) {

                    // Can not make self-connections
                    if (value.id == object.id) {
                        $(".mobileIcon").remove();
                        return false;
                    }

                    var connectedPosition = value.getPosition();

                    var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
                    newLine.setAttribute('x1', position.x1);
                    newLine.setAttribute('y1', position.y1);
                    newLine.setAttribute('x2', connectedPosition.left+75);
                    newLine.setAttribute('y2', connectedPosition.top +75);
                    newLine.setAttribute('class', object.id+"_"+value.id);

                    $("#connectionCanvas").append(newLine);

                    connections.push({
                        isAdd: $(".mobileIcon").is("b"),
                        id: value.id,
                        iconPosition: {
                            x: $(".mobileIcon").position().left,
                            y: $(".mobileIcon").position().top
                        },
                        linePosition: {
                            x1: position.x1,
                            y1: position.y1,
                            x2: connectedPosition.left + 75,
                            y2: connectedPosition.top + 75
                        }
                    });

                    $(".mobileIcon").addClass("finalIcon");
                    $(".mobileIcon").addClass(value.id);
                    $(".mobileIcon").removeClass('mobileIcon');

                    // check to see if there is all ready a connection with this node
                    if (value.checkConnection(object.id)) {
                        // There is a connection so we need to fix the positioning of this new connection and the previous connection
                        object.fixConnection(value.id);
                        value.fixConnection(object.id);
                    }
                }
            });
        }

        $id.find(".mobileIcon").remove();
    });

    $("html").on("mousemove", function(event) {
        if (tool.isMouseDown && connecting) {
            // Need to calculate the position of the connection
            var parentNode = $('.mobileIcon').closest('span');
            var positionOfNode = {
                x : parentNode.position().left+75,
                y : parentNode.position().top+75
            };

            // synchronize position of mouse to same origin as the node
            var positionOfMouse = {
                x: event.originalEvent.clientX - $("#diagram_gameSpace").offset().left,
                y: event.originalEvent.clientY - $("#diagram_gameSpace").offset().top
            };

            // Check to see if we can snap into a node
            $.each(tool.objectArray, function(index, value) {
                if (value.checkHover(positionOfMouse)) {
                    var connectedPosition = value.getPosition();
                    positionOfMouse.x = connectedPosition.left + 75;
                    positionOfMouse.y = connectedPosition.top + 75;

                    return false;
                }
            });

            // PostionOfMouse - PositionOfNode
            var vector = {
                x: positionOfMouse.x - positionOfNode.x,
                y: positionOfMouse.y - positionOfNode.y
            };

            // Get length of vector
            var length = Math.sqrt((vector.x*vector.x) + (vector.y*vector.y));

            // Normalize
            vector.x = vector.x/length;
            vector.y = vector.y/length;

            var finalPosition = {
                x: (vector.x * 100)+60,
                y: (vector.y * 100)+60
            };

            // Change final position of icon
            $(".mobileIcon").css("left", finalPosition.x+"px");
            $(".mobileIcon").css('top', finalPosition.y+"px");


            // Fix SVG line
            var offset = $(".mobileIcon").offset();
            offset.left = offset.left - $("#diagram_gameSpace").offset().left;
            offset.top = offset.top - $("#diagram_gameSpace").offset().top;

            var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
            newLine.setAttribute('id','line2');
            newLine.setAttribute('x1',offset.left+15);
            newLine.setAttribute('y1',offset.top+15);
            newLine.setAttribute('x2',positionOfMouse.x);
            newLine.setAttribute('y2',positionOfMouse.y);

            $("#dynamicCanvas").html(newLine);
        }
    });

    // When text is dropped onto the text area, format the
    // text accordingly
    $id.on("drop", "textarea", function(event) {
        var text = window.getSelection().toString();

        text = text.split("\n").join('').trim();

        if (text != ""){
            object.text = text;

            if (text.length > 74) {
                text = text.substring(0, 68)+"...";
            }

            var previousText = $(event.target).val();

            if (previousText == "") {
                object.isEmpty = false;
                $id.removeClass('empty_node');
                setupConnection();
            }
            else {
            }

            $id.removeClass('hovering');

            $(event.target).val(text);

            window.getSelection().removeAllRanges();

            event.preventDefault();
        }
    });

    $id.on("click", "button", function(event) {
        $id.remove();

        var arrayIndex;
        $.each(tool.objectArray, function(index, value) {
            value.removeConnection(object.id);
            if (value.id == object.id) {
                arrayIndex = index;
            }
            $("line."+object.id+"_"+value.id).remove();
            $("line."+value.id+"_"+object.id).remove();
            $(".finalIcon."+object.id).remove();
        });

        tool.objectArray.splice(arrayIndex, 1);
    });
}

object.repositionConnection = function(id, position) {
    $.each(connections, function(index, value) {
        if (value.id == id) {
            var line = $("line."+object.id+"_"+id);

            var canvasOffset = $("#connectionCanvas").offset();

            value.linePosition.x2 = position.x + 75;
            value.linePosition.y2 = position.y + 75;

            line.attr("x2", value.linePosition.x2);
            line.attr("y2", value.linePosition.y2);
        }
    });
}

object.removeConnection = function(id) {
    var indexArray = [];
    $.each(connections, function(index, value){
        if(value.id == id){
            indexArray.push(index);
        }
    });

    $.each(indexArray.reverse(), function(index, value) {
        connections.splice(value, 1);
    });
}

object.fixConnection = function(id) {
    $.each(connections, function(index, value) {
        // Find correct connections
        if (value.id == id){
            // translate position so the origin is the center of the node
            var vector = {
                x: value.iconPosition.x - 60,
                y: value.iconPosition.y - 60
            };

            // Normalize vector
            var magnitude = Math.sqrt((vector.x * vector.x) + (vector.y * vector.y));
            vector.x = vector.x/magnitude;
            vector.y = vector.y/magnitude;

            var additionalRadian = (10*3.14159/180);

            var newVector = {
                x: (Math.cos(additionalRadian)*vector.x) - (Math.sin(additionalRadian)*vector.y),
                y: (Math.sin(additionalRadian)*vector.x) + (Math.cos(additionalRadian)*vector.y)
            };

            // translate back to original position
            value.iconPosition.x = (newVector.x * magnitude)+60;
            value.iconPosition.y = (newVector.y * magnitude)+60;

            // Fix position of icon
            var iconElement = $id.find('.finalIcon.'+value.id)
            iconElement.css('top', value.iconPosition.y+"px");
            iconElement.css('left', value.iconPosition.x+"px");
            var elementOffset = iconElement.offset();
            var connectionOffset = $("#connectionCanvas").offset();

            value.linePosition.x1 = elementOffset.left - connectionOffset.left+15;
            value.linePosition.y1 = elementOffset.top - connectionOffset.top+15;

            // Fix position of line
            $("."+object.id+"_"+value.id).attr('x1', value.linePosition.x1);
            $("."+object.id+"_"+value.id).attr('y1', value.linePosition.y1);
        }
    });
}

object.checkConnection = function(id) {
    var hasConnection = false;
    $.each(connections, function(index, value) {
        if (value.id == id) {
            hasConnection = true;
            return hasConnection;
        }
    });

    return hasConnection;
}

object.checkHover = function(position){
    var x = $id.position().left;
    var y = $id.position().top;

    return (position.x > x && position.x < x + $id.width() && position.y > y && position.y < y + $id.height());
}

object.getPosition = function() {
    return $id.position();
}

// This will check to see if the given position is currently hovering over the object.
object.hoverCheck = function(position) {
    if (tool.editMode) {
        $id.find('button').removeClass('hidden');
        return;
    }

    if (!object.isEmpty) {
        return false;
    }

    var x = $id.offset().left;
    var y = $id.offset().top;

    if (position.x > x && position.x < x + $id.width() && position.y > y && position.y < y + $id.height()) {
        if (!hovering) {
            hovering = true;
            $id.addClass('hovering');
        }
        return true;
    }
    else {
        if (hovering){
            hovering = false;
            $id.removeClass('hovering');
        }
    }
}

// This will check to see if the currently location is hovering over the object
object.checkDropHover = function(left, top, value) {

    var x = $id.position().left;
    var y = $id.position().top;

    if (left > x && left < x + $id.width() && top > y && top < y + $id.height()) {
        if (object.isEmpty) {
            alert('Can not link to an empty node.');
        }
        else {
            var isAdd = value.indexOf('add') >= 0;
            var gridNumber = value[value.length-1];

            object.addConnection(isAdd, parseInt(gridNumber));
            return true;
        }
    }
}

// Will set the given text to the object and the node will no longer be empty
object.setText = function(text, metadata) {
    object.text = text;
    object.isEmpty = false;
    object.metadata = metadata;
    $id.removeClass('empty_node');
    $id.removeClass('hovering');

    if (text.length > 74) {
        text = text.substring(0, 68)+"...";
    }

    $id.find('textarea').val(text);
}

object.getConnections = function(){
    return connections;
}

object.addConnection = function(newConnections) {
    $.each(newConnections, function(index, value) {
        var element = "a";

        if (value.isAdd) {
            element = "b";
        }

        $id.append("<"+element+" class='finalIcon "+value.id+"' style='left:"+value.iconPosition.x+"px; top:"+value.iconPosition.y+"px'></"+element+">");

        var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
        newLine.setAttribute('x1', value.linePosition.x1);
        newLine.setAttribute('y1', value.linePosition.y1);
        newLine.setAttribute('x2', value.linePosition.x2);
        newLine.setAttribute('y2', value.linePosition.y2);
        newLine.setAttribute('class', object.id+"_"+value.id);


        $("#connectionCanvas").append(newLine);

        connections.push(value);

        //object.addImageConnection({x:value.linePosition.x1, y:value.linePosition.y1}, {x:value.linePosition.x2, y:value.linePosition.y2});
    });
}

object.addImageConnection = function(startPosition, endPosition) {
    // Determine vector
    var vector = {
        x: endPosition.x - startPosition.x,
        y: endPosition.y - startPosition.y
    };

    // Get length of vector
    var length = Math.sqrt((vector.x*vector.x) + (vector.y*vector.y));

    // Normalize
    vector.x = vector.x/length;
    vector.y = vector.y/length;

    var angle = Math.cos(vector.y);
}

// Starts the animation by setting a window interval
object.startAnimation = function() {
    animator.interval = window.setInterval(function(){
        return false;
        animator.currentPosition.x -= animator.animation.imageSize.x;

        if (animator.currentPosition.x / animator.animation.imageSize.x <= -1*animator.animation.frameCount) {
            animator.currentPosition.x = 0;
        }

        $id.css('background-position', animator.currentPosition.x+"px "+animator.currentPosition.y+"px");
    }, 200);

    //$id.addClass('animating');
}

// Stops the animation by clearing the window interval
object.stopAnimation = function() {
    $id.removeClass('animating');
    $id.css('background-position', "0px 0px");
    window.clearInterval(animator.interval);
}

// Only used for dynamic connections
function setupConnection() {
    return false;
    jsPlumb.makeSource($id, {
        filter: "a,b",
        anchor: "Continuous",
        connector: ["StateMachine", {}]
    });

    // makes the objects a target for connections
    jsPlumb.makeTarget( $id, {
        anchor: "Continuous",
        endpoint: ["Image", {src:"challenges/images/ela_empty.png"}]
    });
}

////////////////////////////////////////////////////////////////////////////
// New stuff from Greg 'BAMF' Bliss
////////////////////////////////////////////////////////////////////////////

object.createSelection = function(choices) {
    var listMarkup = "<ul id='system_choiceList'>";
    $.each(choices, function(index, value){
        listMarkup += "<li data='"+value.id+"'>"+value.text+"</li>";
    });
    listMarkup += "</ul>";

    $('html').append(listMarkup);

    var centerPosition = {
        x: $id.offset().left + $id.width()/2,
        y: $id.offset().top + $id.height()/2
    };

    var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
    newLine.setAttribute('id','selectionLine');
    newLine.setAttribute('x1',centerPosition.x);
    newLine.setAttribute('y1',centerPosition.y);
    newLine.setAttribute('x2',$id.offset().left+$id.width());
    newLine.setAttribute('y2',$id.offset().top);
    $("#dynamicCanvas").append(newLine);
}

return object;
}