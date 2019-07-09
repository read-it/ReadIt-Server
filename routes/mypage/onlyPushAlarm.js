var express = require('express');
var router = express.Router();

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const authUtils = require("../../module/utils/authUtils");
const userIdx = req.decoded.idx;
var admin = require("firebase-admin");
var serviceAccount = require("../../config/service-account.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://readit0713.firebaseio.com"
});


router.put('/:alarm_flag', authUtils.isLoggedin, async (req, res) => {
    
    const alarmFlag = req.params.alarm_flag; //1이면 푸시알람 on. 0이면 푸시알람 off

    //alarmFlag(params)가 0, 1 모두 아닌 경우
    if(!(alarmFlag==1 || alarmFlag ==0)){
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.BAD_PARAMETER));
    }
    else{
        //alarm_flag DB에 수정.
        const updateAlarmFlagQuery = `UPDATE alarm SET alarm_flag = ? WHERE user_idx = ?`;
        const updateAlarmFlagResult = await db.queryParam_Arr(updateAlarmFlagQuery,[alarmFlag, userIdx]);
    }

})


router.get('/', authUtils.isLoggedin, async (req, res) => {

    //alarm 관련 정보를 DB에서 가져옴
    const selectFlagQuery = `SELECT alarm_flag, alarm_hour, alarm_minute FROM alarm WHERE user_idx=${userIdx}`;
    const selectFlagResult = await db.queryParam_Arr(selectFlagQuery);

    //알림설정이 on 되어있는 경우
    if(selectFlagResult[0].alarm_flag==1){

        //DB의 device_token을 가져옴.
        const selectTokenQuery = `SELECT device_token FROM user WHERE user_idx=${userIdx}`; //수정
        const selectTokenResult = await db.queryParam_Arr(selectTokenQuery);
        var registrationToken = selectTokenResult[0].device_token;

        //보내는 내용
        var payload = {
            notification: {
                title: "Time to Read it",
                body : AlarmMessage(23) //23시의 메시지로 가정
                // body: AlarmMessage(selectFlagQuery[0].alarm_hour) //실제
                }
            };

    //payload를 device로 보냄
    admin.messaging().sendToDevice(registrationToken, payload)
        .then(function(response) {
        console.log("Successfully sent message:", response);
        })
        .catch(function(error) {
        console.log("Error sending message:", error);
        });


    }
    //알림설정이 off되어있는 경우
    else if(selectFlagResult[0].alarm_flag==0){
        var registrationToken = null;
    }

    else{
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.BAD_PARAMETER));
    }


    

})

function AlarmMessage(alarmhour) {
    if(alarmhour>=3 && alarmhour<=5){
        return('조용한 새벽, 저장해둔 글들을 읽어보아요.');
    }
    else if(alarmhour>=6 && alarmhour<=9){
        return('오늘도 생산적으로 하루를 시작해보세요.');
    }
    else if(alarmhour>=10 && alarmhour<=12){
        return('머리가 가장 맑을 시간. 콘텐츠 하나 읽어볼까요?');
    }
    else if(alarmhour>=13 && alarmhour<=17){
        return('머릿속에 인풋이 필요하다면 리딧으로!');
    }
    else if(alarmhour>=18 && alarmhour<=21){
        return('집가는 길 발견한 콘텐츠를 리딧에 차곡차곡 넣어두세요.');
        }
    else{
        return ('유익한 글 하나만 읽고 잘까요?')
    }
}


module.exports = router;