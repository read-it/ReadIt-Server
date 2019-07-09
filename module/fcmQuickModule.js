//fcmquick module

// /**
//  * Firebase Cloud Messaging (FCM) can be used to send messages to clients on iOS, Android and Web.
//  *
//  * This sample uses FCM to send two types of messages to clients that are subscribed to the `news`
//  * topic. One type of message is a simple notification message (display message). The other is
//  * a notification message (display notification) with platform specific customizations. For example,
//  * a badge is added to messages that are sent to iOS devices.
//  */
// const https = require('https');
// var fs = require('fs');
// var {google} = require('googleapis');
// var PROJECT_ID = 'readit0713';
// var HOST = 'fcm.googleapis.com';
// var PATH = '/v1/projects/' + PROJECT_ID + '/messages:send';
// var MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
// var SCOPES = [MESSAGING_SCOPE];

// module.exports = {

// /**
//  * Get a valid access token.
//  */
// // [START retrieve_access_token]
//     getAccessToken : () => {
//         return new Promise(function(resolve, reject) {
//         var key = require('./service-account.json');
//         var jwtClient = new google.auth.JWT(
//             key.client_email,
//             null,
//             key.private_key,
//             SCOPES,
//             null
//         );
//         jwtClient.authorize(function(err, tokens) {
//             if (err) {
//             reject(err);
//             return;
//             }
//             resolve(tokens.access_token);
//             });
//         });
//         },
//                     // [END retrieve_access_token]

//     /**
//      * Send HTTP request to FCM with given message.
//      *
//      * @param {JSON} fcmMessage will make up the body of the request.
//      */
//     sendFcmMessage : (fcmMessage) => {
//         getAccessToken().then(function(accessToken) {
//         var options = {
//             hostname: HOST,
//             path: PATH,
//             method: 'POST',
//             // [START use_access_token]
//             headers: {
//                 'Authorization': 'Bearer ' + accessToken
//             }
//             // [END use_access_token]
//             };
//         var request = https.request(options, function(resp) {
//             resp.setEncoding('utf8');
//             resp.on('data', function(data) {
//             console.log('Message sent to Firebase for delivery, response:');
//             console.log(data);
//             });
//         });

//         request.on('error', function(err) {
//             console.log('Unable to send message to Firebase');
//             console.log(err);
//         });

//         request.write(JSON.stringify(fcmMessage));
//         request.end();
//         });
//     },

//         /**
//      * Construct a JSON object that will be used to customize
//      * the messages sent to iOS and Android devices.
//      */
//     buildOverrideMessage : () => {
//         var fcmMessage = buildCommonMessage();
//         var apnsOverride = {
//         'payload': {
//             'aps': {
//                 'badge': 1
//             }
//             },
//         'headers': {
//             'apns-priority': '10'
//             }
//         };

//         var androidOverride = {
//         'notification': {
//             'click_action': 'android.intent.action.MAIN'
//         }
//     };

//         fcmMessage['message']['android'] = androidOverride;
//         fcmMessage['message']['apns'] = apnsOverride;

//         return fcmMessage;
//     },
//     /**
//      * Construct a JSON object that will be used to define the
//      * common parts of a notification message that will be sent
//      * to any app instance subscribed to the news topic.
//      */
//     buildCommonMessage : () => {
//         return {
//             'message': {
//             'topic': 'news',
//             'notification': {
//                 'title': 'FCM Notification',
//                 'body': 'Notification from FCM'
//             }
//             }
//         };
//     }

//     }






//모듈 사용법
//     var message = process.argv[2];
//     if (message && message == 'common-message') {
//         var commonMessage = buildCommonMessage();
//         console.log('FCM request body for message using common notification object:');
//         console.log(JSON.stringify(commonMessage, null, 2));
//         sendFcmMessage(buildCommonMessage());
//         } else {
//             console.log('Invalid command. Please use one of the following:\n'
//             + 'node index.js common-message\n');
//         }


//     // })})