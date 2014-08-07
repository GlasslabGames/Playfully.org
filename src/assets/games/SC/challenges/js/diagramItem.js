///////////////////////////////////////////////////////////////////////////
// The object that will be utilized by the diagramming tool.  This will
// contain all functionality for a single node and all connections that are
// established with that node.  All connections, hover menus, and the node
// itself are all under the same Kinetic.Layer
///////////////////////////////////////////////////////////////////////////
var diagramItem = function( diagramTool ) {
    var item = {};
    item.text = "";
    item.metadata = -1;
    item.layer;
    item.id = -1;
    item.circle;
    item.textElement = null;
    item.image = null;
    item.connections = [];
    item.hovering = false;
    item.leftCorrect = true;

    item.nodeBackground;// Used for dynamic styling

    var highlightBorderSize = 10;
    var nodeSize = 120;

    var tool = diagramTool;

    var nodeListAnimation;

    var nodeHoverAnimation;
    var nodeHoverAnimationSpeed = 8;

    var pullHoverAnimation;
    var pullMeEndPosition = nodeSize * .66;
    var pullMeSize = 35;
    var connectionIconSize = 30;

    var connectionOptionsWidth = 150;
    var connectionOptionsHeight = 40;

    var dragging = false;

    var connectionMenuId = null;
    var curPosX = 0;

    item.isDependent = false;

    // //////////////////////////////////////////////////////
    // Will initalize the object given the position and Id.
    // Will create the Kinetic.Layer and Kinetic.Circle along
    // with necessary events and the immediate naming menu. If
    // this object is being created in freeplay, the naming menu
    // needs to immediately be removed
    // //////////////////////////////////////////////////////
    item.init = function (posX, posY, id, freePlacement) {
    	curPosX = posX;

        item.id = id;

        // The entire layer where all information will be drawn to
        item.layer = new Kinetic.Layer( {
            x : posX - 100,
            y : posY - 100,
            draggable: !tool.viewingMode,
            dragBoundFunc: function (pos) {
            	var dragPosX = pos.x;
            	var dragPosY = pos.y;
            	
            	if( dragPosY < -38 ) {
            		return { x: dragPosX, y: -38 };
            	}

            	// Fixed width bounds - comment this out until we
            	// bring back the fixed width feature
            	/*if (dragPosX < 4 && dragPosY < -38) {
            		return { x: 4, y: -38 };
            	}

            	if (dragPosX > 710 && dragPosY < -38) {
            		return { x: 710, y: -38 };
            	}

            	if (dragPosX < 4 && dragPosY > 539) {
            		return { x: 4, y: 539 };
            	}

            	if (dragPosX > 710 && dragPosY > 539) {
            		return { x: 710, y: 539 };
            	}

            	if (dragPosX < 4) {
            		return { x: 4, y: dragPosY };
            	}

            	if (dragPosX > 710) {
            		return { x: 710, y: dragPosY };
            	}

            	if (dragPosY < -38) {
            		return { x: dragPosX, y: -38 };
            	}

            	if (dragPosY > 539) {
            		return { x: dragPosX, y: 539 };
            	}*/

            	return pos;
            }
        });

        // The node that will contain the text and hover ability
        item.circle = new Kinetic.Circle( {
            x : 100,
            y : 100,
            radius : nodeSize / 2,
            fill : '#ddd',
            id : id
        });
        item.layer.add( item.circle );
        
        
        /*var pullImage = new Kinetic.Image( {
            x : item.circle.getX() + nodeSize / 2 + 10 + pullMeSize / 2,
            y : item.circle.getY(),
            name : 1,
            width : pullMeSize,
            height : pullMeSize,
            id : "pullImage1",
            image : tool.images.pullImage,
            offset : [
                    pullMeSize / 2, pullMeSize / 2
            ],
            draggable : true
        });*/

        if (!freePlacement) {
            item.createNewMenu();
        }
        else {
            tool.menuOpen = false;
            item.isDependent = true;
        }
        
        // Add the delete button for independent nodes
        if( !item.isDependent && !tool.inTutorial ) {
            item.deleteButton = new Kinetic.Image( {
                x : 35,
                y : 35,
                width : 20,
                height : 20,
                image : tool.images.deleteXUp,
                id : "DeleteButton"
            });
            item.layer.add( item.deleteButton );
            
            // Mouse enter for changing button state
            item.deleteButton.on( 'mouseenter', function( event ) {
                item.deleteButton.setImage( tool.images.deleteXHover );
                tool.drawStage();
            });
            // Mouse leave for changing button state
            item.deleteButton.on( 'mouseleave', function( event ) {
                item.deleteButton.setImage( tool.images.deleteXUp );
                tool.drawStage();
            });
            // Mouse down for changing button state
            item.deleteButton.on( 'mousedown', function( event ) {
                item.deleteButton.setImage( tool.images.deleteXDown );
                tool.drawStage();
            });
            // Mouse down for changing button state
            item.deleteButton.on( 'mouseup', function( event ) {
                item.deleteButton.setImage( tool.images.deleteXUp );
                
                if (tool.menuOpen) {
                    item.deleteNewMenu();
                }
                
                item.suicide();
            });
        }

        // When we drag the layer, we will hide the hover and connection options menu if they are open
        item.layer.on( 'dragstart', function( event ) {
            dragging = true;
            // We are dragging the layer, so remove the hover menu
            item.destroyNewHoverMenu();

            if (connectionMenuId) {
                item.hideNewConnectionOptions( connectionMenuId );
            }
        } );

        // We are dragging the node, so all nodes need to be notified
        item.layer.on( 'dragmove', function( event ) {
            // Go through each connection and update the current position of the line
            $.each( item.connections, function( index, value ) {
                var itemId = value.id.substring( value.id.indexOf( '-' ) + 1, value.id.length );

                // Why are we going through each object? Can't we just utilize itemId?
                // We need to have access to the object so we can get the position. Having
                // access to the kinetic object won't give us the exact information we require
                $.each( tool.objectArray, function( objectIndex, objectValue ) {
                    if (objectValue.id == itemId) {
                        item.destroyConnection( value.id );
                        var currentPosition = item.circle.getPosition();
                        var toPosition = objectValue.getPosition();
                        toPosition.x -= item.layer.getX();
                        toPosition.y -= item.layer.getY();

                        item.connectionLine( currentPosition.x, currentPosition.y, toPosition.x, toPosition.y, value.id, value.isAdd );
                    }
                } );
            } );

            // Go through each node and notifying them that this node has moved due to the possibility
            // that this node is an endpoint of a connection
            $.each( tool.objectArray, function( objectIndex, objectValue ) {
                objectValue.nodeMovement( item );
            });

            tool.currentMousePositionCords.x = item.layer.getPosition().x;
            tool.currentMousePositionCords.y = item.layer.getPosition().y;

            if (item.circle.getId() == tool.currentSelectedCircle) {
            	tool.createToolTip(tool.currentPhase);
            }

            tool.fitView();
            tool.drawStage();
        } );

        item.layer.on( 'dragend', function( event ) {
            dragging = false;
            tool.isEventDirty = true;

            tool.currentMousePositionCords.x = item.layer.getPosition().x;
            tool.currentMousePositionCords.y = item.layer.getPosition().y;

            if (item.circle.getId() == tool.currentSelectedCircle) {
            	tool.createToolTip(tool.currentPhase);
            }
        } );

        // We are entering the circle so we should draw the menu
        item.circle.on( 'mouseenter', function( event ) {
            if (!tool.menuOpen && !item.hovering && tool.enabled( sdActions.hoverMenu )) {
                item.layer.moveToTop();
                item.createNewHoverMenu();
            }
        } );
        /*item.layer.on( 'click', function( event ) {
            if (item.isDependent) {
                tool.isEventDirty = true;
                return false;
            }

            tool.currentMousePositionCords.x = item.layer.getPosition().x;
            tool.currentMousePositionCords.y = item.layer.getPosition().y;

            if (!tool.menuOpen && !dragging && tool.textOptions.length > 0) {
                item.destroyNewHoverMenu();
                if (!tool.enabled( sdActions.textMenu )) {
                    return;
                }


                curPosX = ((event.offsetX || event.layerX) - 460);

                item.createNewMenu();

                tool.isEventDirty = true;
            }
        });*/

        item.circle.on( 'mouseleave', function( event ) {
            item.destroyNewHoverMenu();
        } );

        tool.stage.add( item.layer );
        tool.createEvent( "GL_Node_Created", 10, {
            name : tool.challengeName
        } );

        return item;
    }

    // We are destroying the node. I was sad when I named this function
    item.suicide = function() {
        var myIndex = -1;

        // Go through each node and let them know I have passed on
        $.each( tool.objectArray, function( index, value ) {
            value.nodeDeath( item );

            if (value.id == item.id) {
                myIndex = index;
            }
        } );

        item.layer.destroy();

        tool.objectArray.splice( myIndex, 1 );

        tool.drawStage();

        tool.createEvent( "GL_Node_Deleted", 10, {
            name : tool.challengeName,
            text : item.text
        } );

        tool.syncTextOptions();
    }

    // We have lost a friend so we must destroy any connection with them!
    // Let the fallen fall
    item.nodeDeath = function( node ) {
        $.each( item.connections.reverse(), function( index, value ) {
            if (!value) {
                return;
            }
            if (value.id) {
                var itemId = value.id.substring( value.id.indexOf( '-' ) + 1, value.id.length );

                if (itemId == node.id) {
                    item.destroyNewOptionsMenu( item.id + "-" + node.id );
                    item.destroyConnection( item.id + "-" + node.id );
                    item.connections.splice( index, 1 );
                }
            }
        } );
    }

    // Will create the menu for when the user mouses over the node. Will show the pull arrow to create connections
    item.createNewHoverMenu = function() {
        if (tool.viewingMode) {// || item.isDependent) {
            return false;
        }

        if (tool.swappedConnection) {
            tool.swappedConnection = false;
            return;
        }

        var pullImage = new Kinetic.Image( {
            x : item.circle.getX() + nodeSize / 2 + 10 + pullMeSize / 2,
            y : item.circle.getY(),
            name : 1,
            width : pullMeSize,
            height : pullMeSize,
            id : "pullImage1",
            image : tool.images.pullImage,
            offset : [
                    pullMeSize / 2, pullMeSize / 2
            ],
            draggable : true
        });

        function changePullImage(imageToChange) {
        	var pullImageToChange = item.layer.get("#pullImage1")[0];

        	if (pullImageToChange !== undefined) {
        		pullImageToChange.setImage(imageToChange);
        	}

        	tool.drawStage();
        }

    	// mouse animations for pull arrow image
		// mouse up, default image
        pullImage.on('mouseup', function () {
        	changePullImage(tool.images.pullImage);
        });

		// mouse down, selected image
        pullImage.on('mousedown', function () {
        	changePullImage(tool.images.pullImageDown);
        });

		// mouse enter, hover image.
        pullImage.on('mouseenter', function () {
        	changePullImage(tool.images.pullImageHover);
        });

		// mouse leave, defualt image
        pullImage.on('mouseleave', function () {
        	changePullImage(tool.images.pullImage);
        });

		// drag events for pull arrow image
        pullImage.on( 'dragstart', hoverCircleDragStartEvent );
        pullImage.on( 'dragmove', newHoverCircleDragMoveEvent );
        pullImage.on( 'dragend', newHoverCircleDragStopEvent );

    	// not sure why this is here, it causes a 
        // blue arrow to show when a circle is hovered over.
		/*
        item.createNewArrow( {
            x : item.circle.getX(),
            y : item.circle.getY()
        }, {
            x : item.circle.getX() - 130,
            y : item.circle.getY()
        }, "pullLine1" );
		*/

        var invisRect = new Kinetic.Rect( {
            x : item.circle.getX(),
            y : item.circle.getY() - 50,
            width : 160,
            height : 100,
            id : "pullRect1",
            opacity : 0
        } );

        item.hovering = true;

        item.layer.add( invisRect );
        item.layer.add( pullImage );

        tool.drawStage();
    }

    // Will destroy the hover menu of the circle
    item.destroyNewHoverMenu = function() {
        item.hovering = false;
        var circle = item.layer.get( "#nodeKiller" );
        if (circle) {
            circle.off( 'click' );
            circle.destroy();
        }

        tool.stage.get( "#back_pullLine1" ).destroy();
        tool.stage.get( "#arrow_pullLine1" ).destroy();
        tool.stage.get( "#pullLine1" ).destroy();
        tool.stage.get( "#pullRect1" ).destroy();
        tool.stage.get( "#pullImage1" ).destroy();
        tool.stage.get( "#pull1" ).destroy();

        tool.stage.draw();
    }

    // This will create a connection line from {fromX, fromY} to {toX, toY} with the id {id} and
    // if it is a positive correlation. Will also create the necessary connection options where
    // each connection option contains the hover rectangle, the text, and an icon.
    item.connectionLine = function( fromX, fromY, toX, toY, id, isAdd ) {
        // item.destroyOptionsMenu(id);
        item.destroyNewOptionsMenu( id );

        var hoverRect = new Kinetic.Rect( {
            x : -9999,
            y : -9999,
            width : connectionOptionsWidth + 100,
            height : connectionOptionsHeight * 3 + 60,
            fill : 'green',
            id : id + "_rect",
            opacity : 0
        } );

        var connectionIcon = new Kinetic.Image( {
            x : ( ( toX - fromX ) / 2 ) + fromX - connectionIconSize / 2,
            y : ( ( toY - fromY ) / 2 ) + fromY - connectionIconSize / 2,
            width : connectionIconSize,
            height : connectionIconSize,
            image : ( !isAdd && tool.images.subImageSelected ) || tool.images.addImageSelected,
            id : id + "_icon"
        } );

        var addRect = new Kinetic.Rect( {
            x : -9999,
            y : -9999,
            width : connectionOptionsWidth,
            height : connectionOptionsHeight,
            fill : "#aaa",
            id : id + "_addRect"
        } );

        var addIcon = new Kinetic.Image( {
            x : -9999,
            y : -9999,
            width : connectionIconSize * .7,
            height : connectionIconSize * .7,
            image : tool.images.addImageSelected,
            id : id + "_addIcon"
        } );

        var addText = new Kinetic.Text( {
            text : "Lead to more/higher",//"More " + item.text + ", More ",
            x : -9999,
            y : -9999,
            fill : 'black',
            fontSize : 12,
            width : connectionOptionsWidth * .6,
            id : id + "_addText"
        } );

        var subRect = new Kinetic.Rect( {
            x : -9999,
            y : -9999,
            width : connectionOptionsWidth,
            height : connectionOptionsHeight,
            fill : "#aaa",
            id : id + "_subRect"
        } );

        var subIcon = new Kinetic.Image( {
            x : -9999,
            y : -9999,
            width : connectionIconSize * .7,
            height : connectionIconSize * .7,
            image : tool.images.subImageSelected,
            id : id + "_subIcon"
        } );

        var subText = new Kinetic.Text( {
            text : "Lead to less/fewer",//"More " + item.text + ", Less ",
            x : -9999,
            y : -9999,
            fill : 'black',
            fontSize : 12,
            width : connectionOptionsWidth * .6,
            id : id + "_subText"
        } );

        var swapRect = new Kinetic.Rect( {
            x : -9999,
            y : -9999,
            width : connectionOptionsWidth,
            height : connectionOptionsHeight,
            fill : "#aaa",
            id : id + "_swapRect"
        } );

        var swapIcon = new Kinetic.Image( {
            x : -9999,
            y : -9999,
            width : connectionIconSize * .7,
            height : connectionIconSize * .7,
            image : tool.images.swapImageHover,
            id : id + "_swapIcon"
        } );

        var swapText = new Kinetic.Text( {
            text : "Change the direction",
            x : -9999,
            y : -9999,
            fill : 'black',
            fontSize : 12,
            width : connectionOptionsWidth * .6,
            id : id + "_swapText"
        } );

        var trashRect = new Kinetic.Rect( {
            x : -9999,
            y : -9999,
            width : connectionOptionsWidth,
            height : connectionOptionsHeight,
            fill : "#aaa",
            id : id + "_trashRect"
        } );

        var trashIcon = new Kinetic.Image( {
            x : -9999,
            y : -9999,
            width : connectionIconSize * .7,
            height : connectionIconSize * .7,
            image : tool.images.trashImageHover,
            id : id + "_trashIcon"
        } );

        var trashText = new Kinetic.Text( {
            text : "Delete the connection",
            x : -9999,
            y : -9999,
            fill : 'black',
            fontSize : 12,
            width : connectionOptionsWidth * .6,
            id : id + "_trashText"
        } );

        var mouseLeftEvent = function( x, y, id ) {
            var mousePosition = {
                x : x,
                y : y
            };

            if (checkLineMouseLeave( mousePosition, id )) {
                item.hideNewConnectionOptions( id );
            }
        }

        addRect.on( "mouseenter", function( event ) {
            this.setFill( "#eee" );
            subRect.setFill( "#aaa" );
            swapRect.setFill( "#aaa" );
            trashRect.setFill( "#aaa" );
            
            tool.drawStage();
        } );

        addRect.on( "mouseleave", function( event ) {
            if (!checkLeftObject( {
                x : event.pageX,
                y : event.pageY
            }, this ))
                return;
            this.setFill( "#aaa" );
            mouseLeftEvent( event.pageX, event.pageY, this.attrs.id.substring( 0, this.attrs.id.indexOf( "_addRect" ) ) );
            tool.drawStage();
        } );

        addRect.on( "click", function( event ) {
            addClickEvent( this );
        } );

        addText.on( "click", function( event ) {
            addClickEvent( this );
        } );

        addIcon.on( "click", function( event ) {
            addClickEvent( this );
        } );

        subRect.on( "mouseenter", function( event ) {
            this.setFill( "#eee" );
            addRect.setFill( "#aaa" );
            swapRect.setFill( "#aaa" );
            trashRect.setFill( "#aaa" );
            
            tool.drawStage();
        } );

        subRect.on( "mouseleave", function( event ) {
            if (!checkLeftObject( {
                x : event.pageX,
                y : event.pageY
            }, this ))
                return;
            this.setFill( "#aaa" );
            mouseLeftEvent( event.pageX, event.pageY, this.attrs.id.substring( 0, this.attrs.id.indexOf( "_subRect" ) ) );
            tool.drawStage();
        } );

        subRect.on( "click", function( event ) {
            subClickEvent( this );
        } );

        subText.on( "click", function( event ) {
            subClickEvent( this );
        } );

        subIcon.on( "click", function( event ) {
            subClickEvent( this );
        } );

        swapRect.on( "mouseenter", function( event ) {
            this.setFill( "#eee" );
            addRect.setFill( "#aaa" );
            subRect.setFill( "#aaa" );
            trashRect.setFill( "#aaa" );
            
            tool.drawStage();
        } );

        swapRect.on( "mouseleave", function( event ) {
            if (!checkLeftObject( {
                x : event.pageX,
                y : event.pageY
            }, this ))
                return;
            this.setFill( "#aaa" );
            mouseLeftEvent( event.pageX, event.pageY, this.attrs.id.substring( 0, this.attrs.id.indexOf( "_swapRect" ) ) );
            tool.drawStage();
        } );

        swapRect.on( "click", function( event ) {
            swapClickEvent( this );
        } );

        swapText.on( "click", function( event ) {
            swapClickEvent( this );
        } );

        swapIcon.on( "click", function( event ) {
            swapClickEvent( this );
        } );

        trashRect.on( "mouseenter", function( event ) {
            this.setFill( "#eee" );
            addRect.setFill( "#aaa" );
            subRect.setFill( "#aaa" );
            swapRect.setFill( "#aaa" );
            
            tool.drawStage();
        } );

        trashRect.on( "mouseleave", function( event ) {
            if (!checkLeftObject( {
                x : event.pageX,
                y : event.pageY
            }, this ))
                return;
            this.setFill( "#aaa" );
            mouseLeftEvent( event.pageX, event.pageY, this.attrs.id.substring( 0, this.attrs.id.indexOf( "_trashRect" ) ) );
            tool.drawStage();
        } );

        trashRect.on( "click", function( event ) {
            trashClickEvent( this );
        } );

        trashText.on( "click", function( event ) {
            trashClickEvent( this );
        } );

        trashIcon.on( "click", function( event ) {
            trashClickEvent( this );
        } );

        connectionIcon.on("mouseenter", function (event) {
            if (!tool.enabled( sdActions.connectionOptions )) {
                return;
            }
            if (tool.menuOpen || tool.viewingMode)
                return;
            var id = this.attrs.id.substring( 0, this.attrs.id.indexOf( "_icon" ) );

            var isAdd = false;
            $.each( item.connections, function( index, value ) {
            	if (value.id == id) {
                    isAdd = value.isAdd
                }
            } );
            
            addRect.setFill( "#aaa" );
            subRect.setFill( "#aaa" );
            swapRect.setFill( "#aaa" );
            trashRect.setFill( "#aaa" );
            
            // console.log(isAdd);
            item.displayNewConnectionOptions( id, isAdd );
        } );

        connectionIcon.on( "mouseleave", function( event ) {
            if (!tool.enabled( sdActions.connectionOptions )) {
                return;
            }
            mouseLeftEvent( event.pageX, event.pageY, this.attrs.id.substring( 0, this.attrs.id.indexOf( "_icon" ) ) );
        } );

        hoverRect.on( "mouseleave", function( event ) {
            mouseLeftEvent( event.pageX, event.pageY, this.attrs.id.substring( 0, this.attrs.id.indexOf( "_rect" ) ) );
        } );

        item.layer.add( hoverRect );
        item.layer.add( connectionIcon );

        item.layer.add( addRect );
        item.layer.add( addIcon );
        item.layer.add( addText );

        item.layer.add( subRect );
        item.layer.add( subIcon );
        item.layer.add( subText );

        item.layer.add( swapRect );
        item.layer.add( swapIcon );
        item.layer.add( swapText );

        item.layer.add( trashRect );
        item.layer.add( trashIcon );
        item.layer.add( trashText );

        item.createNewArrow( {
            x : fromX,
            y : fromY
        }, {
            x : toX,
            y : toY
        }, id );

        item.layer.get( "#arrow_" + id )[ 0 ].moveToBottom();
        item.layer.get( "#" + id )[ 0 ].moveToBottom();
        item.layer.get( "#back_" + id )[ 0 ].moveToBottom();
    }

    // This will create the actual arrow along with the arrowhead
    item.createNewArrow = function( from, to, id ) {
        var vector = {
            x : to.x - from.x,
            y : to.y - from.y
        };

        var magnitude = Math.sqrt( ( vector.x * vector.x ) + ( vector.y * vector.y ) );

        var theta = vector.x / magnitude;

        var radians = Math.acos( theta );

        var endPosition = {
            x : vector.x / magnitude,
            y : vector.y / magnitude
        }

        endPosition.x = ( endPosition.x * ( magnitude - 100 ) ) + from.x;// - (vector.x * 0.1);
        endPosition.y = ( endPosition.y * ( magnitude - 100 ) ) + from.y;// - (vector.y * 0.1);

        if (( endPosition.x > 0 && to.x < 0 ) || ( endPosition.x < 0 && to.x > 0 ) || ( endPosition.y > 0 && to.y < 0 ) || ( endPosition.y < 0 && to.y > 0 )) {
            // endPosition = from;
        }

        if (vector.y > 0) {
            radians *= -1;
        }

        if (id == "pullLine1") {
            var image = item.layer.get( "#pullImage1" )[ 0 ];
            if (image) {
                image.setRotation( radians * -1 );
            }
        }

        var backLine = new Kinetic.Line( {
            points : [
                    from.x, from.y, endPosition.x, endPosition.y
            ],
            stroke : "white",
            strokeWidth : 10,
            id : "back_" + id
        } );

        var line = new Kinetic.Line( {
            points : [
                    from.x, from.y, endPosition.x, endPosition.y
            ],
            stroke : "#265E94",
            strokeWidth : 7,
            id : id
        } );

        var arrowSize = 28;

        var arrowHead = new Kinetic.Image( {
            x : endPosition.x,
            y : endPosition.y,
            width : arrowSize,
            height : arrowSize,
            id : "arrow_" + id,
            offset : [
                    arrowSize / 2 - 1, arrowSize / 2 - 1
            ],
            image : tool.images.arrowHead
        } );

        arrowHead.setRotation( radians * -1 );

        backLine.on( 'mouseenter', function( event ) {
            event.cancelBubble = true;
        } );

        backLine.on( 'mouseleave', function( event ) {
            item.destroyNewHoverMenu();
            event.cancelBubble = true;
        } );

        item.layer.add( backLine );
        item.layer.add( line );
        item.layer.add( arrowHead );
    }

    // Will display the connection options such as changing correlation or direction of the connection along with deleting
    item.displayNewConnectionOptions = function( id, isAdd ) {
        connectionMenuId = id;

        var iconPosition = item.layer.get( "#" + id + "_icon" )[ 0 ].getPosition();

        var xPosition = iconPosition.x - connectionOptionsWidth / 2 + connectionIconSize / 2;

        item.layer.get( "#" + id + "_rect" )[ 0 ].setPosition( {
            x : iconPosition.x - connectionOptionsWidth / 2 - 40,
            y : iconPosition.y - connectionOptionsHeight * 3 - 30
        } );

        item.layer.get( "#" + id + "_addRect" )[ 0 ].setPosition( {
            x : xPosition,
            y : iconPosition.y - connectionOptionsHeight * 3
        } );
        item.layer.get( "#" + id + "_addIcon" )[ 0 ].setPosition( {
            x : xPosition + 5,
            y : iconPosition.y - connectionOptionsHeight * 3 + 10
        } );
        item.layer.get( "#" + id + "_addText" )[ 0 ].setPosition( {
            x : xPosition + 50,
            y : iconPosition.y - connectionOptionsHeight * 3 + 10
        } );

        item.layer.get( "#" + id + "_subRect" )[ 0 ].setPosition( {
            x : xPosition,
            y : iconPosition.y - connectionOptionsHeight * 3
        } );
        item.layer.get( "#" + id + "_subIcon" )[ 0 ].setPosition( {
            x : xPosition + 5,
            y : iconPosition.y - connectionOptionsHeight * 3 + 10
        } );
        item.layer.get( "#" + id + "_subText" )[ 0 ].setPosition( {
            x : xPosition + 50,
            y : iconPosition.y - connectionOptionsHeight * 3 + 10
        } );

        // Since both add and sub options are visible, we have to move the one that is currently required to the top of the layer
        if (!isAdd) {
            item.layer.get( "#" + id + "_addRect" )[ 0 ].moveToTop();
            item.layer.get( "#" + id + "_addIcon" )[ 0 ].moveToTop();
            item.layer.get( "#" + id + "_addText" )[ 0 ].moveToTop();
        }
        else {
            item.layer.get( "#" + id + "_subRect" )[ 0 ].moveToTop();
            item.layer.get( "#" + id + "_subIcon" )[ 0 ].moveToTop();
            item.layer.get( "#" + id + "_subText" )[ 0 ].moveToTop();
        }

        item.layer.get( "#" + id + "_swapRect" )[ 0 ].setPosition( {
            x : xPosition,
            y : iconPosition.y - connectionOptionsHeight * 2
        } );
        item.layer.get( "#" + id + "_swapIcon" )[ 0 ].setPosition( {
            x : xPosition + 5,
            y : iconPosition.y - connectionOptionsHeight * 2 + 10
        } );
        item.layer.get( "#" + id + "_swapText" )[ 0 ].setPosition( {
            x : xPosition + 50,
            y : iconPosition.y - connectionOptionsHeight * 2 + 10
        } );

        item.layer.get( "#" + id + "_trashRect" )[ 0 ].setPosition( {
            x : xPosition,
            y : iconPosition.y - connectionOptionsHeight
        } );
        item.layer.get( "#" + id + "_trashIcon" )[ 0 ].setPosition( {
            x : xPosition + 5,
            y : iconPosition.y - connectionOptionsHeight + 10
        } );
        item.layer.get( "#" + id + "_trashText" )[ 0 ].setPosition( {
            x : xPosition + 50,
            y : iconPosition.y - connectionOptionsHeight + 10
        } );

        item.layer.moveToTop();
        tool.drawStage();
    }

    // Hide the connection options by throwing them way off screen
    item.hideNewConnectionOptions = function( id ) {
        connectionMenuId = null;

        item.layer.get( "#" + id + "_rect" )[ 0 ].setPosition( {
            x : -9999,
            y : -9999
        } );

        item.layer.get( "#" + id + "_addRect" )[ 0 ].setPosition( {
            x : -9999,
            y : -9999
        } );
        item.layer.get( "#" + id + "_addIcon" )[ 0 ].setPosition( {
            x : -9999,
            y : -9999
        } );
        item.layer.get( "#" + id + "_addText" )[ 0 ].setPosition( {
            x : -9999,
            y : -9999
        } );

        item.layer.get( "#" + id + "_subRect" )[ 0 ].setPosition( {
            x : -9999,
            y : -9999
        } );
        item.layer.get( "#" + id + "_subIcon" )[ 0 ].setPosition( {
            x : -9999,
            y : -9999
        } );
        item.layer.get( "#" + id + "_subText" )[ 0 ].setPosition( {
            x : -9999,
            y : -9999
        } );

        item.layer.get( "#" + id + "_swapRect" )[ 0 ].setPosition( {
            x : -9999,
            y : -9999
        } );
        item.layer.get( "#" + id + "_swapIcon" )[ 0 ].setPosition( {
            x : -9999,
            y : -9999
        } );
        item.layer.get( "#" + id + "_swapText" )[ 0 ].setPosition( {
            x : -9999,
            y : -9999
        } );

        item.layer.get( "#" + id + "_trashRect" )[ 0 ].setPosition( {
            x : -9999,
            y : -9999
        } );
        item.layer.get( "#" + id + "_trashIcon" )[ 0 ].setPosition( {
            x : -9999,
            y : -9999
        } );
        item.layer.get( "#" + id + "_trashText" )[ 0 ].setPosition( {
            x : -9999,
            y : -9999
        } );

        tool.drawStage();
    }

    var destroyOption = function( id ) {
        var option = item.layer.get( "#" + id )[ 0 ];

        if (option) {
            option.off( 'mouseenter' );
            option.off( 'mouseleave' );
            option.off( 'click' );
            option.destroy();
        }
    }

    item.destroyNewOptionsMenu = function( id ) {
        connectionMenuId = null;

        destroyOption( id + "_rect" );

        destroyOption( id + "_icon" );

        destroyOption( id + "_addRect" );
        destroyOption( id + "_addIcon" );
        destroyOption( id + "_addText" );

        destroyOption( id + "_subRect" );
        destroyOption( id + "_subIcon" );
        destroyOption( id + "_subText" );

        destroyOption( id + "_swapRect" );
        destroyOption( id + "_swapIcon" );
        destroyOption( id + "_swapText" );

        destroyOption( id + "_trashRect" );
        destroyOption( id + "_trashIcon" );
        destroyOption( id + "_trashText" );

        tool.drawStage();
    }

    // A node has moved so we need to make sure that any and all
    // connections linked to that node are adjusted
    item.nodeMovement = function( node ) {
        $.each( item.connections, function( index, value ) {
            var connectionEndId = value.id.substring( value.id.indexOf( '-' ) + 1, value.id.length );
            if (connectionEndId == node.id) {
                // The connection exists so we have to update the position of the connection
                item.destroyConnection( value.id );
                var currentPosition = item.circle.getPosition();
                var toPosition = node.getPosition();
                toPosition.x -= item.layer.getX();
                toPosition.y -= item.layer.getY();

                item.connectionLine( currentPosition.x, currentPosition.y, toPosition.x, toPosition.y, value.id, value.isAdd );
            }
        });
    }

    item.isSelected = function() {
        return item.layer.get( "#textTriangle" ).length > 0;
    }

    item.createNewMenu = function() {
        var trianglePosition = item.circle.getPosition();
		var menuIsOnRight = true;

        /*if (curPosX > (tool.stage.getWidth() / 2)) {
        	menuIsOnRight = false;
        }*/

        tool.menuOpen = true;
        var triangle = new Kinetic.RegularPolygon( {
            sides : 3,
            radius : 15,
            fill : "#eee",
            strokeWidth : 0,
            id : "textTriangle",
            rotationDeg : (menuIsOnRight) ? -90 : 90,
            x: (menuIsOnRight) ? (trianglePosition.x + nodeSize / 2 + 15) : (trianglePosition.x - nodeSize / 2 - 15),
            y : trianglePosition.y
        } );

        var maxWidth = 0;
        // Determine the max width of the text selection box
        for( var i = 0, textLength = tool.textOptions.length; i < textLength; i++ ) {
            var thisLength = tool.textOptions[ i ].text.length * 10;
            if (maxWidth < thisLength) {
                maxWidth = thisLength;
            }
        }

        var itemHeight = 25;

        $.each( tool.textOptions, function( index, value ) {
        	var startX = (menuIsOnRight) ? (trianglePosition.x + nodeSize / 2 + 22) : (trianglePosition.x - nodeSize / 2 - 92);
            var startY = trianglePosition.y - ( tool.textOptions.length / 2.0 * 20 ) - 10 + ( index * itemHeight );
            var textRect = new Kinetic.Rect( {
                x : startX,
                y : startY,
                width : maxWidth,
                height : itemHeight,
                fill : "#eee",
                cornerRadius : 2,
                id : "textRect_" + index
            } );

            var textItem = new Kinetic.Text( {
                text : value.text,
                name : value.metadata,
                x : startX + 8,
                y : startY + 2,
                fill : 'black',
                fontSize : 18,
                fontFamily : 'Calibri',
                id : "textItem_" + index
            } );

            // A text item has been selected so we are going to change the node item
            textItem.on( "click", function( event ) {
            	tool.isEventDirty = true;

            	tool.currentMousePositionCords.x = item.layer.getPosition().x;
            	tool.currentMousePositionCords.y = item.layer.getPosition().y;

                if (!tool.enabled( sdActions.setText, this.getText() )) {
                    return;
                }

                var textItem = this;
                item.deleteNewMenu();

                var textToSet = this.getText();
                var nameToSet = this.getName();

                item.setImageOnCircle(this.getText(), function () { item.setText(textToSet, nameToSet); });
            } );

            textItem.on( "mouseenter", function( event ) {
                var textItem = this;
                inHover = true;

                var index = this.attrs.id.replace( "textItem_", "" );

                this.setFill( "#00aaee" );

                item.layer.get( "#textRect_" + index )[ 0 ].setFill( "#fff" );

                tool.stage.draw();
            } );

            textItem.on( "mouseleave", function( event ) {
                if (!inHover) {
                    return;
                }

                inHover = false;
                var textItem = this;
                this.setFill( "#000" );
                var rect = item.layer.get( "#textRect_" + index )[ 0 ];
                if (rect) {
                    rect.setFill( "#eee" );
                }

                tool.stage.draw();
            } );

            item.layer.add( textRect );
            item.layer.add( textItem );
            if (index > 0) {
                var points = [
                        startX, startY, startX + maxWidth, startY
                ]
                var textLineBottom = new Kinetic.Line( {
                    points : points,
                    stroke : "#ffffff",
                    strokeWidth : 2,
                    id : "textLineTop_" + index
                } );

                item.layer.add( textLineBottom );
            }

            if (index < tool.textOptions.length - 1) {
                var points = [
                        startX, startY + itemHeight - 1, startX + maxWidth, startY + itemHeight
                ]
                var textLineTop = new Kinetic.Line( {
                    points : points,
                    stroke : "#888",
                    strokeWidth : 2,
                    id : "textLineBottom_" + index
                } );

                item.layer.add( textLineTop );
            }
        } );

        item.layer.add( triangle );

        tool.drawStage();
    }

    item.deleteNewMenu = function() {
        item.layer.get( "#textTriangle" ).destroy();

        $.each( tool.textOptions, function( index, value ) {
            item.layer.get( "#textItem_" + index ).destroy();
            item.layer.get( "#textRect_" + index ).destroy();
            item.layer.get( "#textLineTop_" + index ).destroy();
            item.layer.get( "#textLineBottom_" + index ).destroy();
        } );

        tool.menuOpen = false;
        tool.stage.draw();
    }

    // Text has been selected, so we will name the node
    item.setText = function( text, metadata ) {
        if (tool.menuOpen) {
            item.deleteNewMenu();
        }

        var fontSize = nodeSize * .2;

        var parts = text.split();
        var longestLength = 0;

        for( var i = 0; i < parts.length; i++ ) {
            if (parts[ i ].length > longestLength) {
                longestLength = parts[ i ].length;
            }
        }

        if (text.length > 15) {
            fontSize -= ( text.length - 15 ) / 4
        }
        else if (longestLength > 8) {
            fontSize -= ( longestLength - 8 ) * 2;
        }

        if (fontSize < 14) {
            fontSize = 14;
        }

        if (item.textElement == null) {

			item.textElement = new Kinetic.Text( {
				x : item.circle.getX() - nodeSize / 2 + 10,
				y : item.circle.getY() - nodeSize / 2 + 60,
				text: text,
				name : metadata,
				fill: '#265e94',
				fontFamily: 'Calibri',
				fontStyle: 'bold',
				width : nodeSize - 20,
				height : nodeSize - 40,
				align : 'center',
				id : item.id + "_text"
			} );

			item.textElement.on( 'click', function( event ) {
                if (item.isDependent) {
                    tool.isEventDirty = true;
                    return false;
                }

                tool.currentMousePositionCords.x = item.layer.getPosition().x;
                tool.currentMousePositionCords.y = item.layer.getPosition().y;

                if (!tool.menuOpen && !dragging && tool.textOptions.length > 0) {
                    item.destroyNewHoverMenu();
                    if (!tool.enabled( sdActions.textMenu )) {
                        return;
                    }


                    curPosX = ((event.offsetX || event.layerX) - 460);

                    item.createNewMenu();

                    tool.isEventDirty = true;
                }
            } );

            // We are entering the textElement so we should draw the menu
            item.textElement.on( 'mouseenter', function( event ) {
                if (!tool.menuOpen && !item.hovering && tool.enabled( sdActions.hoverMenu )) {
                    item.layer.moveToTop();
                    item.createNewHoverMenu();
                }
            });

            item.layer.add(item.textElement);

            tool.createEvent( "GL_Node_Name", 10, {
                name : tool.challengeName,
                text : text
            });
        }
        else {
    	    item.textElement.setText(text);
            item.textElement.setName( metadata );

            tool.createEvent( "GL_Node_Rename", 10, {
                name : tool.challengeName,
                text : text
            });
        }

        fontSize = 16;

        item.textElement.setFontSize( fontSize );

        item.text = text;
        item.metadata = metadata;
        tool.stage.draw();

        tool.syncTextOptions();
    }

    item.setImageOnCircle = function (text, callback) {
    	var iconImages = {
    		'pollution': { x: 82, y: 58, w: 32, h: 32, src: '../challenges/images/Icon_AirPollution.png' },
    		'apartments': { x: 82, y: 58, w: 32, h: 32, src: '../challenges/images/Icon_Apartments.png' },
    		'buses': { x: 82, y: 58, w: 32, h: 32, src: '../challenges/images/Icon_Buses.png' },
    		'bus_stop': { x: 84, y: 54, w: 59, h: 41, src: '../challenges/images/Icon_BusStops.png' },
    		'coal': { x: 86, y: 58, w: 28, h: 28, src: '../challenges/images/Icon_CoalPowerPlants.png' },
    		'factories': { x: 82, y: 58, w: 32, h: 32, src: '../challenges/images/Icon_Factories.png' },
    		'homes': { x: 82, y: 58, w: 32, h: 32, src: '../challenges/images/Icon_Homes.png' },
    		'hospitals': { x: 82, y: 58, w: 32, h: 32, src: '../challenges/images/Icon_Hospitals.png' },
    		'jobs': { x: 82, y: 58, w: 32, h: 32, src: '../challenges/images/Icon_Jobs.png' },
    		'libraries': { x: 86, y: 58, w: 28, h: 28, src: '../challenges/images/Icon_Libraries.png' },
    		'offices': { x: 78, y: 50, w: 40, h: 40, src: '../challenges/images/Icon_Offices.png' },
    		'power': { x: 82, y: 58, w: 32, h: 32, src: '../challenges/images/Icon_Power.png' },
    		'roads': { x: 82, y: 58, w: 32, h: 32, src: '../challenges/images/Icon_Roads.png' },
    		'schools': { x: 84, y: 58, w: 28, h: 28, src: '../challenges/images/Icon_Schools.png' },
    		'shops': { x: 84, y: 58, w: 32, h: 32, src: '../challenges/images/Icon_Shops.png' },
    		'solar': { x: 82, y: 58, w: 32, h: 32, src: '../challenges/images/Icon_SolarPowerPlants.png' },
    		'kids': { x: 82, y: 58, w: 32, h: 32, src: '../challenges/images/Icon_Students.png' },
    		'wind': { x: 84, y: 58, w: 28, h: 28, src: '../challenges/images/Icon_WindPowerPlants.png' },
    	};

    	var texts = [
			{ text: 'Pollution', key: 'pollution' },
			{ text: 'Apartments', key: 'apartments' },
			{ text: 'Buses', key: 'buses' },
			{ text: 'Bus Stops', key: 'bus_stop' },
			{ text: 'Coal', key: 'coal' },
			{ text: 'Factories', key: 'factories' },
			{ text: 'Homes', key: 'homes' },
			{ text: 'Houses', key: 'homes' },
			{ text: 'Hospitals', key: 'hospitals' },
			{ text: 'Jobs', key: 'jobs' },
			{ text: 'Libraries', key: 'libraries' },
			{ text: 'Office', key: 'offices' },
			{ text: 'Roads', key: 'roads' },
			{ text: 'Schools', key: 'schools' },
			{ text: 'Shops', key: 'shops' },
			{ text: 'Stores', key: 'shops' },
			{ text: 'Solar', key: 'solar' },
			{ text: 'Kids', key: 'kids' },
			{ text: 'Wind', key: 'wind' },
			{ text: 'Power', key: 'power' },
			{ text: 'Residential', key: 'homes' },
			{ text: 'Commercial', key: 'shops' },
			{ text: 'Industrial', key: 'factories' },
    	];

    	var iconImage = null;

    	for (var i = 0; i < texts.length; i++) {
    		if (text.indexOf(texts[i].text) !== -1) {
    			if (iconImage == null) {
    				iconImage = texts[i].key;
    			}
    		}
    	}

    	if (iconImage !== null) {
    		var icon = iconImages[iconImage];
    		var imageObj = new Image();

    		imageObj.onload = function () {
    			var imageObj2 = new Kinetic.Image({
    				x: icon.x,
    				y: icon.y,
    				image: imageObj,
    				width: icon.w,
    				height: icon.h,
    				id: "NodeIcon"
    			});
    			
    			// Remove existing icons from the layer before adding a new one
    			for( var i = 0; i < item.layer.getChildren().length; i++ ) {
    				if( item.layer.getChildren()[i].getId() == "NodeIcon" ) {
    					item.layer.getChildren()[i].destroy();
    				}
    			}

    			item.layer.add(imageObj2);

    			if (callback !== undefined) {
    				callback();
    			}

    			tool.stage.draw();
    		};

    		imageObj.src = icon.src;
    	} else {
    		if (callback !== undefined) {
    			callback();
    		}
    	}
    }

    // Gets the position of the circle outside of just the layer
    item.getPosition = function() {
        var circlePosition = item.circle.getPosition();
        var layerPosition = item.layer.getPosition();

        return {
            x : circlePosition.x + layerPosition.x,
            y : circlePosition.y + layerPosition.y
        };
    }

    item.hoverCheck = function( position, bounds ) {
        bounds = bounds || 70
        var circlePosition = item.getPosition();
        return position.x > circlePosition.x - bounds && position.x < circlePosition.x + bounds && position.y > circlePosition.y - bounds && position.y < circlePosition.y + bounds;
    }

    // Will create a connection using this as the origin and will link to @toNode
    item.createConnection = function( toNode, isAdd ) {
        var newConnection = {
            targetId : toNode.id,
            isAdd : isAdd,
            id : item.id + "-" + toNode.id
        };

        var connectionExists = false;

        var swappedId = toNode.id + "-" + item.id;

        $.each( tool.objectArray, function( index, value ) {
            for( var i = 0, connectionLength = value.connections.length; i < connectionLength; i++ ) {
                var connectionValue = value.connections[ i ];

                if (connectionValue.id == newConnection.id || connectionValue.id == swappedId) {
                    connectionExists = true;
                    return false;
                }
            }
        } );

        if (connectionExists) {
            alert( 'You all ready have a connection for that node.' );
        }
        else {
            item.connectionLine( item.circle.getX(), item.circle.getY(), toNode.getPosition().x - item.layer.getX(),
                toNode.getPosition().y - item.layer.getY(), newConnection.id, isAdd );
            item.connections.push( newConnection );

            tool.createEvent( "GL_Node_Connection", 10, {
                name : tool.challengeName,
                connectedFrom : item.text,
                connectedTo : tool.stage.get( "#" + newConnection.targetId + "_text" )[ 0 ].getText()
            } );
        }
    }

    var checkLeftObject = function( mousePosition, object ) {
        var sectionOffset = $( "#systemsDiagram section" ).offset();

        var scale = tool.stage.getScale();

        var scaledMouse = {
            x : ( mousePosition.x - sectionOffset.left ) / scale.x,
            y : ( mousePosition.y - sectionOffset.top ) / scale.y
        };

        var rectPosition = {
            x : ( object.getX() + item.layer.getX() ),
            y : ( object.getY() + item.layer.getY() )
        };

        var rectWidth = object.getWidth();
        var rectHeight = object.getHeight();

        if (scaledMouse.x > rectPosition.x && scaledMouse.x < ( rectPosition.x + rectWidth ) && scaledMouse.y > rectPosition.y && scaledMouse.y < ( rectPosition.y + rectHeight )) {
            return false;
        }
        else {
            return true;
        }
    }

    // Checks to see if the mouse has exited the space of the connection hover icon menu. This
    // should never be the case due to the increased size of the hover rectangle
    var checkLineMouseLeave = function( mousePosition, id ) {
        var rect = item.layer.get( "#" + id + "_rect" )[ 0 ];

        var sectionOffset = $( "#systemsDiagram section" ).offset();

        var scale = tool.stage.getScale();

        var scaledMouse = {
            x : ( mousePosition.x - sectionOffset.left ) / scale.x,
            y : ( mousePosition.y - sectionOffset.top ) / scale.y
        };

        var rectPosition = {
            x : ( rect.getX() + item.layer.getX() ),
            y : ( rect.getY() + item.layer.getY() )
        };

        var rectWidth = rect.getWidth();
        var rectHeight = rect.getHeight();

        if (scaledMouse.x > rectPosition.x + 10 && scaledMouse.x < ( rectPosition.x + rectWidth - 10 ) && scaledMouse.y > rectPosition.y + 10 && scaledMouse.y < ( rectPosition.y + rectHeight - 10 )) {
            return false;
        }
        else {
            return true;
            item.hideConnectionOptions( id );
        }

        tool.drawStage();
    }

    item.destroyConnection = function( id ) {
        item.layer.get( "#back_" + id ).destroy();
        item.layer.get( "#arrow_" + id ).destroy();
        item.layer.get( "#" + id ).destroy();
        item.layer.get( "#" + id + "_rect" ).destroy();
    }

    var hoverConnection = function( event ) {
        event.cancelBubble = true;
    };

    var hoverCircleDragStartEvent = function( event ) {
        event.cancelBubble = true;
    };

    var newHoverCircleDragMoveEvent = function( event ) {
        var arrow = this;
        var startPosition = item.circle.getPosition();

        var currentPosition = pullImagePosition();
        // currentPosition.x += pullMeSize/2;
        // currentPosition.y += pullMeSize/2;

        var positionVector = {
            x : currentPosition.x - startPosition.x,
            y : currentPosition.y - startPosition.y
        }

        var magnitude = Math.sqrt( ( positionVector.x * positionVector.x ) + ( positionVector.y * positionVector.y ) );

        // Normalize vector
        positionVector.x = positionVector.x / magnitude;
        positionVector.y = positionVector.y / magnitude;

        var theta = positionVector.y;

        var circlePosition = {
            x : currentPosition.x + item.layer.getX() + pullMeSize / 2,
            y : currentPosition.y + item.layer.getY() + pullMeSize / 2
        };

        $.each( tool.objectArray, function( index, value ) {
            if (value.id != item.id) {
                if (value.hoverCheck( circlePosition )) {
                    arrow.setX( value.getPosition().x - item.layer.getX() );
                    arrow.setY( value.getPosition().y - item.layer.getY() );
                    value.layer.moveToTop();
                    arrow.moveToBottom();
                    return false;
                }
            }
        } );

        currentPosition = pullImagePosition();

        item.layer.get( "#pullLine1" ).destroy();
        item.layer.get( "#back_pullLine1" ).destroy();
        item.layer.get( "#arrow_pullLine1" ).destroy();

        item.createNewArrow( {
            x : item.circle.getPosition().x,
            y : item.circle.getPosition().y
        }, {
            x : currentPosition.x + pullMeSize / 2,
            y : currentPosition.y + pullMeSize / 2
        }, "pullLine1" );

        // arrow.setRotation(Math.acos(theta));
        item.layer.get( "#arrow_pullLine1" )[ 0 ].moveToBottom();
        item.layer.get( "#pullLine1" )[ 0 ].moveToBottom();
        item.layer.get( "#back_pullLine1" )[ 0 ].moveToBottom();
    }

    var newHoverCircleDragStopEvent = function( event ) {
        var circle = this;

        var circleSize = circle.getWidth();

        var position = pullImagePosition();

        var circlePosition = {
            x : position.x + item.layer.getX() + circleSize / 2,
            y : position.y + item.layer.getY() + circleSize / 2
        }

        var madeConnection = false;

        $.each( tool.objectArray, function( index, value ) {
            if (value.id != item.id) {
                if (value.hoverCheck( circlePosition )) {
                    madeConnection = true;

                    // Create connection
                    var newConnection = {
                        targetId : value.id,
                        isAdd : (value.id == 'Kids at School') ? false : true,
                        id : item.id + "-" + value.id
                    };

                    var connectionExists = false;

                    var swappedId = value.id + "-" + item.id;

                    for( var i = 0, objectLength = tool.objectArray.length; i < objectLength; i++ ) {
                        $.each( tool.objectArray[ i ].connections, function( connectionIndex, connectionValue ) {
                            if (connectionValue.id == newConnection.id || connectionValue.id == swappedId) {
                                connectionExists = true;
                                return false;
                            }
                        } );
                    }

                    if (connectionExists) {
                        alert( 'You all ready have a connection for that node.' );
                    }
                    else {
                        var connectionType = sdActions.createConnection;

                        if (value.isDependent) {
                            if (!item.isDependent) {
                                connectionType = sdActions.independentToDependentConnection;
                            }
                            else {
                                connectionType = sdActions.dependentToDependentConnection;
                            }
                        }

                        if (tool.enabled( connectionType )) {
                            item.connectionLine( item.circle.getX(), item.circle.getY(), value.getPosition().x - item.layer.getX(),
                                value.getPosition().y - item.layer.getY(), newConnection.id, (value.id == 'Kids at School') ? false : true);
                            item.connections.push( newConnection );

                            // Set the libretto text
                            var connectedFrom = item.text;
                            var connectedTo = tool.stage.get( "#" + newConnection.targetId + "_text" )[ 0 ].getText();
                            tool.displayLibretto( true, connectedFrom, connectedTo );

                            tool.createEvent( "GL_Node_Connection", 10, {
                                name : tool.challengeName,
                                connectedFrom : connectedFrom,
                                connectedTo : connectedTo
                            } );
                        }
                    }

                    return false;
                }
            }
        });

        // Make sure that a connection wasn't made and the circle is at a far enough distance to create a node
        if (!madeConnection && tool.textOptions.length > 0 && tool.enabled( sdActions.createNode )) {
            var newItem = new diagramItem( tool );
            var newId = tool.getNewId();
            tool.objectArray.push( newItem.init( circlePosition.x, circlePosition.y, newId ) );

            var newConnection = {
                targetId : newId,
                isAdd : true,
                id : item.id + "-" + newId
            };

            item.connectionLine( item.circle.getX(), item.circle.getY(), newItem.getPosition().x - item.layer.getX(), newItem.getPosition().y - item.layer
                    .getY(), newConnection.id, true );
            item.connections.push( newConnection );
            tool.createEvent( "GL_Node_Connection", 10, {
                name : tool.challengeName,
                connectedFrom : item.text,
                connectedTo : "Empty Node"
            } );
        }

        tool.drawStage();

        tool.isEventDirty = true;
        item.destroyNewHoverMenu();

        event.cancelBubble = true;
    }

    var subClickEvent = function (event) {
    	tool.currentMousePositionCords.x = item.layer.getPosition().x;
    	tool.currentMousePositionCords.y = item.layer.getPosition().y;

        if (!tool.enabled( sdActions.negative )) {
            return;
        }

        event.cancelBubble = true;
        tool.isEventDirty = true;
        item.destroyNewHoverMenu();

        var connectionId = event.attrs.id.substring( 0, event.attrs.id.indexOf( "_sub" ) );

        var connection;

        $.each( item.connections, function( index, value ) {
            if (value.id == connectionId) {
                connection = value;
                return false;
            }
        } );

        if (connection.isAdd) {
            item.hideNewConnectionOptions( connectionId );
            item.layer.get( "#" + connectionId + "_icon" )[ 0 ].setImage( tool.images.subImageSelected );
            connection.isAdd = false;

            tool.drawStage();

            // Set the libretto text
            var connectedFrom = item.text;
            var connectedTo = tool.stage.get( "#" + connection.targetId + "_text" )[ 0 ].getText();
            tool.displayLibretto( false, connectedFrom, connectedTo );

            tool.createEvent( "GL_Connection_Negative", 10, {
                name : tool.challengeName,
                connectedFrom : connectedFrom,
                connectedTo : connectedTo
            } );
        }
    }

    var addClickEvent = function (event) {
    	tool.currentMousePositionCords.x = item.layer.getPosition().x;
    	tool.currentMousePositionCords.y = item.layer.getPosition().y;

        if (!tool.enabled( sdActions.positive )) {
            return;
        }

        event.cancelBubble = true;
        tool.isEventDirty = true;

        item.destroyNewHoverMenu();

        var connectionId = event.attrs.id.substring( 0, event.attrs.id.indexOf( "_add" ) );

        var connection;

        $.each( item.connections, function( index, value ) {
            if (value.id == connectionId) {
                connection = value;
                return false;
            }
        } );

        if (!connection.isAdd) {
            connection.isAdd = true;
            item.layer.get( "#" + connectionId + "_icon" )[ 0 ].setImage( tool.images.addImageSelected );

            item.hideNewConnectionOptions( connectionId );
            tool.drawStage();

            // Set the libretto text
            var connectedFrom = item.text;
            var connectedTo = tool.stage.get( "#" + connection.targetId + "_text" )[ 0 ].getText();
            tool.displayLibretto( true, connectedFrom, connectedTo );

            tool.createEvent( "GL_Connection_Positive", 10, {
                name : tool.challengeName,
                connectedFrom : connectedFrom,
                connectedTo : connectedTo
            } );
        }
    }

    var swapClickEvent = function( event ) {
        if (!tool.enabled( sdActions.reverse )) {
            return;
        }

        event.cancelBubble = true;
        tool.isEventDirty = true;
        item.destroyNewHoverMenu();

        var connectionId = event.attrs.id.substring( 0, event.attrs.id.indexOf( "_swap" ) );

        var connection;

        var isAdd = false;

        $.each( item.connections, function( index, value ) {
            if (connectionId == value.id) {
                connection = value;
                isAdd = value.isAdd;
                item.connections.splice( index, 1 );
                return false;
            }
        } );

        item.destroyConnection( connectionId, true );

        var connectedId = connectionId.substring( connectionId.indexOf( '-' ) + 1, connectionId.length );

        $.each( tool.objectArray, function( index, value ) {
            if (value.id == connectedId) {
                var newConnection = {
                    targetId : item.id,
                    isAdd : isAdd,
                    id : connectedId + "-" + item.id
                };

                var hasConnection = false;

                $.each( value.connections, function( connectionIndex, connectionValue ) {
                    if (connectionValue.id == newConnection.id) {
                        hasConnection = true;
                        return false;
                    }
                } );

                if (hasConnection) {
                    // alert('You can not swap because there is all ready a connection');
                    // return false;
                }
                else {
                    var currentPosition = value.circle.getPosition();
                    var toPosition = item.getPosition();
                    toPosition.x -= value.layer.getX();
                    toPosition.y -= value.layer.getY();

                    tool.swappedConnection = true;

                    value.connectionLine( currentPosition.x, currentPosition.y, toPosition.x, toPosition.y, newConnection.id, newConnection.isAdd );
                    value.connections.push( newConnection );

                    // After the swap has been completed, we want to re-activate the hover menu
                    // value.displayNewConnectionOptions(newConnection.id);

                    return false;
                }
            }
        } );

        item.destroyNewOptionsMenu( connectionId );

        tool.drawStage();

        // Set the libretto text
        var connectedFrom = item.text;
        var connectedTo = tool.stage.get( "#" + connection.targetId + "_text" )[ 0 ].getText();
        tool.displayLibretto( isAdd, connectedTo, connectedFrom ); // from and to are flipped because this is a swapped event

        tool.createEvent( "GL_Connection_Reverse", 10, {
            name : tool.challengeName,
            connectedFrom : connectedFrom,
            connectedTo : connectedTo
        } );
    }

    var trashClickEvent = function( event ) {
        if (!tool.enabled( sdActions.trash )) {
            return;
        }

        event.cancelBubble = true;
        tool.isEventDirty = true;
        item.destroyNewHoverMenu();

        var connectionId = event.attrs.id.substring( 0, event.attrs.id.indexOf( "_trash" ) )
        var connection;

        $.each( item.connections, function( index, value ) {
            if (connectionId == value.id) {
                connection = value;
                item.connections.splice( index, 1 );
                return false;
            }
        } );

        item.destroyConnection( connectionId );
        item.destroyNewOptionsMenu( connectionId )

        tool.drawStage();

        tool.createEvent( "GL_Connection_Removed", 10, {
            name : tool.challengeName,
            connectedFrom : item.text,
            connectedTo : tool.stage.get( "#" + connection.targetId + "_text" )[ 0 ].getText()
        } );
    }

    var createNodeMouseOverAnimation = function() {
        var pull1 = item.layer.get( "#pull1" )[ 0 ];
        var pull2 = item.layer.get( "#pull2" )[ 0 ];
        var pullImage1 = item.layer.get( "#pullImage1" )[ 0 ];
        var pullImage2 = item.layer.get( "#pullImage2" )[ 0 ];

        if (nodeHoverAnimation) {
            nodeHoverAnimation.stop();
        }

        var finalPull1 = item.circle.getX() - pullMeEndPosition - pullMeSize;
        var finalPull2 = item.circle.getX() + pullMeEndPosition;

        nodeHoverAnimation = new Kinetic.Animation( function( frame ) {
            var pull1Position = pull1.getX() - nodeHoverAnimationSpeed;
            var pull2Position = pull2.getX() + nodeHoverAnimationSpeed;

            if (pull1Position <= finalPull1 || pull2Position >= finalPull2) {
                pull1Position = finalPull1;
                pull2Position = finalPull2;

                nodeHoverAnimation.stop();
                nodeHoverAnimation = null;
            }

            pull1.setX( pull1Position );
            pull2.setX( pull2Position );
            pullImage1.setX( pull1Position );
            pullImage2.setX( pull2Position );

        }, item.layer );

        nodeHoverAnimation.start();
    }

    var pullImagePosition = function() {
        var pullImage1 = item.layer.get( "#pullImage1" )[ 0 ];

        if (pullImage1) {
            var position = pullImage1.getPosition();
            position.x -= pullMeSize / 2;
            position.y -= pullMeSize / 2;

            return position;
        }
        else {
            return {
                x : 0,
                y : 0
            };
        }
    }

    return item;
}