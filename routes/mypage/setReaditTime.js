// var express = require('express');
// var router = express.Router();

// const db = require('../../module/pool');

// const utils = require('../../module/utils/utils');
// const statusCode = require('../../module/utils/statusCode');
// const resMessage = require('../../module/utils/responseMessage');
// const authUtils = require("../../module/utils/authUtils");
// var admin = require('firebase-admin'); //firebase쓰기위함

// // 1. post => 리딧타임on하고 시간을 동시에 다운받기
// // 2.  =>리딧타임off하는 경우


// //1. post 리딧타임on& 시간을 받기
// router.post('/', async (req, res) => {

// if(!req.body.hour || !req.body.minute){
//     res.status(200).send(util.successFalse(statusCode.NO_CONTENT, resMessage.NULL_VALUE));
// }
// else{
//     let alarmHour = req.body.hour;
//     let alarmMinute = req.body.minute;

//     // let updateAlarmTimeQuery = //update alarm_hour & alarm_minute 하기
//     }});

// module.exports = router;