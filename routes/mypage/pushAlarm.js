var express = require('express');
var router = express.Router();

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const authUtils = require("../../module/utils/authUtils");
const db = require('../../module/pool');

//푸시알람이 되어있는가!
router.put('/:alarm_flag', authUtils.isLoggedin, async (req, res) => {
    const userIdx = req.decoded.idx;    
    const alarmFlag = req.params.alarm_flag; //1이면 푸시알람 on. 0이면 푸시알람 off

    //alarmFlag(params)가 0, 1 모두 아닌 경우
    if(!(alarmFlag==1 || alarmFlag ==0)){
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.BAD_PARAMETER));
    }
    else{
        
        let selectAlarmInfoQuery = 'SELECT * FROM alarm WHERE user_idx = ?'
        let AlarmInfo = await db.queryParam_Arr(selectAlarmInfoQuery, userIdx);
        
        //DB에 기존 정보가 없는 경우
        if(AlarmInfo.length == 0){
            //alarm_flag DB에 insert
            let insertAlarmFlagQuery = 'INSERT INTO alarm (user_idx,alarm_flag) VALUES (?,?)'
            let insertAlarmFlagResult = await db.queryParam_Arr(insertAlarmFlagQuery,[userIdx,alarmFlag])
            //flag insert 실패
            if(!insertAlarmFlagResult){
                res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
            }
            //flag insert 성공
            else{
                res.status(200).send(util.successTrue(statusCode.OK, resMessage.CHANGE_ALARM_FLAG));
            }
        }
        
        //DB에 기존 정보가 있는 경우
        else{
            //alarm_flag DB에 수정.
            const updateAlarmFlagQuery = 'UPDATE alarm SET alarm_flag = ? WHERE user_idx = ?'
            const updateAlarmFlagResult = await db.queryParam_Arr(updateAlarmFlagQuery,[alarmFlag, userIdx]);
            //flag 수정 실패
            if(!updateAlarmFlagResult){
                res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
            }
            //flag 수정 성공
            else{
                res.status(200).send(util.successTrue(statusCode.OK, resMessage.CHANGE_ALARM_FLAG));
            }
        }
        

        
    }

})
module.exports = router;