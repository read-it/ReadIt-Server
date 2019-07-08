// var express = require('express');
// var router = express.Router();

// const utils = require('../../module/utils/utils');
// const statusCode = require('../../module/utils/statusCode');
// const resMessage = require('../../module/utils/responseMessage');
// const authUtils = require("../../module/utils/authUtils");
// var admin = require('firebase-admin'); //firebase쓰기위함

// router.post('/', async (req, res) => {
// var schedule = require('node-schedule'); //npm install node-schedule --save 해주기
// var rule = new schedule.RecurrenceRule();

// //클라이언트에서 받은 req값을 적용
// rule.hour = req.body.hour; //0~23 (클라가 오전 오후 계산해서 보내주세요)
// rule.minute = req.body.minute; //0~59

// var j = schedule.scheduleJob(rule, function(){

//     //FMC 쓰기위한 기본 설정
//     const https = require('https');
//     var fs = require('fs');
//     var {google} = require('googleapis');
//     var PROJECT_ID = 'readit0713';
//     var HOST = 'fcm.googleapis.com';
//     var PATH = '/v1/projects/' + PROJECT_ID + '/messages:send';
//     var MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
//     var SCOPES = [MESSAGING_SCOPE];


//     // FMC의 accessToken
//     function getAccessToken() {
//         return new Promise(function(resolve, reject) {
//         var key = require('../../config/service-account.json');
//         var jwtClient = new google.auth.JWT(
//             key.client_email,
//             null,
//             key.private_key,
//             SCOPES,
//             null
//         );
//         jwtClient.authorize(function(err, tokens) {
//             if (err) {
//                 reject(err);
//                 return;
//             }
//             resolve(tokens.access_token);
//             });
//         });
//     }

// /**
//  * Send HTTP request to FCM with given message.
//  *
//  * @param {JSON} fcmMessage will make up the body of the request.
//  */
// function sendFcmMessage(fcmMessage) {
// getAccessToken().then(function(accessToken) {
//     var options = {
//         hostname: HOST,
//         path: PATH,
//         method: 'POST',
//       // [START use_access_token]
//         headers: {
//         'Authorization': 'Bearer ' + accessToken
//         }
//       // [END use_access_token]
//     };

//     var request = https.request(options, function(resp) {
//         resp.setEncoding('utf8');
//         resp.on('data', function(data) {
//         console.log('Message sent to Firebase for delivery, response:');
//         console.log(data);
//         });
//     });

//     request.on('error', function(err) {
//         console.log('Unable to send message to Firebase');
//         console.log(err);
//     });

//     request.write(JSON.stringify(fcmMessage));
//     request.end();
//     });
// }

// /**
//  * Construct a JSON object that will be used to define the
//  * common parts of a notification message that will be sent
//  * to any app instance subscribed to the news topic.
//  */
// function buildCommonMessage() {
// return {
//     'message': {
//         'topic': 'news',
//         'notification': {
//         'title': 'FCM Notification',
//         'body': 'Notification from FCM'
//             }
//         }
//     };
// }

// var message = process.argv[2];
// if (message && message == 'common-message') {
//     var commonMessage = buildCommonMessage();
//     console.log('FCM request body for message using common notification object:');
//     console.log(JSON.stringify(commonMessage, null, 2));
//     sendFcmMessage(buildCommonMessage());
//     } else {
//         console.log('Invalid command. Please use one of the following:\n'
//         + 'node index.js common-message\n');
//     }


// })})







// module.exports = router;