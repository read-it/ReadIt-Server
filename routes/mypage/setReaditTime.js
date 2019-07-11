var express = require('express');
var router = express.Router();

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const authUtils = require("../../module/utils/authUtils");
const readitTime = require("../../module/readitTimeModule");
const fcmQuick  = require("../../module/fcmQuickModule");
const db = require('../../module/pool');


//리딧타임 설정이 되어있는가!
router.put('/:readittime_flag', authUtils.isLoggedin, async (req, res) => {
    const userIdx = req.decoded.idx;    
    const readitTimeFlag = req.params.readittime_flag; //1이면 리딧타임 on. 0이면 리딧타임 off

    //readitTimeFlag(params)가 0, 1 모두 아닌 경우
    if(readitTimeFlag!=1 && readitTimeFlag !=0){
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.BAD_PARAMETER));
    }
    else{
        if(req.body.alarm_hour>24 || req.body.alarm_hour<0 || req.body.alarm_minute>59 || req.body.alarm_minute<0){
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.BAD_TIME));
        }

        else{
            let selectAlarmInfoQuery = 'SELECT * FROM alarm WHERE user_idx = ?'
            let AlarmInfo = await db.queryParam_Arr(selectAlarmInfoQuery, userIdx);

            //DB에 기존 정보가 없는 경우
            if(AlarmInfo.length == 0){
                //리딧타임 정보 DB에 insert
                let insertReaditTimeQuery = 'INSERT INTO alarm (user_idx,readittime_flag, alarm_hour, alarm_minute) VALUES (?,?,?,?)'
                let insertReaditTimeResult = await db.queryParam_Arr(insertReaditTimeQuery,[userIdx,readitTimeFlag, req.body.alarm_hour, req.body.alarm_minute])
                //리딧타임 정보 insert 실패
                if(!insertReaditTimeResult){
                    res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
                }
                //리딧타임 정보 insert 성공
                else{
                    res.status(200).send(util.successTrue(statusCode.OK, resMessage.SET_READIT_TIME));
                }
            }

            //DB에 기존 정보가 있는 경우
            else{
                //리딧타임 정보 DB에 update
                const updateReaditTimeQuery = `UPDATE alarm SET readittime_flag = ?, alarm_hour = ?, alarm_minute = ? WHERE user_idx = ?`;

                //리딧타임 on
                if(readitTimeFlag==1){
                    const updateReaditTimeResult = await db.queryParam_Arr(updateReaditTimeQuery,[readitTimeFlag, req.body.alarm_hour, req.body.alarm_minute, userIdx]);
                    //리딧타임 update 실패
                    if(!updateReaditTimeResult){
                        res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
                    }

                    //리딧타임 update 성공
                    else{
                        res.status(200).send(util.successTrue(statusCode.OK, resMessage.SET_READIT_TIME));
                    }
                                    
                }

                //리딧타임 off
                else{
                    const updateReaditTimeResult = await db.queryParam_Arr(updateReaditTimeQuery,[readitTimeFlag, AlarmInfo[0].alarm_hour, AlarmInfo[0].alarm_minute, userIdx]);
                    //리딧타임 update 실패
                    if(!updateReaditTimeResult){
                        res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
                    }

                    //리딧타임 update 성공
                    else{
                        res.status(200).send(util.successTrue(statusCode.OK, resMessage.SET_READIT_TIME));
                    }                
                }   
            }
        }
    }
    })

router.get('/', authUtils.isLoggedin, async (req, res) => {
    const userIdx = req.decoded.idx;
    let selectAlarmInfoQuery = 'SELECT * FROM alarm WHERE user_idx = ?'
    let AlarmInfo = await db.queryParam_Arr(selectAlarmInfoQuery, userIdx);

    if(!AlarmInfo){
        res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
    }
    

    else if(AlarmInfo[0].alarm_flag == 1 && AlarmInfo[0].readittime_flag == 1){
        let selectUserTokenQuery = 'SELECT device_token FROM user WHERE user_idx = ?'
        let userToken = await db.queryParam_Arr(selectUserTokenQuery, userIdx);
        if(!userToken){
            res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
        else{
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.SET_READIT_TIME_ALARM));
            // fcmQuick.sendFcmMessage(fcmQuick.buildCommonMessage());
            // readitTime.readitTimeAlarm(userToken[0].device_token,AlarmInfo[0].alarm_hour,AlarmInfo[0].alarm_minute)
            readitTime.readitTimeAlarm(userToken[0].device_token)
            
        }
    }
    else if(AlarmInfo[0].readittime_flag == 0){
        let updateTokenNullQuery = `UPDATE alarm SET device_token = null WHERE user_idx = ${userIdx}`;
        let TokenNullResult = await db.queryParam_None(updateTokenNullQuery);
        if(TokenNullResult[0] == null){
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.SET_READIT_TIME_ALARM));
        }
        else{
            res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    }
    else{
        res.status(200).send(util.successFalse(statusCode.forbidden, resMessage.FORBIDDEN_ACCESS));
    }
})


module.exports = router;