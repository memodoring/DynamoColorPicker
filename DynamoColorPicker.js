/**
* This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
* The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
* testing instructions are located at http://amzn.to/1LzFrj6
*
* For additional samples, visit the Alexa Skills Kit Getting Started guide at
* http://amzn.to/1LGWsLG
*/

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
  try {
    console.log("event.session.application.applicationId=" + event.session.application.applicationId);
    const dynamoTableName = "";
    /**
    * Uncomment this if statement and populate with your skill's application ID to
    * prevent someone else from configuring a skill that sends requests to this function.
    */
    /*
    if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.[unique-value-here]") {
    context.fail("Invalid Application ID");
  }
  */

  if (event.session.new) {
    onSessionStarted({requestId: event.request.requestId}, event.session);
  }

  if (event.request.type === "LaunchRequest") {
    onLaunch(event.request,
      event.session,
      function callback(sessionAttributes, speechletResponse) {
        context.succeed(buildResponse(sessionAttributes, speechletResponse));
      });
    } else if (event.request.type === "IntentRequest") {
      onIntent(event.request,
        event.session,
        function callback(sessionAttributes, speechletResponse) {
          context.succeed(buildResponse(sessionAttributes, speechletResponse));
        });
      } else if (event.request.type === "SessionEndedRequest") {
        onSessionEnded(event.request, event.session);
        context.succeed();
      }
    } catch (e) {
      context.fail("Exception: " + e);
    }
  };

  /**
  * Called when the session starts.
  */
  function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
    ", sessionId=" + session.sessionId);
  }

  /**
  * Called when the user launches the skill without specifying what they want.
  */
  function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
    ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
  }

  /**
  * Called when the user specifies an intent for this skill.
  */
  function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
    ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
    intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("MyColorIsIntent" === intentName) {
      setColor(intent, session, callback);
    } else if ("WhatsMyColorIntent" === intentName) {
      getColor(intent, session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
      getWelcomeResponse(callback);
    } else if ("AMAZON.StopIntent" === intentName || "AMAZON.CancelIntent" === intentName) {
      handleSessionEndRequest(callback);
    } else {
      throw "Invalid intent";
    }
  }

  /**
  * Called when the user ends the session.
  * Is not called when the skill returns shouldEndSession=true.
  */
  function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
    ", sessionId=" + session.sessionId);
    // Add cleanup logic here
  }

  // --------------- Functions that control the skill's behavior -----------------------

  function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Welcome to the Alexa Skills Kit sample. " +
    "Please tell me your favorite color by saying, my favorite color is red";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Please tell me your favorite color by saying, " +
    "my favorite color is red";
    var shouldEndSession = false;

    callback(sessionAttributes,
      buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }

    function handleSessionEndRequest(callback) {
      var cardTitle = "Session Ended";
      var speechOutput = "Thank you for trying the Alexa Skills Kit sample. Have a nice day!";
      // Setting this to true ends the session and exits the skill.
      var shouldEndSession = true;

      callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
    }

    /**
    * Sets the color in the session and prepares the speech to reply to the user.
    */
    function setColor(intent, session, callback) {
      var cardTitle = intent.name;
      var favoriteColorSlot = intent.slots.Color;
      var repromptText = "";
      var sessionAttributes = {};
      var shouldEndSession = false;
      var speechOutput = "";
      var userID = session.user.userId;

      if (favoriteColorSlot) {
        var favoriteColor = favoriteColorSlot.value;
        var AWS = require('aws-sdk');
        var dynamo = new AWS.DynamoDB.DocumentClient();
        var params = {
          TableName : dynamoTableName,
          Item:{
            UserID: userID,
            Color: favoriteColor
          }
        };
        dynamo.put(params, function(err,data){
          if(err){
            speechOutput = "I heard your favorite color is " + favoriteColor + ". But I'm having issues saving it to the database, and won't be able to remember it.";
            var shouldEndSession = true;
          }else{
            speechOutput = "I now know your favorite color is " + favoriteColor + ". You can ask me " +
            "your favorite color by saying, what's my favorite color?";
            repromptText = "You can ask me your favorite color by saying, what's my favorite color?";
          }
          callback(sessionAttributes,buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });
      }else{
        speechOutput = "I'm not sure what your favorite color is. Please try again";
        repromptText = "I'm not sure what your favorite color is. You can tell me your " +
        "favorite color by saying, my favorite color is red";
        callback(sessionAttributes,buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
      }

      // ----- Uncomment to save in session -----
      //
      //       if (favoriteColorSlot) {
      //       var favoriteColor = favoriteColorSlot.value;
      //       sessionAttributes = createFavoriteColorAttributes(favoriteColor);
      //       speechOutput = "I now know your favorite color is " + favoriteColor + ". You can ask me " +
      //       "your favorite color by saying, what's my favorite color?";
      //       repromptText = "You can ask me your favorite color by saying, what's my favorite color?";
      //     } else {
      //     speechOutput = "I'm not sure what your favorite color is. Please try again";
      //     repromptText = "I'm not sure what your favorite color is. You can tell me your " +
      //     "favorite color by saying, my favorite color is red";
      //   }


      //   callback(sessionAttributes,
      //   buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
      //
    }

    function createFavoriteColorAttributes(favoriteColor) {
      return {
        favoriteColor: favoriteColor
      };
    }

    function getColor(intent, session, callback) {
      var favoriteColor;
      var repromptText = null;
      var shouldEndSession = false;
      var speechOutput = "";
      var userID = session.user.userId;
      var sessionAttributes = {};

      var AWS = require('aws-sdk');
      var dynamo = new AWS.DynamoDB.DocumentClient();
      var params = {
        TableName : dynamoTableName,
        Key:{
          UserID: userID
        }
      };
      dynamo.get(params, function(err, data){
        if(err){
          speechOutput = "I cannot connect to the database, please check your settings and permissions.";
          callback(sessionAttributes, buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
        }

        try {
          favoriteColor = data.Item.Color;
          speechOutput = "Your favorite color is " + favoriteColor + ". Goodbye.";
          shouldEndSession = true;
        } catch (e) {
          speechOutput = "I'm not sure what your favorite color is, you can say, my favorite color is red";
        } finally {
          callback(sessionAttributes, buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
        }

      });
      // ----- Uncomment to load from session -----
      //   if (session.attributes) {
      //     favoriteColor = session.attributes.favoriteColor;
      //   }

      //   if (favoriteColor) {
      //     speechOutput = "Your favorite color is " + favoriteColor + ". Goodbye.";
      //     shouldEndSession = true;
      //   } else {
      //     speechOutput = "I'm not sure what your favorite color is, you can say, my favorite color " +
      //     " is red";
      //   }
      //   callback(sessionAttributes, buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
      // Setting repromptText to null signifies that we do not want to reprompt the user.
      // If the user does not respond or says something that is not understood, the session
      // will end.

      }

      // --------------- Helpers that build all of the responses -----------------------

      function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
        return {
          outputSpeech: {
            type: "PlainText",
            text: output
          },
          card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
          },
          reprompt: {
            outputSpeech: {
              type: "PlainText",
              text: repromptText
            }
          },
          shouldEndSession: shouldEndSession
        };
      }

      function buildResponse(sessionAttributes, speechletResponse) {
        return {
          version: "1.0",
          sessionAttributes: sessionAttributes,
          response: speechletResponse
        };
      }
