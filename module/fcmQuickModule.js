
// const https = require('https');
// var fs = require('fs');
// var {google} = require('googleapis');
// var PROJECT_ID = 'readit-ec394';
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
//     // buildCommonMessage : (alarmHour) => {
//     buildCommonMessage : () => {
//         return {
//             'message': {
//             'topic': 'alarmtime',
//             'notification': {
//                 'title': 'Time to Read it',
//                 'body': AlarmMessage(3)
//                 // 'body': AlarmMessage(alarmHour)
//             }
//             }
//         };
//     }
// }


// function AlarmMessage(alarmHour) {
//     if(alarmHour>=3 && alarmHour<=5){
//         return('조용한 새벽, 저장해둔 글들을 읽어보아요.');
//     }
//     else if(alarmHour>=6 && alarmHour<=9){
//         return('오늘도 생산적으로 하루를 시작해보세요.');
//     }
//     else if(alarmHour>=10 && alarmHour<=12){
//         return('머리가 가장 맑을 시간. 콘텐츠 하나 읽어볼까요?');
//     }
//     else if(alarmHour>=13 && alarmHour<=17){
//         return('머릿속에 인풋이 필요하다면 리딧으로!');
//     }
//     else if(alarmHour>=18 && alarmHour<=21){
//         return('집가는 길 발견한 콘텐츠를 리딧에 차곡차곡 넣어두세요.');
//         }
//     else{
//         return ('유익한 글 하나만 읽고 잘까요?')
//     }}