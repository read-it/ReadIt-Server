
//schedule하기

//     var schedule = require('node-schedule'); //npm install node-schedule --save 해주기
//     var rule = new schedule.RecurrenceRule();
//     const userIdx = req.decoded.idx

//     //DB에 있는 값을 적용 (SELECT문으로)
//     let selectTimeQuery = `SELECT alarm_hour, alarm_minute FROM alarm WHERE user_idx=?`; //수정
//     let selectTimeResult = await db.queryParam_Arr(selectTimeQuery, [userIdx]);


//     rule.hour = selectTimeResult[0].alarm_hour; //0~23 (클라가 오전 오후 계산해서 보내주세요)
//     rule.minute = selectTimeResult[0].alarm_minute; //0~59


//     var j = schedule.scheduleJob(rule, function(){


//message 보내는 방법2
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


    // })})
