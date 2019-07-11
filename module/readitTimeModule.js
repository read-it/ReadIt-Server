//firebase에 필요한 것
var admin = require("firebase-admin");
var serviceAccount = require("../config/service-account.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://readit-ec394.firebaseio.com"
});

//schedule에 필요한 것
var schedule = require('node-schedule'); //npm install node-schedule --save 해주기
var rule = new schedule.RecurrenceRule();


module.exports = {
    //기기에게 보내는 내용
    // readitTimeAlarm : (registrationToken, alarmHour, alarmMinute) =>{
    readitTimeAlarm : (registrationToken) =>{

        //기기에게 보내는 내용
        var payload = {
            notification: {
                title: "Time to Read it",
                body: AlarmMessage(3) //실제
                }
            };

        // //schedule하기
        // rule.hour = alarmHour; //0~23 (클라가 오전 오후 계산해서 보내주세요)
        // rule.minute = alarmMinute; //0~59

        // var scheduler = schedule.scheduleJob(rule, function(){

            //payload를 device로 보냄
            admin.messaging().sendToDevice(registrationToken, payload)
            .then(function(response) {
            console.log("Successfully sent message:", response);
            console.log (response.results [0] .error)
            })
            .catch(function(error) {
            console.log("Error sending message:", error);
            })
        // });
            
        }
}


function AlarmMessage(alarmHour) {
    if(alarmHour>=3 && alarmHour<=5){
        return('조용한 새벽, 저장해둔 글들을 읽어보아요.');
    }
    else if(alarmHour>=6 && alarmHour<=9){
        return('오늘도 생산적으로 하루를 시작해보세요.');
    }
    else if(alarmHour>=10 && alarmHour<=12){
        return('머리가 가장 맑을 시간. 콘텐츠 하나 읽어볼까요?');
    }
    else if(alarmHour>=13 && alarmHour<=17){
        return('머릿속에 인풋이 필요하다면 리딧으로!');
    }
    else if(alarmHour>=18 && alarmHour<=21){
        return('집가는 길 발견한 콘텐츠를 리딧에 차곡차곡 넣어두세요.');
        }
    else{
        return ('유익한 글 하나만 읽고 잘까요?')
    }
}

    //j.cancel()        //등록한 스케줄을 취소할 수 있음.