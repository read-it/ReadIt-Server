var express = require('express');
var router = express.Router();

const db = require('../../module/pool');

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const authUtils = require("../../module/utils/authUtils");

// 2.  =>리딧타임off하는 경우


//1. post 리딧타임on& 시간을 받기
router.post('/',authUtils.isLoggedin, async (req, res) => {

if(!req.body.hour || !req.body.minute){
    res.status(200).send(util.successFalse(statusCode.NO_CONTENT, resMessage.NULL_VALUE));
}
else{
    let alarmHour = req.body.hour;
    let alarmMinute = req.body.minute;
    const userIdx = req.decoded.idx

    const setAlarmTimeQuery = `UPDATE alarm SET alarm_hour = ?, alarm_minute = ? WHERE user_idx = ?`;
    const setAlarmTimeResult = await db.queryParam_Arr(setAlarmTimeQuery,[alarmHour, alarmMinute, userIdx]);
    if(!(setAlarmTimeResult)){
        res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
    }
    else{
        res.status(200).send(util.successTrue(statusCode.OK, resMessage.SET_READIT_TIME));
    }


    }});

module.exports = router;