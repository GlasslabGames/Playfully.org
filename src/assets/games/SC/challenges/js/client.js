// Server address should be changed to the server host //
var g_ServerAddress = "";//getBaseURL();
//console.log(g_ServerAddress);
// Learning challenges version
var g_version = "LC_1.0";
var g_API = "/api/challenge/";

// Learning challenge objects
var mELALearningChallenge;
var mSystemsDiagrammingLearningChallenge;
var systemsModal;
var g_challengeCompleted = false;

// The game session ID
var g_sessionId;

$( document ).ready( function() {
    // Get the config data
    getConfigData( launchChallenge );

    // Create the systems modal object
    systemsModal = popup( "popupModal" );

    // Initialize the ELA learning challenge
    mELALearningChallenge = elaTool();
    mELALearningChallenge.init( "#elaTool" );

    // Initialize the Systems Diagramming learning challenge
    mSystemsDiagrammingLearningChallenge = diagramTool();
    mSystemsDiagrammingLearningChallenge.init( "#systemsDiagram" );
} );

function launchChallenge( config ) {
    g_ServerAddress = "http://" + config.gameSessionURL;
    console.log( "Client address: " + g_ServerAddress );

    // Get the view to determine how we're interacting with the learning challenge
    var type = loadPageVar( 'type' );

    // If the type is "view", load the challenge for viewing only
    if (type == "view" || type == "review") {
        // Get the game session Id if it exists in the query string
        var gameSessionId = loadPageVar( 'gameSessionId' );
        // TODO: check if this is correct? gameSessionId vs. g_sessionId
        //console.log( gameSessionId );

        // Setup AJAX request to get the desired learning challenge
        $.ajax( {
            url : g_ServerAddress + g_API + "retrievesubmitted/" + gameSessionId,
            type : "GET",
            success : function( response ) {
                // Verify that we got a response
                if (response && response.submission) {
                    // Set a local variable describing the learning challenge
                    var model = response.submission;
                    //console.log("View: " + JSON.stringify( model ));
                    // Reveal the main div for the learning challenge
                    $( "#main" ).css( 'top', '0px' ).removeClass( 'hidden' );

                    // Load the ELA learning challenge
                    if (model.type == "ELA") {
                        $( "#elaTool" ).removeClass( 'hidden' );
                        mELALearningChallenge.loadChallenge( model, g_sessionId, type );
                    }
                    // Load the Systems Diagramming learning challenge
                    else {
                        $( "#systemsDiagram" ).removeClass( 'hidden' );
                        mSystemsDiagrammingLearningChallenge.loadChallenge( model, g_sessionId, type );
                    }
                }
                else {
                    // There are no challenges to view from this user
                }
            },
            error : function() {
                // Retrieving the learning challenge failed
            }
        } );
    }
    // Else the student is playing the learning challenge
    else if( type == "play" ) {
        // Get the challenge Id, and course Id information if it exists in the query string
        var challengeId = loadPageVar( 'challengeId' );
        var courseId = loadPageVar( 'courseId' );
        var sessionURL = loadPageVar( 'sessionURL' );
        var dataURL = loadPageVar( 'dataURL' );
        var sessionId = loadPageVar( 'sessionId' );

        // Only continue if the above variables do exist
        if (challengeId && courseId) {
            // Setup AJAX request to validate user session and create a game session

            tool.startSession(courseId, challengeId)
                .then( function( response ) {
                    // Game session was successfully created, grab it
                    g_sessionId = response.gameSessionId;
                    var telemetryBatchMaxSize = response.eventsMaxSize;
                    var telemetryBatchMinSize = response.eventsMinSize;
                    var telemetryBatchTime = response.eventsPeriodSecs;
                    var telemetryEventPriority = response.eventsDetailLevel;

                    // Setup AJAX request to get the desired learning challenge
                    $.ajax( {
                        url : g_ServerAddress + g_API + challengeId,
                        type : "GET",
                        success : function( response ) {
                            // Verify that we got a response
                            if (response) {
                                // Set a local variable describing the learning challenge
                                var model = response.template;
                                //console.log( "Play: " + model );
                                // Reveal the main div for the learning challenge
                                $( "#main" ).css( 'top', '0px' ).removeClass( 'hidden' );

                                // Load the ELA learning challenge
                                if (model.type == "ELA") {
                                    $( "#elaTool" ).removeClass( 'hidden' );
                                    mELALearningChallenge.loadChallenge( model, g_sessionId, type, info );
                                    mELALearningChallenge.setTelemetryBatchParameters( telemetryBatchMaxSize, telemetryBatchMinSize, telemetryBatchTime, telemetryEventPriority );
                                }
                                // Load the Systems Diagramming learning challenge
                                else {
                                    $( "#systemsDiagram" ).removeClass( 'hidden' );
                                    mSystemsDiagrammingLearningChallenge.loadChallenge( model, g_sessionId, type );
                                    mSystemsDiagrammingLearningChallenge.setTelemetryBatchParameters( telemetryBatchMaxSize, telemetryBatchMinSize, telemetryBatchTime, telemetryEventPriority );
                                }
                            }
                            // Empty response, the challenge didn't exist
                            else {
                                alert( "Challenge doesn't exist, please contact your teacher!" );
                            }
                        }
                    } );
                });
        }
    }
    // Else, the teacher is previewing a challenge
    else {
        // Get the challenge Id
        var challengeId = loadPageVar( 'challengeId' );
        
        // Setup AJAX request to get the desired learning challenge
        $.ajax( {
            url : g_ServerAddress + g_API + challengeId,
            type : "GET",
            success : function( response ) {
                // Verify that we got a response
                if (response && response.template) {
                    // Set a local variable describing the learning challenge
                    var model = response.template;
                    //console.log("Preview: " + model);
                    // Reveal the main div for the learning challenge
                    $( "#main" ).css( 'top', '0px' ).removeClass( 'hidden' );

                    // Load the ELA learning challenge
                    if (model.type == "ELA") {
                        $( "#elaTool" ).removeClass( 'hidden' );
                        mELALearningChallenge.loadChallenge( model, g_sessionId, type );
                    }
                    // Load the Systems Diagramming learning challenge
                    else {
                        $( "#systemsDiagram" ).removeClass( 'hidden' );
                        mSystemsDiagrammingLearningChallenge.loadChallenge( model, g_sessionId, type );
                    }
                }
                else {
                    // There are no challenge
                }
            },
            error : function() {
                // Retrieving the learning challenge failed
            }
        } );
    }
}

function getBaseURL( sVar ) {
    if (window.self === window.top) {
        // in new window
        if (!window.location.origin) {
           window.location.origin = window.location.protocol+"//"+window.location.host;
        }
        return window.location.origin;
    }
    else {
        // in iframe
        // this seams to work the same though
        if (!window.location.origin) {
           window.location.origin = window.location.protocol+"//"+window.location.host;
        }
        return window.location.origin;
    }
}
function getConfigData( callback ) {
	var sessionURL = loadPageVar( 'sessionURL' );
    var dataURL = loadPageVar( 'dataURL' );
    
    var configData = {
        gameSessionURL : sessionURL,
        gameDataURL : dataURL
    };
    
    if( !sessionURL || !dataURL ) {
    	$.ajax( {
            url : "/api/config/",
            type : "GET",
            success : function( response ) {
                configData.gameSessionURL = response.gameSessionURL;
                configData.gameDataURL = response.gameDataURL;
                
                callback( configData );
            },
            error : function() {
                // Error retrieving config information
            }
    	});
    }
    else {
        callback( configData );
    }
}
window.onbeforeunload = function() {
    if( !g_challengeCompleted ) {
        return "Are you sure you want to close? All data you have entered will be lost! Hit the 'Submit' button if you want to save your data.";
    }
}
// Capturing information from the query string
function loadPageVar( sVar ) {
    var param;
    if (window.self === window.top) {
        param = unescape( window.location.search.replace(
            new RegExp( "^(?:.*[&\\?]" + escape( sVar ).replace( /[\.\+\*]/g, "\\$&" ) + "(?:\\=([^&]*))?)?.*$", "i" ), "$1" ) );
    }
    else {
        param = unescape( $( 'iframe', window.parent.document ).attr( 'src' ).replace(
            new RegExp( "^(?:.*[&\\?]" + escape( sVar ).replace( /[\.\+\*]/g, "\\$&" ) + "(?:\\=([^&]*))?)?.*$", "i" ), "$1" ) );
    }
    return param;
}