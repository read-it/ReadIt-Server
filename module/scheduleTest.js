var express = require('express');
var router = express.Router();

const db = require('./pool');
const readitTime = require("./readitTimeModule");
var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();

module.exports = {

    async select(){
        //select해서 alarm table가져오기
    let selectAlarmInfoQuery = 'SELECT a.*, u.device_token FROM alarm AS a LEFT JOIN user AS u ON a.user_idx = u.user_idx'
    let AlarmInfoNone =await db.queryParam_None(selectAlarmInfoQuery);

    for ( var i = 0 ; i < AlarmInfoNone.length ; i++)
    {
        //알림시간을 적용하기
            rule.hour = AlarmInfoNone[i].alarm_hour; //0~23 (클라가 오전 오후 계산해서 보내주세요)
            rule.minute = AlarmInfoNone[i].alarm_minute; //0~59
            rule.second = 0;


        //리딧타임설정이 on일때
        if(AlarmInfoNone[i].readittime_flag == 1){
            //devicetoken 찾기
            let registrationToken = AlarmInfoNone[i].device_token.toString();
    
            //알림시간에 실행
            var scheduler = schedule.scheduleJob(rule, function(){

                //푸시알람 실행
                readitTime.readitTimeAlarm(registrationToken, rule.hour)})
                console.log('else')
                console.log(i)
        }

        //위의 alarm table을 통해 리딧타임설정이 off임을 알았을 때
        else{
            //devicetoken을 무효화함
            let updateTokenNullQuery = `UPDATE user SET device_token = null WHERE user_idx = ${AlarmInfoNone[i].user_idx}`
            let TokenNullResult = await db.queryParam_None(updateTokenNullQuery);
            console.log('if')
            console.log(i)
        }
        
        
    }
}


}