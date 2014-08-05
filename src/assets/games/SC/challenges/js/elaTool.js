/**
 * ELA Learning Challenge
 */
var elaTool = function() {
    var tool = {};

    var $id;

    var $gameId;

    var connectorSelected = false;

    var launchInfo = null; // user session and course ids for launching next
    // ELA in a group
    
    var instructorPreview = false;

    var objectArray = [];
    var paragraphs = [];
    var articleHeader = "";
    var instructions;

    tool.challengeName;
    tool.viewingMode = false;

    var currentTarget = "";
    var currentEndpoint;

    var expanded = false;
    var isMouseDown = false;
    var editMode = false;
    var parentId = null;
    var sessionId = null;

    var attempt = 0;
    var maxAttempts = 3;
    var currentStars = 0;
    
    // Telemetry batching config
    var telemetryQueue = [];
    var telemetryBatchSizeMax = 0;
    var telemetryBatchSizeMin = 0;
    var telemetryBatchTime = 60;
    var telemetryEventPriority = 1;
    var telemetryBatchTimePassed = false;

    tool.isEvidenceChallenge = false;
    tool.selectedText = "";
    tool.textMetadata = 0;
    
    var sd_wordReplacements = [
           { word: "scrubbers", replacedWord: "scrubbe- rs" },
           { word: "Department", replacedWord: "Depart- ment" },
           { word: "increasing", replacedWord: "increasi- ng" },
           { word: "chemicals", replacedWord: "chemica- ls" },
           { word: "companies", replacedWord: "compan- ies" },
           { word: "company's", replacedWord: "compan- y's" },
           { word: "measurements", replacedWord: "measur- ements" },
           { word: "passengers", replacedWord: "passen- gers" },
           { word: "supposed", replacedWord: "suppos- ed" },
           { word: "Wastewater", replacedWord: "Wastewa- ter" },
           { word: "Pesticides", replacedWord: "Pesticid- es" },
           { word: "happened", replacedWord: "happen- ed" }
    ];
    var ela_wordReplacements = [
           { word: "Measurements", replacedWord: "Measurem- ents" }
    ];

    var mELADiagramGroup = [
        "2d2d2ec0-e01f-11e2-a7e8-3f4343712aaf",
        "c9a942d0-e01e-11e2-a7e8-3f4343712aaf",
        "212f0b70-0a8b-11e3-8ffd-0800200c9a66",
        "2bfb6dc0-e40a-11e2-9336-d1ab0cf51c41"
    ];
    var mELAEvidenceGroup = [
        "57a862b0-e01e-11e2-a7e8-3f4343712aaf",
        "47b0dc70-e01e-11e2-a7e8-3f4343712aaf",
        "212f0b71-0a8b-11e3-8ffd-0800200c9a66",
        "12252b50-e01f-11e2-a7e8-3f4343712aaf"
    ];

    // Summary text in the form of: Level2[diagram, evidence], Level1[diagram, evidence], Level0[diagram, evidence]
    var mSummaryText = [
            [
                    "Well done! You were able to use information from the text and the diagram to find the missing information and complete the diagram. It is important to pay attention to diagrams and be able to read them.",
                    "Nice work! You were able to locate and recognize evidence in each of the texts that supported the different claims that were being made."
            ],
            [
                    "Good effort! You were able to find information in the texts that was related to the missing part of the diagrams. But you were not always finding the information that best completed the diagrams.",
                    "Good effort! You were able to find information in the texts that was related to the different claims. But you were not always finding the evidence."
            ],
            [
                    "Try again! You were identifying pieces of the text. But some of the text you located did not help complete the diagram.",
                    "Try again! You were identifying parts of the text that were not clearly related to the claim."
            ]
    ];
    // Next steps text in the form of: Level2[diagram, evidence], Level1[diagram, evidence], Level0[diagram, evidence]
    var mNextStepsText = [
            [
                    "You may be ready for some more challenging texts or some more challenging diagrams!",
                    "You may want to try out some more challenging texts!"
            ],
            [
                    "Next time, be sure you are finding the best information for completing the diagram. Also be sure you are not repeating information that is already in the diagram.",
                    "It may be helpful for you to review what counts as evidence for a claim."
            ],
            [
                    "Next time it may be helpful to be sure you understand what kind of information might be missing in the diagram. It will help to study the diagram more carefully before you answer.",
                    "Next time it may be helpful to be sure you understand what claims are and how to identify them in a text. It may also help to think about what could count as evidence for a claim in a text before or as you read."
            ]
    ];
    var mTeacherFeedbackCodes = [
            [
                    "TFM3E1S31",
                    "TFM5E1S31"
            ],
            [
                    "TFM3E1S21",
                    "TFM5E1S21"
            ],
            [
                    "TFM3E1S11",
                    "TFM5E1S11"
            ]
    ];
    var mStudentFeedbackCodes = [
            [
                    "SFM3E1S31",
                    "SFM5E1S31"
            ],
            [
                    "SFM3E1S21",
                    "SFM5E1S21"
            ],
            [
                    "SFM3E1S11",
                    "SFM5E1S11"
            ]
    ];

    // Hints array with current hint information
    var mHintsText = [
            "This is your first hint.", "This is your second hint.", "This is your third hint.", "We have no more hints to give you!"
    ];
    var currentHint = 0;
    var noHintsIndex = 3;
    
    var mTeacherCodesForIntermediate = [
            [
                    "TFM3E1S71",
                    "TFM5E1S71"
            ],
            [
                    "TFM3E1S61",
                    "TFM5E1S61"
            ],
            [
                    "TFM3E1S51",
                    "TFM5E1S51"
            ],
            [
                    "TFM3E1S41",
                    "TFM5E1S41"
            ]
    ];

    // Feedback text per challenge/attempt
    var mFeedbackText = {
		"95347e00-0b63-11e3-8ffd-0800200c9a66" : [
                "",
                "",
                "",
                "Great job! The diagram is complete with the correct answer!"
        ],
        "2d2d2ec0-e01f-11e2-a7e8-3f4343712aaf" : [
                "Remember, find the information that does the best job completing the diagram. Try the challenge again.",
                "Take your time and be sure  your answer does not repeat information already in the diagram. Try the challenge again.",
                "The correct answer is \"new materials\". The text suggests that new designs and new materials are making solar panels more efficient, but \"new designs\" is already in the diagram. So \"new materials\" must be the answer.",
                "Great job! The diagram is complete with the correct answer!"
        ],
        "c9a942d0-e01e-11e2-a7e8-3f4343712aaf" : [
                "Remember, find the information that does the best job completing the diagram. Try the challenge again.",
                "Take your time. Be sure  your answer does not repeat information already in the diagram. Try the challenge again.",
                "The correct answer is \"sulfur.\" The text suggests that lowering sulfur and nitrous oxide in fuel will help lower air pollution. But \"nitrous oxide\" is already in the diagram. So \"sulfur\" must be the correct answer.",
                "Great job! The diagram is complete with the correct answer!"
        ],
        "212f0b70-0a8b-11e3-8ffd-0800200c9a66" : [
                "Remember, find the information that does the best job completing the diagram. Try the challenge again.",
                "Take your time. Be sure  your answer does not repeat information already in the diagram. Try the challenge again.",
                "The correct answer is \"pesticides in the port's water.\" The text suggests that sewage from ships and pesticides can lead to algae blooms in the port\'s water.  But \"sewage from ships\" is already in the diagram. So \"pesticides in the port\'s water\" must be the answer.",
                "Great job! The diagram is complete with the correct answer!"
        ],
        "2bfb6dc0-e40a-11e2-9336-d1ab0cf51c41" : [
                "Remember, find the information that does the best job completing the diagram. Try the challenge again.",
                "Take your time. Be sure  your answer does not repeat information already in the diagram. Try the challenge again.",
                "The correct answer is \"more trade\" The text suggests that more tourists and more trade will lead to more orders for local products. But \"more tourists\" is already in the diagram. So \"more trade\" must be the answer.",
                "Great job! The diagram is complete with the correct answer!"
        ],
        "534cd7f0-0495-11e3-8ffd-0800200c9a66" : [
                "Remember, the question is asking for evidence that supports the claim that scrubbers reduce air pollution. Try the challenge again.",
                "To get this right, you may want to think about what kind of evidence in the text could help prove that scrubbers reduce air pollution.",
                "The correct answer is \"scrubbers can decrease some kinds of air pollution by 80%.\" This observation helps prove that scrubbers reduce air pollution.",
                "Great job! The evidence diagram is complete with the correct answer!"
        ],
        "57a862b0-e01e-11e2-a7e8-3f4343712aaf" : [
                "Remember, find evidence that supports the claim that solar panels are getting better at making electricity. Try the challenge again.",
                "To get this right, think about what kind of evidence in the text could help prove that solar panels are getting better at making electricity.",
                "The correct answer is \"solar power panels made in 2012 are up to 6% more efficient than older solar panels.\" This observation helps prove that solar panels are getting better.",
                "Great job! The evidence diagram is complete with the correct answer!"
        ],
        "47b0dc70-e01e-11e2-a7e8-3f4343712aaf" : [
                "Remember, find evidence supporting the claim that using cleaner fuel can lower air pollution. Try the challenge again.",
                "To get this right, think about what kind of evidence in the text could help prove that cleaner fuels can lower air pollution. Try the challenge again.",
                "The correct answer is \"The company's measurements show it is possible to cut four hundred tons of pollution each year by using cleaner fuel.\" This observation helps show that cleaner fuel could lower air pollution.",
                "Great job! The evidence diagram is complete with the correct answer!"
        ],
        "212f0b71-0a8b-11e3-8ffd-0800200c9a66" : [
                "Remember, find evidence supporting the claim that algae blooms can lower the amount of oxygen in the port\'s waters. Try the challenge again.",
                "To get this right, think about what kind of evidence in the text could help prove that algae can lower the amount of oxygen in the port\'s waters. Try the challenge again.",
                "The correct answer is \"scientists have found up to a thirty-four percent drop in the water\'s oxygen level.\" This observation helps show that algae blooms can lower the amount of oxygen in the port\'s waters.",
                "Great job! The evidence diagram is complete with the correct answer!"
        ],
        "12252b50-e01f-11e2-a7e8-3f4343712aaf" : [
                "Remember, find evidence supporting the claim that a larger port will lead to more orders for local products. Try the challenge again.",
                "To get this right, think about what kind of evidence in the text could help prove that a larger port will lead to more orders for local products. Try the challenge again.",
                "The correct answer is \"Water Well factories had a twenty percent increase in orders for their products.\" This observation helps show that a city like Regal City may have an increase in orders for its products too.",
                "Great job! The evidence diagram is complete with the correct answer!"
        ]
    };

    var mIntroText = {
    	"95347e00-0b63-11e3-8ffd-0800200c9a66": "Glad you're back. This time we're going to finish a diagram that someone else started. What word or words are missing from this diagram? Read the text. Then drag your selection to the circle where it belongs.",
    	"2d2d2ec0-e01f-11e2-a7e8-3f4343712aaf": "Allright! This diagram looks a little tricky. Read the text closely. Click on the word or words that complete the diagram and drag them over the empty circle.",
    	"c9a942d0-e01e-11e2-a7e8-3f4343712aaf": "Here is another diagram to complete. Remember, read the text closely. Then click on the word or words that complete the diagram and drag them over to the empty circle.",
    	"212f0b70-0a8b-11e3-8ffd-0800200c9a66": "These challenges keep getting tougher! Read the text closely. What word or words will complete the diagram? Drag the right word or words over to the empty circle.",
    	"2bfb6dc0-e40a-11e2-9336-d1ab0cf51c41": "I think this is the last challenge in this set. Remember, read the text closely. What word or words will complete the diagram? Choose your answer and drag it to the empty circle.",
    	"063cf110-e0f6-11e2-a9b1-fbf5ea959a8c": "We're getting ready for the next mission. Think about what kinds of things might create electricity for your city and what kinds of things might cause pollution. Create a diagram that shows what you're thinking.",
    	"723dfa90-e0f5-11e2-a9b1-fbf5ea959a8c": "Good. You have a chance to show how your ideas are changing. Think about the kinds of things that created electricity for your city and what was causing pollution. Create a new diagram that shows what you're thinking.",
    	"534cd7f0-0495-11e3-8ffd-0800200c9a66": "Look at this. They've added something new to these diagrams. This time you want to find the right piece of evidence. What evidence supports the claim that scrubbers reduce air pollution? Drag the right piece of evidence over to the evidence box.",
    	"57a862b0-e01e-11e2-a7e8-3f4343712aaf": "This challenge will work the same way as the last one. Find the right piece of evidence to complete the diagram. What evidence supports the claim that new designs will lead to more efficient solar panels? Drag the right piece of evidence to the evidence box.",
    	"47b0dc70-e01e-11e2-a7e8-3f4343712aaf": "You're making some nice progress. Keep at it.  What evidence supports the claim that using cleaner fuel can lower air pollution? Find the right piece of evidence the drag it to the evidence box.",
    	"212f0b71-0a8b-11e3-8ffd-0800200c9a66": "Good, I'm glad you're back. We're almost done now. What evidence supports the claim that algae blooms lower the amount of oxygen in the water? Read the text. Then find the right piece of evidence the drag it to the evidence box.",
    	"12252b50-e01f-11e2-a7e8-3f4343712aaf": "Nice work. This is the last challenge in this set. What evidence supports the claim that a larger port will lead to more orders for local products? Read the text. Then find the right piece of evidence the drag it to the evidence box.",
    	"b71d8d00-e0f6-11e2-a9b1-fbf5ea959a8c": "Let's get ready for the next mission. Think about what kinds of things might create jobs for your city and what kinds of things might cause pollution. Create a diagram that shows what you're thinking.",
    	"249ed870-e0f7-11e2-a9b1-fbf5ea959a8c": "Great. You have a chance to show how your ideas are changing. Think about the kinds of things that created lead to more jobs for your city and what was causing pollution. Create a new diagram that shows what you're thinking."
    };

    /**
     * Initializes the tool by inserting the required markup into the given container.
     */
    tool.init = function( container ) {
        // Set the container member variables
        $id = $( container );
        $id.addClass( 'elaTool' );
        $gameId = $( "#ela_gameSpace" );

        $id.find( "#ela_hint" ).on( "click", function( event ) {
            return; // temporarily disable hints
            // Create the markup for the next hint
            var markup = "<h1>" + ( currentHint == noHintsIndex ? "Oops!" : "Need some help?" ) + "</h1>" + "<p>" + mHintsText[ currentHint ] + "</p>";
            systemsModal.create( markup );

            // Fire an event for a hint shown
            tool.createEvent( "GL_Scenario_Hint", 10, {
                hint: mHintsText[ currentHint ],
                counter: ( currentHint + 1 ) + "/" + ( noHintsIndex + 1 )
            });

            // Increment the hint counter
            if (currentHint != noHintsIndex) {
                currentHint++;
            }
        } );

        // When the return button is clicked
        $id.on( "click", "#ela_return", function( event ) {
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

             // If the submission was successful, create the closing
            // Scenario Submitted
            // telemetry event and then close the tab containing the
            // learning challenge
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
                toolAsJSON.gameVersion = "ELA_" + g_version;
                toolAsJSON.stars       = 0;

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

        // When the save button is pressed
        $( "#ela_save" ).on("click", function( event ) {
            if( instructorPreview ) {
                return;
            }
            
            if (parentId) {
                // Check to see if the answer is correct
                var score = 0;
                if( tool.textMetadata != 0 ) {
                    score = tool.textMetadata.substring( 0, tool.textMetadata.indexOf( '_' ) );
                }

                // Check if we're on the last challenge of a group and get the next challenge
                // if there is one
                var diagramIndex = mELADiagramGroup.indexOf( parentId );
                var evidenceIndex = mELAEvidenceGroup.indexOf( parentId );
                var nextChallenge = "";
                var lastChallengeOfGroup = true;
                var isTutorial = false;
                if (diagramIndex != -1) {
                    // Part of the diagram challenge group
                    if (diagramIndex + 1 < mELADiagramGroup.length) {
                        nextChallenge = mELADiagramGroup[ diagramIndex ];
                        lastChallengeOfGroup = false;
                    }
                }
                else if (evidenceIndex != -1) {
                    // Part of the evidence diagram group
                    if (evidenceIndex + 1 < mELAEvidenceGroup.length) {
                        nextChallenge = mELAEvidenceGroup[ evidenceIndex ];
                        lastChallengeOfGroup = false;
                    }
                }
                else {
                    // This was a tutorial
                    isTutorial = true;
                }

                // Set the feedback index for showing either
                // correct or incorrect feedback
                var isCorrect = ( parseInt( score ) >= 1 );
                var feedbackIndex = isCorrect ? 3 : attempt++;
                var endOfChallenge = ( isCorrect || attempt >= maxAttempts );

                // Initial modal markup
                var markup = "";
                // Setup the modal for the end of the challenge
                if (endOfChallenge) {
                    // Submission is correct
                    if (isCorrect) {
                        var markup = "<h1>Great Job!</h1>" + "<p>" + mFeedbackText[ parentId ][ feedbackIndex ] + "</p>" + "<button class='attemptButton'>" + ( lastChallengeOfGroup ? "Done!" : "Next" ) + "</button>";

                        tool.createEvent( "GL_Scenario_Correct", 10, {
                            attempt: attempt
                        });
                    }
                    // Player is out of attempts
                    else {
                        var markup = "<h1>Sorry!</h1>" + "<p>" + mFeedbackText[ parentId ][ feedbackIndex ] + "</p>" + "<button class='attemptButton'>Next</button>";

                        tool.createEvent( "GL_Scenario_Out_Of_Attempts", 10, {
                            attempt: attempt
                        });
                    }
                }
                // Setup the modal for another attempt
                else {
                    var markup = "<h1>Give it another shot!</h1>" + "<p>" + mFeedbackText[ parentId ][ feedbackIndex ] + "</p>" + "<h2>" + ( maxAttempts - attempt ) + "</h2>" + "<span class='triesLeft'>Attempts Remaining</span>" + "<button class='attemptButton'>Try Again!</button>";

                    tool.createEvent( "GL_Scenario_Attempt", 10, {
                        attempt: attempt
                    });
                }
                // Create the modal with the markup
                systemsModal.create( markup, true );

                // Get the assessment data if we're done attempts or correct
                var assessment = "";
                if (endOfChallenge && !lastChallengeOfGroup) {
                    assessment = performAssessment( nextChallenge, 0 );
                }

                // Listen for the 'attemptButton' button click
                $( "#popupModal .attemptButton" ).on( 'click', function( event ) {
                    // If this is just a failed attempt, and not the last attempt, close the modal
                    if (!endOfChallenge && !isCorrect) {
                        tool.createEvent( "GL_Scenario_Try_Again", 10, {
                            attempt: attempt
                        });

                        systemsModal.remove();
                    }
                    // If this is not the last challenge in the group, allow the player to move
                    // onto the next challenge
                    else if (!lastChallengeOfGroup) {
                        tool.createEvent( "GL_Scenario_Next_Challenge", 10, {
                            attempt: attempt
                        });

                        // Send the scenario score event
                        var numStars = ( isCorrect ? (3 - attempt) : 0 );
                        tool.createEvent( "GL_Scenario_Score", 1, {
                            stars : numStars,
                            text : "",
                            studentFeedback: "",
                            teacherFeedback: mTeacherCodesForIntermediate[numStars][tool.isEvidenceChallenge ? 1 : 0]
                        });
                        // Send the scenario summary event
                        tool.createEvent( "GL_Scenario_Summary", 1, {
                            stars : numStars,
                            isTutorial : false
                        });
                        // Send the assessment event
                        tool.createEvent( "GL_Assessment", 1, {
                            progressVariable : 0,
                            competencyLevel: 0,
                            competencyType: ""
                        });
                        assessment.starRating = numStars;

                        g_challengeCompleted = true;
                        finalizeSubmission( assessment, nextChallenge );
                    }
                    else if( isTutorial ) {
                        var numStars = ( isCorrect ? (3 - attempt) : 0 );
                        // Send the scenario score event
                        tool.createEvent( "GL_Scenario_Score", 1, {
                            stars : 3,
                            text : "",
                            studentFeedback: "",
                            teacherFeedback: mTeacherCodesForIntermediate[numStars][tool.isEvidenceChallenge ? 1 : 0]
                        });
                        // Send the scenario summary event
                        tool.createEvent( "GL_Scenario_Summary", 1, {
                            stars : 3,
                            isTutorial : true
                        });
                        // Send the assessment event
                        tool.createEvent( "GL_Assessment", 1, {
                            progressVariable : 2,
                            competencyLevel: 0,
                            competencyType: ""
                        });
                        
                        g_challengeCompleted = true;
                        endTutorial();
                    }
                    // Else, perform the assessment just prior to showing the summary screen
                    else {
                    	var numStars = ( isCorrect ? (3 - attempt) : 0 );
                        assessment = performAssessment( nextChallenge, numStars );
                    }
                });
            }
        });

        // When the expand/collapse text button is pressed
        $( "article .ela_expand" ).on( "click", function( event ) {
            var $button = $( "article .ela_expand" );
            if (expanded) {
                var correctWidth = $id.width() * .2;

                expanded = false;
                $( "article" ).animate( {
                    width : correctWidth + "px"
                }, 500 );

                // Should really just be a class, but my god am I
                // lazy...
                $button.text( "expand text" );
                $button.css( 'background-image', "url('images/ela_expand.png')" );
                $button.css( 'background-position-x', '10px' );
                $button.css( 'text-align', 'right' );

                tool.createEvent( "GL_Collapse_Text", 10, {
                    name : tool.challengeName
                } );
            }
            else {
                expanded = true;
                var correctWidth = $id.width() * .35;

                $( "article" ).animate( {
                    width : correctWidth + "px"
                }, 500 );

                // Should really just be a class, but my god am I
                // lazy...
                $button.text( "collapse text" );
                $button.css( 'background-image', "url('images/ela_collapse.png')" );
                $button.css( 'background-position-x', '100px' );
                $button.css( 'text-align', 'left' );

                tool.createEvent( "GL_Expand_Text", 10, {
                    name : tool.challengeName
                } );
            }
        } );

        $( "section p" ).on( 'mousedown', '.selection', function( event ) {
            if (editMode) {
                return false;
            }

            var text = $( event.target ).text();
            $( event.target ).addClass( "currentSelection" );

            $( "html" ).append( "<span class='highlighted' meta-data='" + $( event.target ).attr( 'meta-data' ) + "'>" + text + "</span>" );

            $( ".highlighted" ).css( "left", ( event.pageX - ( $( ".highlighted" ).width() / 2 ) ) + "px" );
            $( ".highlighted" ).css( "top", ( event.pageY - ( $( ".highlighted" ).height() / 2 ) ) + "px" );

            // We have an object created, so the empty nodes should
            // animate
            $.each( objectArray, function( index, value ) {
                if (value.isEmpty) {
                    value.startAnimation();
                }
            } );

            // Add event for when the user clicks, it will see if the
            // item is
            // hovering over an empty node. If it is, the text will be
            // set to
            // that node
            $( ".highlighted" ).on( 'mouseup', function( event ) {
                if (editMode) {
                    return false;
                }

                $( "#ela_gameSpace .hovering" ).find( 'textarea' ).val( text );

                $.each( objectArray, function( index, value ) {
                    if (value.id == $( "#ela_gameSpace .hovering" ).attr( 'id' )) {
                        value.setText( text, $( event.target ).attr( 'meta-data' ) );
                        value.stopAnimation();
                    }
                    else if (value.isEmpty) {
                        value.stopAnimation();
                    }
                } );

                $( ".highlighted" ).remove();
                $( ".currentSelection" ).removeClass( "currentSelection" );
                window.getSelection().removeAllRanges();
            } );

            // When the object is created, we will have add a mousemove
            // event that will move the newly
            // created object wherever the mouse goes
            $( "html" ).mousemove( function( event ) {
                if ($( ".highlighted" ).length > 0) {
                    $( ".highlighted" ).css( "left", ( event.pageX - ( $( ".highlighted" ).width() / 2 ) ) + "px" );
                    $( ".highlighted" ).css( "top", ( event.pageY - ( $( ".highlighted" ).height() / 2 ) ) + "px" );

                    var position = {
                        x : event.originalEvent.clientX,
                        y : event.originalEvent.clientY
                    }

                    $.each( objectArray, function( index, value ) {
                        value.hoverCheck( position );
                    } );
                }
            } );
        } );

        // I am 90% sure this isn't being used
        $( "article p" ).on( 'drag', function( event ) {
            var position = {
                x : event.originalEvent.clientX,
                y : event.originalEvent.clientY
            }

            $.each( objectArray, function( index, value ) {
                value.hoverCheck( position );
            } );
        } );

        $( window ).on( 'resize', function( event ) {
            // Fix top of the game board
            $gameId.css( 'top', $id.find( 'h3' ).outerHeight() + 'px' );

            // Fix width of the article
            var $button = $( "article .ela_expand" );
            if (!expanded) {
                var correctWidth = $id.width() * .2;
                $( "article" ).width( correctWidth );
            }
            else {
                var correctWidth = $id.width() * .35;
                $( "article" ).width( correctWidth );
            }
        } );
    }

    function buildSummaryModel( totalScore, endChallengeScore, isEvidence ) {
        // Define information that we'll need to both show and store
        var starRating = 0;
        var progressVariableLevel = 0;
        var feedback = "";
        var studentFeedback = "";
        var teacherFeedback = "";
        var nextSteps = "";

        // Set the information based on the score
        if (totalScore >= 10) {
        	starRating = 3;
            progressVariableLevel = 2;
            feedback = mSummaryText[ 0 ][ isEvidence ];
            studentFeedback = mStudentFeedbackCodes[ 0 ][ isEvidence ];
            teacherFeedback = mTeacherFeedbackCodes[ 0 ][ isEvidence ];
            nextSteps = mNextStepsText[ 0 ][ isEvidence ];
        }
        else if (totalScore >= 7) {
        	starRating = 2;
            progressVariableLevel = 1;
            feedback = mSummaryText[ 1 ][ isEvidence ];
            studentFeedback = mStudentFeedbackCodes[ 1 ][ isEvidence ];
            teacherFeedback = mTeacherFeedbackCodes[ 1 ][ isEvidence ];
            nextSteps = mNextStepsText[ 1 ][ isEvidence ];
        }
        else if (totalScore >= 4) {
            starRating = 1;
            progressVariableLevel = 0;
            feedback = mSummaryText[ 2 ][ isEvidence ];
            studentFeedback = mStudentFeedbackCodes[ 2 ][ isEvidence ];
            teacherFeedback = mTeacherFeedbackCodes[ 2 ][ isEvidence ];
            nextSteps = mNextStepsText[ 2 ][ isEvidence ];
        }
        else {
        	starRating = 0;
            progressVariableLevel = 0;
            feedback = mSummaryText[ 2 ][ isEvidence ];
            studentFeedback = mStudentFeedbackCodes[ 2 ][ isEvidence ];
            teacherFeedback = mTeacherFeedbackCodes[ 2 ][ isEvidence ];
            nextSteps = mNextStepsText[ 2 ][ isEvidence ];
        }

        // Create the summary screen modal
        var markup = "<h1>Your Score</h1>" + "<img class='medal'/>" + "<p>" + feedback + "</p>" + "<p>" + nextSteps + "</p>" + "<button class='done'>Finished</button>";
        systemsModal.create( markup, true );

        // Set the star rating and summary text
        $( "#popupModal .medal" ).attr( 'src', "../challenges/images/medal_" + starRating + ".png" );

        // Send the scenario score event
        tool.createEvent( "GL_Scenario_Score", 1, {
            stars : endChallengeScore,
            text : "",
            studentFeedback: studentFeedback,
            teacherFeedback: teacherFeedback
        });

        // Send the scenario summary event
        tool.createEvent( "GL_Scenario_Summary", 1, {
            stars : starRating,
            isTutorial : false
        });
        // Send the assessment event
        tool.createEvent( "GL_Assessment", 1, {
            stars : starRating,
            studentFeedback: studentFeedback,
            teacherFeedback: teacherFeedback,
            progressVariable : progressVariableLevel,
            competencyLevel: progressVariableLevel + 1,
            competencyType: isEvidence ? "lewt_m5" : "lewt_m3"
        });

        // Return the star rating and progress variable for assessment
        return {
            starRating : starRating,
            progressVariable : progressVariableLevel
        };
    }

    function performAssessment( nextChallengeInGroup, numStars ) {
        // Begin ELA assessment pipeline
        // Construct the initial feature vector
        var featureVector = {
            selectedText : tool.selectedText,
            metadata : tool.textMetadata,
            starRating : numStars,
            progressVariable : 0
        };

        // If there is no challenge next in the group, do the assessment across all of
        // the submitted ELA challenges
        if (nextChallengeInGroup == "") {
            // Setup AJAX request to get the desired learning challenge
            $.ajax( {
                url : g_ServerAddress + g_API + "assessment/" + parentId,
                type : "GET",
                success : function( response ) {
                    // Verify that we got a response
                    if (response) {
                        //console.log( response );
                        // Check if we're on the last challenge of a
                        // group and get the next challenge if there is
                        // one
                        var myGroup = null;
                        var isEvidence = false;
                        if (mELADiagramGroup.indexOf( parentId ) != -1) {
                            myGroup = mELADiagramGroup;
                        }
                        else if (mELAEvidenceGroup.indexOf( parentId ) != -1) {
                            myGroup = mELAEvidenceGroup;
                            isEvidence = true;
                        }
                        // Iterate through the group to get all of the
                        // scores
                        var totalScore = 0;
                        for( var i = 0; i < myGroup.length - 1; i++ ) {
                            // Get the metadata
                            if( response.hasOwnProperty(myGroup[ i ]) ){
                                var resultAsJSON = JSON.parse( response[ myGroup[ i ] ] );
                                var metadata = 0;
                                /*if( resultAsJSON.metadata != 0 ) {
                                 metadata = resultAsJSON.metadata.substring( 0, 1 );
                                 }*/
                                if( resultAsJSON.starRating >= 0 ) {
                                    metadata = resultAsJSON.starRating;
                                }
                                var metadataScore = parseInt( metadata );
                                totalScore += metadataScore;
                                // console.log( resultAsJSON + " " +
                                // metadata + " " + metadataScore );
                            }
                        }
                        // Add the current challenge (the unsubmitted one)
                        var endChallengeMetadata = 0;
                        /*if( featureVector.metadata != 0 ) {
                            endChallengeMetadata = featureVector.metadata.substring( 0, 1 );
                        }*/
                        totalScore += numStars;//parseInt( endChallengeMetadata );

                        // Set the summary markup and get the assessment
                        // information
                        var finalAssessment = buildSummaryModel( totalScore, numStars, ( isEvidence ? 1 : 0 ) );
                        featureVector.starRating = finalAssessment.starRating;
                        featureVector.progressVariable = finalAssessment.progressVariable;

                        // Listen for 'Finished' button click
                        $( "#popupModal .done" ).on( 'click', function( event ) {
                            g_challengeCompleted = true;
                            finalizeSubmission( featureVector, nextChallengeInGroup );
                        } );

                        // Send the scenario score event
                        // tool.createEvent( "GL_Scenario_Score", 1, {
                        // stars: 0, text: "Fantastic job!" } );
                    }
                    // Empty response, the challenge didn't exist
                    else {
                        alert( "Could not perform the assessment!" );
                    }
                },
                error : function() {
                    // Retrieving the learning challenge failed
                }
            } );
        }

        // Plug the feature vector into the assessment field of the JSON object
        // console.log( featureVector );
        return featureVector;
        // End ELA assessment pipeline
    }

    function finalizeSubmission( assessment, nextChallengeInGroup ) {
        // Get the tool in JSON format
        var toolAsJSON = tool.toJson();
        toolAsJSON.assessment = assessment;
        // console.log( toolAsJSON );
        
        
        tool.createEvent( "GL_Scenario_Submitted", 10, {
            name : tool.challengeName,
            //metadata : toolAsJSON
        });/*, function() {
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
        } );*/
        
        tool.sendTelemetryBatch( function() {
            // Close the tab
            if (parentId) {
                toolAsJSON.gameVersion = "ELA_" + g_version;
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
    
    function endTutorial() {
        // Get the tool in JSON format
        var toolAsJSON = tool.toJson();
        toolAsJSON.assessment = {
            selectedText : tool.selectedText,
            metadata : tool.textMetadata,
            starRating : 3,
            progressVariable: 3
        };
        
        // If the submission was successful, create the closing Scenario
        // Submitted telemetry event and then close the tab containing the
        // learning challenge
        tool.createEvent( "GL_Scenario_Submitted", 10, {
                name : tool.challengeName//,
                //metadata : toolAsJSON
        });/*,
            function() {
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
                });
            }
        );*/
        
        tool.sendTelemetryBatch( function() {
            // Close the tab
            if (parentId) {
                toolAsJSON.gameVersion = "ELA_" + g_version;
                toolAsJSON.stars       = 3;

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

    /**
     * Will setup the canvas for viewing a student-submitted challenge.
     */
    tool.setupForViewing = function( model ) {
        tool.viewingMode = true;

        // Get the JSON representation of the model objects
        var objectsAsJSON = model.objects;//JSON.parse( model.objects );

        // Iterate through the objects to populate the canvas
        $.each( objectsAsJSON, function( index, value ) {
            // Initialize a new tool object
        	var newObject = toolObject();

            newObject.init( value.position.x, value.position.y, value.text, value.isEvidence, value.evidenceType );

            // Add static connections
            $.each( value.connections, function( connIndex, connValue ) {
                newObject.addConnection( connValue.isAdd, connValue.grid );
            } );

            // Push this new object to the objects array
            objectArray.push( newObject );
        } );

        $id.find( 'article' ).addClass( 'hidden' );
        $id.find( 'h1' ).addClass( 'hidden' );
        $id.find( 'h3' ).addClass( 'hidden' );
        $id.find( "header" ).addClass( 'hidden' );
        $id.find( '#ela_gameSpace' ).css( 'right', '0px' );
        $id.find( '#ela_toolButton' ).addClass( 'hidden' );
    }

    /**
     * Will setup the canvas with objects and connections for the player to interact with.
     */
    tool.setupForInteraction = function( model ) {
        // Set initial challenge parameters
        tool.challengeName = model.name.trim();
        instructions = model.instructions.trim();
        parentId = model.challengeId;
        tool.viewingMode = false;

        // Setup associated HTML
        $( "#ela_gameSpace" ).html( "" );
        $id.find( 'h3' ).text( instructions );
        $id.find( 'h1 span' ).text( tool.challengeName );

        // Get the JSON representation of the model objects
        var objectsAsJSON = model.objects;//JSON.parse( model.objects );

        // Iterate through the objects to determine if an evidence box exists
        var hasEvidenceBox = false;
        $.each( objectsAsJSON, function( objectIndex, objectValue ) {
            if (objectValue.isEvidence) {
                hasEvidenceBox = true;
            }
        } );
        tool.isEvidenceChallenge = hasEvidenceBox;

        // Go through each object and add it and their connections to the canvas
        objectArray = [];
        $.each( objectsAsJSON, function( index, value ) {
            // Initialize the new canvas object
            var newObject = toolObject();
            newObject.init(value.position.x, value.position.y, value.text, value.isEvidence, value.evidenceType );

            // Add static connections
            $.each( value.connections, function( connIndex, connValue ) {
                newObject.addConnection( connValue.isAdd, connValue.grid );
            } );

            // Add the new object with connections to the objects array
            objectArray.push( newObject );
        } );

        // Get the JSON representation of the text
        var textAsJSON = model.text;//JSON.parse( model.text );

        // Setup the article text
        var articleText = "<span class='header'>" + textAsJSON.articleHeader + "</span>";
        paragraphs = textAsJSON.paragraphs;
        $.each( paragraphs, function( index, value ) {
            articleText += "<span>" + value + "</span>";
        } );
        $id.find( "article p" ).html( articleText );
        $id.find( 'section article p span' ).addClass( "noHighlight" );
        $( "#ela_toolButton" ).addClass( 'hidden' );

        var outerHeight = $id.find( 'h3' ).outerHeight();
        $id.find('header').css('height', outerHeight);

        if (mIntroText[model.challengeId] !== undefined) {
        	tool.showDialogMessage(mIntroText[model.challengeId], null, true);
        }
    }

    /**
     * Will transform the current game space into a JSON representation to pass into the database.
     */
    tool.toJson = function() {
        // Create the new challenge model
        var model = {
            gameSessionId : g_sessionId,
            challengeId : parentId,
            name : tool.challengeName.trim(),
            instructions : instructions,
            type : "ELA",
            objects : [],
            connections : [],
            text : {
                paragraphs : paragraphs,
                articleHeader : articleHeader
            },
            assessment : ""
        };

        // Go through each game node and determine its current position
        // and add that to the model. Then figure out what text it is
        // currently displaying and save that as well
        $.each( $( "#ela_gameSpace span" ), function( index, value ) {
            var object = {};
            object.position = {
                x : $( value ).position().left,
                y : $( value ).position().top
            };

            object.connections = [];

            // Go through each sub connection
            $.each( $( value ).find( "a" ), function( subIndex, subValue ) {
                var subConnection = {};
                subConnection.grid = $( subValue ).attr( 'class' )[ $( subValue ).attr( 'class' ).length - 1 ];
                subConnection.isAdd = false;
                object.connections.push( subConnection );
            } );

            // Go through each add connection

            $.each( $( value ).find( "b" ), function( addIndex, addValue ) {
                var addConnection = {};
                addConnection.grid = $( addValue ).attr( 'class' )[ $( addValue ).attr( 'class' ).length - 1 ];
                addConnection.isAdd = true;
                object.connections.push( addConnection );
            } );

            object.text = objectArray[ index ].text;
            object.metadata = objectArray[ index ].metadata;
            object.isEvidence = objectArray[ index ].isEvidence;
            object.evidenceType = objectArray[ index ].evidenceType;
            model.objects.push( object );
        } );

        return model;
    }

    /**
     * Load the challenge from the dashboard. Takes in the model object of the challenge and loads in either an unsolved challenge or a previously-solved
     * challenge.
     */
    tool.loadChallenge = function( model, sessionId, type, info ) {
        // Keep track of the session Id
        sessionId = sessionId;

        // Set the launch info
        launchInfo = info;
        
        var isPreview = false;
        if( type == "view" || type == "preview" || type == "review" ) {
            isPreview = true;
        }
        instructorPreview = isPreview;

        // Show the tool's main container
        $id.removeClass( 'hidden' );

        // Viewing the challenge only
        if( ( type == "view" || type == "review" ) && model.challengeId ) {
            if( type == "view" || type == "review" ) {
                if( model.objects == "" ) {
                    model.objects = "{}";
                } else {
                	model.objects = JSON.parse( model.objects );
                }
            }

            tool.setupForViewing( model );
        }
        // Loading the challenge to interact with
        else {
            // Fire an event indicating the scenario was loaded
            tool.createEvent( "GL_Scenario_Loaded", 1, {
                name : model.name
            });
            
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
            
            // Setup the tool for student play
            tool.setupForInteraction( model );
        }
        
        // If this is a preview, hide the save button
        if( instructorPreview ) {
            $("#ela_save").addClass( 'hidden' );
            g_challengeCompleted = true;
        }
        
        // If this is a student viewing work, show the header with the cancel button
        if( type == "view" ) {
            $id.find( "header" ).removeClass( 'hidden' );
            $id.find( 'h3' ).removeClass( 'hidden' );
            $id.find( 'h3' ).text( 'You are viewing your submitted work.' );
            $("#ela_save").addClass( 'hidden' );
        }
    }

    /**
     * Helper function to create a new telemetry event, taking in the event type and data.
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
            //gameVersion : "ELA_" + g_version
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

        // Setup the AJAX request to fire the telemetry event
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
        
        // Setup the batch data object
        var batch = {
            events : "[" + events.toString() + "]",
            gameSessionId : g_sessionId,
            gameVersion : "ELA_" + g_version
        }
        
        // Setup the AJAX request to fire the telemetry batch
        $.ajax( {
            url : g_ServerAddress + g_API + "sendtelemetrybatch",
            type : "POST",
            contentType : "application/json",
            data : JSON.stringify( batch ),
            success : function( response ) {
                // Batch was successful
                if (callback) {
                    callback();
                }
            },
            error : function() {
                // An error occurred with creating the telemetry event
            }
        } );
    }
    tool.setTelemetryBatchParameters = function( maxSize, minSize, time, priority ) {
        telemetryBatchSizeMax = maxSize;
        telemetryBatchSizeMin = minSize;
        telemetryBatchTime = time;
        telemetryEventPriority = priority;
        
        setInterval( telemetryBatchInterval, telemetryBatchTime * 1000 );
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

    		if (action !== undefined && action != null) {
    			action();
    		}
    	});
    }

    /**
     * Describes an individual object in the canvas. The object will have an id associated with it as well as text.
     */
    var toolObject = function() {
        var object = {};

        object.isEmpty = true;
        object.id = "";
        object.text = "";
        object.metadata = -1;
        object.edittable = true;
        object.isEvidence = false;
        object.evidenceType;

        var $objectId;

        var hovering = false;

        var animator = {
            interval : null,
            animation : {
                imageSize : {
                    x : 210,
                    y : 101
                },
                frameCount : 24
            },
            currentPosition : {
                x : 0,
                y : 0
            }
        };

        var isMouseDown = false;

        // //////////////////////////////////////////////////////////////
        // Will initialize the object given a position, x & y, and text
        // //////////////////////////////////////////////////////////////
        object.init = function( x, y, text, isEvidence, evidenceType ) {
            text = text || "";

            var objectCounter;

            for( i = 0; i <= $gameId.find( 'span' ).length; i++ ) {
                if ($( "#ela_" + i ).length == 0) {
                    objectCounter = i;
                }
            }

            object.id = "ela_" + objectCounter;

            var markup = "<span id='" + object.id + "' class='empty_node'><p><textarea readonly rows=3 cols=8 wrap=hard>" + text + "</textarea><img class='hidden' src='../challenges/images/nodeClose_up.png'>" + "</span>"; //<button class='hidden'>x</button>

            $gameId.append( markup );

            $objectId = $( "#" + object.id );

            $objectId.draggable();

            if (isEvidence) {
                object.evidenceType = evidenceType;
                object.isEvidence = isEvidence;
                $objectId.removeClass( 'empty_node' ).addClass( evidenceType ).addClass( 'evidenceBox' );
            }

            $objectId.css( 'left', x || 0 );
            $objectId.css( 'top', y || 0 );

            // Allow the object to be dragged, but make sure it stays within the
            // boundaries of the game board
            $objectId.on( 'drag', function( event ) {
                if (!editMode) {
                    event.preventDefault();
                    return false;
                }

                var fail = false;
                var top = $objectId.position().top;
                var left = $objectId.position().left;
                var width = $objectId.width();
                var height = $objectId.height();

                if (top < 0) {
                    top = 0;
                    fail = true;
                }
                if (top + height > $objectId.parent().height()) {
                    top = $objectId.parent().height() - height;
                    fail = true;
                }
                if (left < 0) {
                    left = 0;
                    fail = true;
                }
                if (left + width > $objectId.parent().width()) {
                    left = $objectId.parent().width() - width;
                    fail = true;
                }
                if (fail) {
                    $objectId.css( 'top', top + "px" );
                    $objectId.css( 'left', left + "px" );
                    event.preventDefault();
                    return false;
                }
            } );

            // If we are constructed with text, then set it
            if (text != "") {
                object.edittable = false;
                object.setText( text, -1 );
            }

            $objectId.on( "mouseenter", function( event ) {
                if (editMode || ( object.edittable && object.text != "" )) {
                    $objectId.find( 'img' ).removeClass( 'hidden' );
                }
            } );

            $objectId.on( "mouseleave", function( event ) {
                if (editMode || ( object.edittable && object.text != "" )) {
                    $objectId.find( 'img' ).addClass( 'hidden' );
                }
            } );

            $objectId.on( 'mousedown', '.mainIcon', function( event ) {
                var target = $( event.target );
                var isAnchor = target.is( "a" );

                if (isAnchor) {
                    $objectId.append( "<a class='mobileIcon'></a>" );
                }
                else {
                    $objectId.append( "<b class='mobileIcon'></b>" );
                }

                isMouseDown = true;
            } );

            $( "html" ).on( 'mouseup', function( event ) {
                if (isMouseDown) {
                    isMouseDown = false;
                    $( ".mobileIcon" ).remove();
                }
            } );

            $( "html" ).on( "mousemove", function() {
                if (isMouseDown) {

                }
            } );

            // When text is dropped onto the text area, format the
            // text accordingly
            $objectId.on( "drop", "textarea", function( event ) {

                var text = window.getSelection().toString();

                text = text.split( "\n" ).join( '' ).trim();

                if (text != "") {
                    object.text = text;

                    if (text.length > 74) {
                        text = text.substring( 0, 68 ) + "...";
                    }

                    var previousText = $( event.target ).val();

                    if (previousText == "") {
                        object.isEmpty = false;
                        $objectId.removeClass( 'empty_node' );
                    }
                    else {
                    }

                    $objectId.removeClass( 'hovering' );

                    $( event.target ).val( text );

                    window.getSelection().removeAllRanges();

                    event.preventDefault();
                }
            } );

            $objectId.on( "click", "img", function( event ) {
                if (editMode) {
                    $objectId.remove();

                    $.each( objectArray, function( index, value ) {
                        if (value.id == object.id) {
                            objectArray.splice( index, 1 );
                            return false;
                        }
                    } );
                }
                else {
                    object.setText( "", -1 );
                }
            } );
            $objectId.on( "mouseenter", "img", function( event ) {
                $objectId.find( 'img' ).attr( 'src', '../challenges/images/nodeClose_hover.png' );
            } );
            $objectId.on( "mouseleave", "img", function( event ) {
                $objectId.find( 'img' ).attr( 'src', '../challenges/images/nodeClose_up.png' );
            } );
            $objectId.on( 'mousedown', "img", function( event ) {
                $objectId.find( 'img' ).attr( 'src', '../challenges/images/nodeClose_down.png' );
            } );
        }

        // This will check to see if the given position is currently hovering
        // over the object.
        object.hoverCheck = function( position ) {
            if (editMode) {
                $objectId.find( 'img' ).removeClass( 'hidden' );
                return;
            }

            if (!object.edittable) {
                return false;
            }

            var x = $objectId.offset().left;
            var y = $objectId.offset().top;

            if (position.x > x && position.x < x + $objectId.width() && position.y > y && position.y < y + $objectId.height()) {
                if (!hovering) {
                    hovering = true;
                    $objectId.addClass( 'hovering' );
                }
                return true;
            }
            else {
                if (hovering) {
                    hovering = false;
                    $objectId.removeClass( 'hovering' );
                }
            }
        }

        // This will check to see if the currently location is hovering over the
        // object
        object.checkDropHover = function( left, top, width, height, value ) {

            var x = $objectId.position().left;
            var y = $objectId.position().top;

            var x2 = x + $objectId.width();
            var y2 = y + $objectId.height();

            if (!( x > left + width || x2 < left || y > top + height || y2 < top )) {
                var isAdd = value.indexOf( 'add' ) >= 0;
                var gridNumber = value[ value.length - 1 ];

                object.addConnection( isAdd, parseInt( gridNumber ) );
                return true;
            }
        }

        // Will set the given text to the object and the node will no longer be empty
        object.setText = function( text, metaData ) {
        	var fontSize = 1.75;
        	var previousText = object.text;
        	var fullText = text;
        	var nodeText = text;
        	
        	// Split the string and grab all words
        	// We need to hyphenate any words that we know will be too long to fit in the node
        	/*var hyphenatedText = "";
        	var allWords = fullText.split(" ");
        	for( var i in allWords ) {
        	    var currentWord = allWords[i];
        	    if( currentWord.length >= 7 ) {
        	        while( currentWord.length >= 7 ) {
                        var splitWord = currentWord.substring( 0, 7 );
                        splitWord += "-";
                        currentWord = currentWord.substring( 7 );
                        
                        hyphenatedText += splitWord;
                        hyphenatedText += " ";
                    }
        	        
        	        if( currentWord.length > 0 ) {
        	            hyphenatedText += currentWord;
                        hyphenatedText += " ";
        	        }
        	    }
        	    else {
        	        hyphenatedText += currentWord;
        	        hyphenatedText += " ";
        	    }
        	}*/

			/*
        	if (text.length > 30) {
        		fontSize -= ( text.length - 30 ) * .009;
        	}
			*/

        	if (object.isEvidence) {
        		$objectId.addClass( 'filledEvidence' );
        		$objectId.removeClass( 'evidenceBox' );
        		tool.createEvent( "GL_Evidence_Attached", 10, {
        			name : tool.challengeName,
        			text : text
        		} );

        		tool.selectedText = text;
        		tool.textMetadata = metaData;
        	}
        	else if (metaData != -1) {
        		tool.createEvent( "GL_Node_Attached", 10, {
        			name : tool.challengeName,
        			text : text
        		} );

        		// This is for non-evidence nodes, but only set if we're not in
        		// an evidence challenge
        		if (!tool.isEvidenceChallenge) {
        			tool.selectedText = text;
        			tool.textMetadata = metaData;
        		}
        	}

        	object.text = text;
        	object.isEmpty = false;
        	if (metaData) {
        		object.metadata = metaData;
        	}

        	$objectId.removeClass( 'empty_node' );
        	$objectId.removeClass( 'hovering' );

        	if (text.length > 30) {
        		$objectId.find('textarea').val(nodeText.substring(0, 27) + '...').attr('data-text', fullText).addClass('truncated');
        	} else {
        		$objectId.find('textarea').val(nodeText).removeAttr('data-text').removeClass('truncated');
        	}

        	$('.selection.noHighlight').removeClass('selected');
        	$('.selection.noHighlight').each(function () {
        		if ($(this).text() == fullText) {
        			$(this).addClass('selected');
        		}
        	});

        	if (text == "") {
        		$objectId.addClass( 'empty_node' );
        		$objectId.find( 'img' ).addClass( 'hidden' );

        		if (object.isEvidence) {
        			$objectId.removeClass( 'filledEvidence' );
        			$objectId.addClass( 'evidenceBox' );
        			$objectId.removeClass( 'empty_node' );

        			tool.createEvent( "GL_Evidence_Removed", 10, {
        				name : tool.challengeName,
        				text : previousText
        			} );

        			// Reset text and metadata
        			tool.selectedText = "";
        			tool.textMetadata = 0;
        		}
        		else {
        			tool.createEvent( "GL_Node_Removed", 10, {
        				name : tool.challengeName,
        				text : previousText
        			} );

        			// Reset for non-evidence nodes, but only set if we're not
        			// in an evidence challenge
        			if (!tool.isEvidenceChallenge) {
        				tool.selectedText = "";
        				tool.textMetadata = 0;
        			}
        		}
        	}

        	$objectId.find('textarea').css('font-size', fontSize + "em");

        	$objectId.find('textarea.truncated').hover(
				function () {
					var item = $(this);
					var itemText = item.attr('data-text');

					if (itemText.length) {
						item.after(
							$('<div>').addClass('tooltip').text(itemText)
						);
					}
				},
				function () {
					$(this).parent().find('div.tooltip').remove();
				}
			);
        }

        // Will add a static connection to the object given the position and
        // rotation, plus if
        // the connection is add or sub
        object.addConnection = function( isAdd, grid ) {
            var $element = "";
            if (isAdd) {
                if ($objectId.find( "b.arrow_" + grid ).length > 0) {
                    // allready have it
                    return false;
                }
                $objectId.prepend( "<b class='arrow_" + grid + "'></b>" );
                $element = $objectId.find( "b.arrow_" + grid );
            }
            else {
                if ($objectId.find( 'a.arrow_' + grid ).length > 0) {
                    // all ready have it
                    return false;
                }
                $objectId.prepend( "<a class='arrow_" + grid + "'></a>" );
                $element = $objectId.find( "a.arrow_" + grid );
            }
        }

        // Starts the animation by setting a window interval
        object.startAnimation = function() {
            animator.interval = window.setInterval( function() {
                return false;
                animator.currentPosition.x -= animator.animation.imageSize.x;

                if (animator.currentPosition.x / animator.animation.imageSize.x <= -1 * animator.animation.frameCount) {
                    animator.currentPosition.x = 0;
                }

                $objectId.css( 'background-position', animator.currentPosition.x + "px " + animator.currentPosition.y + "px" );
            }, 200 );

            // $id.addClass('animating');
        }

        // Stops the animation by clearing the window interval
        object.stopAnimation = function() {
            $objectId.removeClass( 'animating' );
            $objectId.css( 'background-position', "0px 0px" );
            window.clearInterval( animator.interval );
        }

        return object;
    }

    return tool;
}