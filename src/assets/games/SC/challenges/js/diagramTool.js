var sdActions = {
    hoverMenu : 0,
    connectionOptions : 1,
    textMenu : 2,
    negative : 3,
    positive : 4,
    reverse : 5,
    trash : 6,
    clickToAdd : 7,
    deleteNode : 8,
    setText : 9,
    createNode : 10,
    save : 11,
    createConnection : 12,
    independentToDependentConnection : 13,
    dependentToDependentConnection : 14,
    deleteEmptyNode : 15
};

var Tutorials = [
        {
            scenarioId : "f04804f0-fedf-11e2-ab09-1f14110c1a8d",
            instructions : "Schools in Tutorial",
            phases : [
                    {
                        trigger : sdActions.textMenu,
                        disabled : [
                                sdActions.positive, sdActions.trash, sdActions.reverse, sdActions.clickToAdd, sdActions.hoverMenu, sdActions.save
                        ],
                        instruction : "Click on the '?' to see a menu of choices."
                    },
                    {
                        trigger : sdActions.setText,
                        triggerText : "Bus Stops",
                        disabled : [
                                sdActions.negative, sdActions.trash, sdActions.reverse, sdActions.clickToAdd, sdActions.hoverMenu, sdActions.save
                        ],
                        instruction: "Select \"Bus Stops\" from this list."
                    },
                    {
                        trigger : sdActions.independentToDependentConnection,
                        disabled : [
                                sdActions.clickToAdd,
                                sdActions.deleteNode,
                                sdActions.textMenu,
                                sdActions.createNode,
                                sdActions.save,
                                sdActions.createConnection
                        ],
                        instruction: "Bring your cursor over the node and click on the Arrow Handle to drag an arrow to the other node.  This creates a connection between them."
                    },
                    {
                        trigger : sdActions.positive,
                        disabled : [
                                sdActions.negative,
                                sdActions.trash,
                                sdActions.reverse,
                                sdActions.clickToAdd,
                                sdActions.textMenu,
                                sdActions.hoverMenu,
                                sdActions.save
                        ],
                        instruction: "This '-' sign shows a negative relationship. Switch this to a '+' sign to show that Bus Stops lead to more Kids at School."
                    },
                    /*{	// No longer used in the Bus Stop tutorial
                    	trigger: sdActions.negative,
                        disabled : [
                                sdActions.positive,
                                sdActions.trash,
                                sdActions.reverse,
                                sdActions.clickToAdd,
                                sdActions.textMenu,
                                sdActions.hoverMenu,
                                sdActions.save
                        ],
                        instruction : "Great! Now change it back to represent a positive relationship."
                    },*/
                    {
                        trigger : sdActions.trash,
                        disabled : [
                                sdActions.hoverMenu,
                                sdActions.connectionOptions,
                                sdActions.negative,
                                sdActions.reverse,
                                sdActions.positive,
                                sdActions.clickToAdd,
                                sdActions.textMenu
                        ],
                        instruction : "Nice job! Now hit Submit to complete the tutorial."
                    }
            ],
            startingNodes : [
                "?"
            ],
            summaryInfo : [
                    "Set text on an empty node",
                    "Set a positive relationship",
                    "Set a negative relationship"
            ]
        },
        {
            scenarioId : "12b38320-fee0-11e2-ab09-1f14110c1a8d",
            instructions : "Jobs, jobs, jobs Pre-Game Tutorial",
            phases : [
                    {
                        trigger : sdActions.textMenu,
                        instruction : "Select the '?' to choose an option.",
                        disabled : [
                                sdActions.hoverMenu, sdActions.connectionOptions, sdActions.clickToAdd, sdActions.save
                        ]
                    },
                    {
                        trigger : sdActions.setText,
                        instruction : "Select from the list what you think creates new jobs in the city.",
                        disabled : [
                                sdActions.hoverMenu, sdActions.connectionOptions, sdActions.clickToAdd, sdActions.save
                        ]
                    },
                    {
                        trigger : sdActions.independentToDependentConnection,
                        instruction : "Create a connection from your node to the 'Jobs' node.",
                        disabled : [
                                sdActions.connectionOptions,
                                sdActions.clickToAdd,
                                sdActions.save,
                                sdActions.deleteNode,
                                sdActions.textMenu,
                                sdActions.createConnection,
                                sdActions.createNode
                        ]
                    },
                    {
                        trigger : sdActions.reverse,
                        disabled : [
                                sdActions.negative,
                                sdActions.trash,
                                sdActions.positive,
                                sdActions.clickToAdd,
                                sdActions.textMenu,
                                sdActions.hoverMenu,
                                sdActions.save
                        ],
                        instruction : "Hover over the positive sign and change the direction of the connection."
                    },
                    {
                        trigger : sdActions.reverse,
                        disabled : [
                                sdActions.negative,
                                sdActions.trash,
                                sdActions.positive,
                                sdActions.clickToAdd,
                                sdActions.textMenu,
                                sdActions.hoverMenu,
                                sdActions.save
                        ],
                        instruction : "Great! But this connection is backwards. Change the direction of the connection."
                    },
                    {
                        trigger : sdActions.independentToDependentConnection,
                        instruction : "Nice job! Hit Submit to complete the tutorial.",
                        disabled : [
                                sdActions.hoverMenu,
                                sdActions.connectionOptions,
                                sdActions.clickToAdd,
                                sdActions.deleteNode,
                                sdActions.textMenu,
                                sdActions.createConnection,
                                sdActions.createNode
                        ]
                    }
            ],
            startingNodes : [
                "?"
            ],
            summaryInfo : [
                    "Set text on an empty node",
                    "Created a connection",
                    "Swapped a connection"
            ]
        },
        {
            scenarioId : "397255e0-fee0-11e2-ab09-1f14110c1a8d",
            instructions : "Jobs, jobs, jobs Post-Game Tutorial",
            phases : [
                    {
                        trigger : sdActions.independentToDependentConnection,
                        instruction : "Make a connection from 'Factories' to 'Jobs' to describe the relationship.",
                        disabled : [
                                sdActions.connectionOptions, sdActions.createConnection, sdActions.clickToAdd, sdActions.createNode, sdActions.save
                        ]
                    },
                    {
                        trigger : sdActions.clickToAdd,
                        instruction : "Could there be anything else in your city that leads to jobs? Create a new node by clicking on the canvas.",
                        disabled : [
                                sdActions.hoverMenu, sdActions.connectionOptions, sdActions.save
                        ]
                    },
                    {
                        trigger : sdActions.setText,
                        instruction : "Select another object that has a relationship to 'Jobs'.",
                        disabled : [
                                sdActions.hoverMenu,
                                sdActions.clickToAdd,
                                sdActions.save,
                                sdActions.textMenu,
                                sdActions.deleteNode,
                                sdActions.createConnection,
                                sdActions.dependentToDependentConnection,
                                sdActions.createNode,
                                sdActions.deleteEmptyNode
                        ]
                    },
                    {
                        trigger : sdActions.independentToDependentConnection,
                        instruction : "Make a connection from this new variable to 'Jobs'!",
                        disabled : [
                                sdActions.clickToAdd,
                                sdActions.save,
                                sdActions.textMenu,
                                sdActions.deleteNode,
                                sdActions.connectionOptions,
                                sdActions.createConnection,
                                sdActions.dependentToDependentConnection,
                                sdActions.createNode
                        ]
                    },
                    {
                        trigger : sdActions.trash,
                        instruction : "Great job! Hit submit to finish the tutorial.",
                        disabled : [
                                sdActions.hoverMenu,
                                sdActions.clickToAdd,
                                sdActions.textMenu,
                                sdActions.deleteNode,
                                sdActions.connectionOptions,
                                sdActions.createConnection,
                                sdActions.dependentToDependentConnection,
                                sdActions.createNode
                        ]
                    }
            ],
            startingNodes : [
                    "Factories"
            ],
            summaryInfo : [
                    "Established the initial connection",
                    "Created a new node",
                    "Created a bivariate relationship"
            ]
        }
];

//SYSTEMS SCORING - JAN //
var scoringFeedbackTexts = {
    "medalGold" : "Wow! You are a really great systems thinker. You have correctly mapped the items that directly affect both [variablesAND] in a city. Can you teach your friends how to see that things are connected the same way you do?",
    "medalSilver" : "Good effort. Your map touched on both [variablesAND]. To get a gold medal, could you make an even more detailed map that fully explains all relationships?",
    "medalBronze" : "Good start, but can you create a map that better explains what can directly affect [variablesAND] together in a city?",
    "incorrect" : "Challenge incomplete. We detected incorrect connection(s) on your map. Please try again!",
    "missing" : "Challenge incomplete. Critical connection(s) are missing from your map. Please try again!",
    "null" : "Challenge incomplete. You have not placed anything on the canvas. Please try again!"
};
// NOTE: the T and S at the beginning of the code string are intentionally omitted - they are prepended in the summary modal setup
var scoringFeedbackCodesSM = {	// codes for sierra madre
    "medalGold" : "FM4S1S31",
    "medalSilver" : "FM4S1S21",
    "medalBronze" : "FM4S1S11",
    "incorrect" : "FM4S1S20",
    "missing" : "FM4S1S10",
    "null" : "FM4S1S00"
};
var scoringFeedbackCodesJC = {	// codes for jackson city
    "medalGold" : "FM6S1S31",
    "medalSilver" : "FM6S1S21",
    "medalBronze" : "FM6S1S11",
    "incorrect" : "FM6S1S20",
    "missing" : "FM6S1S10",
    "null" : "FM6S1S00"
};

/*var summaryInfo = [];
summaryInfo[0] = [
    { student: "Challenge incomplete. Critical connection(s) are missing from your map. Please try again!", teacher: "NA", stars: 0 },
    { student: "Challenge incomplete. Critical connection(s) are missing from your map. Please try again!", teacher: "NA", stars: 0 },
    { student: "Challenge incomplete. Critical connection(s) are missing from your map. Please try again!", teacher: "NA", stars: 0 }
];
summaryInfo[1] = [
    { student: "Challenge incomplete. Critical connection(s) are missing from your map. Please try again!", teacher: "NA", stars: 0 },
    { student: "Good start, but can you create a map that better explains what can directly affect [variablesAND] in a city?", teacher: "NA", stars: 1 },
    { student: "Good start, but can you create a map that better explains what can directly affect [variablesAND] in a city?", teacher: "NA", stars: 1 }
];
summaryInfo[2] = [
    { student: "Challenge incomplete. Critical connection(s) are missing from your map. Please try again!", teacher: "NA", stars: 0 },
    { student: "Good effort. To get a gold medal, can you make an even more detailed map that better explains what can directly affect [variablesAND] in a city?", teacher: "NA", stars: 2 },
    { student: "Good effort. To get a gold medal, can you make an even more detailed map that better explains what can directly affect [variablesAND] in a city?", teacher: "NA", stars: 2 }
];
summaryInfo[3] = [
    { student: "Challenge incomplete. Critical connection(s) are missing from your map. Please try again!", teacher: "NA", stars: 0 },
    { student: "Good effort. To get a gold medal, can you make an even more detailed map that better explains what can directly affect [variablesAND] in a city?", teacher: "NA", stars: 2 },
    { student: "Wow! You are a really great systems thinker. You have correctly mapped the items that directly affect both [variablesAND] in a city. Can you teach your friends how to see that things are connected the same way you do?", teacher: "NA", stars: 3 }
];

// SYSTEMS SCORING - JAN //
var summaryInfoCodesSierraMadre = [];  // [accuracy][multivariate]
summaryInfoCodesSierraMadre[0] = [
    { stars: 0, student: "SFM4S1S00", teacher: "TFM4S1S00" },
    { stars: 0, student: "SFM4S1S00", teacher: "TFM4S1S00" },
    { stars: 0, student: "SFM4S1S00", teacher: "TFM4S1S00" },
];
summaryInfoCodesSierraMadre[1] = [
    { stars: 0, student: "SFM4S1S00", teacher: "TFM4S1S00" },
    { stars: 1, student: "SFM4S1S10", teacher: "TFM4S1S10" },
    { stars: 1, student: "SFM4S1S11", teacher: "TFM4S1S11" },
];
summaryInfoCodesSierraMadre[2] = [
    { stars: 0, student: "SFM4S1S00", teacher: "TFM4S1S00" },
    { stars: 2, student: "SFM4S1S20", teacher: "TFM4S1S20" },
    { stars: 2, student: "SFM4S1S21", teacher: "TFM4S1S21" },
];
summaryInfoCodesSierraMadre[3] = [
    { stars: 0, student: "SFM4S1S00", teacher: "TFM4S1S00" },
    { stars: 2, student: "SFM4S1S21", teacher: "TFM4S1S21" },
    { stars: 3, student: "SFM4S1S31", teacher: "TFM4S1S31" },
];

//SYSTEMS SCORING - JAN //
var summaryInfoCodesJacksonCity = [];  // [accuracy][multivariate]
summaryInfoCodesJacksonCity[0] = [
    { stars: 0, student: "SFM6S1S00", teacher: "TFM6S1S00" },
    { stars: 0, student: "SFM6S1S00", teacher: "TFM6S1S00" },
    { stars: 0, student: "SFM6S1S00", teacher: "TFM6S1S00" },
];
summaryInfoCodesJacksonCity[1] = [
    { stars: 0, student: "SFM6S1S00", teacher: "TFM6S1S00" },
    { stars: 1, student: "SFM6S1S11", teacher: "TFM6S1S11" },
    { stars: 1, student: "SFM6S1S11", teacher: "TFM6S1S11" },
];
summaryInfoCodesJacksonCity[2] = [
    { stars: 0, student: "SFM6S1S00", teacher: "TFM6S1S00" },
    { stars: 2, student: "SFM6S1S20", teacher: "TFM6S1S20" },
    { stars: 2, student: "SFM6S1S21", teacher: "TFM6S1S21" },
];
summaryInfoCodesJacksonCity[3] = [
    { stars: 0, student: "SFM6S1S00", teacher: "TFM6S1S00" },
    { stars: 2, student: "SFM6S1S21", teacher: "TFM6S1S21" },
    { stars: 3, student: "SFM6S1S31", teacher: "TFM6S1S31" },
];*/

var introText = {
	"f04804f0-fedf-11e2-ab09-1f14110c1a8d": "Hello. Follow the tutorial to create a map that explains how to enroll all Parktown kids in school.",
	"12b38320-fee0-11e2-ab09-1f14110c1a8d": "Hello again! Follow the tutorial to create a map that explains what creates new jobs in Little Alexandria.",
	"397255e0-fee0-11e2-ab09-1f14110c1a8d": "Hi! Follow this last tutorial to see how to add more nodes to your map, and explain what else could create new jobs in Little Alexandria.",
	"063cf110-e0f6-11e2-a9b1-fbf5ea959a8c": "Hello! We're getting ready for the next mission. Think about what kinds of things might create Power and what kinds of things might cause Air Pollution. Create a map that shows what you're thinking.",
	"723dfa90-e0f5-11e2-a9b1-fbf5ea959a8c": "Now that you have played with Sierra Madre, have your ideas changed or stayed the same? Create a new map that explains what creates Power and causes Air Pollution.",
	"b71d8d00-e0f6-11e2-a9b1-fbf5ea959a8c": "Hi again! Let's get ready for the next mission. Think about what kinds of things might create Jobs and what kinds of things might cause Air Pollution. Create a map that shows what you're thinking.",
	"249ed870-e0f7-11e2-a9b1-fbf5ea959a8c": "Now that you have played with Jackson City, have your ideas changed or stayed the same? Create a new map that explains what creates Jobs and causes Air Pollution.",
};


/**
 * Systems Diagramming Learning Challenge
 */
var diagramTool = function() {
    var tool = {};

    tool.objectArray = [];
    tool.editMode = false;
    tool.stage = null;
    tool.textOptions = [];
    tool.menuOpen = false;
    tool.isEventDirty = false; // Hack used to prevent multi-event firing due
    // to the fact that kinetic doesn't utilize
    // jQuery events
    tool.images = {};
    tool.swappedConnection = false;
    tool.challengeName;
    tool.viewingMode = false;
    tool.currentSelectedCircle = '';
    tool.currentMousePositionCords = {
    	x: 0,
    	y: 0
    }

    tool.currentPhase = 0;
    tool.inTutorial = false;

    var parentId;
    var parentModel;
    var instructions;
    var isClickToCreateActive = true;
    var defaultTextOptions = [];
    var sessionId;

    var started = false;
    var isSierraMadre = false;
    var currentStars = 0;

    var instructorPreview = false;

    var $id;

    var tutorial;
    var currentPhase = 0;
    var currentMousePosition = 0;
    
    // Telemetry batching config
    var telemetryQueue = [];
    var telemetryBatchSizeMax = 0;
    var telemetryBatchSizeMin = 0;
    var telemetryBatchTime = 60;
    var telemetryEventPriority = 1;
    var telemetryBatchTimePassed = false;

    /**
     * Initializes the tool by inserting the required markup in the given
     * container.
     */
    tool.init = function( container ) {
        // Set the container for use later
        $id = $( container );

        // Get all of the images that will be utilized by the tool and pre-load
        // them
        tool.images.subImage = new Image();
        tool.images.subImage.src = "../challenges/images/systems_sub.png";

        tool.images.subImageSelected = new Image();
        tool.images.subImageSelected.src = "../challenges/images/systems_sub_selected.png";

        tool.images.addImage = new Image();
        tool.images.addImage.src = "../challenges/images/systems_add.png";

        tool.images.addImageSelected = new Image();
        tool.images.addImageSelected.src = "../challenges/images/systems_add_selected.png";

        tool.images.swapImage = new Image();
        tool.images.swapImage.src = "../challenges/images/systems_swap.png";

        tool.images.swapImageHover = new Image();
        tool.images.swapImageHover.src = "../challenges/images/systems_swap.png";

        tool.images.trashImage = new Image();
        tool.images.trashImage.src = "../challenges/images/systems_trash.png";

        tool.images.trashImageHover = new Image();
        tool.images.trashImageHover.src = "../challenges/images/systems_trash.png";

        tool.images.pullImage = new Image();
        tool.images.pullImage.src = "../challenges/images/pullArrow.png";

        tool.images.pullImageDown = new Image();
        tool.images.pullImageDown.src = "../challenges/images/pullArrow_down.png";

        tool.images.pullImageHover = new Image();
        tool.images.pullImageHover.src = "../challenges/images/pullArrow_hover.png";
        
        tool.images.deleteXUp = new Image();
        tool.images.deleteXUp.src = "../challenges/images/nodeClose_up.png";
        tool.images.deleteXDown = new Image();
        tool.images.deleteXDown.src = "../challenges/images/nodeClose_down.png";
        tool.images.deleteXHover = new Image();
        tool.images.deleteXHover.src = "../challenges/images/nodeClose_hover.png";

        tool.images.arrowHead = new Image();
        tool.images.arrowHead.src = "../challenges/images/systemsArrowHead.png";
        // Done with pre-loading images

        instructions = $id.find( 'h3' ).text();

        // When the return button is clicked
        $id.on( "click", "#diagram_return", function( event ) {
            if( instructorPreview ) {
                // Close the tab
                open( location, '_self' ).close();
                return;
            }
            
            // Get the tool in JSON format
            var toolAsJSON = tool.toJson();
            //toolAsJSON.challengeId = "";
            toolAsJSON.cancelled = true;
            // console.log( toolAsJSON );

            // If the submission was successful, create the closing Scenario Submitted
            // telemetry event and then close the tab containing the learning challenge
            var connectionCount = 0;
            $.each( tool.objectArray, function( index, value ) {
                connectionCount += value.connections.length;
            } );
            tool.createEvent( "GL_Scenario_Cancelled", 10, {
                name : tool.challengeName,
                metadata : toolAsJSON
            });/*, function() {
                // Create an AJAX request to save the scenario submission
                $.ajax( {
                    url : g_ServerAddress + g_API + "endsession",
                    type : "POST",
                    contentType : "application/json",
                    data : JSON.stringify( toolAsJSON ),
                    success : function( response ) {
                        // Close the tab
                        open( location, '_self' ).close();
                    },
                    error : function() {
                        // An error occurred trying to save the submission
                    }
                } );
            } );*/
            
            tool.sendTelemetryBatch( function() {
                toolAsJSON.stars = currentStars;
                toolAsJSON.gameVersion = "SD_" + g_version;

                // Create an AJAX request to save the scenario submission
                $.ajax( {
                    url : g_ServerAddress + g_API + "endsession",
                    type : "POST",
                    contentType : "application/json",
                    data : JSON.stringify( toolAsJSON ),
                    success : function( response ) {
                        // Close the tab
                        open( location, '_self' ).close();
                    },
                    error : function() {
                        // An error occurred trying to save the submission
                    }
                } );
            });
        } );

        // When the user wishes to save
        $id.on( "click", "#diagram_save", function( event ) {
            if( instructorPreview ) {
                return;
            }
            
            event.stopPropagation();
            if (!tool.enabled( sdActions.save )) {
                return;
            }

            if (tutorial) {
                // Set the summary markup
                buildTutorialSummaryModal();

                // When the modal is accepted, the submission will be uploaded
                // to the database and closed
                $( "#popupModal .done" ).on( 'click', function( event ) {
                    g_challengeCompleted = true;
                    finalizeSubmission( "" );
                } );
            }
            else {
                // Get the assessment data
                var assessment = performAssessment();

                // Set the summary markup
                buildSummaryModal( assessment );

                // Allow the player to try again if they got zero stars
                $( "#popupModal .tryagain" ).on( 'click', function( event ) {
                    g_challengeCompleted = true;
                    $( "#diagram_libretto_header" ).css( "visibility", "hidden" );
                    finalizeSubmissionAndRetry( assessment );
                } );
                // When the modal is accepted, the submission will be uploaded to the database and closed
                $( "#popupModal .done" ).on( 'click', function( event ) {
                    g_challengeCompleted = true;
                    finalizeSubmission( assessment );
                } );
            }
        } );

        $id.on( 'click', 'section .system_fitView', function( event ) {
            tool.fitView();
            event.stopPropagation();
        } );

        // We want a 'click to place node' functionality, but the problem is
        // that it hard to detect with kinetic unless we have an
        // invisible layer at the top the entire time. At this point I did not
        // do that but am using a 'dirty event' method to prevent
        // doubling of events. It should be sought in the future as having
        // kinetic and jQuery events fire simultaneously has caused
        // problems
        $id.on( 'click', 'section', function( event ) {
            var sectionOffset = $( this ).offset();

            var mousePosition = {
                x : 1 * event.pageX / ( tool.stage.getScale().x ) - sectionOffset.left / ( tool.stage.getScale().x ),
                y : 1 * event.pageY / ( tool.stage.getScale().x ) - sectionOffset.top / ( tool.stage.getScale().x )
            };

            //tool.currentMousePositionCords.x = mousePosition.x;
            //tool.currentMousePositionCords.y = mousePosition.y;

            // If we are not in edit mode, we will create a node with the naming
            // menu open
            if (!tool.editMode) {
                if (tool.textOptions.length == 0) {
                    tool.isEventDirty = false;
                    return;
                }

                if (!tool.menuOpen && !tool.isEventDirty && isClickToCreateActive) {
                	if (tool.enabled(sdActions.clickToAdd)) {
                    	var newItem = new diagramItem(tool);
                    	var newItemId = tool.getNewId();

                    	tool.currentSelectedCircle = newItemId;

                    	tool.objectArray.push(newItem.init(mousePosition.x, mousePosition.y, newItemId));

                        event.preventDefault();
                    }
                }
                // If the menu is open, close it
                else if (tool.menuOpen && !tool.isEventDirty) {
                	if (tool.enabled(sdActions.deleteEmptyNode)) {
                        $.each( tool.objectArray, function( index, value ) {
                            if (value.isSelected()) {
                                value.deleteNewMenu();
                                if (value.text == "") {
                                    value.suicide();
                                }
                                return false;
                            }
                        } );
                    }
                }
                else {
                    tool.isEventDirty = false;
                }
            }
            else if (!tool.isEventDirty && !tool.menuOpen) {
                var nodeName = prompt( "What do you want the node to be named?", "" );
                if (nodeName) {
                	var newItem = new diagramItem(tool);
                	var newItemId = tool.getNewId();

                	tool.currentSelectedCircle = newItemId;

                	tool.objectArray.push(newItem.init(mousePosition.x, mousePosition.y, newItemId, true));
                    tool.textOptions.push( {
                        text : nodeName,
                        metadata : -1
                    } );
                    defaultTextOptions.push( {
                        text : nodeName,
                        metadata : -1
                    } );
                    newItem.setText( nodeName, -1 );
                    event.preventDefault();
                }
            }
            else {
                tool.isEventDirty = false;
            }
        } );

        $id.on( 'mousewheel', function( event ) {
            // cross-browser wheel delta
            var event = window.event || event; // old IE support
            var wheelDelta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

            var currentScale = tool.stage.getScale();
            var previousWidth = tool.stage.getWidth() / currentScale.x;
            var previousHeight = tool.stage.getHeight() / currentScale.y;

            var scaleToSet = tool.stage.getScale().x;
            if (scaleToSet < 0.5) {
                scaleToSet = 0.5;
            }
            else if (scaleToSet > 1.0) {
                scaleToSet = 1.0;
            }

            // let's set a min scale so nothing get's
            // so small that you can't read it.
            if (scaleToSet < 0.80) {
            	scaleToSet = 0.80;
            }

            tool.stage.setScale( scaleToSet + wheelDelta * 0.001 );
            var minPosition = {
                x : 9999,
                y : 9999
            };
            var maxPosition = {
                x : 0,
                y : 0
            };

            // Determine the min and max position
            $.each( tool.objectArray, function( index, value ) {
                var objectMinPosition = value.layer.getPosition();
                var objectMaxPosition = value.circle.getPosition();
                objectMaxPosition.x += objectMinPosition.x + value.circle.getWidth() + 50;
                objectMaxPosition.y += objectMinPosition.y + value.circle.getHeight() + 50;

                if (minPosition.x > objectMinPosition.x) {
                    minPosition.x = objectMinPosition.x;
                }

                if (minPosition.y > objectMinPosition.y) {
                    minPosition.y = objectMinPosition.y;
                }

                if (maxPosition.x < objectMaxPosition.x) {
                    maxPosition.x = objectMaxPosition.x;
                }

                if (maxPosition.y < objectMaxPosition.y) {
                    maxPosition.y = objectMaxPosition.y;
                }
            } );

            currentScale = tool.stage.getScale();
            var currentWidth = tool.stage.getWidth() / currentScale.x;
            var currentHeight = tool.stage.getHeight() / currentScale.y;

            var widthDelta = currentWidth - previousWidth;
            var heightDelta = currentHeight - previousHeight;

            var translate = {
                x : currentWidth - maxPosition.x,
                y : currentHeight - maxPosition.y
            };

            $.each( tool.objectArray, function( index, value ) {
                var currentPosition = value.layer.getPosition();
                // currentPosition.x += translate.x/2;
                // currentPosition.y += translate.y/2;

                currentPosition.x += widthDelta / 2;
                currentPosition.y += heightDelta / 2;

                value.layer.setPosition( currentPosition );
            } );

            tool.drawStage();
            //console.log( "TOOL - mouse wheel" );
        } );

        // Need to dynamically set the stages size to match the height and width
        // of the parent section
        $( window ).resize( function( event ) {
            if (tool.stage) {
                tool.stage.setWidth( $id.find( 'section' ).width() );
                tool.stage.setHeight( $id.find( 'section' ).height() );
            }
        } );
    }

    function buildSummaryModal( assessment ) {
        // Get the accuracy category
        var accuracy = assessment.accuracyCategory + 1;
        // Get the multivariate information
        var multivariate = 0;
        if( assessment.numNodesConnectedToAll > 0 || assessment.indirectExists ) {
        	multivariate = 2;
        }
        else if( assessment.numNodesAdded > 0 && assessment.numNodesConnectedToAll > 0 ) {
        	multivariate = 1;
        }


        // Get the interpreted text and star rating
        var studentFeedback = interpretText( assessment, scoringFeedbackTexts[ assessment.summaryLabel ] ); //summaryInfo[accuracy][multivariate].student );
        var starRating = assessment.starRating; //summaryInfo[accuracy][multivariate].stars;

        // Set the summary markup
        var tryAgainButton = "<button class='tryagain'>Try Again</button>";
        var doneButton = "<button class='done'>Finished</button>";
        var markup = "<h1>Your Current Score</h1>" + "<img class='medal'/>" + "<p>" + studentFeedback + "</p>";
        if( starRating == 0 ) {
            markup += tryAgainButton + " ";
        }
        markup += doneButton;
        // Create the modal
        systemsModal.create( markup, true );
        // Set the medal
        $( "#popupModal .medal" ).attr( 'src', "../challenges/images/medal_" + starRating + ".png" );
        
        // Send the scenario score event
        tool.createEvent( "GL_Scenario_Score", 1, {
            stars : starRating,
            text : "",
            studentFeedback: "S" + ( isSierraMadre ? scoringFeedbackCodesSM[ assessment.summaryLabel ] : scoringFeedbackCodesJC[ assessment.summaryLabel ] ),
            teacherFeedback: "T" + ( isSierraMadre ? scoringFeedbackCodesSM[ assessment.summaryLabel ] : scoringFeedbackCodesJC[ assessment.summaryLabel ] )
            //studentFeedback: ( isSierraMadre ? summaryInfoCodesSierraMadre[accuracy][multivariate].student : summaryInfoCodesJacksonCity[accuracy][multivariate].student ),
            //teacherFeedback: ( isSierraMadre ? summaryInfoCodesSierraMadre[accuracy][multivariate].teacher : summaryInfoCodesJacksonCity[accuracy][multivariate].teacher )
        });

        // Send the scenario summary event
        tool.createEvent( "GL_Scenario_Summary", 1, {
            stars : starRating,
            isTutorial : false
        });


        // Send the assessment event
        tool.createEvent( "GL_Assessment", 1, {
            multivariateLevel: assessment.multivariateLevel,
            accuracyCategory: assessment.accuracyCategory,
            competencyLevel: assessment.competencyLevel,
            competencyType: isSierraMadre ? "iiftd_m3" : "iiftd_m5"
        });
    }
    
    function interpretText( assessment, text ) {
        var variablesAnd = "";
        var variablesOr = "";
        var variableCorrect = "";
        var variableIncorrect = "";

        var arrayEnd = assessment.dependents.length - 1;
        for( var i = arrayEnd; i >= 0; i-- ) {
            var dependent = assessment.dependents[ i ];

            if( dependent.accurate ) {
                variableCorrect = dependent.dependentId;
            }
            else {
                variableIncorrect = dependent.dependentId;
            }

            variablesAnd = dependent.dependentId + ( i < arrayEnd ? " and " : "" ) + variablesAnd;
            variablesOr = dependent.dependentId + ( i < arrayEnd ? " or " : "" ) + variablesOr;
        }
        
        //console.log(variablesAnd + " " + variablesOr + " " + variableCorrect + " " + variableIncorrect);

        var interpretedText = "";
        interpretedText = text.replace( "[variablesAND]", variablesAnd );
        interpretedText = interpretedText.replace( "[variablesOR]", variablesOr );
        interpretedText = interpretedText.replace( "[correct]", variableCorrect );
        interpretedText = interpretedText.replace( "[incorrect]", variableIncorrect );
        return interpretedText;
    }

    function buildTutorialSummaryModal() {
        // Set the summary markup
        var markup = "<h1>Great job!</h1>" + "<ul class='rating'>" + "  <li>" + tutorial.summaryInfo[ 0 ] + "</li>" + "  <li>" + tutorial.summaryInfo[ 1 ] + "</li>" + "  <li>" + tutorial.summaryInfo[ 2 ] + "</li>" + "</ul>" + "<button class='done'>Finished</button>";
        // Create the modal
        systemsModal.create( markup, true );
        $( "#popupModal .rating :nth-of-type(1)" ).addClass( 'full' );
        $( "#popupModal .rating :nth-of-type(2)" ).addClass( 'full' );
        $( "#popupModal .rating :nth-of-type(3)" ).addClass( 'full' );
        
        // Send the scenario score event
        tool.createEvent( "GL_Scenario_Score", 1, {
            stars : 3,
            text : "",
            studentFeedback: "This tutorial challenge has been completed!",
            teacherFeedback: "This tutorial challenge has been completed!"
        } );
        // Send the scenario summary event
        tool.createEvent( "GL_Scenario_Summary", 1, {
            stars : 3,
            isTutorial : true
        });
        // Send the assessment event
        tool.createEvent( "GL_Assessment", 1, {
            multivariateLevel: 5,
            accuracyCategory: 3,
            competencyLevel: 0,
            competencyType: ""
        });
    }

    function calculateScore( studentMatrix ) {
        var scoreInfo = {
            label : "",
            stars : 0
        };

        if( isSierraMadre ) {
            // First, check for MISSING CONNECTIONS (-1 = node not present, 0 = no connection - cover both)
            if( studentMatrix[ "Coal Plants" ][ "Air Pollution" ] <= 0 &&
                studentMatrix[ "Industrial Zones" ][ "Air Pollution" ] <= 0 &&
                studentMatrix[ "Coal Plants" ][ "Power" ] <= 0 &&
                studentMatrix[ "Solar Plants" ][ "Power" ] <= 0 &&
                studentMatrix[ "Wind Plants" ][ "Power" ] <= 0 )
            {
                scoreInfo.label = "missing";
                scoreInfo.stars = 0;
            }
            // Second, check for INCORRECT CONNECTIONS
            else if( studentMatrix[ "Coal Plants" ][ "Air Pollution" ] == 2 ||
                studentMatrix[ "Solar Plants" ][ "Air Pollution" ] == 1 ||
                studentMatrix[ "Wind Plants" ][ "Air Pollution" ] == 1 ||
                studentMatrix[ "Commercial Zones" ][ "Air Pollution" ] == 2 ||
                studentMatrix[ "Residential Zones" ][ "Air Pollution" ] == 2 ||
                studentMatrix[ "Industrial Zones" ][ "Air Pollution" ] == 2 ||
                studentMatrix[ "Coal Plants" ][ "Power" ] == 2 ||
                studentMatrix[ "Solar Plants" ][ "Power" ] == 2 ||
                studentMatrix[ "Wind Plants" ][ "Power" ] == 2 ||
                studentMatrix[ "Coal Plants" ][ "Solar Plants" ] == 2 ||
                studentMatrix[ "Coal Plants" ][ "Wind Plants" ] == 2 ||
                studentMatrix[ "Solar Plants" ][ "Wind Plants" ] == 1 ||
                studentMatrix[ "Coal Plants" ][ "Commercial Zones" ] == 1 ||
                studentMatrix[ "Coal Plants" ][ "Residential Zones" ] == 1 )
            {
                scoreInfo.label = "incorrect";
                scoreInfo.stars = 0;
            }
            // Third, check for GOLD
            else if( studentMatrix[ "Coal Plants" ][ "Air Pollution" ] == 1 &&
                studentMatrix[ "Industrial Zones" ][ "Air Pollution" ] == 1 &&
                studentMatrix[ "Coal Plants" ][ "Power" ] == 1 &&
                ( studentMatrix[ "Solar Plants" ][ "Power" ] == 1 || 
                  studentMatrix[ "Wind Plants" ][ "Power" ] == 1 ) )
            {
                scoreInfo.label = "medalGold";
                scoreInfo.stars = 3;
            }
            // Fourth, check for SILVER
            else if( ( studentMatrix[ "Coal Plants" ][ "Air Pollution" ] == 1 ||
                  studentMatrix[ "Industrial Zones" ][ "Air Pollution" ] == 1 ) &&
                ( studentMatrix[ "Coal Plants" ][ "Power" ] == 1 ||
                  studentMatrix[ "Solar Plants" ][ "Power" ] == 1 ||
                  studentMatrix[ "Wind Plants" ][ "Power" ] == 1 ) )
            {
                scoreInfo.label = "medalSilver";
                scoreInfo.stars = 2;
            }
            // Fifth, check for BRONZE (should be bronze if all else fails)
            else {
                scoreInfo.label = "medalBronze";
                scoreInfo.stars = 1;
            }
        }
        else {
            // First, check for MISSING CONNECTIONS (-1 = node not present, 0 = no connection - cover both)
            if( studentMatrix[ "Coal Plants" ][ "Air Pollution" ] <= 0 &&
                studentMatrix[ "Industrial Zones" ][ "Air Pollution" ] <= 0 &&
                studentMatrix[ "Coal Plants" ][ "Jobs" ] <= 0 &&
                studentMatrix[ "Solar Plants" ][ "Jobs" ] <= 0 &&
                studentMatrix[ "Wind Plants" ][ "Jobs" ] <= 0 &&
                studentMatrix[ "Commercial Zones" ][ "Jobs" ] <= 0 &&
                studentMatrix[ "Industrial Zones" ][ "Jobs" ] <= 0 )
            {
                scoreInfo.label = "missing";
                scoreInfo.stars = 0;
            }
            // Second, check for INCORRECT CONNECTIONS
            else if( studentMatrix[ "Coal Plants" ][ "Air Pollution" ] == 2 ||
                studentMatrix[ "Solar Plants" ][ "Air Pollution" ] == 1 ||
                studentMatrix[ "Wind Plants" ][ "Air Pollution" ] == 1 ||
                studentMatrix[ "Coal Plants" ][ "Jobs" ] == 2 ||
                studentMatrix[ "Solar Plants" ][ "Jobs" ] == 2 ||
                studentMatrix[ "Wind Plants" ][ "Jobs" ] == 2 ||
                studentMatrix[ "Commercial Zones" ][ "Jobs" ] == 2 ||
                studentMatrix[ "Industrial Zones" ][ "Jobs" ] == 2 )
            {
                scoreInfo.label = "incorrect";
                scoreInfo.stars = 0;
            }
            // Third, check for GOLD
            else if( studentMatrix[ "Coal Plants" ][ "Air Pollution" ] == 1 &&
                studentMatrix[ "Industrial Zones" ][ "Air Pollution" ] == 1 &&
                studentMatrix[ "Coal Plants" ][ "Jobs" ] == 1 &&
                ( studentMatrix[ "Solar Plants" ][ "Jobs" ] == 1 ||
                  studentMatrix[ "Wind Plants" ][ "Jobs" ] == 1 ) &&
                ( studentMatrix[ "Commercial Zones" ][ "Jobs" ] == 1 ||
                  studentMatrix[ "Industrial Zones" ][ "Jobs" ] == 1 ) &&
                studentMatrix[ "Residential Zones" ][ "Jobs" ] <= 0 )
            {
                scoreInfo.label = "medalGold";
                scoreInfo.stars = 3;
            }
            // Fourth, check for SILVER
            else if( ( studentMatrix[ "Coal Plants" ][ "Air Pollution" ] == 1 ||
                  studentMatrix[ "Industrial Zones" ][ "Air Pollution" ] == 1 ) &&
                ( studentMatrix[ "Coal Plants" ][ "Jobs" ] == 1 ||
                  studentMatrix[ "Solar Plants" ][ "Jobs" ] == 1 ||
                  studentMatrix[ "Wind Plants" ][ "Jobs" ] == 1 ||
                  studentMatrix[ "Commercial Zones" ][ "Jobs" ] == 1 ||
                  studentMatrix[ "Industrial Zones" ][ "Jobs" ] == 1 ) )
            {
                scoreInfo.label = "medalSilver";
                scoreInfo.stars = 2;
            }
            // Fifth, check for BRONZE (should be bronze if all else fails)
            else {
                scoreInfo.label = "medalBronze";
                scoreInfo.stars = 1;
            }
        }
        
        console.log( scoreInfo );
        
        return scoreInfo;
    }

    function performAssessment() {
        // Begin systems diagramming assessment pipeline
        var info = tool.toJson();

        // Initial variables
        var parentMatrix = {};
        var studentMatrix = {};
        var numDependentNodes = parentModel.connections.length;
        var numNodes = parentModel.objects.length;

        // Iterate through the master list of nodes
        for( var i = 0; i < numNodes; i++ ) {
            // Create the initial row object
            var parentRowObject = {};
            var studentRowObject = {};

            for( var j = 0; j < numNodes; j++ ) {
                // Push the correlation
                parentRowObject[ parentModel.objects[ j ].text ] = 0;
                studentRowObject[ parentModel.objects[ j ].text ] = 0;
            }

            // Push the node row into the matrix
            parentMatrix[ parentModel.objects[ i ].text ] = parentRowObject;
            studentMatrix[ parentModel.objects[ i ].text ] = studentRowObject;
        }

        // Fill parent with connections
        for( var k = 0; k < numDependentNodes; k++ ) {
            var currentConnection = parentModel.connections[ k ];

            for( var j = 0, connLength = currentConnection.connections.length; j < connLength; j++ ) {
                var connection = currentConnection.connections[ j ];

                parentMatrix[ connection.nodeId ][ currentConnection.nodeId ] = connection.correlation;
            }
        }

        // Determine what is missing from student submission
        $.each( parentModel.objects, function( index, node ) {
            for( var i = 0, nodeLength = info.objects.length; i < nodeLength; i++ ) {
                if (node.text == info.objects[ i ].text) {
                    return;
                }
            }

            // The node wasn't found so we have to -1'ify all the values
            for( var i = 0; i < numNodes; i++ ) {
                studentMatrix[ parentModel.objects[ i ].text ][ node.text ] = -1;
                studentMatrix[ node.text ][ parentModel.objects[ i ].text ] = -1;
            }
        } );

        // Go through each connection and set up the values
        for( var k = 0, connectionLength = info.connections.length; k < connectionLength; k++ ) {
            var currentConnection = info.connections[ k ];

            for( var j = 0, connLength = currentConnection.connections.length; j < connLength; j++ ) {
                var connection = currentConnection.connections[ j ];

                studentMatrix[ currentConnection.nodeId ][ connection.text ] = connection.isAdd ? 1 : 2;
            }
        }


        // Iterate through the student matrix to print the connections
        for( var i = 0; i < numNodes; i++ ) {
            var rowInfo = parentModel.objects[ i ].text.substring( 0, 7 ) + ":  \t";
            for( var j = 0; j < numNodes; j++ ) {
                rowInfo += studentMatrix[ parentModel.objects[ i ].text ][ parentModel.objects[ j ].text ] + "\t";
            }
            console.log( rowInfo );
        }


        var doesNegativeExist = function( text ) {
            // console.log( "Negative-Node: " + nodeId );
            for( var i = 0; i < numDependentNodes; i++ ) {
                if (parentModel.connections[ i ].nodeId == text) {
                    return true;
                }
            }

            for( var col in studentMatrix ) {
                // Get the element
                var element = studentMatrix[ text ][ col ];
                // console.log( "Col: " + element );

                // We care about positive and negative correlations
                if (element == 1 || element == 2) {
                    for( var i = 0; i < numDependentNodes; i++ ) {
                        if (parentModel.connections[ i ].nodeId == col) {
                            return true;
                        }
                    }

                    var result = doesNegativeExist( col );
                    if (result) {
                        return true;
                    }
                }
            }
            return false
        }

        var isConnected = function( text, isFirstRun, dependentToCheck ) {
            // console.log( "Indirect-Node: " + nodeId );
            for( var col in studentMatrix ) {
                // Get the element
                var element = studentMatrix[ text ][ col ];
                // console.log( "Col: " + element );

                // We care about positive and negative correlations
                if (element == 1 || element == 2) {
                    if (col == dependentToCheck) {
                        if (isFirstRun) {
                            return {
                                connected : true,
                                indirect : false
                            };
                        }
                        else {
                            return {
                                connected : true,
                                indirect : true
                            };
                        }
                    }

                    var result = isConnected( col, false, dependentToCheck );
                    if (result) {
                        return {
                            connected : true,
                            indirect : true
                        };
                    }
                }
            }
            if (isFirstRun) {
                return {
                    connected : false,
                    indirect : false
                };
            }
        }

        // Construct the initial feature vector
        var featureVector = {
            dependents : [], // { dependentId, numCorrect, numIncorrect, accurate }
            numNodesAdded : 0,
            allNodesAdded : false,
            numNodesConnectedToAll : 0,
            indirectExists : false,
            negativeExists : false,
            multivariateLevel : 0,
            accuracyCategory : 0,
            competencyLiklihood : [],
            competencyLevel : 0,
            summaryLabel : "",
            starRating : 0
        };

        // Determine dependents correct/incorrect values
        for( var c = 0; c < numDependentNodes; c++ ) {
            // Get the dependent id
            var dependentId = parentModel.connections[ c ].nodeId;
            var numCorrect = 0, numIncorrect = 0;

            // Iterate through the column pertaining to that dependent variable
            for( var col in parentMatrix[ dependentId ] ) {
                // Get the correlations
                var parentCorrelation = parentMatrix[ col ][ dependentId ];
                var studentCorrelation = studentMatrix[ col ][ dependentId ];

                // Determine correct vs incorrect
                if (studentCorrelation != parentCorrelation) {
                    numIncorrect++;
                }
                else if (parentCorrelation != 0) {
                    numCorrect++;
                }
            }

            // Update the dependents array in the feature vector
            featureVector.dependents.push( {
                dependentId : dependentId,
                numCorrect : numCorrect,
                numIncorrect : numIncorrect,
                accurate: false
            } );
        }

        // Determine the number of added nodes (initially offset by number of dependent nodes)
        var numAdded = -numDependentNodes;
        for( var nodeId in studentMatrix ) {
            // Grab all [nodeId][nodeId] and check the correlation
            // Anything but a -1 is considered added
            if (studentMatrix[ nodeId ][ nodeId ] != -1) {
                numAdded++;
            }
        }
        // Update the feature vector with the number of nodes added whether all nodes were added
        featureVector.numNodesAdded = numAdded;
        if (numAdded == numNodes - numDependentNodes) {
            featureVector.allNodesAdded = true;
        }


        // If no nodes were added, the score is automatically 0
        if( featureVector.numNodesAdded == 0 ) {
            featureVector.summaryLabel = "null";
            featureVector.starRating = 0;
        }
        // Else, get the summary label and star rating
        else {
            var summaryLabelAndRating = calculateScore( studentMatrix );
            featureVector.summaryLabel = summaryLabelAndRating.label;
            featureVector.starRating = summaryLabelAndRating.stars;
        }


        // Determine the number of nodes connected to all
        var numNodesConnectedToAll = 0;
        var indirectConnectionExists = false;
        for( var nodeId in studentMatrix ) {
            var countForCurrentNode = 0;
            for( var i = 0; i < numDependentNodes; i++ ) {
                var result = isConnected( nodeId, true, parentModel.connections[ i ].nodeId );
                if (result.connected) {
                    countForCurrentNode++;
                }
                if (result.indirect) {
                    indirectConnectionExists = true;
                }
            }

            if (countForCurrentNode == numDependentNodes) {
                numNodesConnectedToAll++;
            }
        }
        // Update the feature vector
        featureVector.numNodesConnectedToAll = numNodesConnectedToAll;
        if (indirectConnectionExists) {
            featureVector.indirectExists = true;
        }

        // Determine if any negative correlations exists
        var hasNegative = false;
        for( var row in studentMatrix ) {
            for( var col in studentMatrix[ row ] ) {
                // If the correlation is a 2, it is negative
                if (studentMatrix[ row ][ col ] == 2) {
                    hasNegative = doesNegativeExist( col );
                    if (hasNegative) {
                        break;
                    }
                }
            }

            // If a negative correlation exists, end the iteration
            if (hasNegative) {
                break;
            }
        }
        // Update the feature vector with this information
        featureVector.negativeExists = hasNegative;

        // Determine the multivariate level
        var multivariateLevel = 0;
        if (featureVector.indirectExists && featureVector.negativeExists) {
            multivariateLevel = 4;
        }
        else if (featureVector.numNodesConnectedToAll > 0) {
            multivariateLevel = 3;
        }
        else if (( !featureVector.allNodesAdded && featureVector.numNodesAdded == 0 ) || ( !featureVector.allNodesAdded && featureVector.numNodesAdded > 0 ) || ( featureVector.allNodesAdded && featureVector.numNodesAdded > 0 )) {
            multivariateLevel = 2;
        }
        else if (featureVector.allNodesAdded) {
            multivariateLevel = 1;
        }
        featureVector.multivariateLevel = multivariateLevel;

        // Determine the accuracy category
        var numDependentsAccurate = 0;
        // Iterate through dependents to gather targets for correct and
        // incorrect
        for( var k = 0; k < numDependentNodes; k++ ) {
            // Get current dependent and targets
            var currentDependent = parentModel.connections[ k ];
            var targetCorrect = currentDependent.targetCorrect;
            var targetIncorrect = currentDependent.targetIncorrect;

            // Get the student dependent in question
            var studentDependent = featureVector.dependents[ k ];

            // Validate both correct and incorrect to determine accuracy for
            // this dependent
            if (studentDependent.numCorrect >= targetCorrect && studentDependent.numIncorrect <= targetIncorrect) {
                numDependentsAccurate++;
                featureVector.dependents[ k ].accurate = true;
            }
        }
        // Set the category of the feature vector
        if (numDependentsAccurate == numDependentNodes) {
            featureVector.accuracyCategory = 2;
        }
        else if (numDependentsAccurate > 0) {
            featureVector.accuracyCategory = 1;
        }

        // Compute the probabilistic model from the multivariate score and the
        // accuracy category
        var numMultivariateLevels = 5;
        var numCategories = 3;
        var studentComptencyLevel = 0;
        // Setup probabilistic table
        var probabilisticTable = [];
        probabilisticTable[ 0 ] = [
                [
                        0.523, 0.244, 0.139, 0.063, 0.032
                ], [
                        0.412, 0.264, 0.172, 0.099, 0.053
                ], [
                        0.310, 0.255, 0.190, 0.151, 0.094
                ]
        ];
        probabilisticTable[ 1 ] = [
                [
                        0.386, 0.274, 0.179, 0.087, 0.074
                ], [
                        0.280, 0.274, 0.205, 0.127, 0.114
                ], [
                        0.192, 0.240, 0.206, 0.176, 0.186
                ]
        ];
        probabilisticTable[ 2 ] = [
                [
                        0.265, 0.267, 0.233, 0.132, 0.103
                ], [
                        0.179, 0.248, 0.248, 0.179, 0.147
                ], [
                        0.114, 0.202, 0.231, 0.230, 0.223
                ]
        ];
        probabilisticTable[ 3 ] = [
                [
                        0.175, 0.205, 0.239, 0.191, 0.190
                ], [
                        0.108, 0.174, 0.232, 0.237, 0.248
                ], [
                        0.062, 0.128, 0.195, 0.275, 0.339
                ]
        ];
        probabilisticTable[ 4 ] = [
                [
                        0.125, 0.157, 0.212, 0.257, 0.249
                ], [
                        0.073, 0.126, 0.194, 0.301, 0.306
                ], [
                        0.039, 0.087, 0.153, 0.328, 0.393
                ]
        ];
        studentComptencyLevel = Math.max.apply( Math, probabilisticTable[ featureVector.multivariateLevel ][ featureVector.accuracyCategory ] );
        studentComptencyLevel = probabilisticTable[ featureVector.multivariateLevel ][ featureVector.accuracyCategory ].indexOf( studentComptencyLevel ) + 1;

        // Set the final two bits of info for the feature vector
        featureVector.competencyLiklihood = probabilisticTable[ featureVector.multivariateLevel ][ featureVector.accuracyCategory ];
        featureVector.competencyLevel = studentComptencyLevel;

        // Plug the feature vector into the assessment field of the JSON object
        // info.assessment = featureVector;
        console.log( featureVector );
        return featureVector;
        // End systems diagramming assessment pipeline
    }

    function finalizeSubmission( assessment ) {
        // Get the tool in JSON format
        var toolAsJSON = tool.toJson();
        toolAsJSON.assessment = assessment;
        // console.log( toolAsJSON );
        
        // If the submission was successful, create the closing Scenario
        // Submitted
        // telemetry event and then close the tab containing the
        // learning challenge
        var connectionCount = 0;
        $.each( tool.objectArray, function( index, value ) {
            connectionCount += value.connections.length;
        } );
        tool.createEvent( "GL_Scenario_Submitted", 10, {
            name : tool.challengeName,
            definedNodeCount : tool.stage.getLayers().length,
            connectionCount : connectionCount//,
            //metadata : toolAsJSON
        });/*, function() {
            // Close the tab
            if (parentId) {
                //open( location, '_self' ).close();
                // Create an AJAX request to save the scenario submission
                $.ajax( {
                    url : g_ServerAddress + g_API + "endsession",
                    type : "POST",
                    contentType : "application/json",
                    data : JSON.stringify( toolAsJSON ),
                    success : function( response ) {
                        open( location, '_self' ).close();
                    },
                    error : function() {
                        // An error occurred trying to save the submission
                    }
                } );
            }
        } );*/
        
        tool.sendTelemetryBatch( function() {
         // Close the tab
            if (parentId) {
                toolAsJSON.gameVersion = "SD_" + g_version;
                toolAsJSON.stars = currentStars;

                //open( location, '_self' ).close();
                // Create an AJAX request to save the scenario submission
                $.ajax( {
                    url : g_ServerAddress + g_API + "endsession",
                    type : "POST",
                    contentType : "application/json",
                    data : JSON.stringify( toolAsJSON ),
                    success : function( response ) {
                        open( location, '_self' ).close();
                    },
                    error : function() {
                        // An error occurred trying to save the submission
                    }
                } );
            }
        });
    }
    
    function finalizeSubmissionAndRetry( assessment ) {
        // Get the tool in JSON format
        var toolAsJSON = tool.toJson();
        toolAsJSON.assessment = assessment;
        // console.log( toolAsJSON );
        
        // If the submission was successful, create the closing Scenario Submitted
        // telemetry event and then close the tab containing the learning challenge
        var connectionCount = 0;
        $.each( tool.objectArray, function( index, value ) {
            connectionCount += value.connections.length;
        } );
        tool.createEvent( "GL_Scenario_Submitted", 10, {
            name : tool.challengeName,
            definedNodeCount : tool.stage.getLayers().length,
            connectionCount : connectionCount
        });
        
        tool.sendTelemetryBatch( function() {
         // Close the tab
            if (parentId) {
                toolAsJSON.gameVersion = "SD_" + g_version;
                toolAsJSON.stars = currentStars;

                //open( location, '_self' ).close();
                // Create an AJAX request to save the scenario submission
                return tool.endSession();
                /*
                $.ajax( {
                    url : g_ServerAddress + g_API + "endsession",
                    type : "POST",
                    contentType : "application/json",
                    data : JSON.stringify( toolAsJSON ),
                    success : function( response ) {
                        systemsModal.remove();
                        //tool.loadChallenge(parentModel, sessionId, "play");
                        getConfigData( launchChallenge );
                    },
                    error : function() {
                        // An error occurred trying to save the submission
                    }
                } );
                */
            }
        });
    }

    // Draw the stage by moving all circle and text objects to the top.
    tool.drawStage = function() {
        if (!tool.menuOpen) {
            $.each( tool.objectArray, function( index, value ) {
                //value.circle.moveToTop();
                if (value.textElement) {
                    value.textElement.moveToTop();
                }
            } );
        }

        tool.stage.draw();
    }

    tool.syncTextOptions = function() {
        tool.textOptions = [];
        for( var j = 0, textLength = defaultTextOptions.length; j < textLength; j++ ) {
            tool.textOptions.push( defaultTextOptions[ j ] );
        }

        for( var i = 0, length = tool.objectArray.length; i < length; i++ ) {
            for( var j = 0, textLength = tool.textOptions.length; j < textLength; j++ ) {
                if (tool.textOptions[ j ].text == tool.objectArray[ i ].text) {
                    tool.textOptions.splice( j, 1 );
                    break;
                }
            }
        }
    }

    tool.fitView = function( run ) {
        if (!run) {
            return false;
        }
        var minPosition = {
            x : 9999,
            y : 9999
        };
        var maxPosition = {
            x : 0,
            y : 0
        };

        // Determine the min and max position
        $.each( tool.objectArray, function( index, value ) {
            var objectMinPosition = value.layer.getPosition();
            var objectMaxPosition = value.circle.getPosition();
            objectMaxPosition.x += objectMinPosition.x + value.circle.getWidth() + 50;
            objectMaxPosition.y += objectMinPosition.y + value.circle.getHeight() + 50;

            if (minPosition.x > objectMinPosition.x) {
                minPosition.x = objectMinPosition.x;
            }

            if (minPosition.y > objectMinPosition.y) {
                minPosition.y = objectMinPosition.y;
            }

            if (maxPosition.x < objectMaxPosition.x) {
                maxPosition.x = objectMaxPosition.x;
            }

            if (maxPosition.y < objectMaxPosition.y) {
                maxPosition.y = objectMaxPosition.y;
            }
        } );

        // Translate all layers to the minPosition
        $.each( tool.objectArray, function( index, value ) {
            var currentPosition = value.layer.getPosition();
            currentPosition.x -= minPosition.x;
            currentPosition.y -= minPosition.y;

            // value.layer.setPosition(currentPosition);
        } );

        // Translate maxPosition
        maxPosition.x -= minPosition.x;
        maxPosition.y -= minPosition.y;

        // Set zoom based on the maxPosition
        var currentScale = tool.stage.getScale();
        var currentWidth = tool.stage.getWidth() / currentScale.x;
        var currentHeight = tool.stage.getHeight() / currentScale.y;

        var widthMultiplier = maxPosition.x / currentWidth;
        var heightMultiplier = maxPosition.y / currentHeight;

        var multiplier;

        if (widthMultiplier > heightMultiplier) {
            multiplier = widthMultiplier;
        }
        else {
            multiplier = heightMultiplier;
        }

        currentScale.x = currentScale.x / multiplier;
        currentScale.y = currentScale.y / multiplier;

        tool.stage.setScale( currentScale );

        // Now we have to center
        currentScale = tool.stage.getScale();
        currentWidth = tool.stage.getWidth() / currentScale.x;
        currentHeight = tool.stage.getHeight() / currentScale.y;

        var translate = {
            x : currentWidth - maxPosition.x,
            y : currentHeight - maxPosition.y
        };

        $.each( tool.objectArray, function( index, value ) {
            var currentPosition = value.layer.getPosition();
            currentPosition.x += translate.x / 2;
            currentPosition.y += translate.y / 2;

            // value.layer.setPosition(currentPosition);
        } );

        tool.drawStage();
        console.log( "TOOL - fit view" );
    }

    /**
     * Will setup the canvas for viewing a student-submitted challenge.
     */
    tool.setupForViewing = function( model ) {
        // Set the viewing mode
        tool.viewingMode = true;

        // Set initial challenge parameters
        tool.challengeName = model.name;
        instructions = model.instructions;
        parentId = model.challengeId;
        parentModel = model;
        tool.textOptions = [];
        defaultTextOptions = [];

        // Setup associated HTML
        $id.find( 'h1 span' ).text( model.name );
        $id.find( 'h3' ).text( model.instructions );
        $id.find( "header" ).addClass( 'hidden' );

        // Get the JSON representation of the model objects
        var objectsAsJSON = model.objects;
        if(Object.prototype.toString.call(objectsAsJSON) == '[object String]') {
            objectsAsJSON =  JSON.parse(objectsAsJSON);
        }
		console.log("objectsAsJSON:", objectsAsJSON);
        // Iterate through the nodes to create each one
        tool.objectArray = [];

        $.each( objectsAsJSON, function( index, value ) {
            if (value.position) {
                var item = new diagramItem( tool );
                tool.objectArray.push( item.init( value.position.x, value.position.y, value.id, true ) );
                item.setText( value.text );
            }
            else {
                console.log( "Oops! An object's position is missing!" );
            }
        } );

        // Get the JSON representation of the model connections
        var connectionsAsJSON = model.connections;
        if(Object.prototype.toString.call(connectionsAsJSON) == '[object String]') {
            connectionsAsJSON =  JSON.parse(connectionsAsJSON);
        }
		console.log("connectionsAsJSON:", connectionsAsJSON);

        // Iterate through the connections to create them
        $.each( connectionsAsJSON, function( index, value ) {
            // Get the from node
            var fromNode;
            for( var i = 0, objectLength = tool.objectArray.length; i < objectLength; i++ ) {
                if (tool.objectArray[ i ].text == value.nodeId) {
                    fromNode = tool.objectArray[ i ];
                    break;
                }
            }
            // If no connections exist in the from node, ignore
            // it
            if (!value.connections) {
                return;
            }

            // Iterate through the from node's connections to
            // get the to node
            $.each( value.connections, function( connectionIndex, connectionValue ) {
                var toNode = null;
                for( var i = 0, objectLength = tool.objectArray.length; i < objectLength; i++ ) {
                    if (tool.objectArray[ i ].text == connectionValue.text) {
                        toNode = tool.objectArray[ i ];
                        break;
                    }
                }

                // Be sure the to node exists
                // before making the connection
                if (toNode) {
                    fromNode.createConnection( toNode, connectionValue.isAdd );
                }
                else {
                    console.log( "Oops! Connection can not be made from " + fromNode.text + " to " + connectionValue.text + "!" );
                }
            } );
        } );

        // Finally, fit the objects and connections into the canvas
        tool.fitView( true );
    }

    /**
     * Will setup the canvas with objects and connections for the player to
     * interact with.
     */
    tool.setupForInteraction = function( model ) {
        // Set the viewing mode
        tool.viewingMode = false;

        // Set initial challenge parameters
        tool.challengeName = model.name;
        instructions = model.instructions;
        parentId = model.challengeId;
        parentModel = model;
        tool.textOptions = [];
        defaultTextOptions = [];

        // Setup associated HTML
        $id.find( 'h1 span' ).text( model.name );
        $id.find( 'h3' ).text( model.instructions );
        $id.find( "h1" ).removeClass( 'hidden' );
        $id.find( "h3" ).removeClass( 'hidden' );

        // Get the JSON representation of the model objects
        var objectsAsJSON = model.objects;//JSON.parse( model.objects );
        parentModel.objects = objectsAsJSON;
        // Get the JSON representation of the model connections
        var connectionsAsJSON = model.connections;//JSON.parse( model.connections );
        parentModel.connections = connectionsAsJSON;

        // Don't show dependent nodes in the textOptions
        tool.objectArray = [];
        $.each( objectsAsJSON, function( index, value ) {
            // Iterate through the connections to determine if the node in
            // question is a dependent
            var isDependent = false;
            $.each( connectionsAsJSON, function( connectionIndex, connectionValue ) {
                // Validate node Ids
                if (value.id == connectionValue.nodeId) {
                    isDependent = true;
                    return false;
                }
            } );

            // If the node is not dependent, create text options and default
            // text options for the independent node
            if (!isDependent) {
                tool.textOptions.push( {
                    text : value.text,
                    metadata : value.metadata,
                    id : value.id
                } );
                defaultTextOptions.push( {
                    text : value.text,
                    metadata : value.metadata,
                    id : value.id
                } );
            }
        } );

        // Iterate through the tutorials to see if this challenge matches one
        tutorial = null;

        $.each(Tutorials, function( index, value ) {
            // Validate the challenge Ids
            if (value.scenarioId == model.challengeId) {
                console.log( "tutorial found" );
                // A tutorial was found
                tutorial = value;
                tool.inTutorial = true;

                // Initialize starting phase
                currentPhase = 0;
                //$id.find( 'h4' ).html( tutorial.phases[ currentPhase ].instruction );
                //$id.find('h4').css('top', $id.find('h3').outerHeight());

                // Iterate through the starting nodes and create
                // each one
                for( var i = 0, nodeLength = tutorial.startingNodes.length; i < nodeLength; i++ ) {
                	var nodeName = tutorial.startingNodes[i];
                	var item = new diagramItem(tool);

                	tool.objectArray.push(item.init((i + 1) * 200, 200, nodeName));

                	tool.currentMousePositionCords.x = item.layer.getPosition().x;
                	tool.currentMousePositionCords.y = item.layer.getPosition().y;

                	tool.currentSelectedCircle = nodeName;
                	tool.createToolTip(currentPhase);

                	item.setText(nodeName);
                	item.setImageOnCircle(nodeName, function () { item.setText(nodeName); });
                }

                // A tutorial was found, no need to continue
                // searching
                return;
            }
        });

    	// Iterate through each connection
        $.each(connectionsAsJSON, function (index, value) {
        	// Iterate through each object to get the node names
        	var nodeName;
        	$.each(objectsAsJSON, function (objectIndex, objectValue) {
        		if (objectValue.text == value.nodeId) {
        			nodeName = objectValue.text;
        			return false;
        		}
        	});

        	// Create a new diagram item using the node name
        	var item = new diagramItem(tool);
        	tool.objectArray.push(item.init((index + Tutorials.length) * 200, 200, value.nodeId, true));

        	item.setImageOnCircle(nodeName, function () { item.setText(nodeName); });
        });

        // Fix height for instructions
        var outerHeight = $id.find( "h3" ).outerHeight();
        $id.find( 'header' ).css( 'height', outerHeight );

        //tool.showDialogMessage('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur suscipit urna ac odio mollis luctus. Integer euismod lorem ac cursus lacinia. Praesent dictum bibendum leo, sit amet interdum dolor condimentum id. Morbi non dui ornare, pulvinar augue id, venenatis risus. Praesent nec quam congue, egestas felis vitae, lobortis massa. Maecenas tempor, lorem in placerat viverra, nisi ligula vulputate mauris, sed dignissim sapien risus vel velit. Etiam nec congue augue. Phasellus sed vestibulum leo. Cras sed risus eleifend augue varius dictum. Proin id tortor pharetra, lobortis nunc vitae, dignissim dui. Maecenas nulla elit, tincidunt sit amet sodales sed, condimentum in sapien.');

        // We can begin interacting with the tool
        started = true;

        if (introText[model.challengeId] !== undefined) {
        	tool.showDialogMessage(introText[model.challengeId], function () { }, true);
        }
        
        // Enable the submit button for non-tutorial challenges
        if( tutorial == null ) {
        	$('#diagram_save').removeClass('disabled');
        }
    }

    /**
     * Will transform the current game space into a JSON representation to pass
     * into the database.
     */
    tool.toJson = function() {
        // Create the new challenge model
        var model = {
            gameSessionId : g_sessionId,
            challengeId : parentId,
            name : tool.challengeName,
            instructions : instructions,
            type : "SD",
            objects : [],
            connections : [],
            text : "",
            assessment : ""
        };

        $.each( tool.objectArray, function( index, value ) {
            var object = {
                id : value.text,
                metadata : value.metadata,
                text : value.text,
                connections : [],
                position : value.getPosition()
            };

            var objectConnection = {
                nodeId : value.text,
                connections : []
            };

            $.each( value.connections, function( connectionIndex, connection ) {
                var text;

                for( var i = 0, length = tool.objectArray.length; i < length; i++ ) {
                    if (tool.objectArray[ i ].id == connection.targetId) {
                        text = tool.objectArray[ i ].text;
                    }
                }

                var newConnection = {
                    id : connection.id,
                    isAdd : connection.isAdd,
                    targetId : connection.targetId,
                    text : text
                };

                objectConnection.connections.push( newConnection );
            } );

            if (objectConnection.connections.length != 0) {
                model.connections.push( objectConnection );
            }

            model.objects.push( object );
        } );

        return model;
    }

    // This will dynamically determine the id of a node based on what is
    // currently in play
    tool.getNewId = function() {
        var indexFound = false;
        var index = 0;
        while( !indexFound ) {
            indexFound = true;
            $.each( tool.objectArray, function( objectIndex, objectValue ) {
                if (objectValue.id == "systems_" + index) {
                    index++;
                    indexFound = false;
                    return;
                }
            } );
        }

        return "systems_" + index;
    }

    /**
     * Load the challenge from the dashboard. Takes in the model object of the
     * challenge and loads in either an unsolved challenge or a
     * previously-solved challenge.
     */
    tool.loadChallenge = function( model, sessionId, type ) {
        // Keep track of the session Id
        sessionId = sessionId;
        
        var isPreview = false;
        if( type == "view" || type == "preview" || type == "review" ) {
            isPreview = true;
        }
        instructorPreview = isPreview;

        // Show the tool's main container
        $id.removeClass( 'hidden' );

        // Setup the Kinetic stage
        tool.stage = new Kinetic.Stage( {
            container : 'systemCanvas',
            width : $id.find( 'section' ).width(),
            height : $id.find( 'section' ).height()
        } );

        // Viewing the challenge only
        if( ( type == "view" || type == "review" ) && model.challengeId ) {
            if( type == "view" || type == "review" ) {
                if( model.objects == "" ) {
                    model.objects = "{}";
                } else {
                	model.objects = JSON.parse( model.objects );
                }
                if( model.connections == "" ) {
                    model.connections = "{}";
                } else {
                	model.connections = JSON.parse( model.connections );
                }
            }

            tool.setupForViewing( model );
        }
        // Loading the challenge to interact with
        else {
            // Fire an event indicating the scenario was loaded
            tool.createEvent( "GL_Scenario_Loaded", 1, {
                name : model.name
            } );
            
            // Fire browser specs event
            tool.createEvent( "GL_Browser_Specs", 10, {
                codeName : navigator.appCodeName,
                appName : navigator.appName,
                appVersion : navigator.appVersion,
                cookiesEnabled : navigator.cookieEnabled,
                platform : navigator.platform,
                userAgent : navigator.userAgent,
                systemLanguage : navigator.systemLanguage
            } );
            
            // Setup the tool for the student to use
            tool.setupForInteraction( model );
            
            // Look for sierra madre flag
            if( model.challengeId == "063cf110-e0f6-11e2-a9b1-fbf5ea959a8c" || model.challengeId == "723dfa90-e0f5-11e2-a9b1-fbf5ea959a8c" ) {
                isSierraMadre = true;
            }
        }
        
        // If this is a preview, hide the save button
        if( instructorPreview ) {
            $("#diagram_save").addClass( 'hidden' );
            g_challengeCompleted = true;
        }
        
        // If this is a student viewing work, show the header with the cancel button
        if( type == "view" ) {
            $id.find( "header" ).removeClass( 'hidden' );
            $id.find( 'h3' ).removeClass( 'hidden' );
            $id.find( 'h3' ).text( 'You are viewing your submitted work.' );
            $("#diagram_save").addClass( 'hidden' );
        }
    }

    /**
     * Helper function to create a new telemetry event, taking in the event type
     * and data.
     */
    tool.createEvent = function( eventType, priority, data, callback ) {
        if (tool.viewingMode || instructorPreview) {
            return;
        }
        
        // If the event does not match priority, ignore it
        if( priority > telemetryEventPriority ) {
            return;
        }

        if(data.hasOwnProperty("stars")) {
            currentStars = data.stars;
        }

        // Create the event structure
        var event = {
            name : eventType,
            eventData : data,
            timestamp : Math.round(new Date().getTime()/1000.0)
            //gameSessionId : g_sessionId,
            //gameVersion : "SD_" + g_version
        }
        
        // Push this event to the queue
        telemetryQueue.push( event );
        
        // If the queue has reached the max size, send the batch
        if( telemetryQueue.length >= telemetryBatchSizeMax ) {
            tool.sendTelemetryBatch();
        }
        // If the queue has reached the min size and timer already passed, send the batch
        if( telemetryBatchTimePassed && telemetryQueue.length >= telemetryBatchSizeMin ) {
            tool.sendTelemetryBatch();
            telemetryBatchTimePassed = false;
        }

        // Setup the AJAX request to fire the telemetry event - this should be moved to a batch fire function
        /*$.ajax( {
            url : g_ServerAddress + g_API + "sendtelemetry",
            type : "POST",
            contentType : "application/json",
            data : JSON.stringify( event ),
            success : function( response ) {
                if (callback) {
                    callback();
                }
            },
            error : function() {
                // An error occurred with creating the telemetry event
            }
        } );*/
    }
    
    function telemetryBatchInterval() {
        // The timer has passed, keep this state until the events are fired
        // Batch won't fire if min events aren't met
        telemetryBatchTimePassed = true;
        
        // Send telemtry batch if we have the minimum number of events
        if( telemetryQueue.length >= telemetryBatchSizeMin ) {
            tool.sendTelemetryBatch();
            telemetryBatchTimePassed = false;
        }
    }

    tool.getQEvents = function() {
        // Setup the local events array
        var events = [];
        // Iterate through the telemetry queue and append to the post event
        var queueSize = telemetryQueue.length;
        for( var i = 0; i < queueSize; i++ ) {
            // Ensure we stick to the size cap
            if( i >= telemetryBatchSizeMax ) {
                break;
            }
            
            // push the queue event in the batch
            events.push( JSON.stringify( telemetryQueue.shift() ) );
        }

        return events;
    };

    tool.buildUrl = function(route) {
        return g_ServerAddress + route;
    };


    tool.startSession = function(courseId, challengeId) {
        var info = {
            gameId:    "SC",
            courseId:  courseId,
            deviceId:  "browser",
            gameLevel: challengeId,
            timestamp: new Date().getTime()
        };

        // return promise
        return $.ajax( {
            url : tool.buildUrl("/api/v2/data/session/start"),
            type : "POST",
            contentType : "application/json",
            data : JSON.stringify( info )
        });
    };

    tool.endSession = function(gameSessionId) {
        var info = {
            gameSessionId: gameSessionId,
            timestamp:     new Date().getTime()
        };

        // return promise
        return $.ajax( {
            url : tool.buildUrl("/api/v2/data/session/end"),
            type : "POST",
            contentType : "application/json",
            data : JSON.stringify( info )
        });
    };
    
    /**
     * Send a batch of telemetry events. This will ONLY be called when:
     *  - batch timer passes and min events encountered
     *  - max events encountered
     *  - forced (usually just prior to a session submit)
     */
    tool.sendTelemetryBatch = function( callback ) {
        if (tool.viewingMode || instructorPreview) {
            return;
        }
        
        // Ignore sending batches if the max size is 0 (default)
        if( telemetryBatchSizeMax == 0 ) {
            return;
        }
        
        var events = tool.getQEvents();
        
        // Setup the batch data object
        var batch = {
            events : "[" + events.toString() + "]",
            gameSessionId : g_sessionId,
            gameVersion : "SD_" + g_version
        }
        
        // Setup the AJAX request to fire the telemetry batch
        return $.ajax( {
            url : tool.buildUrl("/api/v2/data/events"),
            type : "POST",
            contentType : "application/json",
            data : JSON.stringify( batch ),
            success : function( response ) {
                // Batch was successful
                if( callback ) {
                    callback();
                }
            },
            error : function() {
                // An error occurred with creating the telemetry event
            }
        } );
    };

    tool.setTelemetryBatchParameters = function( maxSize, minSize, time, priority ) {
        telemetryBatchSizeMax = maxSize;
        telemetryBatchSizeMin = minSize;
        telemetryBatchTime = time;
        telemetryEventPriority = priority;
        
        setInterval( telemetryBatchInterval, telemetryBatchTime * 1000 );
    }

    tool.enabled = function( action, textToSet ) {
        if (!tutorial || !started) {
            return true;
        }

        if ($.inArray( action, tutorial.phases[ currentPhase ].disabled ) >= 0) {
            return false;
        }
        else if (action == tutorial.phases[ currentPhase ].trigger) {
            if( action == sdActions.setText && tutorial.phases[ currentPhase ].triggerText ) {
                if( tutorial.phases[ currentPhase ].triggerText != textToSet ) {
                    return false;
                }
            }

            currentPhase++;
            if (currentPhase == tutorial.phases.length) {
                console.log( "Done" );
                tutorial = null;
            }
            else {
            	tool.createToolTip(currentPhase);

                //$id.find( 'h4' ).html( tutorial.phases[ currentPhase ].instruction );
                //$id.find( 'h4' ).css( 'top', $id.find( 'h3' ).outerHeight() );
            }
        }

        if ((tutorial.phases.length - 1) == currentPhase) {
        	$('#diagram_save').removeClass('disabled');
        }

        return true;
    }

    tool.showDialogMessage = function (message, action) {
    	tool.showDialogMessage(mesage, action, true);
    }

    tool.showDialogMessage = function (message, action, modal) {
    	if (modal) {
    		$('#dialog-message-overlay').removeClass('hidden');
    	}

    	var dialog = $('#dialog-message');

    	dialog.find('.content p').text(message);
    	dialog.removeClass('hidden');

    	dialog.find('.close').click(function (e) {
    		e.preventDefault();

    		dialog.find('.content p').text('');
    		dialog.addClass('hidden');

    		if (modal) {
    			$('#dialog-message-overlay').addClass('hidden');
    		}

    		if (action !== undefined) {
    			action();
    		}
    	});
    }

    tool.createToolTip = function (currentPhase) {
        // Only display tool tips for tutorials
        if( !tool.inTutorial ) {
            return;
        }
        
    	tool.stage.get('.tooltip').destroy();

    	tool.currentPhase = currentPhase;

    	var toolTipIsOnBottom = true;

    	if (tool.currentMousePositionCords.y > (tool.stage.getHeight() / 2)) {
    		toolTipIsOnBottom = false;
    	}

    	var layer = new Kinetic.Layer({
    		name: 'tooltip',
    		x: tool.currentMousePositionCords.x + 100,
    		y: (toolTipIsOnBottom) ? (tool.currentMousePositionCords.y + 180) : (tool.currentMousePositionCords.y + 20),
    	});

    	var label = new Kinetic.Label({
    		draggable: false
    	});

    	label.add(
			new Kinetic.Tag({
    			fillLinearGradientStartPoint: [-80, -20],
    			fillLinearGradientEndPoint: [80, 20],
    			fillLinearGradientColorStops: [0, '#88daff', 1, '#6abdf5'],
    			stroke: '#ffffff',
    			lineJoin: 'round',
    			shadowColor: '#000000',
    			shadowBlur: 10,
    			shadowOffset: 10,
    			shadowOpacity: 0.5,
    			pointerDirection: (toolTipIsOnBottom) ? 'up' : 'down',
    			pointerWidth: 20,
    			pointerHeight: 20,
    			cornerRadius: 5
    		})
		);

    	label.add(
			new Kinetic.Text({
				text: tutorial.phases[currentPhase].instruction,
				fontSize: 18,
				lineHeight: 1.2,
				padding: 10,
				width: 200,
				align: 'center',
				fill: '#ffffff'
			})
		);

    	layer.add(label);

    	tool.stage.add(layer);

    	tool.drawStage();
        //console.log( "TOOL - create tooltip" );
    }
    
    tool.displayLibretto = function( correlationPositive, from, to ) {
        // Set the libretto text
        if( !tool.inTutorial ) {
            var correlation = "";

            // Make sure correlation includes third person 's' in adds and reduces for "Air Pollution" and "Power"
            if( from == "Air Pollution" || from == "Power" ) {
                correlation = correlationPositive ? "adds to the" : "reduces the";
            }
            // Set the correlation text based on positive or negative
            else {
            	correlation = correlationPositive ? "add to the" : "reduce the";
            }

            // Set the visibility and text for the libretto
            $( "#diagram_libretto_header" ).css( "visibility", "visible" );
            $( "#diagram_libretto" ).html( "<b>" + from + "</b> " + correlation + " <b>" + to + "</b> of the city." );
        }
    }

    return tool;
}