//리딧타임 설정

// var express = require('express');
// var router = express.Router();

// const db = require('../../module/pool');

// const util = require('../../module/utils/utils');
// const statusCode = require('../../module/utils/statusCode');
// const resMessage = require('../../module/utils/responseMessage');
// const authUtils = require("../../module/utils/authUtils");



// router.post('/:readittime_flag',authUtils.isLoggedin, async (req, res) => {
//     const readitTimeFlag = req.params.readittime_flag; //1이면 리딧타임on. 0이면 리딧타임off
//     const userIdx = req.decoded.idx

//     //리딧타임on하면
//     if(readitTimeFlag == 1){
//         //알림시간이 입력되지 않았을 경우
//         if(!req.body.hour || !req.body.minute ){
//             res.status(200).send(util.successFalse(statusCode.NO_CONTENT, resMessage.NULL_VALUE));
//         }

//         //알림시간이 벗어날 경우
//         else if(req.body.hour>=24 || req.body.minute >= 60){
//             res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.BAD_TIME));
//         }
//         else{
//             //시간이 입력되었을 때 DB에 시간을 넣음
//             let alarmHour = req.body.hour;
//             let alarmMinute = req.body.minute;
//             const setAlarmTimeQuery = `UPDATE alarm SET alarm_hour = ?, alarm_minute = ? WHERE user_idx = ?`;
//             const setAlarmTimeResult = await db.queryParam_Arr(setAlarmTimeQuery,[alarmHour, alarmMinute, userIdx]);
//             if(setAlarmTimeResult == null){
//                 res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
//             }
//             else{
//                 res.status(200).send(util.successTrue(statusCode.OK, resMessage.SET_READIT_TIME));
//             }
//         }
//     }

//     //리딧타임off일 때
//     else if(readitTimeFlag == 0){

//         //DB의 알림시간을 null로 만듦
//         const deleteAlarmTimeQuery = `UPDATE alarm SET alarm_hour = ?, alarm_minute = ? WHERE user_idx = ?`;
//         const deleteAlarmTimeResult = await db.queryParam_Arr(deleteAlarmTimeQuery,[null, null, userIdx]);
//         if(deleteAlarmTimeResult == null){
//             res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
//         }
//         else{
//             res.status(200).send(util.successTrue(statusCode.OK, resMessage.END_READIT_TIME));
//             }
        
//     }

//     //리딧타임 on/off가 모두 아닐 때
//     else{
//         res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.BAD_PARAMETER));
//     }
// });

// module.exports = router;